import fs from "fs";
import path from "path";

const MIN_AGE = 70;
const { PERSONAS } = await import("../eval/personas.js");

// persona id -> age (Run A + Run B)
const ages = new Map(PERSONAS.map((p) => [p.id, p.profile.age]));
const dir = "eval/personas-extra";
for (const f of fs.readdirSync(dir).filter((f) => /^part\d+\.json$/.test(f))) {
  for (const p of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))) {
    if (ages.has(p.id) && ages.get(p.id) !== p.profile.age) console.warn("ID CLASH with different age:", p.id);
    ages.set(p.id, p.profile.age);
  }
}

function summarize(rows) {
  const n = rows.length;
  const c = (e, k) => rows.filter((r) => r.expected === e && r.classification === k).length;
  const correct = rows.filter((r) => r.correct).length;
  return {
    total: n, correct, accuracy: n ? +(correct / n).toFixed(3) : 0,
    unclear: rows.filter((r) => !r.error && r.classification === null).length,
    errors: rows.filter((r) => r.error).length,
    TP: c(true, true), FP: c(false, true), TN: c(false, false), FN: c(true, false),
  };
}

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: node scripts/rescore-ab-pmjay.js <results.json> ..."); process.exit(1); }

const all = [];
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const kept = [];
  let dropped = 0;
  for (const r of data.records) {
    if (r.schemeKey === "ab-pmjay") {
      const age = ages.get(r.personaId);
      if (age === undefined) throw new Error(`no age for persona ${r.personaId}`);
      if (age < MIN_AGE) { dropped++; continue; }
      kept.push({ ...r, oldExpected: r.expected, expected: true, correct: !r.error && r.classification === true });
    } else kept.push(r);
  }
  all.push(...kept);
  const out = path.join(path.dirname(file), "rescored-" + path.basename(file));
  fs.writeFileSync(out, JSON.stringify({ records: kept }, null, 2));
  console.log(`${file}: kept ${kept.length}, dropped ${dropped} -> ${out}`);
}

const modes = [...new Set(all.map((r) => r.mode))];
console.table(Object.fromEntries(modes.map((m) => [m, summarize(all.filter((r) => r.mode === m))])));