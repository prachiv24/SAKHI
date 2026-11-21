// scripts/combine-results.mjs
// Pools eval/results/part*/results-*.json (latest file per part) into one summary.
//   node scripts/combine-results.mjs
// Writes eval/results/combined-summary.md and eval/results/combined-results.json
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";

const ROOT = "eval/results";
const MODES = ["v1", "v2", "v3"];
const LABEL = { v1: "V1 single-shot", v2: "V2 RAG single-shot", v3: "V3 tool-calling + rule engine" };

const parts = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^part\d+$/i.test(d.name))
  .map((d) => d.name)
  .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
if (!parts.length) { console.error("No eval/results/partN folders found."); process.exit(1); }

let records = [];
const used = [];
const models = new Set();
for (const p of parts) {
  const files = readdirSync(`${ROOT}/${p}`).filter((f) => /^results-.*\.json$/.test(f)).sort();
  if (!files.length) { console.log(`${p}: NO results file yet (unfinished) - skipped`); continue; }
  const f = files[files.length - 1];
  const j = JSON.parse(readFileSync(`${ROOT}/${p}/${f}`, "utf-8"));
  if (j.model) models.add(j.model);
  for (const r of j.records) records.push({ ...r, part: p });
  used.push(`${p}/${f} (${j.records.length} answers)`);
}
console.log("Using:\n  " + used.join("\n  "));

// ---- statistics ----------------------------------------------------------------
function wilson(k, n, z = 1.96) {
  if (!n) return [0, 0];
  const ph = k / n, d = 1 + (z * z) / n;
  const c = ph + (z * z) / (2 * n);
  const a = z * Math.sqrt((ph * (1 - ph)) / n + (z * z) / (4 * n * n));
  return [(c - a) / d, (c + a) / d];
}
function binomCdf(k, n) { // P(X <= k), X~Bin(n,0.5)
  let s = 0, c = 1; // C(n,0)
  for (let i = 0; i <= k; i++) { s += c; c = (c * (n - i)) / (i + 1); }
  return s / Math.pow(2, n);
}
function mcnemar(b, c) {
  const n = b + c;
  if (!n) return 1;
  return Math.min(1, 2 * binomCdf(Math.min(b, c), n));
}
const pct = (x) => (100 * x).toFixed(1) + "%";
const ci = (k, n) => { const [l, h] = wilson(k, n); return `${pct(l)}–${pct(h)}`; };

// ---- per-mode ------------------------------------------------------------------
const per = {};
for (const m of MODES) {
  const rows = records.filter((r) => r.mode === m);
  const total = rows.length;
  const errors = rows.filter((r) => r.error).length;
  const unclear = rows.filter((r) => !r.error && r.classification === null).length;
  const correct = rows.filter((r) => r.correct).length;
  const answered = total - errors;
  const lat = rows.map((r) => r.latencyMs).filter((x) => Number.isFinite(x));
  const fb = rows.filter((r) => r.usedFallbackModel === true).length;
  const tp = rows.filter((r) => !r.error && r.expected && r.classification === true).length;
  const fp = rows.filter((r) => !r.error && !r.expected && r.classification === true).length;
  const tn = rows.filter((r) => !r.error && !r.expected && r.classification === false).length;
  const fn = rows.filter((r) => !r.error && r.expected && r.classification === false).length;
  per[m] = { total, correct, errors, unclear, answered, fb, tp, fp, tn, fn,
    acc: total ? correct / total : 0, accExcl: answered ? correct / answered : 0,
    avgLat: lat.length ? Math.round(lat.reduce((a, b) => a + b, 0) / lat.length) : 0 };
}

// ---- paired comparisons --------------------------------------------------------
const key = (r) => `${r.personaId}|${r.schemeKey}`;
const byMode = Object.fromEntries(MODES.map((m) => [m, new Map(records.filter((r) => r.mode === m).map((r) => [key(r), r]))]));
const common = [...byMode.v1.keys()].filter((k) => byMode.v2.has(k) && byMode.v3.has(k));
function pair(a, b) {
  let bothOk = 0, aOnly = 0, bOnly = 0, bothBad = 0;
  for (const k of common) {
    const x = byMode[a].get(k).correct, y = byMode[b].get(k).correct;
    if (x && y) bothOk++; else if (x && !y) aOnly++; else if (!x && y) bOnly++; else bothBad++;
  }
  return { a, b, bothOk, aOnly, bOnly, bothBad, p: mcnemar(aOnly, bOnly) };
}
const pairs = [pair("v3", "v1"), pair("v3", "v2"), pair("v1", "v2")];

// ---- per-scheme (V3 vs V1/V2) --------------------------------------------------
const schemes = [...new Set(records.map((r) => r.schemeKey))].sort();

let md = `# Combined evaluation (extended persona set)\n\n`;
md += `Parts used: ${used.length}/${parts.length}. Model(s) recorded: ${[...models].join(", ") || "not recorded"}.\n`;
md += `Personas: ${new Set(records.map((r) => r.personaId)).size}. Questions per architecture: ${per.v1.total}. Questions answered by all three: ${common.length}.\n\n`;
md += `## Accuracy (95% Wilson confidence interval)\n\n`;
md += `| Architecture | Correct | Accuracy | 95% CI | API errors | Accuracy excl. errors | Unclear | Avg latency (ms) | Fallback used |\n|---|---|---|---|---|---|---|---|---|\n`;
for (const m of MODES) {
  const s = per[m];
  md += `| ${LABEL[m]} | ${s.correct}/${s.total} | ${pct(s.acc)} | ${ci(s.correct, s.total)} | ${s.errors} | ${pct(s.accExcl)} | ${s.unclear} | ${s.avgLat} | ${s.fb} |\n`;
}
md += `\n"Accuracy" counts an API error as wrong, as in the main run. "Accuracy excl. errors" removes them, so provider failures are not blamed on reasoning.\n\n`;
md += `## Confusion (answered questions only)\n\n| Architecture | TP | FP | TN | FN |\n|---|---|---|---|---|\n`;
for (const m of MODES) md += `| ${LABEL[m]} | ${per[m].tp} | ${per[m].fp} | ${per[m].tn} | ${per[m].fn} |\n`;
md += `\n## Paired comparison (exact two-sided McNemar test)\n\n| A vs B | Both correct | A only | B only | Both wrong | p-value |\n|---|---|---|---|---|---|\n`;
for (const q of pairs) md += `| ${LABEL[q.a]} vs ${LABEL[q.b]} | ${q.bothOk} | ${q.aOnly} | ${q.bOnly} | ${q.bothBad} | ${q.p < 0.001 ? "<0.001" : q.p.toFixed(4)} |\n`;
md += `\n## Per scheme (correct / asked)\n\n| Scheme | V1 | V2 | V3 |\n|---|---|---|---|\n`;
for (const s of schemes) {
  const cell = (m) => { const rows = records.filter((r) => r.mode === m && r.schemeKey === s); return `${rows.filter((r) => r.correct).length}/${rows.length}`; };
  md += `| ${s} | ${cell("v1")} | ${cell("v2")} | ${cell("v3")} |\n`;
}
md += `\n## V3 failures\n\n`;
const v3bad = records.filter((r) => r.mode === "v3" && !r.correct);
if (!v3bad.length) md += `None.\n`;
else {
  md += `| Part | Persona | Scheme | Expected | Said | Error |\n|---|---|---|---|---|---|\n`;
  for (const r of v3bad) md += `| ${r.part} | ${r.personaId} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${r.error ? "-" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible"} | ${r.error ? String(r.error).slice(0, 60) : ""} |\n`;
}
writeFileSync(`${ROOT}/combined-summary.md`, md);
writeFileSync(`${ROOT}/combined-results.json`, JSON.stringify({ parts: used, perMode: per, pairs, records }, null, 2));
console.log("\n" + md);
console.log(`Wrote ${ROOT}/combined-summary.md and combined-results.json`);