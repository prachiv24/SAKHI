// // eval/personas.js
// //
// // A small, fixed set of citizen personas for the BTP's comparative
// // evaluation (scripts/evaluate.js). Deliberately covers different states,
// // ages, occupations, and scheme categories so the eligible/ineligible split
// // computed against data/schemes.js isn't dominated by one scheme type.
// //
// // IMPORTANT for your BTP write-up: 4 personas is enough to prove the
// // evaluation methodology works end-to-end, but it is NOT a statistically
// // rigorous sample size. For a defensible accuracy/reliability claim in your
// // report, expand this file to at least 15-20 personas (vary state, income
// // band, social category, disability status, occupation) before treating the
// // output numbers as a real result rather than a pilot run.

// export const PERSONAS = [
//   {
//     id: "sunita",
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





// // eval/personas.js
// //
// // A small, fixed set of citizen personas for the BTP's comparative
// // evaluation (scripts/evaluate.js). Deliberately covers different states,
// // ages, occupations, and scheme categories so the eligible/ineligible split
// // computed against data/schemes.js isn't dominated by one scheme type.
// //
// // IMPORTANT for your BTP write-up: 4 personas is enough to prove the
// // evaluation methodology works end-to-end, but it is NOT a statistically
// // rigorous sample size. For a defensible accuracy/reliability claim in your
// // report, expand this file to at least 15-20 personas (vary state, income
// // band, social category, disability status, occupation) before treating the
// // output numbers as a real result rather than a pilot run.

// export const PERSONAS = [
//   {
//     id: "sunita",
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
// A small, fixed set of citizen personas for the BTP's comparative
// evaluation (scripts/evaluate.js). Deliberately covers different states,
// ages, occupations, and scheme categories so the eligible/ineligible split
// computed against data/schemes.js isn't dominated by one scheme type.
//
// NOTE: personas 5-21 were added as boundary / near-miss cases (income and age exactly at a
// scheme limit, missing Aadhaar, landless farmer, ...). Original note: 4 personas is enough to prove the
// evaluation methodology works end-to-end, but it is NOT a statistically
// rigorous sample size. For a defensible accuracy/reliability claim in your
// report, expand this file to at least 15-20 personas (vary state, income
// band, social category, disability status, occupation) before treating the
// output numbers as a real result rather than a pilot run.

export const PERSONAS = [
  {
    id: "sunita",
    focusSchemes: ["aay", "igndps"],
    label: "Sunita — widow, Uttar Pradesh, low income",
    profile: {
      name: "Sunita",
      age: 31,
      gender: "female",
      maritalStatus: "widow",
      state: "Uttar Pradesh",
      incomeAnnual: 80000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "unemployed",
      socialCategory: "OBC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "ramesh",
    label: "Ramesh — senior farmer, Maharashtra",
    profile: {
      name: "Ramesh",
      age: 66,
      gender: "male",
      maritalStatus: "married",
      state: "Maharashtra",
      incomeAnnual: 150000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 1,
      landOwned: true,
      occupation: "farmer",
      socialCategory: "general",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "fatima",
    label: "Fatima — young, unemployed, Bihar, SC category",
    profile: {
      name: "Fatima",
      age: 22,
      gender: "female",
      maritalStatus: "unmarried",
      state: "Bihar",
      incomeAnnual: 60000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 0,
      landOwned: false,
      occupation: "unemployed",
      socialCategory: "SC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "arjun",
    label: "Arjun — disabled, urban, Odisha",
    profile: {
      name: "Arjun",
      age: 45,
      gender: "male",
      maritalStatus: "married",
      state: "Odisha",
      incomeAnnual: 100000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 3,
      landOwned: false,
      occupation: "artisan",
      socialCategory: "general",
      disability: true,
      residenceType: "urban",
    },
  },  {
    id: "meena",
    focusSchemes: ["up-widow-pension", "pm-sym"],
    label: "Meena — widow, UP, income just under limit",
    profile: {
      name: "Meena",
      age: 38,
      gender: "female",
      maritalStatus: "widow",
      state: "Uttar Pradesh",
      incomeAnnual: 199000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "labourer",
      socialCategory: "general",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "kamla",
    focusSchemes: ["up-widow-pension", "pmay-g"],
    label: "Kamla — widow, UP, income exactly at limit",
    profile: {
      name: "Kamla",
      age: 52,
      gender: "female",
      maritalStatus: "widow",
      state: "Uttar Pradesh",
      incomeAnnual: 200000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 1,
      landOwned: false,
      occupation: "labourer",
      socialCategory: "OBC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "shanti",
    focusSchemes: ["ignoaps", "jsy"],
    label: "Shanti — age 59, BPL (one year short of pension age)",
    profile: {
      name: "Shanti",
      age: 59,
      gender: "female",
      maritalStatus: "married",
      state: "Rajasthan",
      incomeAnnual: 90000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "labourer",
      socialCategory: "general",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "harbans",
    focusSchemes: ["ignoaps", "pm-kisan"],
    label: "Harbans — age 60, BPL farmer",
    profile: {
      name: "Harbans",
      age: 60,
      gender: "male",
      maritalStatus: "married",
      state: "Punjab",
      incomeAnnual: 110000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: true,
      occupation: "farmer",
      socialCategory: "general",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "deepak",
    focusSchemes: ["apy", "pm-svanidhi"],
    label: "Deepak — age 40, street vendor, urban",
    profile: {
      name: "Deepak",
      age: 40,
      gender: "male",
      maritalStatus: "married",
      state: "Delhi",
      incomeAnnual: 450000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "street-vendor",
      socialCategory: "general",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "vikram",
    focusSchemes: ["apy", "pmjjby"],
    label: "Vikram — age 41, salaried, urban",
    profile: {
      name: "Vikram",
      age: 41,
      gender: "male",
      maritalStatus: "married",
      state: "Gujarat",
      incomeAnnual: 600000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "private-employee",
      socialCategory: "general",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "anil",
    focusSchemes: ["pmjjby", "pmsby"],
    label: "Anil — age 51, BPL labourer",
    profile: {
      name: "Anil",
      age: 51,
      gender: "male",
      maritalStatus: "married",
      state: "Madhya Pradesh",
      incomeAnnual: 120000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 3,
      landOwned: false,
      occupation: "labourer",
      socialCategory: "OBC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "gopal",
    focusSchemes: ["pm-kisan", "pmsby"],
    label: "Gopal — farmer without land, Bihar",
    profile: {
      name: "Gopal",
      age: 44,
      gender: "male",
      maritalStatus: "married",
      state: "Bihar",
      incomeAnnual: 70000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 3,
      landOwned: false,
      occupation: "farmer",
      socialCategory: "OBC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "hari",
    focusSchemes: ["pm-kisan", "pmfby"],
    label: "Hari — landowning farmer, Aadhaar not linked",
    profile: {
      name: "Hari",
      age: 38,
      gender: "male",
      maritalStatus: "married",
      state: "Haryana",
      incomeAnnual: 140000,
      bplCard: false,
      aadhaarLinked: false,
      dependents: 2,
      landOwned: true,
      occupation: "farmer",
      socialCategory: "general",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "priya",
    focusSchemes: ["nsp-post-matric-sc", "pm-sym"],
    label: "Priya — SC student, income just under limit",
    profile: {
      name: "Priya",
      age: 19,
      gender: "female",
      maritalStatus: "unmarried",
      state: "Karnataka",
      incomeAnnual: 249000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 0,
      landOwned: false,
      occupation: "student",
      socialCategory: "SC",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "rohan",
    focusSchemes: ["nsp-post-matric-sc", "stand-up-india"],
    label: "Rohan — SC student, income exactly at limit",
    profile: {
      name: "Rohan",
      age: 20,
      gender: "male",
      maritalStatus: "unmarried",
      state: "Maharashtra",
      incomeAnnual: 250000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 0,
      landOwned: false,
      occupation: "student",
      socialCategory: "SC",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "lalita",
    focusSchemes: ["nsp-pre-matric-st", "pm-mudra"],
    label: "Lalita — ST schoolgirl, Jharkhand",
    profile: {
      name: "Lalita",
      age: 16,
      gender: "female",
      maritalStatus: "unmarried",
      state: "Jharkhand",
      incomeAnnual: 100000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 0,
      landOwned: false,
      occupation: "student",
      socialCategory: "ST",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "salim",
    focusSchemes: ["pm-svanidhi", "pm-vishwakarma"],
    label: "Salim — street vendor, Telangana",
    profile: {
      name: "Salim",
      age: 34,
      gender: "male",
      maritalStatus: "married",
      state: "Telangana",
      incomeAnnual: 150000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "street-vendor",
      socialCategory: "general",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "tanvi",
    focusSchemes: ["pm-vishwakarma", "ddu-gky"],
    label: "Tanvi — artisan aged 17",
    profile: {
      name: "Tanvi",
      age: 17,
      gender: "female",
      maritalStatus: "unmarried",
      state: "Gujarat",
      incomeAnnual: 95000,
      bplCard: true,
      aadhaarLinked: true,
      dependents: 0,
      landOwned: false,
      occupation: "artisan",
      socialCategory: "OBC",
      disability: false,
      residenceType: "rural",
    },
  },
  {
    id: "mohan",
    focusSchemes: ["igndps", "pmsby"],
    label: "Mohan — disabled adult, not BPL",
    profile: {
      name: "Mohan",
      age: 52,
      gender: "male",
      maritalStatus: "married",
      state: "Kerala",
      incomeAnnual: 300000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: false,
      occupation: "unemployed",
      socialCategory: "general",
      disability: true,
      residenceType: "urban",
    },
  },
  {
    id: "rajiv",
    focusSchemes: ["pmay-u", "pmsby"],
    label: "Rajiv — urban landowner, high income",
    profile: {
      name: "Rajiv",
      age: 48,
      gender: "male",
      maritalStatus: "married",
      state: "Delhi",
      incomeAnnual: 1500000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 2,
      landOwned: true,
      occupation: "private-employee",
      socialCategory: "general",
      disability: false,
      residenceType: "urban",
    },
  },
  {
    id: "kishan",
    focusSchemes: ["ab-pmjay", "pmsby"],
    label: "Kishan — age 72, not BPL",
    profile: {
      name: "Kishan",
      age: 72,
      gender: "male",
      maritalStatus: "widower",
      state: "West Bengal",
      incomeAnnual: 400000,
      bplCard: false,
      aadhaarLinked: true,
      dependents: 1,
      landOwned: false,
      occupation: "retired",
      socialCategory: "general",
      disability: false,
      residenceType: "urban",
    },
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
