// import { readFileSync, existsSync } from "fs";
// if (existsSync(".env.local")) for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
//   const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); if (m && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] || "").replace(/^["']|["']$/g, "");
// }
// const { runPlannerTurn } = await import("../agents/planner.js");
// const { personaToSentence } = await import("../eval/personas.js");
// const base = { name: "T", age: 20, gender: "male", maritalStatus: "unmarried", state: "Bihar", bplCard: false,
//   aadhaarLinked: true, dependents: 0, landOwned: false, occupation: "student", socialCategory: "SC", disability: false, residenceType: "rural" };
// for (const inc of [60000, 150000, 200000, 240000, 249999, 250000]) {
//   const q = `${personaToSentence({ ...base, incomeAnnual: inc })} Am I eligible for the "Post Matric Scholarship for SC Students" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;
//   const r = await runPlannerTurn(`dbg-${inc}`, [], q);
//   console.log(inc, "|", Object.keys(r).join(","), "|", r.finalText.slice(0, 160).replace(/\n/g, " "));
// }
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
  const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); if (m && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] || "").replace(/^["']|["']$/g, "");
}
const { runPlannerTurn } = await import("../agents/planner.js");
const { personaToSentence } = await import("../eval/personas.js");
const base = { name: "T", age: 22, gender: "female", maritalStatus: "unmarried", state: "Bihar", incomeAnnual: 60000,
  bplCard: true, aadhaarLinked: true, dependents: 0, landOwned: false, occupation: "unemployed", socialCategory: "SC", disability: false, residenceType: "rural" };
const cases = { fatimaLike: base, studentNoBpl: { ...base, occupation: "student", bplCard: false, age: 20 } };
for (const [name, p] of Object.entries(cases)) {
  const q = `${personaToSentence(p)} Am I eligible for the "Post Matric Scholarship for SC Students" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;
  const r = await runPlannerTurn(`dbg-${name}`, [], q);
  console.log("\n=====", name, "| fallback:", r.usedFallbackModel);
  console.log(r.finalText.slice(0, 200).replace(/\n/g, " "));
  console.log(JSON.stringify(r.toolCallsExecuted, null, 1).slice(0, 3500));
}