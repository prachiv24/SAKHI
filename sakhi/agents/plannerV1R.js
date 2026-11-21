// // agents/plannerV1.js
// //
// // V1 of the BTP's three-way comparison: a plain single-shot LLM call, with
// // NO tools, NO retrieval, and NO deterministic eligibility engine. This is
// // the classic "just ask the model" baseline that RAG/agent papers compare
// // against — Gemini answers purely from its own training-time knowledge of
// // Indian government schemes, which is exactly the failure mode this BTP is
// // meant to measure (unverifiable claims, no grounding, potential
// // hallucination of scheme names/amounts/eligibility rules).
// //
// // Deliberately kept structurally parallel to agents/planner.js (V3) —
// // same function signature and return shape — so scripts/evaluate.js can
// // call all three interchangeably.

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const V1_SYSTEM_PROMPT = `You are a helpful assistant for Indian citizens asking about government
// welfare schemes (central and state). Answer questions about scheme eligibility, benefits,
// required documents, and how to apply, using your own knowledge. Be concise and specific
// (scheme names, amounts, eligibility conditions) wherever you can. If you are not confident about
// a specific detail, say so rather than guessing with false confidence.`;

// const model = genAI.getGenerativeModel({
//   model: process.env.EVAL_MODEL || "gemini-3.8-flash",
//   systemInstruction: { role: "system", parts: [{ text: V1_SYSTEM_PROMPT }] },
// });

// /**
//  * @param {string} sessionId - unused (V1 is stateless beyond the passed-in history) but kept
//  *   for a matching call signature with V2/V3.
//  * @param {import('./planner.js').ChatMessage[]} history
//  * @param {string} userMessage
//  * @returns {Promise<import('./planner.js').PlannerResult>}
//  */
// export async function runPlannerTurnV1R(sessionId, history, userMessage) {
//   const trimmedHistory = [...history];
//   while (trimmedHistory.length && trimmedHistory[0].role === "assistant") {
//     trimmedHistory.shift();
//   }

//   const chat = model.startChat({
//     history: trimmedHistory.map((m) => ({
//       role: m.role === "assistant" ? "model" : "user",
//       parts: [{ text: m.content }],
//     })),
//   });

//   const response = (await chat.sendMessage(userMessage)).response;
//   const finalText = response.text();

//   return {
//     messages: [...history, { role: "user", content: userMessage }, { role: "assistant", content: finalText }],
//     finalText,
//     toolCallsExecuted: [], // V1 has no tools — kept for shape-compatibility with V2/V3 results
//   };
// }



// agents/plannerV1R.js
//
// V1R: rule-aware single-shot baseline. Identical to plannerV1.js (no tools,
// no retrieval, no engine) EXCEPT that the plain-English eligibility rules of
// the eight evaluated verified schemes are included in the system prompt.
// Used to test whether V3's advantage comes from the rule engine itself or
// merely from having the rules available.

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RULES = `SCHEME RULES. A person is eligible only if every condition for that scheme holds.

1. Indira Gandhi National Old Age Pension: age >= 60 AND has a BPL card.
2. Indira Gandhi National Disability Pension: has a certified severe disability AND age >= 18 AND has a BPL card.
3. UP Widow Pension: marital status is widow AND gender is female AND state is Uttar Pradesh AND annual income is strictly below Rs 2,00,000 (exactly Rs 2,00,000 is NOT eligible) AND age >= 18.
4. PM-KISAN: occupation is farmer AND family owns cultivable land AND Aadhaar is linked to the bank account.
5. PMUY: gender is female AND age >= 18 AND has a BPL card.
6. Post-Matric Scholarship for SC students: social category is SC AND annual family income is at most Rs 2,50,000 (exactly Rs 2,50,000 IS eligible).
7. PM-SYM: age is at least 18 and at most 40 AND annual income is at most Rs 1,80,000 (exactly Rs 1,80,000 IS eligible) AND Aadhaar is linked.
8. AB-PMJAY: eligible if EITHER age >= 70 (no income test) OR (has a BPL card AND annual income is strictly below Rs 5,00,000).`;

const V1R_SYSTEM_PROMPT = `You are a helpful assistant for Indian citizens asking about government
welfare schemes (central and state). For questions about scheme eligibility, decide using ONLY the
rules below. Be concise and specific. If the rules do not cover a detail, or you are not confident
about it, say so rather than guessing with false confidence.

${RULES}`;

const model = genAI.getGenerativeModel({
  model: process.env.EVAL_MODEL || "gemini-3.8-flash",
  systemInstruction: { role: "system", parts: [{ text: V1R_SYSTEM_PROMPT }] },
});

export async function runPlannerTurnV1R(sessionId, history, userMessage) {
  const trimmedHistory = [...history];
  while (trimmedHistory.length && trimmedHistory[0].role === "assistant") {
    trimmedHistory.shift();
  }

  const chat = model.startChat({
    history: trimmedHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const response = (await chat.sendMessage(userMessage)).response;
  const finalText = response.text();

  return {
    messages: [...history, { role: "user", content: userMessage }, { role: "assistant", content: finalText }],
    finalText,
    toolCallsExecuted: [],
  };
}