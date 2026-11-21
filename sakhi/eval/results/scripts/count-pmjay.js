import fs from "fs";
import path from "path";

const dir = "eval/personas-extra";
const c = { keepTrue: 0, flipToTrue: 0, dropEligible: 0, dropIneligible: 0 };

for (const f of fs.readdirSync(dir).filter((f) => /^part\d+\.json$/.test(f))) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const arr = Array.isArray(j) ? j : j.personas;
  for (const p of arr) {
    const inEl = p.expected.eligible.includes("ab-pmjay");
    const inInel = p.expected.ineligible.includes("ab-pmjay");
    if (!inEl && !inInel) continue;
    const old70 = p.profile.age >= 70;
    if (old70 && inEl) c.keepTrue++;
    else if (old70 && inInel) { c.flipToTrue++; console.log("FLIP:", p.id, p.profile.age); }
    else if (inEl) c.dropEligible++;
    else c.dropIneligible++;
  }
}
console.log(c);