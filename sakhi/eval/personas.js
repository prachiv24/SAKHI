// // // eval/personas.js
// // //
// // // A small, fixed set of citizen personas for the BTP's comparative
// // // evaluation (scripts/evaluate.js). Deliberately covers different states,
// // // ages, occupations, and scheme categories so the eligible/ineligible split
// // // computed against data/schemes.js isn't dominated by one scheme type.
// // //
// // // IMPORTANT for your BTP write-up: 4 personas is enough to prove the
// // // evaluation methodology works end-to-end, but it is NOT a statistically
// // // rigorous sample size. For a defensible accuracy/reliability claim in your
// // // report, expand this file to at least 15-20 personas (vary state, income
// // // band, social category, disability status, occupation) before treating the
// // // output numbers as a real result rather than a pilot run.

// // // export const PERSONAS = [
// // //   {
// // //     id: "lalita",
// // //     focusSchemes: ["nsp-pre-matric-st", "pm-mudra"],
// // //     label: "Lalita — ST schoolgirl, Jharkhand",
// // //     profile: {
// // //       name: "Lalita",
// // //       age: 16,
// // //       gender: "female",
// // //       maritalStatus: "unmarried",
// // //       state: "Jharkhand",
// // //       incomeAnnual: 100000,
// // //       bplCard: true,
// // //       aadhaarLinked: true,
// // //       dependents: 0,
// // //       landOwned: false,
// // //       occupation: "student",
// // //       educationLevel: "class 10",
// // //       socialCategory: "ST",
// // //       disability: false,
// // //       residenceType: "rural",
// // //     },
// // //   },
// // // ];
// // export const PERSONAS = [
// //   {
// //     id: "anil",
// //     focusSchemes: ["pmjjby", "pmsby"],
// //     label: "Anil — age 51, BPL labourer",
// //     profile: {
// //       name: "Anil",
// //       age: 51,
// //       gender: "male",
// //       maritalStatus: "married",
// //       state: "Madhya Pradesh",
// //       incomeAnnual: 120000,
// //       bplCard: true,
// //       aadhaarLinked: true,
// //       dependents: 3,
// //       landOwned: false,
// //       occupation: "labourer",
// //       socialCategory: "OBC",
// //       disability: false,
// //       residenceType: "rural",
// //     },
// //   },
// // ];

// // /**
// //  * Renders a persona's profile fields as a single self-contained natural
// //  * language sentence. Used as-is for V1/V2 (which have no structured
// //  * profile storage) and also given to V3 (so all three architectures get
// //  * the exact same stimulus — a fair, controlled comparison of "given
// //  * identical information, which one answers correctly" rather than
// //  * conflating that with "which one is better at extracting facts from
// //  * prose").
// //  */
// // export function personaToSentence(profile) {
// //   const bits = [
// //     `I am ${profile.age} years old`,
// //     profile.gender,
// //     profile.maritalStatus,
// //     `living in ${profile.state}`,
// //     `My annual family income is ₹${profile.incomeAnnual}`,
// //     profile.bplCard ? "I have a BPL card" : "I do not have a BPL card",
// //     profile.aadhaarLinked ? "my Aadhaar is linked to my bank account" : "my Aadhaar is not linked to a bank account",
// //     `I have ${profile.dependents} dependents`,
// //     profile.landOwned ? "I own agricultural land" : "I do not own any land",
// //     `my occupation is ${profile.occupation}`,
// //     `my social category is ${profile.socialCategory}`,
// //     profile.disability ? "I have a disability" : "I do not have a disability",
// //     `I live in a ${profile.residenceType} area`,
// //   ];

// //   return bits.join(", ") + ".";
// // }


// // // eval/personas.js
// // //
// // // A small, fixed set of citizen personas for the BTP's comparative
// // // evaluation (scripts/evaluate.js). Deliberately covers different states,
// // // ages, occupations, and scheme categories so the eligible/ineligible split
// // // computed against data/schemes.js isn't dominated by one scheme type.
// // //
// // // IMPORTANT for your BTP write-up: 4 personas is enough to prove the
// // // evaluation methodology works end-to-end, but it is NOT a statistically
// // // rigorous sample size. For a defensible accuracy/reliability claim in your
// // // report, expand this file to at least 15-20 personas (vary state, income
// // // band, social category, disability status, occupation) before treating the
// // // output numbers as a real result rather than a pilot run.


// export const PERSONAS = [
//   {
//     id: "sunita",
//     focusSchemes: ["aay", "igndps"],
//     label: "Sunita — widow, Uttar Pradesh, low income",
//     profile: {
//       name: "Sunita",
//       age: 31,
//       gender: "female",
//       maritalStatus: "widow",
//       state: "Uttar Pradesh",
//       incomeAnnual: 80000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "unemployed",
//       socialCategory: "OBC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "ramesh",
//     label: "Ramesh — senior farmer, Maharashtra",
//     profile: {
//       name: "Ramesh",
//       age: 66,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Maharashtra",
//       incomeAnnual: 150000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 1,
//       landOwned: true,
//       occupation: "farmer",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "fatima",
//     label: "Fatima — young, unemployed, Bihar, SC category",
//     profile: {
//       name: "Fatima",
//       age: 22,
//       gender: "female",
//       maritalStatus: "unmarried",
//       state: "Bihar",
//       incomeAnnual: 60000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 0,
//       landOwned: false,
//       occupation: "unemployed",
//       socialCategory: "SC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "arjun",
//     label: "Arjun — disabled, urban, Odisha",
//     profile: {
//       name: "Arjun",
//       age: 45,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Odisha",
//       incomeAnnual: 100000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 3,
//       landOwned: false,
//       occupation: "artisan",
//       socialCategory: "general",
//       disability: true,
//       residenceType: "urban",
//     },
//   },  {
//     id: "meena",
//     focusSchemes: ["up-widow-pension", "pm-sym"],
//     label: "Meena — widow, UP, income just under limit",
//     profile: {
//       name: "Meena",
//       age: 38,
//       gender: "female",
//       maritalStatus: "widow",
//       state: "Uttar Pradesh",
//       incomeAnnual: 199000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "labourer",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "kamla",
//     focusSchemes: ["up-widow-pension", "pmay-g"],
//     label: "Kamla — widow, UP, income exactly at limit",
//     profile: {
//       name: "Kamla",
//       age: 52,
//       gender: "female",
//       maritalStatus: "widow",
//       state: "Uttar Pradesh",
//       incomeAnnual: 200000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 1,
//       landOwned: false,
//       occupation: "labourer",
//       socialCategory: "OBC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "shanti",
//     focusSchemes: ["ignoaps", "jsy"],
//     label: "Shanti — age 59, BPL (one year short of pension age)",
//     profile: {
//       name: "Shanti",
//       age: 59,
//       gender: "female",
//       maritalStatus: "married",
//       state: "Rajasthan",
//       incomeAnnual: 90000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "labourer",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "harbans",
//     focusSchemes: ["ignoaps", "pm-kisan"],
//     label: "Harbans — age 60, BPL farmer",
//     profile: {
//       name: "Harbans",
//       age: 60,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Punjab",
//       incomeAnnual: 110000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: true,
//       occupation: "farmer",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "deepak",
//     focusSchemes: ["apy", "pm-svanidhi"],
//     label: "Deepak — age 40, street vendor, urban",
//     profile: {
//       name: "Deepak",
//       age: 40,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Delhi",
//       incomeAnnual: 450000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "street-vendor",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "vikram",
//     focusSchemes: ["apy", "pmjjby"],
//     label: "Vikram — age 41, salaried, urban",
//     profile: {
//       name: "Vikram",
//       age: 41,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Gujarat",
//       incomeAnnual: 600000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "private-employee",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "anil",
//     focusSchemes: ["pmjjby", "pmsby"],
//     label: "Anil — age 51, BPL labourer",
//     profile: {
//       name: "Anil",
//       age: 51,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Madhya Pradesh",
//       incomeAnnual: 120000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 3,
//       landOwned: false,
//       occupation: "labourer",
//       socialCategory: "OBC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "gopal",
//     focusSchemes: ["pm-kisan", "pmsby"],
//     label: "Gopal — farmer without land, Bihar",
//     profile: {
//       name: "Gopal",
//       age: 44,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Bihar",
//       incomeAnnual: 70000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 3,
//       landOwned: false,
//       occupation: "farmer",
//       socialCategory: "OBC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "hari",
//     focusSchemes: ["pm-kisan", "pmfby"],
//     label: "Hari — landowning farmer, Aadhaar not linked",
//     profile: {
//       name: "Hari",
//       age: 38,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Haryana",
//       incomeAnnual: 140000,
//       bplCard: false,
//       aadhaarLinked: false,
//       dependents: 2,
//       landOwned: true,
//       occupation: "farmer",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "priya",
//     focusSchemes: ["nsp-post-matric-sc", "pm-sym"],
//     label: "Priya — SC student, income just under limit",
//     profile: {
//       name: "Priya",
//       age: 19,
//       gender: "female",
//       maritalStatus: "unmarried",
//       state: "Karnataka",
//       incomeAnnual: 249000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 0,
//       landOwned: false,
//       occupation: "student",
//       socialCategory: "SC",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "rohan",
//     focusSchemes: ["nsp-post-matric-sc", "stand-up-india"],
//     label: "Rohan — SC student, income exactly at limit",
//     profile: {
//       name: "Rohan",
//       age: 20,
//       gender: "male",
//       maritalStatus: "unmarried",
//       state: "Maharashtra",
//       incomeAnnual: 250000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 0,
//       landOwned: false,
//       occupation: "student",
//       socialCategory: "SC",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "lalita",
//     focusSchemes: ["nsp-pre-matric-st", "pm-mudra"],
//     label: "Lalita — ST schoolgirl, Jharkhand",
//     profile: {
//       name: "Lalita",
//       age: 16,
//       gender: "female",
//       maritalStatus: "unmarried",
//       state: "Jharkhand",
//       incomeAnnual: 100000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 0,
//       landOwned: false,
//       occupation: "student",
//       educationLevel: "class 10",
//       socialCategory: "ST",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "salim",
//     focusSchemes: ["pm-svanidhi", "pm-vishwakarma"],
//     label: "Salim — street vendor, Telangana",
//     profile: {
//       name: "Salim",
//       age: 34,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Telangana",
//       incomeAnnual: 150000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "street-vendor",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "tanvi",
//     focusSchemes: ["pm-vishwakarma", "ddu-gky"],
//     label: "Tanvi — artisan aged 17",
//     profile: {
//       name: "Tanvi",
//       age: 17,
//       gender: "female",
//       maritalStatus: "unmarried",
//       state: "Gujarat",
//       incomeAnnual: 95000,
//       bplCard: true,
//       aadhaarLinked: true,
//       dependents: 0,
//       landOwned: false,
//       occupation: "artisan",
//       socialCategory: "OBC",
//       disability: false,
//       residenceType: "rural",
//     },
//   },
//   {
//     id: "mohan",
//     focusSchemes: ["igndps", "pmsby"],
//     label: "Mohan — disabled adult, not BPL",
//     profile: {
//       name: "Mohan",
//       age: 52,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Kerala",
//       incomeAnnual: 300000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: false,
//       occupation: "unemployed",
//       socialCategory: "general",
//       disability: true,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "rajiv",
//     focusSchemes: ["pmay-u", "pmsby"],
//     label: "Rajiv — urban landowner, high income",
//     profile: {
//       name: "Rajiv",
//       age: 48,
//       gender: "male",
//       maritalStatus: "married",
//       state: "Delhi",
//       incomeAnnual: 1500000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 2,
//       landOwned: true,
//       occupation: "private-employee",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
//   {
//     id: "kishan",
//     focusSchemes: ["ab-pmjay", "pmsby"],
//     label: "Kishan — age 72, not BPL",
//     profile: {
//       name: "Kishan",
//       age: 72,
//       gender: "male",
//       maritalStatus: "widower",
//       state: "West Bengal",
//       incomeAnnual: 400000,
//       bplCard: false,
//       aadhaarLinked: true,
//       dependents: 1,
//       landOwned: false,
//       occupation: "retired",
//       socialCategory: "general",
//       disability: false,
//       residenceType: "urban",
//     },
//   },
// ];

// /**
//  * Renders a persona's profile fields as a single self-contained natural
//  * language sentence. Used as-is for V1/V2 (which have no structured
//  * profile storage) and also given to V3 (so all three architectures get
//  * the exact same stimulus — a fair, controlled comparison of "given
//  * identical information, which one answers correctly" rather than
//  * conflating that with "which one is better at extracting facts from
//  * prose").
//  */
// export function personaToSentence(profile) {
//   const bits = [
//     `I am ${profile.age} years old`,
//     profile.gender,
//     profile.maritalStatus,
//     `living in ${profile.state}`,
//     `My annual family income is ₹${profile.incomeAnnual}`,
//     profile.bplCard ? "I have a BPL card" : "I do not have a BPL card",
//     profile.aadhaarLinked ? "my Aadhaar is linked to my bank account" : "my Aadhaar is not linked to a bank account",
//     `I have ${profile.dependents} dependents`,
//     profile.landOwned ? "I own agricultural land" : "I do not own any land",
//     `my occupation is ${profile.occupation}`,
//     `my social category is ${profile.socialCategory}`,
//     profile.disability ? "I have a disability" : "I do not have a disability",
//     `I live in a ${profile.residenceType} area`,
//   ];

//   return bits.join(", ") + ".";
// }


// eval/personas.js
//
// 21 citizen personas for the comparative evaluation (scripts/evaluate.js):
// the 4 original pilot personas + 17 edge-case personas built around the
// REAL thresholds in data/schemes.js (age cut-offs, income limits, state
// restriction, near-miss profiles, OR-route eligibility).
//
// GROUND TRUTH
//   `expected.eligible` / `expected.ineligible` are scored only for the 8
//   FOCUS_SCHEMES below. Labels were worked out by hand from the rules in
//   data/schemes.js (NOT by running the rule engine), so the engine cannot
//   pass its own bugs. Before you report results, verify those 8 schemes'
//   rules against the official notifications (see notes in the chat).
//
// IMPORTANT RULE SEMANTICS (from schemes.js)
//   - Income limits use `lt` (strictly below): income == limit is INELIGIBLE.
//   - Age minimums use `gte` (inclusive); age maximums use `lt`
//     (e.g. pm-sym `age < 41` means 40 is eligible, 41 is not).
//ab-pmjay: age >= 70 only (SECC listing not modelled). Under-70 questions are undetermined and skipped by evaluate.js.
//   - All personas have aadhaarLinked = true, so the "exists" rule never
//     decides an outcome.

export const FOCUS_SCHEMES = {
    IGNOAPS: "ignoaps",            // age >= 60 AND bplCard
    IGNDPS: "igndps",              // disability AND age >= 18 AND bplCard
    WIDOW: "up-widow-pension",     // widow AND state == UP AND income < 200000 AND age >= 18
    KISAN: "pm-kisan",             // occupation == farmer AND landOwned
    UJJWALA: "pmuy",               // female AND age >= 18 AND bplCard
    SC: "nsp-post-matric-sc",      // socialCategory == SC AND income < 250000
    SYM: "pm-sym",                 // 18 <= age < 41 AND income < 180000
    PMJAY: "ab-pmjay",             // age >= 70 only.
  };
  
  const F = FOCUS_SCHEMES;
  const ALL = Object.values(F);
  
  // Write only the eligible list; everything else in FOCUS is ineligible.
  const expect = (eligible) => ({
    eligible,
    ineligible: ALL.filter((id) => !eligible.includes(id)),
  });
  
  // Neutral baseline. Each edge-case persona overrides only what it tests.
  //(Baseline alone is eligible for pm-sym.).
  const BASE = {
    age: 35,
    gender: "male",
    maritalStatus: "married",
    state: "Bihar",
    incomeAnnual: 80000,
    bplCard: true,
    aadhaarLinked: true,
    dependents: 2,
    landOwned: false,
    occupation: "labourer",
    socialCategory: "general",
    disability: false,
    residenceType: "rural",
  };
  const P = (name, over) => ({ ...BASE, name, ...over });
  
  export const PERSONAS = [
    // ---------------- original pilot personas ----------------
    {
      id: "sunita",
      label: "Sunita — widow, Uttar Pradesh, low income",
      edge: "clear positive: widow pension + Ujjwala",
      profile: {
        name: "Sunita", age: 31, gender: "female", maritalStatus: "widow",
        state: "Uttar Pradesh", incomeAnnual: 80000, bplCard: true,
        aadhaarLinked: true, dependents: 2, landOwned: false,
        occupation: "unemployed", socialCategory: "OBC", disability: false,
        residenceType: "rural",
      },
      expected: expect([F.WIDOW, F.UJJWALA, F.SYM, F.PMJAY]),
    },
    {
      id: "ramesh",
      label: "Ramesh — senior farmer, Maharashtra",
      edge: "near-miss: age 66 but no BPL card, so old-age pension fails",
      profile: {
        name: "Ramesh", age: 66, gender: "male", maritalStatus: "married",
        state: "Maharashtra", incomeAnnual: 150000, bplCard: false,
        aadhaarLinked: true, dependents: 1, landOwned: true,
        occupation: "farmer", socialCategory: "general", disability: false,
        residenceType: "rural",
      },
      expected: expect([F.KISAN]),
    },
    {
      id: "fatima",
      label: "Fatima — young, unemployed, Bihar, SC category",
      edge: "clear positive: SC scholarship + Ujjwala; wrong state for widow pension",
      profile: {
        name: "Fatima", age: 22, gender: "female", maritalStatus: "unmarried",
        state: "Bihar", incomeAnnual: 60000, bplCard: true,
        aadhaarLinked: true, dependents: 0, landOwned: false,
        occupation: "unemployed", socialCategory: "SC", disability: false,
        residenceType: "rural",
      },
      expected: expect([F.UJJWALA, F.SC, F.SYM, F.PMJAY]),
    },
    {
      id: "arjun",
      label: "Arjun — disabled, urban, Odisha",
      edge: "clear positive: disability pension; too old (45) for pm-sym",
      profile: {
        name: "Arjun", age: 45, gender: "male", maritalStatus: "married",
        state: "Odisha", incomeAnnual: 100000, bplCard: true,
        aadhaarLinked: true, dependents: 3, landOwned: false,
        occupation: "artisan", socialCategory: "general", disability: true,
        residenceType: "urban",
      },
      expected: expect([F.IGNDPS, F.PMJAY]),
    },
  
    // ---------------- old-age pension age cut-off (>= 60) ----------------
    {
      id: "mohan_60",
      label: "Mohan — exactly 60, BPL",
      edge: "age exactly at old-age pension cut-off (inclusive)",
      profile: P("Mohan", { age: 60 }),
      expected: expect([F.IGNOAPS, F.PMJAY]),
    },
    {
      id: "kishan_59",
      label: "Kishan — 59, BPL",
      edge: "age one year below old-age pension cut-off",
      profile: P("Kishan", { age: 59 }),
      expected: expect([F.PMJAY]),
    },
  
    // ---------------- pm-sym age band (18 <= age < 41) ----------------
    {
      id: "sym_age_40",
      label: "Deepak — 40, BPL, income 80,000",
      edge: "age one below pm-sym upper limit (40 is eligible)",
      profile: P("Deepak", { age: 40 }),
      expected: expect([F.SYM, F.PMJAY]),
    },
    {
      id: "sym_age_41",
      label: "Harish — 41, BPL, income 80,000",
      edge: "age exactly at pm-sym exclusive upper limit (41 is NOT eligible)",
      profile: P("Harish", { age: 41 }),
      expected: expect([F.PMJAY]),
    },
  
    // ---------------- pm-sym income limit (< 180000) ----------------
    {
      id: "sym_inc_179999",
      label: "Imran — 30, income 179,999",
      edge: "income just under pm-sym limit",
      profile: P("Imran", { age: 30, incomeAnnual: 179999 }),
      expected: expect([F.SYM, F.PMJAY]),
    },
    {
      id: "sym_inc_180000",
      label: "Jatin — 30, income 180,000",
      edge: "income exactly at pm-sym limit (inclusive limit,  eligible)",
      profile: P("Jatin", { age: 30, incomeAnnual: 180000 }),
      // expected: expect([F.PMJAY]),
      expected: expect([F.SYM, F.PMJAY]),
    },
  
    // ---------------- SC scholarship income limit (<= 250000) ----------------
    {
      id: "sc_249999",
      label: "Rohit — SC student, income 249,999, no BPL",
      edge: "income just under SC scholarship limit",
      profile: P("Rohit", {
        age: 20, maritalStatus: "unmarried", occupation: "student",
        socialCategory: "SC", incomeAnnual: 249999, bplCard: false,
      }),
      expected: expect([F.SC]),
    },
    {
      id: "sc_250000",
      label: "Pankaj — SC student, income 250,000, no BPL",
      edge: "income exactly at SC scholarship limit (inclusive limit,  eligible)",
      profile: P("Pankaj", {
        age: 20, maritalStatus: "unmarried", occupation: "student",
        socialCategory: "SC", incomeAnnual: 250000, bplCard: false,
      }),
      // expected: expect([]),
      expected: expect([F.SC]),
    },
  
    // ---------------- widow pension: state + income (< 200000) ----------------
    {
      id: "widow_up_199999",
      label: "Geeta — widow, 45, UP, income 199,999, BPL",
      edge: "income just under widow-pension limit, correct state",
      profile: P("Geeta", {
        age: 45, gender: "female", maritalStatus: "widow",
        state: "Uttar Pradesh", incomeAnnual: 199999,
      }),
      expected: expect([F.WIDOW, F.UJJWALA, F.PMJAY]),
    },
    {
      id: "widow_up_200000",
      label: "Lata — widow, 45, UP, income 200,000, BPL",
      edge: "income exactly at widow-pension limit (strict lt, so NOT eligible)",
      profile: P("Lata", {
        age: 45, gender: "female", maritalStatus: "widow",
        state: "Uttar Pradesh", incomeAnnual: 200000,
      }),
      expected: expect([F.UJJWALA, F.PMJAY]),
    },
    {
      id: "widow_wrong_state",
      label: "Radha — widow, 45, Bihar, income 80,000, BPL",
      edge: "wrong state: meets every widow-pension criterion except state",
      profile: P("Radha", {
        age: 45, gender: "female", maritalStatus: "widow",
        state: "Bihar", incomeAnnual: 80000,
      }),
      expected: expect([F.UJJWALA, F.PMJAY]),
    },
  
    // ---------------- near-miss: one failing criterion ----------------
    {
      id: "bhola_noland",
      label: "Bhola — farmer by occupation, owns no land",
      edge: "near-miss: occupation farmer but landOwned = false",
      profile: P("Bhola", { age: 50, occupation: "farmer", landOwned: false }),
      expected: expect([F.PMJAY]),
    },
    {
      id: "sanjay_dis_nobpl",
      label: "Sanjay — disabled, 38, no BPL, income 400,000",
      edge: "near-miss: disability + age ok but fails BPL",
      profile: P("Sanjay", {
        age: 38, disability: true, bplCard: false, incomeAnnual: 400000,
      }),
      expected: expect([]),
    },
  
    // ---------------- disability pension age cut-off (>= 18) ----------------
    {
      id: "vikas_18",
      label: "Vikas — disabled, exactly 18, BPL",
      edge: "age exactly at disability-pension minimum (inclusive)",
      profile: P("Vikas", {
        age: 18, maritalStatus: "unmarried", disability: true,
      }),
      expected: expect([F.IGNDPS, F.SYM, F.PMJAY]),
    },
    {
      id: "anil_17",
      label: "Anil — disabled, 17, BPL",
      edge: "age one below disability-pension minimum; also below pm-sym minimum",
      profile: P("Anil", {
        age: 17, maritalStatus: "unmarried", disability: true,
      }),
      expected: expect([F.PMJAY]),
    },
  
    // ---------------- OR-route eligibility ----------------
    {
      id: "pmjay_70_nobpl",
      label: "Gopal — 70, no BPL, income 900,000",
      edge: "ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL",
      profile: P("Gopal", {
        age: 70, bplCard: false, incomeAnnual: 900000, occupation: "retired",
      }),
      expected: expect([F.PMJAY]),
    },
  
    // ---------------- clear negative ----------------
    {
      id: "karan_none",
      label: "Karan — salaried, urban, income 12 lakh, no BPL",
      edge: "clearly eligible for none of the focus schemes",
      profile: P("Karan", {
        age: 30, occupation: "salaried", residenceType: "urban",
        incomeAnnual: 1200000, bplCard: false,
      }),
      expected: expect([]),
    },
  ];
  
  /**
   * Renders a persona's profile fields as a single self-contained natural
   * language sentence. Used as-is for V1/V2 (which have no structured
   * profile storage) and also given to V3 (so all three architectures get
   * the exact same stimulus — a fair, controlled comparison of "given
   * identical information, which one answers correctly" rather than
   * conflating that with "which one is better at extracting facts from
   * prose").
   */
  export function personaToSentence(profile) {
    const bits = [
      `I am ${profile.age} years old`,
      profile.gender,
      profile.maritalStatus,
      `living in ${profile.state}`,
      `My annual family income is ₹${profile.incomeAnnual}`,
      profile.bplCard ? "I have a BPL card" : "I do not have a BPL card",
      profile.aadhaarLinked ? "my Aadhaar is linked to my bank account" : "my Aadhaar is not linked to a bank account",
      `I have ${profile.dependents} dependents`,
      profile.landOwned ? "I own agricultural land" : "I do not own any land",
      `my occupation is ${profile.occupation}`,
      `my social category is ${profile.socialCategory}`,
      profile.disability ? "I have a disability" : "I do not have a disability",
      `I live in a ${profile.residenceType} area`,
    ];
  
    return bits.join(", ") + ".";
  }