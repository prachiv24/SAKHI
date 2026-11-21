// scripts/gen-personas.mjs
// Generates 100 edge-case personas in 5 parts (21+21+21+21+16) so you can run them one part at a time.
//   node scripts/gen-personas.mjs           -> writes eval/personas-extra/part1..5.json (+ index.json)
//   node scripts/gen-personas.mjs --check   -> also compares the labels with YOUR rule engine (no API calls)
//
// Labels come from the independent RULES table below, NOT from your engine. Verify each rule against the official
// scheme notification (and edit RULES if you disagree) before you report accuracy. The --check step lists every
// persona/scheme where your engine disagrees with the table; resolve each by fixing the label or the rule, as before.
import { mkdirSync, writeFileSync } from "fs";

const SCHEMES = ["ignoaps", "igndps", "up-widow-pension", "pmuy", "pm-kisan", "pm-sym", "nsp-post-matric-sc", "ab-pmjay"];

// ---- independent label table (edit if the official criteria differ) --------------------------------------------
const RULES = {
  ignoaps: (p) => p.age >= 60 && p.bplCard,
  igndps: (p) => p.disability && p.age >= 18 && p.bplCard,
  "up-widow-pension": (p) => p.maritalStatus === "widow" && p.gender === "female" && p.state === "Uttar Pradesh" && p.incomeAnnual < 200000, // strict <
  pmuy: (p) => p.gender === "female" && p.age >= 18 && p.bplCard,
  "pm-kisan": (p) => p.occupation === "farmer" && p.landOwned,
  "pm-sym": (p) => p.age >= 18 && p.age <= 40 && p.incomeAnnual <= 180000, // inclusive limits
  "nsp-post-matric-sc": (p) => p.socialCategory === "SC" && p.incomeAnnual <= 250000, // inclusive
  // ENCODED route only (age >= 70 OR BPL). The real scheme is SECC-based; if you change the engine rule, change this line too.
  "ab-pmjay": (p) => p.age >= 70 || p.bplCard,
};

const BASE = {
  name: "Citizen", age: 35, gender: "male", maritalStatus: "married", state: "Bihar", incomeAnnual: 120000,
  bplCard: false, aadhaarLinked: true, dependents: 2, landOwned: false, occupation: "unemployed",
  socialCategory: "General", disability: false, residenceType: "rural",
};

const groups = { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [] };
const add = (g, id, edge, focus, over) => groups[g].push({ id, edge, focus, over });
const UP = "Uttar Pradesh";

// A. Old-age pension (ignoaps): age and BPL thresholds
for (const [age, bpl, edge] of [
  [55, true, "well below old-age cut-off"], [58, true, "two years below cut-off"], [59, true, "one year below cut-off"],
  [60, true, "exactly at cut-off, BPL"], [61, true, "one year above cut-off, BPL"], [60, false, "at cut-off but no BPL card"],
  [65, false, "old enough but no BPL card"], [69, true, "69 with BPL"], [70, false, "70, no BPL: pension fails, AB-PMJAY age route holds"],
  [75, true, "75 with BPL"], [85, true, "85 with BPL"],
]) add("A", `x_oldage_${age}_${bpl ? "bpl" : "nobpl"}`, edge, ["ignoaps"], { age, bplCard: bpl });

// B. Disability pension (igndps): disability, age floor, BPL
for (const [age, dis, bpl, edge, extra] of [
  [17, true, true, "disabled, one year below minimum age", {}], [18, true, true, "disabled, exactly at minimum age", {}],
  [19, true, true, "disabled, one year above minimum", {}], [30, true, true, "disabled adult with BPL", {}],
  [30, true, false, "disabled adult without BPL", {}], [30, false, true, "BPL adult without disability", {}],
  [45, true, true, "disabled woman with BPL", { gender: "female" }], [59, true, true, "disabled, 59, BPL", {}],
  [70, true, true, "disabled senior, BPL", {}], [25, true, true, "disabled student, BPL", { occupation: "student" }],
]) add("B", `x_dis_${age}_${dis ? "d" : "nd"}_${bpl ? "bpl" : "nobpl"}${extra.gender ? "_f" : ""}${extra.occupation ? "_stu" : ""}`, edge, ["igndps"], { age, disability: dis, bplCard: bpl, ...extra });

// C. UP widow pension: marital status, state, gender, income (strict limit 2,00,000)
for (const [id, edge, over] of [
  ["x_widow_up_inc0", "widow, UP, zero income", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 0, age: 40 }],
  ["x_widow_up_inc100k", "widow, UP, 1,00,000", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 100000, age: 45 }],
  ["x_widow_up_inc199999", "widow, UP, just under strict limit", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 199999, age: 50 }],
  ["x_widow_up_inc200000", "widow, UP, exactly at strict limit: not eligible", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 200000, age: 50 }],
  ["x_widow_up_inc200001", "widow, UP, just over limit", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 200001, age: 50 }],
  ["x_widow_bihar", "widow, low income, wrong state (Bihar)", { maritalStatus: "widow", gender: "female", state: "Bihar", incomeAnnual: 80000, age: 48 }],
  ["x_widow_delhi", "widow, low income, wrong state (Delhi)", { maritalStatus: "widow", gender: "female", state: "Delhi", incomeAnnual: 80000, age: 48, residenceType: "urban" }],
  ["x_married_up_f", "married woman in UP, low income", { maritalStatus: "married", gender: "female", state: UP, incomeAnnual: 80000, age: 40 }],
  ["x_unmarried_up_f", "unmarried woman in UP, low income", { maritalStatus: "unmarried", gender: "female", state: UP, incomeAnnual: 80000, age: 30 }],
  ["x_divorced_up_f", "divorced woman in UP, low income", { maritalStatus: "divorced", gender: "female", state: UP, incomeAnnual: 80000, age: 38 }],
  ["x_widower_up_m", "widower (man) in UP: scheme is for widows (women)", { maritalStatus: "widow", gender: "male", state: UP, incomeAnnual: 80000, age: 52 }],
  ["x_widow_up_19", "young widow, UP, age 19", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 60000, age: 19 }],
  ["x_widow_up_55_bpl", "widow, UP, 55, BPL", { maritalStatus: "widow", gender: "female", state: UP, incomeAnnual: 70000, age: 55, bplCard: true }],
]) add("C", id, edge, ["up-widow-pension"], over);

// D. Ujjwala (pmuy): woman, 18+, BPL
for (const [id, edge, over] of [
  ["x_pmuy_f17_bpl", "girl aged 17 with BPL household", { gender: "female", age: 17, bplCard: true }],
  ["x_pmuy_f18_bpl", "woman exactly 18, BPL", { gender: "female", age: 18, bplCard: true }],
  ["x_pmuy_f19_bpl", "woman 19, BPL", { gender: "female", age: 19, bplCard: true }],
  ["x_pmuy_f30_bpl", "woman 30, BPL", { gender: "female", age: 30, bplCard: true }],
  ["x_pmuy_f30_nobpl", "woman 30, no BPL", { gender: "female", age: 30, bplCard: false }],
  ["x_pmuy_m30_bpl", "man 30, BPL: scheme is for women", { gender: "male", age: 30, bplCard: true }],
  ["x_pmuy_widow40_bpl", "widow 40, BPL (outside UP)", { gender: "female", age: 40, bplCard: true, maritalStatus: "widow" }],
  ["x_pmuy_f62_bpl", "woman 62, BPL (also old-age eligible)", { gender: "female", age: 62, bplCard: true }],
]) add("D", id, edge, ["pmuy"], over);

// E. PM-KISAN: farmer and land
for (const [id, edge, over] of [
  ["x_kisan_land", "farmer with land", { occupation: "farmer", landOwned: true, age: 42 }],
  ["x_kisan_land_f", "woman farmer with land", { occupation: "farmer", landOwned: true, age: 38, gender: "female" }],
  ["x_kisan_landless", "farmer without land", { occupation: "farmer", landOwned: false, age: 42 }],
  ["x_kisan_landless_bpl", "landless farmer with BPL", { occupation: "farmer", landOwned: false, age: 50, bplCard: true }],
  ["x_kisan_unemp_noland", "unemployed, no land", { occupation: "unemployed", landOwned: false, age: 34 }],
  ["x_kisan_student", "student, no land", { occupation: "student", landOwned: false, age: 20 }],
  ["x_kisan_land70", "farmer with land, aged 70", { occupation: "farmer", landOwned: true, age: 70 }],
  ["x_kisan_land_bpl68", "retired farmer 68, BPL and land", { occupation: "farmer", landOwned: true, age: 68, bplCard: true }],
]) add("E", id, edge, ["pm-kisan"], over);

// F. PM-SYM: age 18-40 inclusive, income <= 1,80,000 inclusive
for (const age of [17, 18, 19, 39, 40, 41, 42, 60]) add("F", `x_sym_age_${age}`, `PM-SYM age ${age}, income 1,20,000`, ["pm-sym"], { age, incomeAnnual: 120000 });
for (const inc of [0, 100000, 179999, 180000, 180001, 200000, 500000]) add("F", `x_sym_inc_${inc}`, `PM-SYM income ${inc}, age 30`, ["pm-sym"], { age: 30, incomeAnnual: inc });
add("F", "x_sym_age40_inc180000", "both PM-SYM limits exactly at the edge (still eligible)", ["pm-sym"], { age: 40, incomeAnnual: 180000 });

// G. SC post-matric scholarship: category and inclusive limit 2,50,000
for (const [id, edge, over] of [
  ["x_sc_inc100k", "SC, 1,00,000", { socialCategory: "SC", incomeAnnual: 100000, age: 22, occupation: "student" }],
  ["x_sc_inc249999", "SC, just under limit", { socialCategory: "SC", incomeAnnual: 249999, age: 22, occupation: "student" }],
  ["x_sc_inc250000", "SC, exactly at inclusive limit", { socialCategory: "SC", incomeAnnual: 250000, age: 22, occupation: "student" }],
  ["x_sc_inc250001", "SC, one rupee over limit", { socialCategory: "SC", incomeAnnual: 250001, age: 22, occupation: "student" }],
  ["x_sc_inc300k", "SC, 3,00,000", { socialCategory: "SC", incomeAnnual: 300000, age: 22, occupation: "student" }],
  ["x_sc_inc900k", "SC, high income", { socialCategory: "SC", incomeAnnual: 900000, age: 24, occupation: "student" }],
  ["x_st_inc100k", "ST, low income (separate scheme)", { socialCategory: "ST", incomeAnnual: 100000, age: 22, occupation: "student" }],
  ["x_obc_inc100k", "OBC, low income", { socialCategory: "OBC", incomeAnnual: 100000, age: 22, occupation: "student" }],
  ["x_gen_inc100k", "General, low income", { socialCategory: "General", incomeAnnual: 100000, age: 22, occupation: "student" }],
  ["x_sc_student19", "SC student 19", { socialCategory: "SC", incomeAnnual: 90000, age: 19, occupation: "student" }],
  ["x_sc_f28", "SC woman 28", { socialCategory: "SC", incomeAnnual: 120000, age: 28, gender: "female" }],
  ["x_sc_zero", "SC, zero income", { socialCategory: "SC", incomeAnnual: 0, age: 21, occupation: "student" }],
  ["x_sc_farmer45", "SC farmer 45", { socialCategory: "SC", incomeAnnual: 150000, age: 45, occupation: "farmer", landOwned: true }],
]) add("G", id, edge, ["nsp-post-matric-sc"], over);

// H. AB-PMJAY (encoded route: age >= 70 OR BPL)
for (const [age, bpl, edge] of [
  [69, true, "69 with BPL"], [69, false, "69 without BPL"], [70, false, "exactly 70, no BPL"], [71, false, "71, no BPL"],
  [70, true, "70 with BPL"], [80, false, "80, no BPL"], [40, true, "40 with BPL"], [25, false, "25, no BPL"],
]) add("H", `x_pmjay_${age}_${bpl ? "bpl" : "nobpl"}`, edge, ["ab-pmjay"], { age, bplCard: bpl });

// I. Realistic multi-scheme profiles
for (const [id, edge, focus, over] of [
  ["x_combo_widow66", "elderly widow, UP, BPL", ["up-widow-pension", "ignoaps", "pmuy"], { age: 66, gender: "female", maritalStatus: "widow", state: UP, bplCard: true, incomeAnnual: 40000 }],
  ["x_combo_dis_sc_student", "disabled SC student, BPL", ["igndps", "nsp-post-matric-sc", "pm-sym"], { age: 20, disability: true, socialCategory: "SC", occupation: "student", bplCard: true, incomeAnnual: 90000 }],
  ["x_combo_young_farmer", "young landowning farmer, no BPL", ["pm-kisan", "pm-sym", "ab-pmjay"], { age: 30, occupation: "farmer", landOwned: true, incomeAnnual: 150000 }],
  ["x_combo_sc_woman_farmer", "SC woman farmer, BPL", ["pm-kisan", "pmuy", "nsp-post-matric-sc"], { age: 45, gender: "female", socialCategory: "SC", occupation: "farmer", landOwned: true, bplCard: true, incomeAnnual: 120000 }],
  ["x_combo_professional", "well-off professional, 38", ["pm-sym", "nsp-post-matric-sc", "ab-pmjay"], { age: 38, incomeAnnual: 1200000, residenceType: "urban", occupation: "salaried" }],
  ["x_combo_rich_senior", "wealthy senior 72, no BPL", ["ignoaps", "ab-pmjay", "pm-kisan"], { age: 72, incomeAnnual: 2000000, residenceType: "urban" }],
  ["x_combo_widow_dis", "disabled widow, UP, BPL", ["up-widow-pension", "igndps", "pmuy"], { age: 50, gender: "female", maritalStatus: "widow", state: UP, disability: true, bplCard: true, incomeAnnual: 80000 }],
  ["x_combo_old_farmer", "retired farmer 68, land, BPL", ["pm-kisan", "ignoaps", "ab-pmjay"], { age: 68, occupation: "farmer", landOwned: true, bplCard: true, incomeAnnual: 60000 }],
]) add("I", id, edge, focus, over);

// J. Clear negatives
for (const [id, edge, over] of [
  ["x_none_salaried28", "urban salaried man, 6,00,000", { age: 28, incomeAnnual: 600000, residenceType: "urban", occupation: "salaried" }],
  ["x_none_student_gen", "General student, 4,00,000", { age: 20, incomeAnnual: 400000, occupation: "student" }],
  ["x_none_married35", "married man, 5,00,000", { age: 35, incomeAnnual: 500000 }],
  ["x_none_woman30", "woman 30, no BPL, 3,00,000", { age: 30, gender: "female", incomeAnnual: 300000 }],
  ["x_none_man45", "man 45, 10,00,000", { age: 45, incomeAnnual: 1000000, residenceType: "urban", occupation: "salaried" }],
]) add("J", id, edge, ["ignoaps", "igndps", "pm-kisan"], over);

// ---- build ----------------------------------------------------------------------------------------------------
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = rng(20261119);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// interleave groups after a seeded shuffle so every part mixes schemes and thresholds
const lists = Object.values(groups).map((g) => shuffle([...g]));
const order = [];
for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) order.push(l[i]);

const NAMES = ["Asha", "Bharat", "Chitra", "Deepak", "Esha", "Farhan", "Geeta", "Harish", "Indu", "Jatin", "Kavita", "Lokesh", "Meena", "Naveen", "Omi", "Pooja", "Qadir", "Rekha", "Suresh", "Tara", "Uday"];

// Same shape as eval/personas.js: { id, edge, profile, expected:{eligible,ineligible} } plus focusSchemes.
// evaluate.js picks the 4 questions per persona itself (focus schemes first, then balanced), exactly as in your first run.
const personas = order.map((o, idx) => {
  const profile = { ...BASE, ...o.over, name: NAMES[idx % NAMES.length] };
  const eligible = SCHEMES.filter((s) => RULES[s](profile));
  const ineligible = SCHEMES.filter((s) => !RULES[s](profile));
  return { id: o.id, edge: o.edge, focusSchemes: o.focus, profile, expected: { eligible, ineligible } };
});

const sizes = [21, 21, 21, 21, 16];
const parts = []; let at = 0;
for (const s of sizes) { parts.push(personas.slice(at, at + s)); at += s; }
if (personas.length !== 100 || new Set(personas.map((p) => p.id)).size !== 100) throw new Error("expected 100 unique personas");

mkdirSync("eval/personas-extra", { recursive: true });
parts.forEach((p, i) => writeFileSync(`eval/personas-extra/part${i + 1}.json`, JSON.stringify(p, null, 2)));
const summary = {
  personas: personas.length,
  labelledPairs: personas.length * SCHEMES.length,
  eligiblePairs: personas.reduce((n, p) => n + p.expected.eligible.length, 0),
  focusQuestions: personas.reduce((n, p) => n + p.focusSchemes.length, 0),
  parts: parts.map((p, i) => ({ part: i + 1, personas: p.length, questionsPerArchitecture: p.length * 4, llmCallsAllThree: p.length * 12 })),
};
writeFileSync("eval/personas-extra/index.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

// ---- optional: compare labels with your engine (local code, no API calls) ------------------------------------------
if (process.argv.includes("--check")) {
  try {
    const { evaluateAllSchemes } = await import("../lib/eligibility.js");
    const { SCHEMES: DATA } = await import("../data/schemes.js");
    let bad = 0;
    for (const p of personas) {
      const byKey = new Map(evaluateAllSchemes(p.profile, DATA).map((r) => [r.schemeKey, r.eligible]));
      for (const s of SCHEMES) {
        const label = p.expected.eligible.includes(s);
        if (byKey.get(s) !== label) { bad++; console.log(`MISMATCH ${p.id} / ${s}: label=${label} engine=${byKey.get(s)}`); }
      }
    }
    console.log(`engine check: ${personas.length * SCHEMES.length - bad}/${personas.length * SCHEMES.length} agree`);
  } catch (e) { console.log("engine check skipped:", e.message); }
}