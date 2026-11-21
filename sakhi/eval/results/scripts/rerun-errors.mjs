// scripts/rerun-errors.mjs
// Re-asks ONLY the answers that failed (error != null, e.g. "fetch failed") and puts the new
// answers back in the same file, in the same position. Good answers are never touched.
//
//   $env:EVAL_MODEL="gemini-3.5-flash-lite"; $env:EVAL_DELAY_MS="1000"
//   node scripts/rerun-errors.mjs path\to\results.json
//   node scripts/rerun-errors.mjs path\to\results.json --dry      (only lists what would be re-asked)
//
// Writes  <name>.fixed.json  after EVERY answer (safe to stop; run the same command again to continue).
// The original file is never modified. Use the SAME EVAL_MODEL as the original run.
import { readFileSync, existsSync, writeFileSync, readdirSync } from "fs";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!m) continue;
    const [, key, raw = ""] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const src = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!src || !existsSync(src)) { console.error("Usage: node scripts/rerun-errors.mjs results.json [--dry]"); process.exit(1); }
const OUT = src.replace(/\.json$/i, "") + ".fixed.json";

const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1000;
const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 6;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// network drops AND rate limits are both retried here (never saved as answers)
const RETRY = /fetch failed|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket|network|503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;

const original = JSON.parse(readFileSync(src, "utf-8"));
const working = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf-8")) : structuredClone(original);
if (existsSync(OUT)) console.log(`Continuing from ${OUT}`);
const records = working.records;
const bad = () => records.map((r, i) => ({ r, i })).filter(({ r }) => r.error);

console.log(`Records: ${records.length}. Failed: ${bad().length}. Personas affected: ${new Set(bad().map(({ r }) => r.personaId)).size}`);
const byMode = {};
for (const { r } of bad()) byMode[r.mode] = (byMode[r.mode] || 0) + 1;
console.log("Failed by architecture:", byMode);
if (DRY) { for (const { r } of bad()) console.log(`  ${r.mode} / ${r.personaId} / ${r.schemeKey}`); process.exit(0); }
if (!bad().length) { console.log("Nothing to re-run."); process.exit(0); }
if (!process.env.GEMINI_API_KEY) { console.error("GEMINI_API_KEY missing from .env.local"); process.exit(1); }
console.log(`Model (EVAL_MODEL): ${process.env.EVAL_MODEL || "default"}  <- must match the original run\n`);

const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
const { runPlannerTurn } = await import("../agents/planner.js");
const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");
const MODES = { v1: runPlannerTurnV1, v2: runPlannerTurnV2, v3: runPlannerTurn };

// every persona the harness could have used: built-in 21 + every JSON in eval/personas-extra
const byId = new Map(PERSONAS.map((p) => [p.id, p]));
const extraDir = "eval/personas-extra";
if (existsSync(extraDir)) {
  for (const f of readdirSync(extraDir).filter((f) => f.endsWith(".json"))) {
    try {
      const raw = JSON.parse(readFileSync(`${extraDir}/${f}`, "utf-8"));
      for (const p of Array.isArray(raw) ? raw : raw.personas || []) if (p?.id && p.profile) byId.set(p.id, p);
    } catch { /* skip unreadable file */ }
  }
}

function classifyAnswer(text) {
  const t = text.trim().toLowerCase();
  const first = t.split(/[\s,.:;!]+/)[0];
  if (first === "yes" || first === "हाँ" || first === "haan") return true;
  if (first === "no" || first === "नहीं" || first === "nahi" || first === "nahin") return false;
  if (["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"].some((p) => t.includes(p))) return false;
  if (["you are eligible", "you qualify", "you're eligible", "yes, you"].some((p) => t.includes(p))) return true;
  return null;
}

async function ask(rec) {
  const persona = byId.get(rec.personaId);
  if (!persona) throw new Error(`persona ${rec.personaId} not found in eval/personas.js or eval/personas-extra/*.json`);
  const questionText = `${personaToSentence(persona.profile)} Am I eligible for the "${rec.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;
  const sessionId = `eval-${rec.mode}-${rec.personaId}-${rec.schemeKey}-${Date.now()}`;
  let error = null, finalText = "", usedFallbackModel = null, start = Date.now(), attempts;
  for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
    start = Date.now();
    try {
      const res = await MODES[rec.mode](sessionId, [], questionText);
      finalText = res.finalText; usedFallbackModel = res.usedFallbackModel ?? null; error = null; break;
    } catch (e) {
      error = e.message || String(e);
      if (!RETRY.test(error) || attempts === MAX_ATTEMPTS) break;
      await sleep(15000 * attempts);
    }
  }
  const classification = error ? null : classifyAnswer(finalText);
  return {
    ...rec, latencyMs: Date.now() - start, attempts, usedFallbackModel,
    model: process.env.EVAL_MODEL || "default", error, quotaHit: false,
    responseText: finalText, classification, correct: error ? false : classification === rec.expected,
  };
}

function summarize(rows) {
  const out = {};
  for (const mode of [...new Set(rows.map((r) => r.mode))]) {
    const m = rows.filter((r) => r.mode === mode);
    const lat = m.filter((r) => !r.error).map((r) => r.latencyMs).sort((a, b) => a - b);
    const pct = (p) => (lat.length ? lat[Math.min(lat.length - 1, Math.floor(p * lat.length))] : 0);
    const c = (e, k) => m.filter((r) => r.expected === e && r.classification === k).length;
    out[mode] = {
      total: m.length, correct: m.filter((r) => r.correct).length,
      accuracy: +(m.filter((r) => r.correct).length / m.length).toFixed(3),
      unclear: m.filter((r) => !r.error && r.classification === null).length,
      errors: m.filter((r) => r.error).length,
      p50LatencyMs: pct(0.5), p95LatencyMs: pct(0.95),
      confusion: { truePositive: c(true, true), falsePositive: c(false, true), trueNegative: c(false, false), falseNegative: c(true, false) },
    };
  }
  return out;
}
const save = () => writeFileSync(OUT, JSON.stringify({ ...working, records, summary: summarize(records) }, null, 2));

let n = 0;
const todo = bad();
for (const { r, i } of todo) {
  n++;
  process.stdout.write(`(${n}/${todo.length}) [${r.mode}] ${r.personaId} / ${r.schemeKey} ... `);
  let fresh;
  try { fresh = await ask(r); } catch (e) { console.log("SKIPPED: " + e.message); continue; }
  console.log(fresh.error ? `STILL ERROR (${fresh.error.slice(0, 80)})` : `${fresh.correct ? "correct" : "WRONG"} (${fresh.latencyMs}ms)`);
  if (!fresh.error) records[i] = fresh; // only a real answer replaces the failed one
  save();
  await sleep(DELAY_MS);
}
save();
const left = bad().length;
console.log(`\nDone. Still failed: ${left}. Wrote ${OUT}`);
console.table(summarize(records));
if (left) console.log("Run the same command again to retry the remaining failures.");