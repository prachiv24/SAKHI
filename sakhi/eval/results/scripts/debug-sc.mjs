import { evaluateAllSchemes } from "../lib/eligibility.js";
import { SCHEMES } from "../data/schemes.js";
import { PERSONAS } from "../eval/personas.js";
for (const id of ["sc_249999", "sc_250000"]) {
  const p = PERSONAS.find((x) => x.id === id);
  const r = evaluateAllSchemes(p.profile, SCHEMES).find((x) => x.schemeKey === "nsp-post-matric-sc");
  console.log(id, p.profile.incomeAnnual, JSON.stringify(r));
}