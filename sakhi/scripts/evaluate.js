// // // // // // // // scripts/evaluate.js
// // // // // // // //
// // // // // // // // The BTP's core comparative-evaluation harness. Runs a fixed set of
// // // // // // // // (persona, scheme) eligibility questions through all three architectures —
// // // // // // // // V1 (single-shot, no grounding), V2 (single-shot + RAG), V3 (multi-agent +
// // // // // // // // deterministic eligibility engine) — using IDENTICAL prompts across all
// // // // // // // // three (see eval/personas.js: personaToSentence()), and scores each
// // // // // // // // architecture's answer against ground truth computed directly from
// // // // // // // // lib/eligibility.js (the same deterministic logic V3 uses internally,
// // // // // // // // which is why V3 is expected — and should be shown — to score highest).
// // // // // // // //
// // // // // // // // Usage:
// // // // // // // //   node scripts/evaluate.js                # full run (all personas x all modes)
// // // // // // // //   node scripts/evaluate.js --quick         # 1 persona, 2 questions, for a fast smoke test
// // // // // // // //
// // // // // // // // Output:
// // // // // // // //   eval/results/results-<timestamp>.json    raw per-question records
// // // // // // // //   eval/results/summary.md                  accuracy table + confusion matrix per mode
// // // // // // // //
// // // // // // // // Requires GEMINI_API_KEY in .env.local (same one the app already uses).
// // // // // // // // Each question costs one LLM call per mode (V2 also costs one embedding
// // // // // // // // call for retrieval) — the full run is ~4 personas x 4 questions x 3 modes
// // // // // // // // = 48 LLM calls. Budget a few minutes and stay mindful of free-tier quota.
// // // // // // // //
// // // // // // // // ---------------------------------------------------------------------
// // // // // // // // HONESTY NOTE FOR YOUR BTP WRITE-UP — read this before citing the numbers:
// // // // // // // // ---------------------------------------------------------------------
// // // // // // // // 1. Answer classification (classifyAnswer below) is a keyword heuristic,
// // // // // // // //    not an LLM-graded or human-graded judgment. It's good enough to
// // // // // // // //    validate the harness works and to get a directional first read, but a
// // // // // // // //    handful of responses will likely be misclassified (e.g. hedged
// // // // // // // //    answers). Spot-check the raw text in the JSON output before trusting
// // // // // // // //    the accuracy numbers, and ideally have a human re-label a sample.
// // // // // // // // 2. 4 personas is a pilot sample, not a statistically powered evaluation.
// // // // // // // //    Expand eval/personas.js before treating this as a real result.
// // // // // // // // 3. The "language robustness" section (Hindi question) is a qualitative
// // // // // // // //    pilot only — one question, one language, machine-translated by an AI
// // // // // // // //    assistant and NOT verified by a native speaker. Treat it as "does the
// // // // // // // //    pipeline work at all with non-English input", not as a language-
// // // // // // // //    accuracy measurement. Get the translation checked, add more languages
// // // // // // // //    and more questions, before this becomes a claim in your report.
// // // // // // // // ---------------------------------------------------------------------

// // // // // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // // // // function loadEnvLocal() {
// // // // // // //   if (!existsSync(".env.local")) return;
// // // // // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // // // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // // // // //     if (!match) continue;
// // // // // // //     const [, key, rawValue = ""] = match;
// // // // // // //     if (process.env[key] !== undefined) continue;
// // // // // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // // // // //   }
// // // // // // // }
// // // // // // // loadEnvLocal();

// // // // // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // // // // const QUICK = process.argv.includes("--quick");
// // // // // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // // // // const QUESTIONS_PER_PERSONA = QUICK ? 2 : 4; // split roughly evenly between eligible/ineligible

// // // // // // // const MODES = {
// // // // // // //   v1: runPlannerTurnV1,
// // // // // // //   v2: runPlannerTurnV2,
// // // // // // //   v3: runPlannerTurn,
// // // // // // // };

// // // // // // // const HINDI_PILOT_QUESTION = {
// // // // // // //   personaId: "sunita",
// // // // // // //   schemeKey: "up-widow-pension",
// // // // // // //   expected: true,
// // // // // // //   text:
// // // // // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // // // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // // // // };

// // // // // // // function sleep(ms) {
// // // // // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // // // // }

// // // // // // // /** Builds each persona's fixed question set: half known-eligible, half known-ineligible,
// // // // // // //  * chosen deterministically (sorted by schemeKey) so re-runs are reproducible. */
// // // // // // // function buildQuestionsForPersona(persona) {
// // // // // // //   const results = evaluateAllSchemes(persona.profile, SCHEMES);
// // // // // // //   const eligible = results.filter((r) => r.eligible).sort((a, b) => a.schemeKey.localeCompare(b.schemeKey));
// // // // // // //   const ineligible = results.filter((r) => !r.eligible).sort((a, b) => a.schemeKey.localeCompare(b.schemeKey));

// // // // // // //   const half = Math.ceil(QUESTIONS_PER_PERSONA / 2);
// // // // // // //   const picked = [...eligible.slice(0, half), ...ineligible.slice(0, QUESTIONS_PER_PERSONA - half)];

// // // // // // //   return picked.map((r) => ({
// // // // // // //     personaId: persona.id,
// // // // // // //     schemeKey: r.schemeKey,
// // // // // // //     schemeName: r.schemeName,
// // // // // // //     expected: r.eligible,
// // // // // // //   }));
// // // // // // // }

// // // // // // // /** Keyword-based classifier — see the HONESTY NOTE at the top of this file. */
// // // // // // // function classifyAnswer(text) {
// // // // // // //   const t = text.trim().toLowerCase();
// // // // // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // // // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // // // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // // // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // // // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // // // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // // // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // // // // //   return null; // unclear
// // // // // // // }

// // // // // // // async function runOne(mode, question, questionText) {
// // // // // // //   const runTurn = MODES[mode];
// // // // // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // // // // //   const start = Date.now();
// // // // // // //   let finalText = "";
// // // // // // //   let error = null;

// // // // // // //   try {
// // // // // // //     const result = await runTurn(sessionId, [], questionText);
// // // // // // //     finalText = result.finalText;
// // // // // // //   } catch (err) {
// // // // // // //     error = err.message || String(err);
// // // // // // //   }

// // // // // // //   const latencyMs = Date.now() - start;
// // // // // // //   const classification = error ? null : classifyAnswer(finalText);

// // // // // // //   return {
// // // // // // //     mode,
// // // // // // //     ...question,
// // // // // // //     latencyMs,
// // // // // // //     error,
// // // // // // //     responseText: finalText,
// // // // // // //     classification, // true = model said eligible, false = model said not eligible, null = unclear
// // // // // // //     correct: error ? false : classification === question.expected,
// // // // // // //   };
// // // // // // // }

// // // // // // // function summarize(records) {
// // // // // // //   const byMode = {};

// // // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // // //     const rows = records.filter((r) => r.mode === mode);
// // // // // // //     const total = rows.length;
// // // // // // //     const errors = rows.filter((r) => r.error).length;
// // // // // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // // // // //     const correct = rows.filter((r) => r.correct).length;

// // // // // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // // // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // // // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // // // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // // // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // // // // //     byMode[mode] = {
// // // // // // //       total,
// // // // // // //       correct,
// // // // // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // // // // //       unclear,
// // // // // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // // // // //       errors,
// // // // // // //       avgLatencyMs,
// // // // // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // // // // //     };
// // // // // // //   }

// // // // // // //   return byMode;
// // // // // // // }

// // // // // // // function toMarkdown(byMode, records, hindiPilot) {
// // // // // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };

// // // // // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // // // // //   md += `Pilot run: ${new Set(records.map((r) => r.personaId)).size} persona(s), ${records.length / 3} question(s) per architecture.\n`;
// // // // // // //   md += `**See the HONESTY NOTE at the top of scripts/evaluate.js before citing these numbers in your report.**\n\n`;

// // // // // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // // // // //   md += `|---|---|---|---|---|---|\n`;
// // // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // // //     const s = byMode[mode];
// // // // // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // // // // //   }

// // // // // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // // // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // // // // //   md += `|---|---|---|---|---|\n`;
// // // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // // //     const c = byMode[mode].confusion;
// // // // // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // // // // //   }

// // // // // // //   if (hindiPilot?.length) {
// // // // // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // // // // //     for (const r of hindiPilot) {
// // // // // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // // // // //     }
// // // // // // //   }

// // // // // // //   md += `\n## Raw per-question results\n\n`;
// // // // // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // // // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // // // // //   for (const r of records) {
// // // // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // // // // //   }

// // // // // // //   return md;
// // // // // // // }

// // // // // // // async function main() {
// // // // // // //   if (!process.env.GEMINI_API_KEY) {
// // // // // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // // // // //     process.exit(1);
// // // // // // //   }

// // // // // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;
// // // // // // //   const records = [];

// // // // // // //   for (const persona of personas) {
// // // // // // //     const questions = buildQuestionsForPersona(persona);
// // // // // // //     const sentence = personaToSentence(persona.profile);

// // // // // // //     for (const q of questions) {
// // // // // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // // // // //       for (const mode of Object.keys(MODES)) {
// // // // // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // // // // //         const record = await runOne(mode, q, questionText);
// // // // // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // // // // //         records.push(record);
// // // // // // //         await sleep(DELAY_MS);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // // // // //   const hindiPilot = [];
// // // // // // //   if (!QUICK) {
// // // // // // //     for (const mode of Object.keys(MODES)) {
// // // // // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // // // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // // // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // // // // //       hindiPilot.push(record);
// // // // // // //       await sleep(DELAY_MS);
// // // // // // //     }
// // // // // // //   }

// // // // // // //   const byMode = summarize(records);

// // // // // // //   mkdirSync("eval/results", { recursive: true });
// // // // // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // // // // //   writeFileSync(`eval/results/results-${timestamp}.json`, JSON.stringify({ records, hindiPilot, summary: byMode }, null, 2));
// // // // // // //   writeFileSync("eval/results/summary.md", toMarkdown(byMode, records, hindiPilot));

// // // // // // //   console.log("\n=== Summary ===");
// // // // // // //   console.table(byMode);
// // // // // // //   console.log(`\nFull results: eval/results/results-${timestamp}.json`);
// // // // // // //   console.log("Markdown summary: eval/results/summary.md");
// // // // // // // }

// // // // // // // main().catch((err) => {
// // // // // // //   console.error("Evaluation run failed:", err);
// // // // // // //   process.exit(1);
// // // // // // // });



// // // // // // // scripts/evaluate.js
// // // // // // //
// // // // // // // The BTP's core comparative-evaluation harness. Runs a fixed set of
// // // // // // // (persona, scheme) eligibility questions through all three architectures —
// // // // // // // V1 (single-shot, no grounding), V2 (single-shot + RAG), V3 (multi-agent +
// // // // // // // deterministic eligibility engine) — using IDENTICAL prompts across all
// // // // // // // three (see eval/personas.js: personaToSentence()), and scores each
// // // // // // // architecture's answer against ground truth computed directly from
// // // // // // // lib/eligibility.js (the same deterministic logic V3 uses internally,
// // // // // // // which is why V3 is expected — and should be shown — to score highest).
// // // // // // //
// // // // // // // Usage:
// // // // // // //   node scripts/evaluate.js                # full run (all personas x all modes)
// // // // // // //   node scripts/evaluate.js --quick         # 1 persona, 2 questions, for a fast smoke test
// // // // // // //
// // // // // // // Output:
// // // // // // //   eval/results/results-<timestamp>.json    raw per-question records
// // // // // // //   eval/results/summary.md                  accuracy table + confusion matrix per mode
// // // // // // //
// // // // // // // Requires GEMINI_API_KEY in .env.local (same one the app already uses).
// // // // // // // Each question costs one LLM call per mode (V2 also costs one embedding
// // // // // // // call for retrieval) — the full run is ~4 personas x 4 questions x 3 modes
// // // // // // // = 48 LLM calls. Budget a few minutes and stay mindful of free-tier quota.
// // // // // // //
// // // // // // // ---------------------------------------------------------------------
// // // // // // // HONESTY NOTE FOR YOUR BTP WRITE-UP — read this before citing the numbers:
// // // // // // // ---------------------------------------------------------------------
// // // // // // // 1. Answer classification (classifyAnswer below) is a keyword heuristic,
// // // // // // //    not an LLM-graded or human-graded judgment. It's good enough to
// // // // // // //    validate the harness works and to get a directional first read, but a
// // // // // // //    handful of responses will likely be misclassified (e.g. hedged
// // // // // // //    answers). Spot-check the raw text in the JSON output before trusting
// // // // // // //    the accuracy numbers, and ideally have a human re-label a sample.
// // // // // // // 2. 4 personas is a pilot sample, not a statistically powered evaluation.
// // // // // // //    Expand eval/personas.js before treating this as a real result.
// // // // // // // 3. The "language robustness" section (Hindi question) is a qualitative
// // // // // // //    pilot only — one question, one language, machine-translated by an AI
// // // // // // //    assistant and NOT verified by a native speaker. Treat it as "does the
// // // // // // //    pipeline work at all with non-English input", not as a language-
// // // // // // //    accuracy measurement. Get the translation checked, add more languages
// // // // // // //    and more questions, before this becomes a claim in your report.
// // // // // // // ---------------------------------------------------------------------

// // // // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // // // function loadEnvLocal() {
// // // // // //   if (!existsSync(".env.local")) return;
// // // // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // // // //     if (!match) continue;
// // // // // //     const [, key, rawValue = ""] = match;
// // // // // //     if (process.env[key] !== undefined) continue;
// // // // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // // // //   }
// // // // // // }
// // // // // // loadEnvLocal();

// // // // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // // // const QUICK = process.argv.includes("--quick");
// // // // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // // // const QUESTIONS_PER_PERSONA = QUICK ? 2 : 4; // split roughly evenly between eligible/ineligible

// // // // // // const MODES = {
// // // // // //   v1: runPlannerTurnV1,
// // // // // //   v2: runPlannerTurnV2,
// // // // // //   v3: runPlannerTurn,
// // // // // // };

// // // // // // const HINDI_PILOT_QUESTION = {
// // // // // //   personaId: "sunita",
// // // // // //   schemeKey: "up-widow-pension",
// // // // // //   expected: true,
// // // // // //   text:
// // // // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // // // };

// // // // // // function sleep(ms) {
// // // // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // // // }

// // // // // // /** Builds each persona's fixed question set: half known-eligible, half known-ineligible,
// // // // // //  * chosen deterministically (sorted by schemeKey) so re-runs are reproducible. */
// // // // // // function buildQuestionsForPersona(persona) {
// // // // // //   const results = evaluateAllSchemes(persona.profile, SCHEMES);
// // // // // //   // Eligible questions: prefer schemes with more conditions (non-trivial decisions).
// // // // // //   // Ineligible questions: prefer NEAR-MISSES (most conditions satisfied) so the question
// // // // // //   // actually tests boundary reasoning; ties broken by schemeKey so runs are reproducible.
// // // // // //   const frac = (r) => (r.totalConditions ? r.matchedConditions / r.totalConditions : 0);
// // // // // //   const eligible = results
// // // // // //     .filter((r) => r.eligible)
// // // // // //     .sort((a, b) => (b.totalConditions || 0) - (a.totalConditions || 0) || a.schemeKey.localeCompare(b.schemeKey));
// // // // // //   const ineligible = results
// // // // // //     .filter((r) => !r.eligible)
// // // // // //     .sort((a, b) => frac(b) - frac(a) || a.schemeKey.localeCompare(b.schemeKey));

// // // // // //   // Personas may name "focus" schemes (the boundary case each persona was designed to test).
// // // // // //   // Those are asked first; remaining slots are filled to keep eligible/ineligible roughly balanced.
// // // // // //   const focus = (persona.focusSchemes || [])
// // // // // //     .map((k) => results.find((r) => r.schemeKey === k))
// // // // // //     .filter(Boolean)
// // // // // //     .slice(0, QUESTIONS_PER_PERSONA);
// // // // // //   const used = new Set(focus.map((r) => r.schemeKey));
// // // // // //   const picked = [...focus];
// // // // // //   const wantEligible = Math.ceil(QUESTIONS_PER_PERSONA / 2);
// // // // // //   const add = (list, stopWhen) => {
// // // // // //     for (const r of list) {
// // // // // //       if (picked.length >= QUESTIONS_PER_PERSONA || stopWhen()) break;
// // // // // //       if (!used.has(r.schemeKey)) {
// // // // // //         picked.push(r);
// // // // // //         used.add(r.schemeKey);
// // // // // //       }
// // // // // //     }
// // // // // //   };
// // // // // //   add(eligible, () => picked.filter((x) => x.eligible).length >= wantEligible);
// // // // // //   add(ineligible, () => false);
// // // // // //   add(eligible, () => false);

// // // // // //   return picked.map((r) => ({
// // // // // //     personaId: persona.id,
// // // // // //     schemeKey: r.schemeKey,
// // // // // //     schemeName: r.schemeName,
// // // // // //     expected: r.eligible,
// // // // // //   }));
// // // // // // }

// // // // // // /** Keyword-based classifier — see the HONESTY NOTE at the top of this file. */
// // // // // // function classifyAnswer(text) {
// // // // // //   const t = text.trim().toLowerCase();
// // // // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // // // //   return null; // unclear
// // // // // // }

// // // // // // async function runOne(mode, question, questionText) {
// // // // // //   const runTurn = MODES[mode];
// // // // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // // // //   // Transient overload (HTTP 503 / 429) is retried so that provider outages are not
// // // // // //   // scored as wrong answers. latencyMs is the time of the final attempt only;
// // // // // //   // totalMs includes failed attempts and back-off waits.
// // // // // //   const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
// // // // // //   const t0 = Date.now();
// // // // // //   let start = Date.now();
// // // // // //   let finalText = "";
// // // // // //   let error = null;
// // // // // //   let attempts = 0;

// // // // // //   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
// // // // // //     start = Date.now();
// // // // // //     try {
// // // // // //       const result = await runTurn(sessionId, [], questionText);
// // // // // //       finalText = result.finalText;
// // // // // //       error = null;
// // // // // //       break;
// // // // // //     } catch (err) {
// // // // // //       error = err.message || String(err);
// // // // // //       const transient = /503|429|high demand|overloaded|RESOURCE_EXHAUSTED/i.test(error);
// // // // // //       if (!transient || attempts === MAX_ATTEMPTS) break;
// // // // // //       await sleep(5000 * attempts);
// // // // // //     }
// // // // // //   }

// // // // // //   const latencyMs = Date.now() - start;
// // // // // //   const totalMs = Date.now() - t0;
// // // // // //   const classification = error ? null : classifyAnswer(finalText);

// // // // // //   return {
// // // // // //     mode,
// // // // // //     ...question,
// // // // // //     latencyMs,
// // // // // //     totalMs,
// // // // // //     attempts,
// // // // // //     error,
// // // // // //     responseText: finalText,
// // // // // //     classification, // true = model said eligible, false = model said not eligible, null = unclear
// // // // // //     correct: error ? false : classification === question.expected,
// // // // // //   };
// // // // // // }

// // // // // // function summarize(records) {
// // // // // //   const byMode = {};

// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const rows = records.filter((r) => r.mode === mode);
// // // // // //     const total = rows.length;
// // // // // //     const errors = rows.filter((r) => r.error).length;
// // // // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // // // //     const correct = rows.filter((r) => r.correct).length;

// // // // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;
// // // // // //     const okRows = rows.filter((r) => !r.error);
// // // // // //     const lat = okRows.map((r) => r.latencyMs).sort((a, b) => a - b);
// // // // // //     const pct = (q) => (lat.length ? lat[Math.min(lat.length - 1, Math.floor(q * lat.length))] : 0);
// // // // // //     const p50LatencyMs = pct(0.5);
// // // // // //     const p95LatencyMs = pct(0.95);
// // // // // //     const accuracyExclErrors = okRows.length ? +(okRows.filter((r) => r.correct).length / okRows.length).toFixed(3) : 0;

// // // // // //     byMode[mode] = {
// // // // // //       total,
// // // // // //       correct,
// // // // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // // // //       unclear,
// // // // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // // // //       errors,
// // // // // //       accuracyExclErrors,
// // // // // //       avgLatencyMs,
// // // // // //       p50LatencyMs,
// // // // // //       p95LatencyMs,
// // // // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // // // //     };
// // // // // //   }

// // // // // //   return byMode;
// // // // // // }

// // // // // // function toMarkdown(byMode, records, hindiPilot) {
// // // // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };

// // // // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // // // //   md += `Pilot run: ${new Set(records.map((r) => r.personaId)).size} persona(s), ${records.length / 3} question(s) per architecture.\n`;
// // // // // //   md += `**See the HONESTY NOTE at the top of scripts/evaluate.js before citing these numbers in your report.**\n\n`;

// // // // // //   md += `| Architecture | Accuracy (all) | Accuracy (excl. errors) | Correct/Total | Unclear rate | Errors | p50 latency (ms) | p95 latency (ms) | Avg latency (ms) |\n`;
// // // // // //   md += `|---|---|---|---|---|---|---|---|---|\n`;
// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const s = byMode[mode];
// // // // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${(s.accuracyExclErrors * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.p50LatencyMs} | ${s.p95LatencyMs} | ${s.avgLatencyMs} |\n`;
// // // // // //   }

// // // // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // // // //   md += `|---|---|---|---|---|\n`;
// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const c = byMode[mode].confusion;
// // // // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // // // //   }

// // // // // //   if (hindiPilot?.length) {
// // // // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // // // //     for (const r of hindiPilot) {
// // // // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // // // //     }
// // // // // //   }

// // // // // //   md += `\n## Raw per-question results\n\n`;
// // // // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // // // //   for (const r of records) {
// // // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // // // //   }

// // // // // //   return md;
// // // // // // }

// // // // // // async function main() {
// // // // // //   if (!process.env.GEMINI_API_KEY) {
// // // // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // // // //     process.exit(1);
// // // // // //   }

// // // // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;
// // // // // //   const records = [];

// // // // // //   for (const persona of personas) {
// // // // // //     const questions = buildQuestionsForPersona(persona);
// // // // // //     const sentence = personaToSentence(persona.profile);

// // // // // //     for (const q of questions) {
// // // // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // // // //       for (const mode of Object.keys(MODES)) {
// // // // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // // // //         const record = await runOne(mode, q, questionText);
// // // // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // // // //         records.push(record);
// // // // // //         await sleep(DELAY_MS);
// // // // // //       }
// // // // // //     }
// // // // // //   }

// // // // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // // // //   const hindiPilot = [];
// // // // // //   if (!QUICK) {
// // // // // //     for (const mode of Object.keys(MODES)) {
// // // // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // // // //       hindiPilot.push(record);
// // // // // //       await sleep(DELAY_MS);
// // // // // //     }
// // // // // //   }

// // // // // //   const byMode = summarize(records);

// // // // // //   mkdirSync("eval/results", { recursive: true });
// // // // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // // // //   writeFileSync(`eval/results/results-${timestamp}.json`, JSON.stringify({ records, hindiPilot, summary: byMode }, null, 2));
// // // // // //   writeFileSync("eval/results/summary.md", toMarkdown(byMode, records, hindiPilot));

// // // // // //   console.log("\n=== Summary ===");
// // // // // //   console.table(byMode);
// // // // // //   console.log(`\nFull results: eval/results/results-${timestamp}.json`);
// // // // // //   console.log("Markdown summary: eval/results/summary.md");
// // // // // // }

// // // // // // main().catch((err) => {
// // // // // //   console.error("Evaluation run failed:", err);
// // // // // //   process.exit(1);
// // // // // // });



// // // // // // scripts/evaluate.js
// // // // // //
// // // // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // // // eval/personas.js: personaToSentence()).
// // // // // //
// // // // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // // // engine's own output would be circular for V3. Instead, the engine is
// // // // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // // // in the summary), which is itself a result.
// // // // // //
// // // // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // // // deterministic).
// // // // // //
// // // // // // Usage:
// // // // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // // // //   node scripts/evaluate.js             # full run
// // // // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // // // //
// // // // // // Output (eval/results/):
// // // // // //   results-<timestamp>.json     raw per-question records
// // // // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // // // //   summary.md                   copy of the latest summary
// // // // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // // // //                                manual labelling of the keyword classifier
// // // // // //
// // // // // // Requires GEMINI_API_KEY in .env.local.
// // // // // //
// // // // // // ---------------------------------------------------------------------
// // // // // // HONESTY NOTES FOR THE WRITE-UP
// // // // // // ---------------------------------------------------------------------
// // // // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // // // //    re-score the saved raw JSON if agreement is poor.
// // // // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // // // //    occurred, say latency was not reliably measured.
// // // // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // // // ---------------------------------------------------------------------

// // // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // // function loadEnvLocal() {
// // // // //   if (!existsSync(".env.local")) return;
// // // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // // //     if (!match) continue;
// // // // //     const [, key, rawValue = ""] = match;
// // // // //     if (process.env[key] !== undefined) continue;
// // // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // // //   }
// // // // // }
// // // // // loadEnvLocal();

// // // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // // const QUICK = process.argv.includes("--quick");
// // // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || Infinity; // questions per persona
// // // // // const SPOTCHECK_N = 10;
// // // // // const SPOTCHECK_SEED = 42;

// // // // // const MODES = {
// // // // //   v1: runPlannerTurnV1,
// // // // //   v2: runPlannerTurnV2,
// // // // //   v3: runPlannerTurn,
// // // // // };

// // // // // const HINDI_PILOT_QUESTION = {
// // // // //   personaId: "sunita",
// // // // //   schemeKey: "up-widow-pension",
// // // // //   expected: true,
// // // // //   text:
// // // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // // };

// // // // // function sleep(ms) {
// // // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // // }

// // // // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // // // function mulberry32(seed) {
// // // // //   let a = seed >>> 0;
// // // // //   return () => {
// // // // //     a |= 0;
// // // // //     a = (a + 0x6d2b79f5) | 0;
// // // // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // // // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // // // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // // // //   };
// // // // // }

// // // // // function schemeNameById(id) {
// // // // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // // // }

// // // // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // // // function buildQuestionsForPersona(persona) {
// // // // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // // // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // // // //   let picked = [...el, ...inel];
// // // // //   if (QPP < picked.length) {
// // // // //     // balanced, deterministic subsample: alternate eligible / ineligible
// // // // //     picked = [];
// // // // //     for (let i = 0; picked.length < QPP && (i < el.length || i < inel.length); i++) {
// // // // //       if (i < el.length && picked.length < QPP) picked.push(el[i]);
// // // // //       if (i < inel.length && picked.length < QPP) picked.push(inel[i]);
// // // // //     }
// // // // //   }

// // // // //   return picked.map((x) => ({
// // // // //     personaId: persona.id,
// // // // //     edge: persona.edge ?? "",
// // // // //     schemeKey: x.id,
// // // // //     schemeName: schemeNameById(x.id),
// // // // //     expected: x.expected,
// // // // //   }));
// // // // // }

// // // // // /** Compares the deterministic rule engine with the hand labels. */
// // // // // function checkEngineAgreement(personas) {
// // // // //   const mismatches = [];
// // // // //   let checked = 0;

// // // // //   for (const p of personas) {
// // // // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // // // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // // // //     const labelled = [
// // // // //       ...p.expected.eligible.map((id) => [id, true]),
// // // // //       ...p.expected.ineligible.map((id) => [id, false]),
// // // // //     ];
// // // // //     for (const [id, expected] of labelled) {
// // // // //       checked++;
// // // // //       const engine = byKey.get(id);
// // // // //       if (engine !== expected) {
// // // // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // // // //       }
// // // // //     }
// // // // //   }
// // // // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // // // }

// // // // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // // // function classifyAnswer(text) {
// // // // //   const t = text.trim().toLowerCase();
// // // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // // //   return null; // unclear
// // // // // }

// // // // // async function runOne(mode, question, questionText) {
// // // // //   const runTurn = MODES[mode];
// // // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // // //   const start = Date.now();
// // // // //   let finalText = "";
// // // // //   let error = null;

// // // // //   try {
// // // // //     const result = await runTurn(sessionId, [], questionText);
// // // // //     finalText = result.finalText;
// // // // //   } catch (err) {
// // // // //     error = err.message || String(err);
// // // // //   }

// // // // //   const latencyMs = Date.now() - start;
// // // // //   const classification = error ? null : classifyAnswer(finalText);

// // // // //   return {
// // // // //     mode,
// // // // //     ...question,
// // // // //     latencyMs,
// // // // //     error,
// // // // //     responseText: finalText,
// // // // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // // // //     correct: error ? false : classification === question.expected,
// // // // //   };
// // // // // }

// // // // // function summarize(records) {
// // // // //   const byMode = {};

// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const rows = records.filter((r) => r.mode === mode);
// // // // //     const total = rows.length;
// // // // //     const errors = rows.filter((r) => r.error).length;
// // // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // // //     const correct = rows.filter((r) => r.correct).length;

// // // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // // //     byMode[mode] = {
// // // // //       total,
// // // // //       correct,
// // // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // // //       unclear,
// // // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // // //       errors,
// // // // //       avgLatencyMs,
// // // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // // //     };
// // // // //   }

// // // // //   return byMode;
// // // // // }

// // // // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // // // //   const perMode = records.length / Object.keys(MODES).length;

// // // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // // // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // // //   md += `|---|---|---|---|---|---|\n`;
// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const s = byMode[mode];
// // // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // // //   }

// // // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // // //   md += `|---|---|---|---|---|\n`;
// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const c = byMode[mode].confusion;
// // // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // // //   }

// // // // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // // // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // // // //   if (engineCheck.mismatches.length) {
// // // // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // // // //     for (const m of engineCheck.mismatches) {
// // // // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // // // //     }
// // // // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // // // //   }

// // // // //   const bad = records.filter((r) => !r.correct);
// // // // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // // // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // // // //   for (const r of bad) {
// // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // // // //   }

// // // // //   if (hindiPilot?.length) {
// // // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // // //     for (const r of hindiPilot) {
// // // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // // //     }
// // // // //   }

// // // // //   md += `\n## Raw per-question results\n\n`;
// // // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // // //   for (const r of records) {
// // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // // //   }

// // // // //   return md;
// // // // // }

// // // // // function csvField(v) {
// // // // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // // // }

// // // // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // // // function buildSpotcheckCsv(records) {
// // // // //   const pool = records.filter((r) => !r.error);
// // // // //   const rand = mulberry32(SPOTCHECK_SEED);
// // // // //   const idx = pool.map((_, i) => i);
// // // // //   for (let i = idx.length - 1; i > 0; i--) {
// // // // //     const j = Math.floor(rand() * (i + 1));
// // // // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // // // //   }
// // // // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // // // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // // // //   const lines = [header.map(csvField).join(",")];
// // // // //   for (const r of sample) {
// // // // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     lines.push(
// // // // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // // // //         .map(csvField)
// // // // //         .join(",")
// // // // //     );
// // // // //   }
// // // // //   return lines.join("\n");
// // // // // }

// // // // // async function main() {
// // // // //   if (!process.env.GEMINI_API_KEY) {
// // // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // // //     process.exit(1);
// // // // //   }

// // // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // // // //   // Check the labels against the rule engine before spending any API calls.
// // // // //   const engineCheck = checkEngineAgreement(personas);
// // // // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // // // //   for (const m of engineCheck.mismatches) {
// // // // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // // // //   }

// // // // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // // // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // // // //   const records = [];

// // // // //   for (const persona of personas) {
// // // // //     const questions = buildQuestionsForPersona(persona);
// // // // //     const sentence = personaToSentence(persona.profile);

// // // // //     for (const q of questions) {
// // // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // // //       for (const mode of Object.keys(MODES)) {
// // // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // // //         const record = await runOne(mode, q, questionText);
// // // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // // //         records.push(record);
// // // // //         await sleep(DELAY_MS);
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // // //   const hindiPilot = [];
// // // // //   if (!QUICK) {
// // // // //     for (const mode of Object.keys(MODES)) {
// // // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // // //       hindiPilot.push(record);
// // // // //       await sleep(DELAY_MS);
// // // // //     }
// // // // //   }

// // // // //   const byMode = summarize(records);

// // // // //   mkdirSync("eval/results", { recursive: true });
// // // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // // // //   writeFileSync(
// // // // //     `eval/results/results-${timestamp}.json`,
// // // // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // // // //   );
// // // // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // // // //   writeFileSync("eval/results/summary.md", summaryMd);
// // // // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // // // //   console.log("\n=== Summary ===");
// // // // //   console.table(byMode);
// // // // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // // // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // // // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // // // }

// // // // // main().catch((err) => {
// // // // //   console.error("Evaluation run failed:", err);
// // // // //   process.exit(1);
// // // // // });



// // // // // scripts/evaluate.js
// // // // //
// // // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // // eval/personas.js: personaToSentence()).
// // // // //
// // // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // // engine's own output would be circular for V3. Instead, the engine is
// // // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // // in the summary), which is itself a result.
// // // // //
// // // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // // deterministic).
// // // // //
// // // // // Usage:
// // // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // // //   node scripts/evaluate.js             # full run
// // // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // // //
// // // // // Output (eval/results/):
// // // // //   results-<timestamp>.json     raw per-question records
// // // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // // //   summary.md                   copy of the latest summary
// // // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // // //                                manual labelling of the keyword classifier
// // // // //
// // // // // Requires GEMINI_API_KEY in .env.local.
// // // // //
// // // // // ---------------------------------------------------------------------
// // // // // HONESTY NOTES FOR THE WRITE-UP
// // // // // ---------------------------------------------------------------------
// // // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // // //    re-score the saved raw JSON if agreement is poor.
// // // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // // //    occurred, say latency was not reliably measured.
// // // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // // ---------------------------------------------------------------------

// // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // function loadEnvLocal() {
// // // //   if (!existsSync(".env.local")) return;
// // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // //     if (!match) continue;
// // // //     const [, key, rawValue = ""] = match;
// // // //     if (process.env[key] !== undefined) continue;
// // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // //   }
// // // // }
// // // // loadEnvLocal();

// // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // const QUICK = process.argv.includes("--quick");
// // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// // // // const SPOTCHECK_N = 10;
// // // // const SPOTCHECK_SEED = 42;

// // // // const MODES = {
// // // //   v1: runPlannerTurnV1,
// // // //   v2: runPlannerTurnV2,
// // // //   v3: runPlannerTurn,
// // // // };

// // // // const HINDI_PILOT_QUESTION = {
// // // //   personaId: "sunita",
// // // //   schemeKey: "up-widow-pension",
// // // //   expected: true,
// // // //   text:
// // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // };

// // // // function sleep(ms) {
// // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // }

// // // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // // function mulberry32(seed) {
// // // //   let a = seed >>> 0;
// // // //   return () => {
// // // //     a |= 0;
// // // //     a = (a + 0x6d2b79f5) | 0;
// // // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // // //   };
// // // // }

// // // // function schemeNameById(id) {
// // // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // // }

// // // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // // function buildQuestionsForPersona(persona) {
// // // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // // //   let picked = [...el, ...inel];
// // // //   if (QPP < picked.length) {
// // // //     // balanced, deterministic subsample: alternate eligible / ineligible
// // // //     picked = [];
// // // //     for (let i = 0; picked.length < QPP && (i < el.length || i < inel.length); i++) {
// // // //       if (i < el.length && picked.length < QPP) picked.push(el[i]);
// // // //       if (i < inel.length && picked.length < QPP) picked.push(inel[i]);
// // // //     }
// // // //   }

// // // //   return picked.map((x) => ({
// // // //     personaId: persona.id,
// // // //     edge: persona.edge ?? "",
// // // //     schemeKey: x.id,
// // // //     schemeName: schemeNameById(x.id),
// // // //     expected: x.expected,
// // // //   }));
// // // // }

// // // // /** Compares the deterministic rule engine with the hand labels. */
// // // // function checkEngineAgreement(personas) {
// // // //   const mismatches = [];
// // // //   let checked = 0;

// // // //   for (const p of personas) {
// // // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // // //     const labelled = [
// // // //       ...p.expected.eligible.map((id) => [id, true]),
// // // //       ...p.expected.ineligible.map((id) => [id, false]),
// // // //     ];
// // // //     for (const [id, expected] of labelled) {
// // // //       checked++;
// // // //       const engine = byKey.get(id);
// // // //       if (engine !== expected) {
// // // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // // //       }
// // // //     }
// // // //   }
// // // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // // }

// // // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // // function classifyAnswer(text) {
// // // //   const t = text.trim().toLowerCase();
// // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // //   return null; // unclear
// // // // }

// // // // async function runOne(mode, question, questionText) {
// // // //   const runTurn = MODES[mode];
// // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // //   const start = Date.now();
// // // //   let finalText = "";
// // // //   let error = null;

// // // //   try {
// // // //     const result = await runTurn(sessionId, [], questionText);
// // // //     finalText = result.finalText;
// // // //   } catch (err) {
// // // //     error = err.message || String(err);
// // // //   }

// // // //   const latencyMs = Date.now() - start;
// // // //   const classification = error ? null : classifyAnswer(finalText);

// // // //   return {
// // // //     mode,
// // // //     ...question,
// // // //     latencyMs,
// // // //     error,
// // // //     responseText: finalText,
// // // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // // //     correct: error ? false : classification === question.expected,
// // // //   };
// // // // }

// // // // function summarize(records) {
// // // //   const byMode = {};

// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const rows = records.filter((r) => r.mode === mode);
// // // //     const total = rows.length;
// // // //     const errors = rows.filter((r) => r.error).length;
// // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // //     const correct = rows.filter((r) => r.correct).length;

// // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // //     byMode[mode] = {
// // // //       total,
// // // //       correct,
// // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // //       unclear,
// // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // //       errors,
// // // //       avgLatencyMs,
// // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // //     };
// // // //   }

// // // //   return byMode;
// // // // }

// // // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // // //   const perMode = records.length / Object.keys(MODES).length;

// // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // //   md += `|---|---|---|---|---|---|\n`;
// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const s = byMode[mode];
// // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // //   }

// // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // //   md += `|---|---|---|---|---|\n`;
// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const c = byMode[mode].confusion;
// // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // //   }

// // // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // // //   if (engineCheck.mismatches.length) {
// // // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // // //     for (const m of engineCheck.mismatches) {
// // // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // // //     }
// // // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // // //   }

// // // //   const bad = records.filter((r) => !r.correct);
// // // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // // //   for (const r of bad) {
// // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // // //   }

// // // //   if (hindiPilot?.length) {
// // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // //     for (const r of hindiPilot) {
// // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // //     }
// // // //   }

// // // //   md += `\n## Raw per-question results\n\n`;
// // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // //   for (const r of records) {
// // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // //   }

// // // //   return md;
// // // // }

// // // // function csvField(v) {
// // // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // // }

// // // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // // function buildSpotcheckCsv(records) {
// // // //   const pool = records.filter((r) => !r.error);
// // // //   const rand = mulberry32(SPOTCHECK_SEED);
// // // //   const idx = pool.map((_, i) => i);
// // // //   for (let i = idx.length - 1; i > 0; i--) {
// // // //     const j = Math.floor(rand() * (i + 1));
// // // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // // //   }
// // // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // // //   const lines = [header.map(csvField).join(",")];
// // // //   for (const r of sample) {
// // // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     lines.push(
// // // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // // //         .map(csvField)
// // // //         .join(",")
// // // //     );
// // // //   }
// // // //   return lines.join("\n");
// // // // }

// // // // async function main() {
// // // //   if (!process.env.GEMINI_API_KEY) {
// // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // //     process.exit(1);
// // // //   }

// // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // // //   // Check the labels against the rule engine before spending any API calls.
// // // //   const engineCheck = checkEngineAgreement(personas);
// // // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // // //   for (const m of engineCheck.mismatches) {
// // // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // // //   }

// // // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // // //   const records = [];

// // // //   for (const persona of personas) {
// // // //     const questions = buildQuestionsForPersona(persona);
// // // //     const sentence = personaToSentence(persona.profile);

// // // //     for (const q of questions) {
// // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // //       for (const mode of Object.keys(MODES)) {
// // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // //         const record = await runOne(mode, q, questionText);
// // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // //         records.push(record);
// // // //         await sleep(DELAY_MS);
// // // //       }
// // // //     }
// // // //   }

// // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // //   const hindiPilot = [];
// // // //   if (!QUICK) {
// // // //     for (const mode of Object.keys(MODES)) {
// // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // //       hindiPilot.push(record);
// // // //       await sleep(DELAY_MS);
// // // //     }
// // // //   }

// // // //   const byMode = summarize(records);

// // // //   mkdirSync("eval/results", { recursive: true });
// // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // // //   writeFileSync(
// // // //     `eval/results/results-${timestamp}.json`,
// // // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // // //   );
// // // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // // //   writeFileSync("eval/results/summary.md", summaryMd);
// // // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // // //   console.log("\n=== Summary ===");
// // // //   console.table(byMode);
// // // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // // }

// // // // main().catch((err) => {
// // // //   console.error("Evaluation run failed:", err);
// // // //   process.exit(1);
// // // // });

// // // // scripts/evaluate.js
// // // //
// // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // eval/personas.js: personaToSentence()).
// // // //
// // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // engine's own output would be circular for V3. Instead, the engine is
// // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // in the summary), which is itself a result.
// // // //
// // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // deterministic).
// // // //
// // // // Usage:
// // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // //   node scripts/evaluate.js             # full run
// // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // //
// // // // Output (eval/results/):
// // // //   results-<timestamp>.json     raw per-question records
// // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // //   summary.md                   copy of the latest summary
// // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // //                                manual labelling of the keyword classifier
// // // //
// // // // Requires GEMINI_API_KEY in .env.local.
// // // //
// // // // ---------------------------------------------------------------------
// // // // HONESTY NOTES FOR THE WRITE-UP
// // // // ---------------------------------------------------------------------
// // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // //    re-score the saved raw JSON if agreement is poor.
// // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // //    occurred, say latency was not reliably measured.
// // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // ---------------------------------------------------------------------

// // // import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

// // // function loadEnvLocal() {
// // //   if (!existsSync(".env.local")) return;
// // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // //     if (!match) continue;
// // //     const [, key, rawValue = ""] = match;
// // //     if (process.env[key] !== undefined) continue;
// // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // //   }
// // // }
// // // loadEnvLocal();

// // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // const { SCHEMES } = await import("../data/schemes.js");
// // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // const QUICK = process.argv.includes("--quick");
// // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 4000;
// // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// // // const SPOTCHECK_N = 10;
// // // const SPOTCHECK_SEED = 42;

// // // const MODES = {
// // //   v1: runPlannerTurnV1,
// // //   v2: runPlannerTurnV2,
// // //   v3: runPlannerTurn,
// // // };

// // // const HINDI_PILOT_QUESTION = {
// // //   personaId: "sunita",
// // //   schemeKey: "up-widow-pension",
// // //   expected: true,
// // //   text:
// // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // };

// // // function sleep(ms) {
// // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // }

// // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // function mulberry32(seed) {
// // //   let a = seed >>> 0;
// // //   return () => {
// // //     a |= 0;
// // //     a = (a + 0x6d2b79f5) | 0;
// // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // //   };
// // // }

// // // function schemeNameById(id) {
// // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // }

// // // // The scheme(s) each edge-case persona exists to test (always asked, even with EVAL_QPP).
// // // const FOCUS_BY_PERSONA = {
// // //   sunita: ["up-widow-pension", "pmuy"],
// // //   ramesh: ["ignoaps"],
// // //   fatima: ["nsp-post-matric-sc", "up-widow-pension"],
// // //   arjun: ["igndps", "pm-sym"],
// // //   mohan_60: ["ignoaps"],
// // //   kishan_59: ["ignoaps"],
// // //   sym_age_40: ["pm-sym"],
// // //   sym_age_41: ["pm-sym"],
// // //   sym_inc_179999: ["pm-sym"],
// // //   sym_inc_180000: ["pm-sym"],
// // //   sc_249999: ["nsp-post-matric-sc"],
// // //   sc_250000: ["nsp-post-matric-sc"],
// // //   widow_up_199999: ["up-widow-pension"],
// // //   widow_up_200000: ["up-widow-pension"],
// // //   widow_wrong_state: ["up-widow-pension"],
// // //   bhola_noland: ["pm-kisan"],
// // //   sanjay_dis_nobpl: ["igndps"],
// // //   vikas_18: ["igndps"],
// // //   anil_17: ["igndps", "pm-sym"],
// // //   pmjay_70_nobpl: ["ab-pmjay"],
// // //   karan_none: ["ignoaps"],
// // // };

// // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // function buildQuestionsForPersona(persona) {
// // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // //   let picked = [...el, ...inel];
// // //   if (QPP < picked.length) {
// // //     // The scheme(s) each persona was designed to test are ALWAYS asked first,
// // //     // then the rest is a balanced, deterministic subsample (eligible / ineligible alternating).
// // //     const focusIds = FOCUS_BY_PERSONA[persona.id] || [];
// // //     const all = [...el, ...inel];
// // //     picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
// // //     const used = new Set(picked.map((x) => x.id));
// // //     const el2 = el.filter((x) => !used.has(x.id));
// // //     const inel2 = inel.filter((x) => !used.has(x.id));
// // //     for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
// // //       if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
// // //       if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
// // //     }
// // //   }

// // //   return picked.map((x) => ({
// // //     personaId: persona.id,
// // //     edge: persona.edge ?? "",
// // //     schemeKey: x.id,
// // //     schemeName: schemeNameById(x.id),
// // //     expected: x.expected,
// // //   }));
// // // }

// // // /** Compares the deterministic rule engine with the hand labels. */
// // // function checkEngineAgreement(personas) {
// // //   const mismatches = [];
// // //   let checked = 0;

// // //   for (const p of personas) {
// // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // //     const labelled = [
// // //       ...p.expected.eligible.map((id) => [id, true]),
// // //       ...p.expected.ineligible.map((id) => [id, false]),
// // //     ];
// // //     for (const [id, expected] of labelled) {
// // //       checked++;
// // //       const engine = byKey.get(id);
// // //       if (engine !== expected) {
// // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // //       }
// // //     }
// // //   }
// // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // }

// // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // function classifyAnswer(text) {
// // //   const t = text.trim().toLowerCase();
// // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // //   return null; // unclear
// // // }

// // // // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;


// // // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;
// // // async function runOne(mode, question, questionText) {
// // //   const runTurn = MODES[mode];
// // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // //   const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
// // //   let start = Date.now();
// // //   let finalText = "";
// // //   let error = null;
// // //   let attempts = 0;

// // //   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
// // //     start = Date.now();
// // //     try {
// // //       const result = await runTurn(sessionId, [], questionText);
// // //       finalText = result.finalText;
// // //       error = null;
// // //       break;
// // //     } catch (err) {
// // //       error = err.message || String(err);
// // //       if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
// // //       await sleep(8000 * attempts); // back off 8s, 16s, 24s
// // //     }
// // //   }

// // //   const latencyMs = Date.now() - start; // final attempt only
// // //   const classification = error ? null : classifyAnswer(finalText);

// // //   return {
// // //     mode,
// // //     ...question,
// // //     latencyMs,
// // //     attempts,
// // //     error,
// // //     // true when the failure is a rate/quota problem: not a model answer, so it is NOT saved or scored
// // //     quotaHit: !!error && TRANSIENT.test(error),
// // //     responseText: finalText,
// // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // //     correct: error ? false : classification === question.expected,
// // //   };
// // // }

// // // function summarize(records) {
// // //   const byMode = {};

// // //   for (const mode of Object.keys(MODES)) {
// // //     const rows = records.filter((r) => r.mode === mode);
// // //     const total = rows.length;
// // //     const errors = rows.filter((r) => r.error).length;
// // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // //     const correct = rows.filter((r) => r.correct).length;

// // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // //     byMode[mode] = {
// // //       total,
// // //       correct,
// // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // //       unclear,
// // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // //       errors,
// // //       avgLatencyMs,
// // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // //     };
// // //   }

// // //   return byMode;
// // // }

// // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // //   const perMode = records.length / Object.keys(MODES).length;

// // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // //   md += `|---|---|---|---|---|---|\n`;
// // //   for (const mode of Object.keys(MODES)) {
// // //     const s = byMode[mode];
// // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // //   }

// // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // //   md += `|---|---|---|---|---|\n`;
// // //   for (const mode of Object.keys(MODES)) {
// // //     const c = byMode[mode].confusion;
// // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // //   }

// // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // //   if (engineCheck.mismatches.length) {
// // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // //     for (const m of engineCheck.mismatches) {
// // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // //     }
// // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // //   }

// // //   const bad = records.filter((r) => !r.correct);
// // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // //   for (const r of bad) {
// // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // //   }

// // //   if (hindiPilot?.length) {
// // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // //     for (const r of hindiPilot) {
// // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // //     }
// // //   }

// // //   md += `\n## Raw per-question results\n\n`;
// // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // //   md += `|---|---|---|---|---|---|---|\n`;
// // //   for (const r of records) {
// // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // //   }

// // //   return md;
// // // }

// // // function csvField(v) {
// // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // }

// // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // function buildSpotcheckCsv(records) {
// // //   const pool = records.filter((r) => !r.error);
// // //   const rand = mulberry32(SPOTCHECK_SEED);
// // //   const idx = pool.map((_, i) => i);
// // //   for (let i = idx.length - 1; i > 0; i--) {
// // //     const j = Math.floor(rand() * (i + 1));
// // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // //   }
// // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // //   const lines = [header.map(csvField).join(",")];
// // //   for (const r of sample) {
// // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     lines.push(
// // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // //         .map(csvField)
// // //         .join(",")
// // //     );
// // //   }
// // //   return lines.join("\n");
// // // }

// // // async function main() {
// // //   if (!process.env.GEMINI_API_KEY) {
// // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // //     process.exit(1);
// // //   }

// // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // //   // Check the labels against the rule engine before spending any API calls.
// // //   const engineCheck = checkEngineAgreement(personas);
// // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // //   for (const m of engineCheck.mismatches) {
// // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // //   }

// // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // //   // ---- checkpoint / resume: every finished answer is saved at once, so hitting the
// // //   // ---- API limit never loses work. Re-run the same command later to continue.
// // //   const CKPT = "eval/results/checkpoint.json";
// // //   mkdirSync("eval/results", { recursive: true });
// // //   const FRESH = process.argv.includes("--fresh");
// // //   let records = [];
// // //   let hindiPilot = [];
// // //   if (!QUICK && !FRESH && existsSync(CKPT)) {
// // //     try {
// // //       const c = JSON.parse(readFileSync(CKPT, "utf-8"));
// // //       records = c.records || [];
// // //       hindiPilot = c.hindiPilot || [];
// // //       console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)\n`);
// // //     } catch {
// // //       console.log("Checkpoint unreadable, starting fresh\n");
// // //     }
// // //   }
// // //   const saveCkpt = () => {
// // //     if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records, hindiPilot }, null, 2));
// // //   };
// // //   const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));
// // //   let stopped = false;
// // //   const stopForQuota = (record) => {
// // //     saveCkpt();
// // //     console.log(`\nAPI limit reached (${record.error.slice(0, 120)}).`);
// // //     console.log(`${records.length} answers are saved. Wait for the quota to reset (or a few minutes for a per-minute limit),`);
// // //     console.log("then run the SAME command again. It will continue where it stopped.");
// // //     stopped = true;
// // //   };

// // //   outer: for (const persona of personas) {
// // //     const questions = buildQuestionsForPersona(persona);
// // //     const sentence = personaToSentence(persona.profile);

// // //     for (const q of questions) {
// // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // //       for (const mode of Object.keys(MODES)) {
// // //         if (done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) continue;
// // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // //         const record = await runOne(mode, q, questionText);
// // //         console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // //         if (record.quotaHit) { stopForQuota(record); break outer; }
// // //         records.push(record);
// // //         saveCkpt();
// // //         await sleep(DELAY_MS);
// // //       }
// // //     }
// // //   }

// // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // //   if (!QUICK && !stopped) {
// // //     for (const mode of Object.keys(MODES)) {
// // //       if (hindiPilot.some((r) => r.mode === mode)) continue;
// // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // //       console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : "done");
// // //       if (record.quotaHit) { stopForQuota(record); break; }
// // //       hindiPilot.push(record);
// // //       saveCkpt();
// // //       await sleep(DELAY_MS);
// // //     }
// // //   }

// // //   if (stopped) return;

// // //   const byMode = summarize(records);

// // //   mkdirSync("eval/results", { recursive: true });
// // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // //   writeFileSync(
// // //     `eval/results/results-${timestamp}.json`,
// // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // //   );
// // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // //   writeFileSync("eval/results/summary.md", summaryMd);
// // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // //   if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `eval/results/checkpoint-done-${timestamp}.json`);

// // //   console.log("\n=== Summary ===");
// // //   console.table(byMode);
// // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // }

// // // main().catch((err) => {
// // //   console.error("Evaluation run failed:", err);
// // //   process.exit(1);
// // // });

// // // scripts/evaluate.js  (patched: --personas <file>, --check-only, per-set results folder, records usedFallbackModel)
// // //   node scripts/evaluate.js --personas eval/personas-extra/part1.json --check-only   # free: labels vs engine
// // //   node scripts/evaluate.js --personas eval/personas-extra/part1.json                # runs part 1 (resumes after a quota stop)
// // // scripts/evaluate.js
// // //
// // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // eligibility questions through all three architectures — V1 (single-shot,
// // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // eval/personas.js: personaToSentence()).
// // //
// // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // engine's own output would be circular for V3. Instead, the engine is
// // // checked against the hand labels separately (see "Rule-engine agreement"
// // // in the summary), which is itself a result.
// // //
// // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // deterministic).
// // //
// // // Usage:
// // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // //   node scripts/evaluate.js             # full run
// // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // //
// // // Output (eval/results/):
// // //   results-<timestamp>.json     raw per-question records
// // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // //   summary.md                   copy of the latest summary
// // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // //                                manual labelling of the keyword classifier
// // //
// // // Requires GEMINI_API_KEY in .env.local.
// // //
// // // ---------------------------------------------------------------------
// // // HONESTY NOTES FOR THE WRITE-UP
// // // ---------------------------------------------------------------------
// // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // //    re-score the saved raw JSON if agreement is poor.
// // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // //    occurred, say latency was not reliably measured.
// // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // ---------------------------------------------------------------------

// // import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

// // function loadEnvLocal() {
// //   if (!existsSync(".env.local")) return;
// //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// //     if (!match) continue;
// //     const [, key, rawValue = ""] = match;
// //     if (process.env[key] !== undefined) continue;
// //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// //   }
// // }
// // loadEnvLocal();

// // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // const { SCHEMES } = await import("../data/schemes.js");
// // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // const { runPlannerTurn } = await import("../agents/planner.js");
// // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // const QUICK = process.argv.includes("--quick");
// // // --personas <file.json> : run an extra persona set (e.g. eval/personas-extra/part1.json) instead of PERSONAS.
// // // Results go to their own folder (eval/results/<file name>/), so your finished main results are never touched.
// // // --check-only           : compare hand labels with the rule engine and exit (no API calls).
// // const argVal = (flag) => { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : null; };
// // const PERSONAS_FILE = argVal("--personas");
// // const CHECK_ONLY = process.argv.includes("--check-only");
// // const RESULTS_DIR = PERSONAS_FILE
// //   ? `eval/results/${PERSONAS_FILE.split(/[\\/]/).pop().replace(/\.json$/i, "")}`
// //   : "eval/results";
// // const ACTIVE_PERSONAS = PERSONAS_FILE ? JSON.parse(readFileSync(PERSONAS_FILE, "utf-8")) : PERSONAS;
// // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 4000;
// // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// // const SPOTCHECK_N = 10;
// // const SPOTCHECK_SEED = 42;

// // const MODES = {
// //   v1: runPlannerTurnV1,
// //   v2: runPlannerTurnV2,
// //   v3: runPlannerTurn,
// // };

// // const HINDI_PILOT_QUESTION = {
// //   personaId: "sunita",
// //   schemeKey: "up-widow-pension",
// //   expected: true,
// //   text:
// //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // };

// // function sleep(ms) {
// //   return new Promise((resolve) => setTimeout(resolve, ms));
// // }

// // // Small seeded PRNG so the spot-check sample is reproducible.
// // function mulberry32(seed) {
// //   let a = seed >>> 0;
// //   return () => {
// //     a |= 0;
// //     a = (a + 0x6d2b79f5) | 0;
// //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// //   };
// // }

// // function schemeNameById(id) {
// //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // }

// // // The scheme(s) each edge-case persona exists to test (always asked, even with EVAL_QPP).
// // const FOCUS_BY_PERSONA = {
// //   sunita: ["up-widow-pension", "pmuy"],
// //   ramesh: ["ignoaps"],
// //   fatima: ["nsp-post-matric-sc", "up-widow-pension"],
// //   arjun: ["igndps", "pm-sym"],
// //   mohan_60: ["ignoaps"],
// //   kishan_59: ["ignoaps"],
// //   sym_age_40: ["pm-sym"],
// //   sym_age_41: ["pm-sym"],
// //   sym_inc_179999: ["pm-sym"],
// //   sym_inc_180000: ["pm-sym"],
// //   sc_249999: ["nsp-post-matric-sc"],
// //   sc_250000: ["nsp-post-matric-sc"],
// //   widow_up_199999: ["up-widow-pension"],
// //   widow_up_200000: ["up-widow-pension"],
// //   widow_wrong_state: ["up-widow-pension"],
// //   bhola_noland: ["pm-kisan"],
// //   sanjay_dis_nobpl: ["igndps"],
// //   vikas_18: ["igndps"],
// //   anil_17: ["igndps", "pm-sym"],
// //   pmjay_70_nobpl: ["ab-pmjay"],
// //   karan_none: ["ignoaps"],
// // };

// // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // function buildQuestionsForPersona(persona) {
// //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// //   let picked = [...el, ...inel];
// //   if (QPP < picked.length) {
// //     // The scheme(s) each persona was designed to test are ALWAYS asked first,
// //     // then the rest is a balanced, deterministic subsample (eligible / ineligible alternating).
// //     const focusIds = persona.focusSchemes || FOCUS_BY_PERSONA[persona.id] || [];
// //     const all = [...el, ...inel];
// //     picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
// //     const used = new Set(picked.map((x) => x.id));
// //     const el2 = el.filter((x) => !used.has(x.id));
// //     const inel2 = inel.filter((x) => !used.has(x.id));
// //     for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
// //       if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
// //       if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
// //     }
// //   }

// //   return picked.map((x) => ({
// //     personaId: persona.id,
// //     edge: persona.edge ?? "",
// //     schemeKey: x.id,
// //     schemeName: schemeNameById(x.id),
// //     expected: x.expected,
// //   }));
// // }

// // /** Compares the deterministic rule engine with the hand labels. */
// // function checkEngineAgreement(personas) {
// //   const mismatches = [];
// //   let checked = 0;

// //   for (const p of personas) {
// //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// //     const labelled = [
// //       ...p.expected.eligible.map((id) => [id, true]),
// //       ...p.expected.ineligible.map((id) => [id, false]),
// //     ];
// //     for (const [id, expected] of labelled) {
// //       checked++;
// //       const engine = byKey.get(id);
// //       if (engine !== expected) {
// //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// //       }
// //     }
// //   }
// //   return { checked, agree: checked - mismatches.length, mismatches };
// // }

// // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // function classifyAnswer(text) {
// //   const t = text.trim().toLowerCase();
// //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// //   if (negPhrases.some((p) => t.includes(p))) return false;

// //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// //   if (posPhrases.some((p) => t.includes(p))) return true;

// //   return null; // unclear
// // }

// // // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;


// // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;
// // async function runOne(mode, question, questionText) {
// //   const runTurn = MODES[mode];
// //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// //   const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
// //   let start = Date.now();
// //   let finalText = "";
// //   let error = null;
// //   let attempts = 0;
// //   let usedFallbackModel = null;

// //   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
// //     start = Date.now();
// //     try {
// //       const result = await runTurn(sessionId, [], questionText);
// //       finalText = result.finalText;
// //       usedFallbackModel = result.usedFallbackModel ?? null;
// //       error = null;
// //       break;
// //     } catch (err) {
// //       error = err.message || String(err);
// //       if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
// //       await sleep(8000 * attempts); // back off 8s, 16s, 24s
// //     }
// //   }

// //   const latencyMs = Date.now() - start; // final attempt only
// //   const classification = error ? null : classifyAnswer(finalText);

// //   return {
// //     mode,
// //     ...question,
// //     latencyMs,
// //     attempts,
// //     usedFallbackModel,
// //     error,
// //     // true when the failure is a rate/quota problem: not a model answer, so it is NOT saved or scored
// //     quotaHit: !!error && TRANSIENT.test(error),
// //     responseText: finalText,
// //     classification, // true = said eligible, false = said not eligible, null = unclear
// //     correct: error ? false : classification === question.expected,
// //   };
// // }

// // function summarize(records) {
// //   const byMode = {};

// //   for (const mode of Object.keys(MODES)) {
// //     const rows = records.filter((r) => r.mode === mode);
// //     const total = rows.length;
// //     const errors = rows.filter((r) => r.error).length;
// //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// //     const correct = rows.filter((r) => r.correct).length;

// //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// //     byMode[mode] = {
// //       total,
// //       correct,
// //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// //       unclear,
// //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// //       errors,
// //       avgLatencyMs,
// //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// //     };
// //   }

// //   return byMode;
// // }

// // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// //   const perMode = records.length / Object.keys(MODES).length;

// //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// //   md += `|---|---|---|---|---|---|\n`;
// //   for (const mode of Object.keys(MODES)) {
// //     const s = byMode[mode];
// //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// //   }

// //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// //   md += `|---|---|---|---|---|\n`;
// //   for (const mode of Object.keys(MODES)) {
// //     const c = byMode[mode].confusion;
// //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// //   }

// //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// //   if (engineCheck.mismatches.length) {
// //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// //     for (const m of engineCheck.mismatches) {
// //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// //     }
// //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// //   }

// //   const bad = records.filter((r) => !r.correct);
// //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// //   for (const r of bad) {
// //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// //   }

// //   if (hindiPilot?.length) {
// //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// //     for (const r of hindiPilot) {
// //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// //     }
// //   }

// //   md += `\n## Raw per-question results\n\n`;
// //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// //   md += `|---|---|---|---|---|---|---|\n`;
// //   for (const r of records) {
// //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// //   }

// //   return md;
// // }

// // function csvField(v) {
// //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // }

// // /** Seeded random sample of answers for manual labelling of the classifier. */
// // function buildSpotcheckCsv(records) {
// //   const pool = records.filter((r) => !r.error);
// //   const rand = mulberry32(SPOTCHECK_SEED);
// //   const idx = pool.map((_, i) => i);
// //   for (let i = idx.length - 1; i > 0; i--) {
// //     const j = Math.floor(rand() * (i + 1));
// //     [idx[i], idx[j]] = [idx[j], idx[i]];
// //   }
// //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// //   const lines = [header.map(csvField).join(",")];
// //   for (const r of sample) {
// //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// //     lines.push(
// //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// //         .map(csvField)
// //         .join(",")
// //     );
// //   }
// //   return lines.join("\n");
// // }

// // async function main() {
// //   const personas = QUICK ? ACTIVE_PERSONAS.slice(0, 1) : ACTIVE_PERSONAS;

// //   // Check the labels against the rule engine before spending any API calls.
// //   const engineCheck = checkEngineAgreement(personas);
// //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// //   for (const m of engineCheck.mismatches) {
// //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// //   }

// //   if (CHECK_ONLY) {
// //     console.log("--check-only: no API calls made.");
// //     return;
// //   }
// //   if (!process.env.GEMINI_API_KEY) {
// //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// //     process.exit(1);
// //   }

// //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// //   // ---- checkpoint / resume: every finished answer is saved at once, so hitting the
// //   // ---- API limit never loses work. Re-run the same command later to continue.
// //   const CKPT = `${RESULTS_DIR}/checkpoint.json`;
// //   mkdirSync(RESULTS_DIR, { recursive: true });
// //   const FRESH = process.argv.includes("--fresh");
// //   let records = [];
// //   let hindiPilot = [];
// //   if (!QUICK && !FRESH && existsSync(CKPT)) {
// //     try {
// //       const c = JSON.parse(readFileSync(CKPT, "utf-8"));
// //       records = c.records || [];
// //       hindiPilot = c.hindiPilot || [];
// //       console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)\n`);
// //     } catch {
// //       console.log("Checkpoint unreadable, starting fresh\n");
// //     }
// //   }
// //   const saveCkpt = () => {
// //     if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records, hindiPilot }, null, 2));
// //   };
// //   const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));
// //   let stopped = false;
// //   const stopForQuota = (record) => {
// //     saveCkpt();
// //     console.log(`\nAPI limit reached (${record.error.slice(0, 120)}).`);
// //     console.log(`${records.length} answers are saved. Wait for the quota to reset (or a few minutes for a per-minute limit),`);
// //     console.log("then run the SAME command again. It will continue where it stopped.");
// //     stopped = true;
// //   };

// //   outer: for (const persona of personas) {
// //     const questions = buildQuestionsForPersona(persona);
// //     const sentence = personaToSentence(persona.profile);

// //     for (const q of questions) {
// //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// //       for (const mode of Object.keys(MODES)) {
// //         if (done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) continue;
// //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// //         const record = await runOne(mode, q, questionText);
// //         console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// //         if (record.quotaHit) { stopForQuota(record); break outer; }
// //         records.push(record);
// //         saveCkpt();
// //         await sleep(DELAY_MS);
// //       }
// //     }
// //   }

// //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// //   if (!QUICK && !stopped && !PERSONAS_FILE) {
// //     for (const mode of Object.keys(MODES)) {
// //       if (hindiPilot.some((r) => r.mode === mode)) continue;
// //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// //       console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : "done");
// //       if (record.quotaHit) { stopForQuota(record); break; }
// //       hindiPilot.push(record);
// //       saveCkpt();
// //       await sleep(DELAY_MS);
// //     }
// //   }

// //   if (stopped) return;

// //   const byMode = summarize(records);

// //   mkdirSync(RESULTS_DIR, { recursive: true });
// //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// //   writeFileSync(
// //     `${RESULTS_DIR}/results-${timestamp}.json`,
// //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// //   );
// //   writeFileSync(`${RESULTS_DIR}/summary-${timestamp}.md`, summaryMd);
// //   writeFileSync(`${RESULTS_DIR}/summary.md`, summaryMd);
// //   writeFileSync(`${RESULTS_DIR}/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// //   if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `${RESULTS_DIR}/checkpoint-done-${timestamp}.json`);

// //   console.log("\n=== Summary ===");
// //   console.table(byMode);
// //   console.log(`\nFull results:     ${RESULTS_DIR}/results-${timestamp}.json`);
// //   console.log(`Markdown summary: ${RESULTS_DIR}/summary-${timestamp}.md (also summary.md)`);
// //   console.log(`Spot-check CSV:   ${RESULTS_DIR}/spotcheck-${timestamp}.csv`);
// // }

// // main().catch((err) => {
// //   console.error("Evaluation run failed:", err);
// //   process.exit(1);
// // });
// // scripts/evaluate.js
// //
// // Comparative-evaluation harness for the BTP / paper.
// // Architectures: v1 (single-shot), v2 (RAG), v3 (tool-calling + rule engine),
// // v1r (rule-aware single-shot baseline: V1 plus the plain-English rules).
// //
// // By default ONLY v1r is run (the other three are already evaluated); use --modes
// // to choose others. All architectures get identical question text (see
// // eval/personas.js: personaToSentence()). Ground truth is the hand-labelled
// // persona.expected, NOT the rule engine.
// //
// // Usage (PowerShell: set the model first, same as the earlier runs):
// //   $env:EVAL_MODEL="gemini-3.5-flash-lite"
// //   node scripts/evaluate.js --quick                       # smoke test: 1 persona, 2 questions
// //   node scripts/evaluate.js                               # Run A personas (eval/personas.js), v1r only
// //   node scripts/evaluate.js --personas eval/personas-extra/part1.json,eval/personas-extra/part2.json
// //   node scripts/evaluate.js --modes v1,v2,v3,v1r          # run several architectures
// //   node scripts/evaluate.js --check-only                  # labels vs rule engine, no API calls
// //   node scripts/evaluate.js --fresh                       # ignore the saved checkpoint
// //
// // Env: EVAL_QPP (questions per persona, default 4), EVAL_CONC (parallel calls, default 3),
// //      EVAL_DELAY_MS (pause per call, default 800), EVAL_MAX_ATTEMPTS (default 4).
// //
// // Results go to eval/results/<set>-<modes>/ so earlier results are never overwritten.
// // Every answer is checkpointed; after an API-limit stop, run the same command again.

// import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

// function loadEnvLocal() {
//   if (!existsSync(".env.local")) return;
//   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
//     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
//     if (!match) continue;
//     const [, key, rawValue = ""] = match;
//     if (process.env[key] !== undefined) continue;
//     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
//   }
// }
// loadEnvLocal();

// const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// const { SCHEMES } = await import("../data/schemes.js");
// const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// const { runPlannerTurn } = await import("../agents/planner.js");
// const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");
// const { runPlannerTurnV1R } = await import("../agents/plannerV1R.js");

// // ---------- options ----------
// const argVal = (flag) => {
//   const i = process.argv.indexOf(flag);
//   return i > -1 ? process.argv[i + 1] : null;
// };
// const QUICK = process.argv.includes("--quick");
// const FRESH = process.argv.includes("--fresh");
// const CHECK_ONLY = process.argv.includes("--check-only");

// const ALL_MODES = { v1: runPlannerTurnV1, v2: runPlannerTurnV2, v3: runPlannerTurn, v1r: runPlannerTurnV1R };
// const MODE_LABEL = {
//   v1: "V1 — single-shot",
//   v2: "V2 — RAG single-shot",
//   v3: "V3 — tool-calling + rule engine",
//   v1r: "V1R — rule-aware single-shot",
// };
// const modeNames = (argVal("--modes") || "v1r").split(",").map((s) => s.trim()).filter(Boolean);
// for (const m of modeNames) {
//   if (!ALL_MODES[m]) {
//     console.error(`Unknown mode "${m}". Choose from: ${Object.keys(ALL_MODES).join(", ")}`);
//     process.exit(1);
//   }
// }
// const MODES = Object.fromEntries(modeNames.map((m) => [m, ALL_MODES[m]]));

// const PERSONAS_FILES = (argVal("--personas") || "").split(",").map((s) => s.trim()).filter(Boolean);
// const ACTIVE_PERSONAS = PERSONAS_FILES.length
//   ? PERSONAS_FILES.flatMap((f) => JSON.parse(readFileSync(f, "utf-8")))
//   : PERSONAS;
// const SET_NAME = PERSONAS_FILES.length
//   ? PERSONAS_FILES.length === 1
//     ? PERSONAS_FILES[0].split(/[\\/]/).pop().replace(/\.json$/i, "")
//     : "personas-extra-combined"
//   : "main";
// const RESULTS_DIR = `eval/results/${SET_NAME}-${modeNames.join("+")}`;

// const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 800;
// const CONC = Math.max(1, Number(process.env.EVAL_CONC) || 3);
// const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4;
// const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
// const SPOTCHECK_N = 10;
// const SPOTCHECK_SEED = 42;
// const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// function mulberry32(seed) {
//   let a = seed >>> 0;
//   return () => {
//     a |= 0;
//     a = (a + 0x6d2b79f5) | 0;
//     let t = Math.imul(a ^ (a >>> 15), 1 | a);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// const schemeNameById = (id) => SCHEMES.find((s) => s.id === id)?.name ?? id;

// // Scheme(s) each Run A edge-case persona was designed to test (always asked first).
// // Run B personas carry their own `focusSchemes`.
// const FOCUS_BY_PERSONA = {
//   sunita: ["up-widow-pension", "pmuy"],
//   ramesh: ["ignoaps"],
//   fatima: ["nsp-post-matric-sc", "up-widow-pension"],
//   arjun: ["igndps", "pm-sym"],
//   mohan_60: ["ignoaps"],
//   kishan_59: ["ignoaps"],
//   sym_age_40: ["pm-sym"],
//   sym_age_41: ["pm-sym"],
//   sym_inc_179999: ["pm-sym"],
//   sym_inc_180000: ["pm-sym"],
//   sc_249999: ["nsp-post-matric-sc"],
//   sc_250000: ["nsp-post-matric-sc"],
//   widow_up_199999: ["up-widow-pension"],
//   widow_up_200000: ["up-widow-pension"],
//   widow_wrong_state: ["up-widow-pension"],
//   bhola_noland: ["pm-kisan"],
//   sanjay_dis_nobpl: ["igndps"],
//   vikas_18: ["igndps"],
//   anil_17: ["igndps", "pm-sym"],
//   pmjay_70_nobpl: ["ab-pmjay"],
//   karan_none: ["ignoaps"],
// };

// /** Same question selection as the earlier runs. */
// function buildQuestionsForPersona(persona) {
//   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
//   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

//   let picked = [...el, ...inel];
//   if (QPP < picked.length) {
//     const focusIds = persona.focusSchemes || FOCUS_BY_PERSONA[persona.id] || [];
//     const all = [...el, ...inel];
//     picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
//     const used = new Set(picked.map((x) => x.id));
//     const el2 = el.filter((x) => !used.has(x.id));
//     const inel2 = inel.filter((x) => !used.has(x.id));
//     for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
//       if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
//       if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
//     }
//   }

//   return picked.map((x) => ({
//     personaId: persona.id,
//     edge: persona.edge ?? "",
//     schemeKey: x.id,
//     schemeName: schemeNameById(x.id),
//     expected: x.expected,
//   }));
// }

// /** Compares the deterministic rule engine with the hand labels. */
// function checkEngineAgreement(personas) {
//   const mismatches = [];
//   let checked = 0;
//   for (const p of personas) {
//     const results = evaluateAllSchemes(p.profile, SCHEMES);
//     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
//     const labelled = [
//       ...p.expected.eligible.map((id) => [id, true]),
//       ...p.expected.ineligible.map((id) => [id, false]),
//     ];
//     for (const [id, expected] of labelled) {
//       checked++;
//       const engine = byKey.get(id);
//       if (engine !== expected) {
//         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
//       }
//     }
//   }
//   return { checked, agree: checked - mismatches.length, mismatches };
// }

// /** Keyword classifier — identical to the earlier runs. */
// function classifyAnswer(text) {
//   const t = text.trim().toLowerCase();
//   const firstWord = t.split(/[\s,.:;!]+/)[0];

//   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
//   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

//   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
//   if (negPhrases.some((p) => t.includes(p))) return false;

//   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
//   if (posPhrases.some((p) => t.includes(p))) return true;

//   return null; // unclear
// }

// async function runOne(mode, question, questionText) {
//   const runTurn = MODES[mode];
//   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

//   let start = Date.now();
//   let finalText = "";
//   let error = null;
//   let attempts = 0;
//   let usedFallbackModel = null;

//   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
//     start = Date.now();
//     try {
//       const result = await runTurn(sessionId, [], questionText);
//       finalText = result.finalText;
//       usedFallbackModel = result.usedFallbackModel ?? null;
//       error = null;
//       break;
//     } catch (err) {
//       error = err.message || String(err);
//       if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
//       await sleep(8000 * attempts); // back off 8s, 16s, 24s
//     }
//   }

//   const latencyMs = Date.now() - start; // final attempt only
//   const classification = error ? null : classifyAnswer(finalText);

//   return {
//     mode,
//     ...question,
//     latencyMs,
//     attempts,
//     usedFallbackModel,
//     error,
//     quotaHit: !!error && TRANSIENT.test(error), // rate/quota failure: not saved, not scored
//     responseText: finalText,
//     classification, // true = said eligible, false = said not eligible, null = unclear
//     correct: error ? false : classification === question.expected,
//   };
// }

// function summarize(records) {
//   const byMode = {};
//   for (const mode of Object.keys(MODES)) {
//     const rows = records.filter((r) => r.mode === mode);
//     const total = rows.length;
//     const errors = rows.filter((r) => r.error).length;
//     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
//     const correct = rows.filter((r) => r.correct).length;
//     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
//     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
//     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
//     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;
//     const lat = rows.filter((r) => !r.error).map((r) => r.latencyMs).sort((a, b) => a - b);
//     const pct = (q) => (lat.length ? lat[Math.min(lat.length - 1, Math.floor(q * lat.length))] : 0);

//     byMode[mode] = {
//       total,
//       correct,
//       accuracy: total ? +(correct / total).toFixed(3) : 0,
//       unclear,
//       errors,
//       p50LatencyMs: pct(0.5),
//       p95LatencyMs: pct(0.95),
//       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
//     };
//   }
//   return byMode;
// }

// const said = (r) => (r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible");

// function toMarkdown(byMode, records, engineCheck, personaCount) {
//   const perMode = records.length / Object.keys(MODES).length;
//   let md = `# Evaluation summary (${SET_NAME}; ${modeNames.join(", ")})\n\nGenerated ${new Date().toISOString()}\n\n`;
//   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Model override: ${process.env.EVAL_MODEL || "default"}.\n\n`;

//   md += `| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |\n|---|---|---|---|---|---|---|\n`;
//   for (const mode of Object.keys(MODES)) {
//     const s = byMode[mode];
//     md += `| ${MODE_LABEL[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${s.unclear} | ${s.errors} | ${s.p50LatencyMs} | ${s.p95LatencyMs} |\n`;
//   }

//   md += `\n## Confusion matrix (positive class = "eligible")\n\n| Architecture | TP | FP | TN | FN |\n|---|---|---|---|---|\n`;
//   for (const mode of Object.keys(MODES)) {
//     const c = byMode[mode].confusion;
//     md += `| ${MODE_LABEL[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
//   }

//   md += `\n## Rule-engine agreement with hand labels\n\n${engineCheck.agree}/${engineCheck.checked} labels agree with lib/eligibility.js.\n`;
//   for (const m of engineCheck.mismatches) {
//     md += `- MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}\n`;
//   }

//   const bad = records.filter((r) => !r.correct);
//   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
//   for (const r of bad) {
//     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said(r)} |\n`;
//   }
//   return md;
// }

// const csvField = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

// function buildSpotcheckCsv(records) {
//   const pool = records.filter((r) => !r.error);
//   const rand = mulberry32(SPOTCHECK_SEED);
//   const idx = pool.map((_, i) => i);
//   for (let i = idx.length - 1; i > 0; i--) {
//     const j = Math.floor(rand() * (i + 1));
//     [idx[i], idx[j]] = [idx[j], idx[i]];
//   }
//   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);
//   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
//   const lines = [header.map(csvField).join(",")];
//   for (const r of sample) {
//     lines.push([r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", said(r), r.responseText, ""].map(csvField).join(","));
//   }
//   return lines.join("\n");
// }

// async function main() {
//   const personas = QUICK ? ACTIVE_PERSONAS.slice(0, 1) : ACTIVE_PERSONAS;

//   // Free check of the labels against the rule engine.
//   const engineCheck = checkEngineAgreement(personas);
//   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
//   for (const m of engineCheck.mismatches) {
//     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
//   }
//   if (CHECK_ONLY) {
//     console.log("--check-only: no API calls made.");
//     return;
//   }
//   if (!process.env.GEMINI_API_KEY) {
//     console.error("GEMINI_API_KEY is missing from .env.local. Aborting.");
//     process.exit(1);
//   }

//   // Resume support.
//   const CKPT = `${RESULTS_DIR}/checkpoint.json`;
//   mkdirSync(RESULTS_DIR, { recursive: true });
//   let records = [];
//   if (!QUICK && !FRESH && existsSync(CKPT)) {
//     try {
//       records = JSON.parse(readFileSync(CKPT, "utf-8")).records || [];
//       console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)`);
//     } catch {
//       console.log("Checkpoint unreadable, starting fresh");
//     }
//   }
//   const saveCkpt = () => {
//     if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records }, null, 2));
//   };
//   const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));

//   // Build the task list (skipping anything already answered).
//   const tasks = [];
//   for (const persona of personas) {
//     const sentence = personaToSentence(persona.profile);
//     for (const q of buildQuestionsForPersona(persona)) {
//       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;
//       for (const mode of Object.keys(MODES)) {
//         if (!done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) tasks.push({ mode, q, questionText, persona });
//       }
//     }
//   }
//   const total = tasks.length;
//   console.log(
//     `${personas.length} persona(s), modes: ${modeNames.join("+")}, ${total} call(s) to run, ${CONC} in parallel\n`
//   );

//   let next = 0;
//   let finished = 0;
//   let stopped = false;

//   const worker = async () => {
//     while (!stopped) {
//       const i = next++;
//       if (i >= tasks.length) return;
//       const { mode, q, questionText } = tasks[i];
//       const record = await runOne(mode, q, questionText);
//       finished++;
//       const tag = `[${finished}/${total}] [${mode}] ${q.personaId} / ${q.schemeKey}`;
//       console.log(record.error ? `${tag} ERROR (${record.error.slice(0, 100)})` : `${tag} ${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
//       if (record.quotaHit) {
//         if (!stopped) {
//           stopped = true;
//           console.log(`\nAPI limit reached. ${records.length} answers are saved. Wait for the quota to reset, then run the SAME command again.`);
//         }
//         return;
//       }
//       records.push(record);
//       saveCkpt();
//       await sleep(DELAY_MS);
//     }
//   };
//   await Promise.all(Array.from({ length: CONC }, worker));

//   saveCkpt();
//   if (stopped) return;

//   const byMode = summarize(records);
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const summaryMd = toMarkdown(byMode, records, engineCheck, personas.length);

//   writeFileSync(`${RESULTS_DIR}/results-${timestamp}.json`, JSON.stringify({ records, summary: byMode, engineCheck }, null, 2));
//   writeFileSync(`${RESULTS_DIR}/summary-${timestamp}.md`, summaryMd);
//   writeFileSync(`${RESULTS_DIR}/summary.md`, summaryMd);
//   writeFileSync(`${RESULTS_DIR}/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));
//   if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `${RESULTS_DIR}/checkpoint-done-${timestamp}.json`);

//   console.log("\n=== Summary ===");
//   console.table(byMode);
//   console.log(`\nFull results: ${RESULTS_DIR}/results-${timestamp}.json`);
// }

// main().catch((err) => {
//   console.error("Evaluation run failed:", err);
//   process.exit(1);
// });


















// // // // // // // scripts/evaluate.js
// // // // // // //
// // // // // // // The BTP's core comparative-evaluation harness. Runs a fixed set of
// // // // // // // (persona, scheme) eligibility questions through all three architectures —
// // // // // // // V1 (single-shot, no grounding), V2 (single-shot + RAG), V3 (multi-agent +
// // // // // // // deterministic eligibility engine) — using IDENTICAL prompts across all
// // // // // // // three (see eval/personas.js: personaToSentence()), and scores each
// // // // // // // architecture's answer against ground truth computed directly from
// // // // // // // lib/eligibility.js (the same deterministic logic V3 uses internally,
// // // // // // // which is why V3 is expected — and should be shown — to score highest).
// // // // // // //
// // // // // // // Usage:
// // // // // // //   node scripts/evaluate.js                # full run (all personas x all modes)
// // // // // // //   node scripts/evaluate.js --quick         # 1 persona, 2 questions, for a fast smoke test
// // // // // // //
// // // // // // // Output:
// // // // // // //   eval/results/results-<timestamp>.json    raw per-question records
// // // // // // //   eval/results/summary.md                  accuracy table + confusion matrix per mode
// // // // // // //
// // // // // // // Requires GEMINI_API_KEY in .env.local (same one the app already uses).
// // // // // // // Each question costs one LLM call per mode (V2 also costs one embedding
// // // // // // // call for retrieval) — the full run is ~4 personas x 4 questions x 3 modes
// // // // // // // = 48 LLM calls. Budget a few minutes and stay mindful of free-tier quota.
// // // // // // //
// // // // // // // ---------------------------------------------------------------------
// // // // // // // HONESTY NOTE FOR YOUR BTP WRITE-UP — read this before citing the numbers:
// // // // // // // ---------------------------------------------------------------------
// // // // // // // 1. Answer classification (classifyAnswer below) is a keyword heuristic,
// // // // // // //    not an LLM-graded or human-graded judgment. It's good enough to
// // // // // // //    validate the harness works and to get a directional first read, but a
// // // // // // //    handful of responses will likely be misclassified (e.g. hedged
// // // // // // //    answers). Spot-check the raw text in the JSON output before trusting
// // // // // // //    the accuracy numbers, and ideally have a human re-label a sample.
// // // // // // // 2. 4 personas is a pilot sample, not a statistically powered evaluation.
// // // // // // //    Expand eval/personas.js before treating this as a real result.
// // // // // // // 3. The "language robustness" section (Hindi question) is a qualitative
// // // // // // //    pilot only — one question, one language, machine-translated by an AI
// // // // // // //    assistant and NOT verified by a native speaker. Treat it as "does the
// // // // // // //    pipeline work at all with non-English input", not as a language-
// // // // // // //    accuracy measurement. Get the translation checked, add more languages
// // // // // // //    and more questions, before this becomes a claim in your report.
// // // // // // // ---------------------------------------------------------------------

// // // // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // // // function loadEnvLocal() {
// // // // // //   if (!existsSync(".env.local")) return;
// // // // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // // // //     if (!match) continue;
// // // // // //     const [, key, rawValue = ""] = match;
// // // // // //     if (process.env[key] !== undefined) continue;
// // // // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // // // //   }
// // // // // // }
// // // // // // loadEnvLocal();

// // // // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // // // const QUICK = process.argv.includes("--quick");
// // // // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // // // const QUESTIONS_PER_PERSONA = QUICK ? 2 : 4; // split roughly evenly between eligible/ineligible

// // // // // // const MODES = {
// // // // // //   v1: runPlannerTurnV1,
// // // // // //   v2: runPlannerTurnV2,
// // // // // //   v3: runPlannerTurn,
// // // // // // };

// // // // // // const HINDI_PILOT_QUESTION = {
// // // // // //   personaId: "sunita",
// // // // // //   schemeKey: "up-widow-pension",
// // // // // //   expected: true,
// // // // // //   text:
// // // // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // // // };

// // // // // // function sleep(ms) {
// // // // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // // // }

// // // // // // /** Builds each persona's fixed question set: half known-eligible, half known-ineligible,
// // // // // //  * chosen deterministically (sorted by schemeKey) so re-runs are reproducible. */
// // // // // // function buildQuestionsForPersona(persona) {
// // // // // //   const results = evaluateAllSchemes(persona.profile, SCHEMES);
// // // // // //   const eligible = results.filter((r) => r.eligible).sort((a, b) => a.schemeKey.localeCompare(b.schemeKey));
// // // // // //   const ineligible = results.filter((r) => !r.eligible).sort((a, b) => a.schemeKey.localeCompare(b.schemeKey));

// // // // // //   const half = Math.ceil(QUESTIONS_PER_PERSONA / 2);
// // // // // //   const picked = [...eligible.slice(0, half), ...ineligible.slice(0, QUESTIONS_PER_PERSONA - half)];

// // // // // //   return picked.map((r) => ({
// // // // // //     personaId: persona.id,
// // // // // //     schemeKey: r.schemeKey,
// // // // // //     schemeName: r.schemeName,
// // // // // //     expected: r.eligible,
// // // // // //   }));
// // // // // // }

// // // // // // /** Keyword-based classifier — see the HONESTY NOTE at the top of this file. */
// // // // // // function classifyAnswer(text) {
// // // // // //   const t = text.trim().toLowerCase();
// // // // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // // // //   return null; // unclear
// // // // // // }

// // // // // // async function runOne(mode, question, questionText) {
// // // // // //   const runTurn = MODES[mode];
// // // // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // // // //   const start = Date.now();
// // // // // //   let finalText = "";
// // // // // //   let error = null;

// // // // // //   try {
// // // // // //     const result = await runTurn(sessionId, [], questionText);
// // // // // //     finalText = result.finalText;
// // // // // //   } catch (err) {
// // // // // //     error = err.message || String(err);
// // // // // //   }

// // // // // //   const latencyMs = Date.now() - start;
// // // // // //   const classification = error ? null : classifyAnswer(finalText);

// // // // // //   return {
// // // // // //     mode,
// // // // // //     ...question,
// // // // // //     latencyMs,
// // // // // //     error,
// // // // // //     responseText: finalText,
// // // // // //     classification, // true = model said eligible, false = model said not eligible, null = unclear
// // // // // //     correct: error ? false : classification === question.expected,
// // // // // //   };
// // // // // // }

// // // // // // function summarize(records) {
// // // // // //   const byMode = {};

// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const rows = records.filter((r) => r.mode === mode);
// // // // // //     const total = rows.length;
// // // // // //     const errors = rows.filter((r) => r.error).length;
// // // // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // // // //     const correct = rows.filter((r) => r.correct).length;

// // // // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // // // //     byMode[mode] = {
// // // // // //       total,
// // // // // //       correct,
// // // // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // // // //       unclear,
// // // // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // // // //       errors,
// // // // // //       avgLatencyMs,
// // // // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // // // //     };
// // // // // //   }

// // // // // //   return byMode;
// // // // // // }

// // // // // // function toMarkdown(byMode, records, hindiPilot) {
// // // // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };

// // // // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // // // //   md += `Pilot run: ${new Set(records.map((r) => r.personaId)).size} persona(s), ${records.length / 3} question(s) per architecture.\n`;
// // // // // //   md += `**See the HONESTY NOTE at the top of scripts/evaluate.js before citing these numbers in your report.**\n\n`;

// // // // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // // // //   md += `|---|---|---|---|---|---|\n`;
// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const s = byMode[mode];
// // // // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // // // //   }

// // // // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // // // //   md += `|---|---|---|---|---|\n`;
// // // // // //   for (const mode of Object.keys(MODES)) {
// // // // // //     const c = byMode[mode].confusion;
// // // // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // // // //   }

// // // // // //   if (hindiPilot?.length) {
// // // // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // // // //     for (const r of hindiPilot) {
// // // // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // // // //     }
// // // // // //   }

// // // // // //   md += `\n## Raw per-question results\n\n`;
// // // // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // // // //   for (const r of records) {
// // // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // // // //   }

// // // // // //   return md;
// // // // // // }

// // // // // // async function main() {
// // // // // //   if (!process.env.GEMINI_API_KEY) {
// // // // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // // // //     process.exit(1);
// // // // // //   }

// // // // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;
// // // // // //   const records = [];

// // // // // //   for (const persona of personas) {
// // // // // //     const questions = buildQuestionsForPersona(persona);
// // // // // //     const sentence = personaToSentence(persona.profile);

// // // // // //     for (const q of questions) {
// // // // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // // // //       for (const mode of Object.keys(MODES)) {
// // // // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // // // //         const record = await runOne(mode, q, questionText);
// // // // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // // // //         records.push(record);
// // // // // //         await sleep(DELAY_MS);
// // // // // //       }
// // // // // //     }
// // // // // //   }

// // // // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // // // //   const hindiPilot = [];
// // // // // //   if (!QUICK) {
// // // // // //     for (const mode of Object.keys(MODES)) {
// // // // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // // // //       hindiPilot.push(record);
// // // // // //       await sleep(DELAY_MS);
// // // // // //     }
// // // // // //   }

// // // // // //   const byMode = summarize(records);

// // // // // //   mkdirSync("eval/results", { recursive: true });
// // // // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // // // //   writeFileSync(`eval/results/results-${timestamp}.json`, JSON.stringify({ records, hindiPilot, summary: byMode }, null, 2));
// // // // // //   writeFileSync("eval/results/summary.md", toMarkdown(byMode, records, hindiPilot));

// // // // // //   console.log("\n=== Summary ===");
// // // // // //   console.table(byMode);
// // // // // //   console.log(`\nFull results: eval/results/results-${timestamp}.json`);
// // // // // //   console.log("Markdown summary: eval/results/summary.md");
// // // // // // }

// // // // // // main().catch((err) => {
// // // // // //   console.error("Evaluation run failed:", err);
// // // // // //   process.exit(1);
// // // // // // });



// // // // // // scripts/evaluate.js
// // // // // //
// // // // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // // // eval/personas.js: personaToSentence()).
// // // // // //
// // // // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // // // engine's own output would be circular for V3. Instead, the engine is
// // // // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // // // in the summary), which is itself a result.
// // // // // //
// // // // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // // // deterministic).
// // // // // //
// // // // // // Usage:
// // // // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // // // //   node scripts/evaluate.js             # full run
// // // // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // // // //
// // // // // // Output (eval/results/):
// // // // // //   results-<timestamp>.json     raw per-question records
// // // // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // // // //   summary.md                   copy of the latest summary
// // // // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // // // //                                manual labelling of the keyword classifier
// // // // // //
// // // // // // Requires GEMINI_API_KEY in .env.local.
// // // // // //
// // // // // // ---------------------------------------------------------------------
// // // // // // HONESTY NOTES FOR THE WRITE-UP
// // // // // // ---------------------------------------------------------------------
// // // // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // // // //    re-score the saved raw JSON if agreement is poor.
// // // // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // // // //    occurred, say latency was not reliably measured.
// // // // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // // // ---------------------------------------------------------------------

// // // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // // function loadEnvLocal() {
// // // // //   if (!existsSync(".env.local")) return;
// // // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // // //     if (!match) continue;
// // // // //     const [, key, rawValue = ""] = match;
// // // // //     if (process.env[key] !== undefined) continue;
// // // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // // //   }
// // // // // }
// // // // // loadEnvLocal();

// // // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // // const QUICK = process.argv.includes("--quick");
// // // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || Infinity; // questions per persona
// // // // // const SPOTCHECK_N = 10;
// // // // // const SPOTCHECK_SEED = 42;

// // // // // const MODES = {
// // // // //   v1: runPlannerTurnV1,
// // // // //   v2: runPlannerTurnV2,
// // // // //   v3: runPlannerTurn,
// // // // // };

// // // // // const HINDI_PILOT_QUESTION = {
// // // // //   personaId: "sunita",
// // // // //   schemeKey: "up-widow-pension",
// // // // //   expected: true,
// // // // //   text:
// // // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // // };

// // // // // function sleep(ms) {
// // // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // // }

// // // // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // // // function mulberry32(seed) {
// // // // //   let a = seed >>> 0;
// // // // //   return () => {
// // // // //     a |= 0;
// // // // //     a = (a + 0x6d2b79f5) | 0;
// // // // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // // // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // // // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // // // //   };
// // // // // }

// // // // // function schemeNameById(id) {
// // // // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // // // }

// // // // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // // // function buildQuestionsForPersona(persona) {
// // // // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // // // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // // // //   let picked = [...el, ...inel];
// // // // //   if (QPP < picked.length) {
// // // // //     // balanced, deterministic subsample: alternate eligible / ineligible
// // // // //     picked = [];
// // // // //     for (let i = 0; picked.length < QPP && (i < el.length || i < inel.length); i++) {
// // // // //       if (i < el.length && picked.length < QPP) picked.push(el[i]);
// // // // //       if (i < inel.length && picked.length < QPP) picked.push(inel[i]);
// // // // //     }
// // // // //   }

// // // // //   return picked.map((x) => ({
// // // // //     personaId: persona.id,
// // // // //     edge: persona.edge ?? "",
// // // // //     schemeKey: x.id,
// // // // //     schemeName: schemeNameById(x.id),
// // // // //     expected: x.expected,
// // // // //   }));
// // // // // }

// // // // // /** Compares the deterministic rule engine with the hand labels. */
// // // // // function checkEngineAgreement(personas) {
// // // // //   const mismatches = [];
// // // // //   let checked = 0;

// // // // //   for (const p of personas) {
// // // // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // // // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // // // //     const labelled = [
// // // // //       ...p.expected.eligible.map((id) => [id, true]),
// // // // //       ...p.expected.ineligible.map((id) => [id, false]),
// // // // //     ];
// // // // //     for (const [id, expected] of labelled) {
// // // // //       checked++;
// // // // //       const engine = byKey.get(id);
// // // // //       if (engine !== expected) {
// // // // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // // // //       }
// // // // //     }
// // // // //   }
// // // // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // // // }

// // // // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // // // function classifyAnswer(text) {
// // // // //   const t = text.trim().toLowerCase();
// // // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // // //   return null; // unclear
// // // // // }

// // // // // async function runOne(mode, question, questionText) {
// // // // //   const runTurn = MODES[mode];
// // // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // // //   const start = Date.now();
// // // // //   let finalText = "";
// // // // //   let error = null;

// // // // //   try {
// // // // //     const result = await runTurn(sessionId, [], questionText);
// // // // //     finalText = result.finalText;
// // // // //   } catch (err) {
// // // // //     error = err.message || String(err);
// // // // //   }

// // // // //   const latencyMs = Date.now() - start;
// // // // //   const classification = error ? null : classifyAnswer(finalText);

// // // // //   return {
// // // // //     mode,
// // // // //     ...question,
// // // // //     latencyMs,
// // // // //     error,
// // // // //     responseText: finalText,
// // // // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // // // //     correct: error ? false : classification === question.expected,
// // // // //   };
// // // // // }

// // // // // function summarize(records) {
// // // // //   const byMode = {};

// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const rows = records.filter((r) => r.mode === mode);
// // // // //     const total = rows.length;
// // // // //     const errors = rows.filter((r) => r.error).length;
// // // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // // //     const correct = rows.filter((r) => r.correct).length;

// // // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // // //     byMode[mode] = {
// // // // //       total,
// // // // //       correct,
// // // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // // //       unclear,
// // // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // // //       errors,
// // // // //       avgLatencyMs,
// // // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // // //     };
// // // // //   }

// // // // //   return byMode;
// // // // // }

// // // // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // // // //   const perMode = records.length / Object.keys(MODES).length;

// // // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // // // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // // //   md += `|---|---|---|---|---|---|\n`;
// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const s = byMode[mode];
// // // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // // //   }

// // // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // // //   md += `|---|---|---|---|---|\n`;
// // // // //   for (const mode of Object.keys(MODES)) {
// // // // //     const c = byMode[mode].confusion;
// // // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // // //   }

// // // // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // // // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // // // //   if (engineCheck.mismatches.length) {
// // // // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // // // //     for (const m of engineCheck.mismatches) {
// // // // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // // // //     }
// // // // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // // // //   }

// // // // //   const bad = records.filter((r) => !r.correct);
// // // // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // // // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // // // //   for (const r of bad) {
// // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // // // //   }

// // // // //   if (hindiPilot?.length) {
// // // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // // //     for (const r of hindiPilot) {
// // // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // // //     }
// // // // //   }

// // // // //   md += `\n## Raw per-question results\n\n`;
// // // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // // //   for (const r of records) {
// // // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // // //   }

// // // // //   return md;
// // // // // }

// // // // // function csvField(v) {
// // // // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // // // }

// // // // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // // // function buildSpotcheckCsv(records) {
// // // // //   const pool = records.filter((r) => !r.error);
// // // // //   const rand = mulberry32(SPOTCHECK_SEED);
// // // // //   const idx = pool.map((_, i) => i);
// // // // //   for (let i = idx.length - 1; i > 0; i--) {
// // // // //     const j = Math.floor(rand() * (i + 1));
// // // // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // // // //   }
// // // // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // // // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // // // //   const lines = [header.map(csvField).join(",")];
// // // // //   for (const r of sample) {
// // // // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // // //     lines.push(
// // // // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // // // //         .map(csvField)
// // // // //         .join(",")
// // // // //     );
// // // // //   }
// // // // //   return lines.join("\n");
// // // // // }

// // // // // async function main() {
// // // // //   if (!process.env.GEMINI_API_KEY) {
// // // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // // //     process.exit(1);
// // // // //   }

// // // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // // // //   // Check the labels against the rule engine before spending any API calls.
// // // // //   const engineCheck = checkEngineAgreement(personas);
// // // // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // // // //   for (const m of engineCheck.mismatches) {
// // // // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // // // //   }

// // // // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // // // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // // // //   const records = [];

// // // // //   for (const persona of personas) {
// // // // //     const questions = buildQuestionsForPersona(persona);
// // // // //     const sentence = personaToSentence(persona.profile);

// // // // //     for (const q of questions) {
// // // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // // //       for (const mode of Object.keys(MODES)) {
// // // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // // //         const record = await runOne(mode, q, questionText);
// // // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // // //         records.push(record);
// // // // //         await sleep(DELAY_MS);
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // // //   const hindiPilot = [];
// // // // //   if (!QUICK) {
// // // // //     for (const mode of Object.keys(MODES)) {
// // // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // // //       hindiPilot.push(record);
// // // // //       await sleep(DELAY_MS);
// // // // //     }
// // // // //   }

// // // // //   const byMode = summarize(records);

// // // // //   mkdirSync("eval/results", { recursive: true });
// // // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // // // //   writeFileSync(
// // // // //     `eval/results/results-${timestamp}.json`,
// // // // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // // // //   );
// // // // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // // // //   writeFileSync("eval/results/summary.md", summaryMd);
// // // // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // // // //   console.log("\n=== Summary ===");
// // // // //   console.table(byMode);
// // // // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // // // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // // // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // // // }

// // // // // main().catch((err) => {
// // // // //   console.error("Evaluation run failed:", err);
// // // // //   process.exit(1);
// // // // // });



// // // // // scripts/evaluate.js
// // // // //
// // // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // // eval/personas.js: personaToSentence()).
// // // // //
// // // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // // engine's own output would be circular for V3. Instead, the engine is
// // // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // // in the summary), which is itself a result.
// // // // //
// // // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // // deterministic).
// // // // //
// // // // // Usage:
// // // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // // //   node scripts/evaluate.js             # full run
// // // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // // //
// // // // // Output (eval/results/):
// // // // //   results-<timestamp>.json     raw per-question records
// // // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // // //   summary.md                   copy of the latest summary
// // // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // // //                                manual labelling of the keyword classifier
// // // // //
// // // // // Requires GEMINI_API_KEY in .env.local.
// // // // //
// // // // // ---------------------------------------------------------------------
// // // // // HONESTY NOTES FOR THE WRITE-UP
// // // // // ---------------------------------------------------------------------
// // // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // // //    re-score the saved raw JSON if agreement is poor.
// // // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // // //    occurred, say latency was not reliably measured.
// // // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // // ---------------------------------------------------------------------

// // // // import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

// // // // function loadEnvLocal() {
// // // //   if (!existsSync(".env.local")) return;
// // // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // // //     if (!match) continue;
// // // //     const [, key, rawValue = ""] = match;
// // // //     if (process.env[key] !== undefined) continue;
// // // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // // //   }
// // // // }
// // // // loadEnvLocal();

// // // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // // const { SCHEMES } = await import("../data/schemes.js");
// // // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // // const QUICK = process.argv.includes("--quick");
// // // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 1500;
// // // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// // // // const SPOTCHECK_N = 10;
// // // // const SPOTCHECK_SEED = 42;

// // // // const MODES = {
// // // //   v1: runPlannerTurnV1,
// // // //   v2: runPlannerTurnV2,
// // // //   v3: runPlannerTurn,
// // // // };

// // // // const HINDI_PILOT_QUESTION = {
// // // //   personaId: "sunita",
// // // //   schemeKey: "up-widow-pension",
// // // //   expected: true,
// // // //   text:
// // // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // // };

// // // // function sleep(ms) {
// // // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // // }

// // // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // // function mulberry32(seed) {
// // // //   let a = seed >>> 0;
// // // //   return () => {
// // // //     a |= 0;
// // // //     a = (a + 0x6d2b79f5) | 0;
// // // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // // //   };
// // // // }

// // // // function schemeNameById(id) {
// // // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // // }

// // // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // // function buildQuestionsForPersona(persona) {
// // // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // // //   let picked = [...el, ...inel];
// // // //   if (QPP < picked.length) {
// // // //     // balanced, deterministic subsample: alternate eligible / ineligible
// // // //     picked = [];
// // // //     for (let i = 0; picked.length < QPP && (i < el.length || i < inel.length); i++) {
// // // //       if (i < el.length && picked.length < QPP) picked.push(el[i]);
// // // //       if (i < inel.length && picked.length < QPP) picked.push(inel[i]);
// // // //     }
// // // //   }

// // // //   return picked.map((x) => ({
// // // //     personaId: persona.id,
// // // //     edge: persona.edge ?? "",
// // // //     schemeKey: x.id,
// // // //     schemeName: schemeNameById(x.id),
// // // //     expected: x.expected,
// // // //   }));
// // // // }

// // // // /** Compares the deterministic rule engine with the hand labels. */
// // // // function checkEngineAgreement(personas) {
// // // //   const mismatches = [];
// // // //   let checked = 0;

// // // //   for (const p of personas) {
// // // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // // //     const labelled = [
// // // //       ...p.expected.eligible.map((id) => [id, true]),
// // // //       ...p.expected.ineligible.map((id) => [id, false]),
// // // //     ];
// // // //     for (const [id, expected] of labelled) {
// // // //       checked++;
// // // //       const engine = byKey.get(id);
// // // //       if (engine !== expected) {
// // // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // // //       }
// // // //     }
// // // //   }
// // // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // // }

// // // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // // function classifyAnswer(text) {
// // // //   const t = text.trim().toLowerCase();
// // // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // // //   return null; // unclear
// // // // }

// // // // async function runOne(mode, question, questionText) {
// // // //   const runTurn = MODES[mode];
// // // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // // //   const start = Date.now();
// // // //   let finalText = "";
// // // //   let error = null;

// // // //   try {
// // // //     const result = await runTurn(sessionId, [], questionText);
// // // //     finalText = result.finalText;
// // // //   } catch (err) {
// // // //     error = err.message || String(err);
// // // //   }

// // // //   const latencyMs = Date.now() - start;
// // // //   const classification = error ? null : classifyAnswer(finalText);

// // // //   return {
// // // //     mode,
// // // //     ...question,
// // // //     latencyMs,
// // // //     error,
// // // //     responseText: finalText,
// // // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // // //     correct: error ? false : classification === question.expected,
// // // //   };
// // // // }

// // // // function summarize(records) {
// // // //   const byMode = {};

// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const rows = records.filter((r) => r.mode === mode);
// // // //     const total = rows.length;
// // // //     const errors = rows.filter((r) => r.error).length;
// // // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // // //     const correct = rows.filter((r) => r.correct).length;

// // // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // // //     byMode[mode] = {
// // // //       total,
// // // //       correct,
// // // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // // //       unclear,
// // // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // // //       errors,
// // // //       avgLatencyMs,
// // // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // // //     };
// // // //   }

// // // //   return byMode;
// // // // }

// // // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // // //   const perMode = records.length / Object.keys(MODES).length;

// // // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // // //   md += `|---|---|---|---|---|---|\n`;
// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const s = byMode[mode];
// // // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // // //   }

// // // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // // //   md += `|---|---|---|---|---|\n`;
// // // //   for (const mode of Object.keys(MODES)) {
// // // //     const c = byMode[mode].confusion;
// // // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // // //   }

// // // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // // //   if (engineCheck.mismatches.length) {
// // // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // // //     for (const m of engineCheck.mismatches) {
// // // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // // //     }
// // // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // // //   }

// // // //   const bad = records.filter((r) => !r.correct);
// // // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // // //   for (const r of bad) {
// // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // // //   }

// // // //   if (hindiPilot?.length) {
// // // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // // //     for (const r of hindiPilot) {
// // // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // // //     }
// // // //   }

// // // //   md += `\n## Raw per-question results\n\n`;
// // // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // // //   md += `|---|---|---|---|---|---|---|\n`;
// // // //   for (const r of records) {
// // // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // // //   }

// // // //   return md;
// // // // }

// // // // function csvField(v) {
// // // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // // }

// // // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // // function buildSpotcheckCsv(records) {
// // // //   const pool = records.filter((r) => !r.error);
// // // //   const rand = mulberry32(SPOTCHECK_SEED);
// // // //   const idx = pool.map((_, i) => i);
// // // //   for (let i = idx.length - 1; i > 0; i--) {
// // // //     const j = Math.floor(rand() * (i + 1));
// // // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // // //   }
// // // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // // //   const lines = [header.map(csvField).join(",")];
// // // //   for (const r of sample) {
// // // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // // //     lines.push(
// // // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // // //         .map(csvField)
// // // //         .join(",")
// // // //     );
// // // //   }
// // // //   return lines.join("\n");
// // // // }

// // // // async function main() {
// // // //   if (!process.env.GEMINI_API_KEY) {
// // // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // // //     process.exit(1);
// // // //   }

// // // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // // //   // Check the labels against the rule engine before spending any API calls.
// // // //   const engineCheck = checkEngineAgreement(personas);
// // // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // // //   for (const m of engineCheck.mismatches) {
// // // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // // //   }

// // // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // // //   const records = [];

// // // //   for (const persona of personas) {
// // // //     const questions = buildQuestionsForPersona(persona);
// // // //     const sentence = personaToSentence(persona.profile);

// // // //     for (const q of questions) {
// // // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // // //       for (const mode of Object.keys(MODES)) {
// // // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // // //         const record = await runOne(mode, q, questionText);
// // // //         console.log(record.error ? `ERROR (${record.error})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // // //         records.push(record);
// // // //         await sleep(DELAY_MS);
// // // //       }
// // // //     }
// // // //   }

// // // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // // //   const hindiPilot = [];
// // // //   if (!QUICK) {
// // // //     for (const mode of Object.keys(MODES)) {
// // // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // // //       console.log(record.error ? `ERROR (${record.error})` : "done");
// // // //       hindiPilot.push(record);
// // // //       await sleep(DELAY_MS);
// // // //     }
// // // //   }

// // // //   const byMode = summarize(records);

// // // //   mkdirSync("eval/results", { recursive: true });
// // // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // // //   writeFileSync(
// // // //     `eval/results/results-${timestamp}.json`,
// // // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // // //   );
// // // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // // //   writeFileSync("eval/results/summary.md", summaryMd);
// // // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // // //   console.log("\n=== Summary ===");
// // // //   console.table(byMode);
// // // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // // }

// // // // main().catch((err) => {
// // // //   console.error("Evaluation run failed:", err);
// // // //   process.exit(1);
// // // // });

// // // // scripts/evaluate.js
// // // //
// // // // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // // // eligibility questions through all three architectures — V1 (single-shot,
// // // // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // // // eligibility engine) — using IDENTICAL prompts across all three (see
// // // // eval/personas.js: personaToSentence()).
// // // //
// // // // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // // // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // // // engine's own output would be circular for V3. Instead, the engine is
// // // // checked against the hand labels separately (see "Rule-engine agreement"
// // // // in the summary), which is itself a result.
// // // //
// // // // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // // // persona's expected.eligible / expected.ineligible (8 per persona by
// // // // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // // // deterministic).
// // // //
// // // // Usage:
// // // //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// // // //   node scripts/evaluate.js             # full run
// // // //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// // // //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// // // //
// // // // Output (eval/results/):
// // // //   results-<timestamp>.json     raw per-question records
// // // //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// // // //   summary.md                   copy of the latest summary
// // // //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// // // //                                manual labelling of the keyword classifier
// // // //
// // // // Requires GEMINI_API_KEY in .env.local.
// // // //
// // // // ---------------------------------------------------------------------
// // // // HONESTY NOTES FOR THE WRITE-UP
// // // // ---------------------------------------------------------------------
// // // // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// // // //    the spot-check CSV and report the agreement rate; fix the classifier and
// // // //    re-score the saved raw JSON if agreement is poor.
// // // // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// // // //    occurred, say latency was not reliably measured.
// // // // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // // // ---------------------------------------------------------------------

// // // import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

// // // function loadEnvLocal() {
// // //   if (!existsSync(".env.local")) return;
// // //   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
// // //     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
// // //     if (!match) continue;
// // //     const [, key, rawValue = ""] = match;
// // //     if (process.env[key] !== undefined) continue;
// // //     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
// // //   }
// // // }
// // // loadEnvLocal();

// // // const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// // // const { SCHEMES } = await import("../data/schemes.js");
// // // const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// // // const { runPlannerTurn } = await import("../agents/planner.js");
// // // const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// // // const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// // // const QUICK = process.argv.includes("--quick");
// // // const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 4000;
// // // const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// // // const SPOTCHECK_N = 10;
// // // const SPOTCHECK_SEED = 42;

// // // const MODES = {
// // //   v1: runPlannerTurnV1,
// // //   v2: runPlannerTurnV2,
// // //   v3: runPlannerTurn,
// // // };

// // // const HINDI_PILOT_QUESTION = {
// // //   personaId: "sunita",
// // //   schemeKey: "up-widow-pension",
// // //   expected: true,
// // //   text:
// // //     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
// // //     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// // // };

// // // function sleep(ms) {
// // //   return new Promise((resolve) => setTimeout(resolve, ms));
// // // }

// // // // Small seeded PRNG so the spot-check sample is reproducible.
// // // function mulberry32(seed) {
// // //   let a = seed >>> 0;
// // //   return () => {
// // //     a |= 0;
// // //     a = (a + 0x6d2b79f5) | 0;
// // //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// // //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// // //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// // //   };
// // // }

// // // function schemeNameById(id) {
// // //   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// // // }

// // // // The scheme(s) each edge-case persona exists to test (always asked, even with EVAL_QPP).
// // // const FOCUS_BY_PERSONA = {
// // //   sunita: ["up-widow-pension", "pmuy"],
// // //   ramesh: ["ignoaps"],
// // //   fatima: ["nsp-post-matric-sc", "up-widow-pension"],
// // //   arjun: ["igndps", "pm-sym"],
// // //   mohan_60: ["ignoaps"],
// // //   kishan_59: ["ignoaps"],
// // //   sym_age_40: ["pm-sym"],
// // //   sym_age_41: ["pm-sym"],
// // //   sym_inc_179999: ["pm-sym"],
// // //   sym_inc_180000: ["pm-sym"],
// // //   sc_249999: ["nsp-post-matric-sc"],
// // //   sc_250000: ["nsp-post-matric-sc"],
// // //   widow_up_199999: ["up-widow-pension"],
// // //   widow_up_200000: ["up-widow-pension"],
// // //   widow_wrong_state: ["up-widow-pension"],
// // //   bhola_noland: ["pm-kisan"],
// // //   sanjay_dis_nobpl: ["igndps"],
// // //   vikas_18: ["igndps"],
// // //   anil_17: ["igndps", "pm-sym"],
// // //   pmjay_70_nobpl: ["ab-pmjay"],
// // //   karan_none: ["ignoaps"],
// // // };

// // // /** One question per scheme in persona.expected (hand-labelled ground truth). */
// // // function buildQuestionsForPersona(persona) {
// // //   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
// // //   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

// // //   let picked = [...el, ...inel];
// // //   if (QPP < picked.length) {
// // //     // The scheme(s) each persona was designed to test are ALWAYS asked first,
// // //     // then the rest is a balanced, deterministic subsample (eligible / ineligible alternating).
// // //     const focusIds = FOCUS_BY_PERSONA[persona.id] || [];
// // //     const all = [...el, ...inel];
// // //     picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
// // //     const used = new Set(picked.map((x) => x.id));
// // //     const el2 = el.filter((x) => !used.has(x.id));
// // //     const inel2 = inel.filter((x) => !used.has(x.id));
// // //     for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
// // //       if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
// // //       if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
// // //     }
// // //   }

// // //   return picked.map((x) => ({
// // //     personaId: persona.id,
// // //     edge: persona.edge ?? "",
// // //     schemeKey: x.id,
// // //     schemeName: schemeNameById(x.id),
// // //     expected: x.expected,
// // //   }));
// // // }

// // // /** Compares the deterministic rule engine with the hand labels. */
// // // function checkEngineAgreement(personas) {
// // //   const mismatches = [];
// // //   let checked = 0;

// // //   for (const p of personas) {
// // //     const results = evaluateAllSchemes(p.profile, SCHEMES);
// // //     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
// // //     const labelled = [
// // //       ...p.expected.eligible.map((id) => [id, true]),
// // //       ...p.expected.ineligible.map((id) => [id, false]),
// // //     ];
// // //     for (const [id, expected] of labelled) {
// // //       checked++;
// // //       const engine = byKey.get(id);
// // //       if (engine !== expected) {
// // //         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
// // //       }
// // //     }
// // //   }
// // //   return { checked, agree: checked - mismatches.length, mismatches };
// // // }

// // // /** Keyword-based classifier — see HONESTY NOTE 1. */
// // // function classifyAnswer(text) {
// // //   const t = text.trim().toLowerCase();
// // //   const firstWord = t.split(/[\s,.:;!]+/)[0];

// // //   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
// // //   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

// // //   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
// // //   if (negPhrases.some((p) => t.includes(p))) return false;

// // //   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
// // //   if (posPhrases.some((p) => t.includes(p))) return true;

// // //   return null; // unclear
// // // }

// // // // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;


// // // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;
// // // async function runOne(mode, question, questionText) {
// // //   const runTurn = MODES[mode];
// // //   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

// // //   const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
// // //   let start = Date.now();
// // //   let finalText = "";
// // //   let error = null;
// // //   let attempts = 0;

// // //   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
// // //     start = Date.now();
// // //     try {
// // //       const result = await runTurn(sessionId, [], questionText);
// // //       finalText = result.finalText;
// // //       error = null;
// // //       break;
// // //     } catch (err) {
// // //       error = err.message || String(err);
// // //       if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
// // //       await sleep(8000 * attempts); // back off 8s, 16s, 24s
// // //     }
// // //   }

// // //   const latencyMs = Date.now() - start; // final attempt only
// // //   const classification = error ? null : classifyAnswer(finalText);

// // //   return {
// // //     mode,
// // //     ...question,
// // //     latencyMs,
// // //     attempts,
// // //     error,
// // //     // true when the failure is a rate/quota problem: not a model answer, so it is NOT saved or scored
// // //     quotaHit: !!error && TRANSIENT.test(error),
// // //     responseText: finalText,
// // //     classification, // true = said eligible, false = said not eligible, null = unclear
// // //     correct: error ? false : classification === question.expected,
// // //   };
// // // }

// // // function summarize(records) {
// // //   const byMode = {};

// // //   for (const mode of Object.keys(MODES)) {
// // //     const rows = records.filter((r) => r.mode === mode);
// // //     const total = rows.length;
// // //     const errors = rows.filter((r) => r.error).length;
// // //     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
// // //     const correct = rows.filter((r) => r.correct).length;

// // //     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
// // //     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
// // //     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
// // //     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

// // //     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

// // //     byMode[mode] = {
// // //       total,
// // //       correct,
// // //       accuracy: total ? +(correct / total).toFixed(3) : 0,
// // //       unclear,
// // //       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
// // //       errors,
// // //       avgLatencyMs,
// // //       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
// // //     };
// // //   }

// // //   return byMode;
// // // }

// // // function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
// // //   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
// // //   const perMode = records.length / Object.keys(MODES).length;

// // //   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
// // //   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
// // //   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

// // //   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
// // //   md += `|---|---|---|---|---|---|\n`;
// // //   for (const mode of Object.keys(MODES)) {
// // //     const s = byMode[mode];
// // //     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
// // //   }

// // //   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
// // //   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
// // //   md += `|---|---|---|---|---|\n`;
// // //   for (const mode of Object.keys(MODES)) {
// // //     const c = byMode[mode].confusion;
// // //     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
// // //   }

// // //   md += `\n## Rule-engine agreement with hand labels\n\n`;
// // //   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
// // //   if (engineCheck.mismatches.length) {
// // //     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
// // //     for (const m of engineCheck.mismatches) {
// // //       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
// // //     }
// // //     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
// // //   }

// // //   const bad = records.filter((r) => !r.correct);
// // //   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
// // //   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
// // //   for (const r of bad) {
// // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
// // //   }

// // //   if (hindiPilot?.length) {
// // //     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
// // //     for (const r of hindiPilot) {
// // //       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
// // //     }
// // //   }

// // //   md += `\n## Raw per-question results\n\n`;
// // //   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
// // //   md += `|---|---|---|---|---|---|---|\n`;
// // //   for (const r of records) {
// // //     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
// // //   }

// // //   return md;
// // // }

// // // function csvField(v) {
// // //   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// // // }

// // // /** Seeded random sample of answers for manual labelling of the classifier. */
// // // function buildSpotcheckCsv(records) {
// // //   const pool = records.filter((r) => !r.error);
// // //   const rand = mulberry32(SPOTCHECK_SEED);
// // //   const idx = pool.map((_, i) => i);
// // //   for (let i = idx.length - 1; i > 0; i--) {
// // //     const j = Math.floor(rand() * (i + 1));
// // //     [idx[i], idx[j]] = [idx[j], idx[i]];
// // //   }
// // //   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

// // //   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
// // //   const lines = [header.map(csvField).join(",")];
// // //   for (const r of sample) {
// // //     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
// // //     lines.push(
// // //       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
// // //         .map(csvField)
// // //         .join(",")
// // //     );
// // //   }
// // //   return lines.join("\n");
// // // }

// // // async function main() {
// // //   if (!process.env.GEMINI_API_KEY) {
// // //     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
// // //     process.exit(1);
// // //   }

// // //   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

// // //   // Check the labels against the rule engine before spending any API calls.
// // //   const engineCheck = checkEngineAgreement(personas);
// // //   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
// // //   for (const m of engineCheck.mismatches) {
// // //     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
// // //   }

// // //   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
// // //   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

// // //   // ---- checkpoint / resume: every finished answer is saved at once, so hitting the
// // //   // ---- API limit never loses work. Re-run the same command later to continue.
// // //   const CKPT = "eval/results/checkpoint.json";
// // //   mkdirSync("eval/results", { recursive: true });
// // //   const FRESH = process.argv.includes("--fresh");
// // //   let records = [];
// // //   let hindiPilot = [];
// // //   if (!QUICK && !FRESH && existsSync(CKPT)) {
// // //     try {
// // //       const c = JSON.parse(readFileSync(CKPT, "utf-8"));
// // //       records = c.records || [];
// // //       hindiPilot = c.hindiPilot || [];
// // //       console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)\n`);
// // //     } catch {
// // //       console.log("Checkpoint unreadable, starting fresh\n");
// // //     }
// // //   }
// // //   const saveCkpt = () => {
// // //     if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records, hindiPilot }, null, 2));
// // //   };
// // //   const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));
// // //   let stopped = false;
// // //   const stopForQuota = (record) => {
// // //     saveCkpt();
// // //     console.log(`\nAPI limit reached (${record.error.slice(0, 120)}).`);
// // //     console.log(`${records.length} answers are saved. Wait for the quota to reset (or a few minutes for a per-minute limit),`);
// // //     console.log("then run the SAME command again. It will continue where it stopped.");
// // //     stopped = true;
// // //   };

// // //   outer: for (const persona of personas) {
// // //     const questions = buildQuestionsForPersona(persona);
// // //     const sentence = personaToSentence(persona.profile);

// // //     for (const q of questions) {
// // //       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

// // //       for (const mode of Object.keys(MODES)) {
// // //         if (done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) continue;
// // //         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
// // //         const record = await runOne(mode, q, questionText);
// // //         console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
// // //         if (record.quotaHit) { stopForQuota(record); break outer; }
// // //         records.push(record);
// // //         saveCkpt();
// // //         await sleep(DELAY_MS);
// // //       }
// // //     }
// // //   }

// // //   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
// // //   if (!QUICK && !stopped) {
// // //     for (const mode of Object.keys(MODES)) {
// // //       if (hindiPilot.some((r) => r.mode === mode)) continue;
// // //       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
// // //       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
// // //       console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : "done");
// // //       if (record.quotaHit) { stopForQuota(record); break; }
// // //       hindiPilot.push(record);
// // //       saveCkpt();
// // //       await sleep(DELAY_MS);
// // //     }
// // //   }

// // //   if (stopped) return;

// // //   const byMode = summarize(records);

// // //   mkdirSync("eval/results", { recursive: true });
// // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // //   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

// // //   writeFileSync(
// // //     `eval/results/results-${timestamp}.json`,
// // //     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
// // //   );
// // //   writeFileSync(`eval/results/summary-${timestamp}.md`, summaryMd);
// // //   writeFileSync("eval/results/summary.md", summaryMd);
// // //   writeFileSync(`eval/results/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

// // //   if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `eval/results/checkpoint-done-${timestamp}.json`);

// // //   console.log("\n=== Summary ===");
// // //   console.table(byMode);
// // //   console.log(`\nFull results:     eval/results/results-${timestamp}.json`);
// // //   console.log(`Markdown summary: eval/results/summary-${timestamp}.md (also summary.md)`);
// // //   console.log(`Spot-check CSV:   eval/results/spotcheck-${timestamp}.csv`);
// // // }

// // // main().catch((err) => {
// // //   console.error("Evaluation run failed:", err);
// // //   process.exit(1);
// // // });

// // // scripts/evaluate.js  (patched: --personas <file>, --check-only, per-set results folder, records usedFallbackModel)
// // //   node scripts/evaluate.js --personas eval/personas-extra/part1.json --check-only   # free: labels vs engine
// // //   node scripts/evaluate.js --personas eval/personas-extra/part1.json                # runs part 1 (resumes after a quota stop)
// // scripts/evaluate.js
// //
// // The BTP's core comparative-evaluation harness. Runs (persona, scheme)
// // eligibility questions through all three architectures — V1 (single-shot,
// // no grounding), V2 (single-shot + RAG), V3 (multi-agent + deterministic
// // eligibility engine) — using IDENTICAL prompts across all three (see
// // eval/personas.js: personaToSentence()).
// //
// // GROUND TRUTH: hand-labelled `persona.expected` in eval/personas.js, derived
// // from the scheme criteria — NOT from lib/eligibility.js. Scoring against the
// // engine's own output would be circular for V3. Instead, the engine is
// // checked against the hand labels separately (see "Rule-engine agreement"
// // in the summary), which is itself a result.
// //
// // QUESTIONS: for every persona, one question per FOCUS scheme listed in that
// // persona's expected.eligible / expected.ineligible (8 per persona by
// // default). Set EVAL_QPP=4 to subsample (balanced eligible/ineligible,
// // deterministic).
// //
// // Usage:
// //   node scripts/evaluate.js --quick     # 1 persona, 2 questions (smoke test)
// //   node scripts/evaluate.js             # full run
// //   EVAL_QPP=4 node scripts/evaluate.js  # cheaper full run (4 questions/persona)
// //   PowerShell:  $env:EVAL_QPP=4; node scripts/evaluate.js
// //
// // Output (eval/results/):
// //   results-<timestamp>.json     raw per-question records
// //   summary-<timestamp>.md       accuracy, confusion matrices, errors, engine check
// //   summary.md                   copy of the latest summary
// //   spotcheck-<timestamp>.csv    10 randomly sampled answers (fixed seed) for
// //                                manual labelling of the keyword classifier
// //
// // Requires GEMINI_API_KEY in .env.local.
// //
// // ---------------------------------------------------------------------
// // HONESTY NOTES FOR THE WRITE-UP
// // ---------------------------------------------------------------------
// // 1. classifyAnswer is a keyword heuristic. Fill the `your_label` column in
// //    the spot-check CSV and report the agreement rate; fix the classifier and
// //    re-score the saved raw JSON if agreement is poor.
// // 2. Latency is recorded but includes retries/rate-limit waits; if retries
// //    occurred, say latency was not reliably measured.
// // 3. The Hindi question is a qualitative pilot only (unverified translation).
// // ---------------------------------------------------------------------

// import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

// function loadEnvLocal() {
//   if (!existsSync(".env.local")) return;
//   for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
//     const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
//     if (!match) continue;
//     const [, key, rawValue = ""] = match;
//     if (process.env[key] !== undefined) continue;
//     process.env[key] = rawValue.replace(/^["']|["']$/g, "");
//   }
// }
// loadEnvLocal();

// const { evaluateAllSchemes } = await import("../lib/eligibility.js");
// const { SCHEMES } = await import("../data/schemes.js");
// const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
// const { runPlannerTurn } = await import("../agents/planner.js");
// const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
// const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");

// const QUICK = process.argv.includes("--quick");
// // --personas <file.json> : run an extra persona set (e.g. eval/personas-extra/part1.json) instead of PERSONAS.
// // Results go to their own folder (eval/results/<file name>/), so your finished main results are never touched.
// // --check-only           : compare hand labels with the rule engine and exit (no API calls).
// const argVal = (flag) => { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : null; };
// const PERSONAS_FILE = argVal("--personas");
// const CHECK_ONLY = process.argv.includes("--check-only");
// const RESULTS_DIR = PERSONAS_FILE
//   ? `eval/results/${PERSONAS_FILE.split(/[\\/]/).pop().replace(/\.json$/i, "")}`
//   : "eval/results";
// const ACTIVE_PERSONAS = PERSONAS_FILE ? JSON.parse(readFileSync(PERSONAS_FILE, "utf-8")) : PERSONAS;
// const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 4000;
// const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4; // questions per persona
// const SPOTCHECK_N = 10;
// const SPOTCHECK_SEED = 42;

// const MODES = {
//   v1: runPlannerTurnV1,
//   v2: runPlannerTurnV2,
//   v3: runPlannerTurn,
// };

// const HINDI_PILOT_QUESTION = {
//   personaId: "sunita",
//   schemeKey: "up-widow-pension",
//   expected: true,
//   text:
//     'मेरी उम्र 31 वर्ष है, मैं महिला हूँ, मैं विधवा हूँ, मैं उत्तर प्रदेश में रहती हूँ। मेरी वार्षिक पारिवारिक आय ₹80000 है। मेरे पास बीपीएल कार्ड है। मेरा आधार मेरे बैंक खाते से जुड़ा है। मेरे 2 आश्रित हैं। मेरे पास कोई ज़मीन नहीं है। मैं बेरोज़गार हूँ। मेरी सामाजिक श्रेणी ओबीसी है। मुझे कोई विकलांगता नहीं है। मैं ग्रामीण क्षेत्र में रहती हूँ। ' +
//     'क्या मैं "विधवा पेंशन योजना" के लिए पात्र हूँ? पहले केवल एक शब्द में उत्तर दें — "हाँ" या "नहीं" — फिर एक वाक्य में स्पष्टीकरण दें।',
// };

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // Small seeded PRNG so the spot-check sample is reproducible.
// function mulberry32(seed) {
//   let a = seed >>> 0;
//   return () => {
//     a |= 0;
//     a = (a + 0x6d2b79f5) | 0;
//     let t = Math.imul(a ^ (a >>> 15), 1 | a);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// function schemeNameById(id) {
//   return SCHEMES.find((s) => s.id === id)?.name ?? id;
// }

// // The scheme(s) each edge-case persona exists to test (always asked, even with EVAL_QPP).
// const FOCUS_BY_PERSONA = {
//   sunita: ["up-widow-pension", "pmuy"],
//   ramesh: ["ignoaps"],
//   fatima: ["nsp-post-matric-sc", "up-widow-pension"],
//   arjun: ["igndps", "pm-sym"],
//   mohan_60: ["ignoaps"],
//   kishan_59: ["ignoaps"],
//   sym_age_40: ["pm-sym"],
//   sym_age_41: ["pm-sym"],
//   sym_inc_179999: ["pm-sym"],
//   sym_inc_180000: ["pm-sym"],
//   sc_249999: ["nsp-post-matric-sc"],
//   sc_250000: ["nsp-post-matric-sc"],
//   widow_up_199999: ["up-widow-pension"],
//   widow_up_200000: ["up-widow-pension"],
//   widow_wrong_state: ["up-widow-pension"],
//   bhola_noland: ["pm-kisan"],
//   sanjay_dis_nobpl: ["igndps"],
//   vikas_18: ["igndps"],
//   anil_17: ["igndps", "pm-sym"],
//   pmjay_70_nobpl: ["ab-pmjay"],
//   karan_none: ["ignoaps"],
// };

// /** One question per scheme in persona.expected (hand-labelled ground truth). */
// function buildQuestionsForPersona(persona) {
//   const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
//   const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

//   let picked = [...el, ...inel];
//   if (QPP < picked.length) {
//     // The scheme(s) each persona was designed to test are ALWAYS asked first,
//     // then the rest is a balanced, deterministic subsample (eligible / ineligible alternating).
//     const focusIds = persona.focusSchemes || FOCUS_BY_PERSONA[persona.id] || [];
//     const all = [...el, ...inel];
//     picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
//     const used = new Set(picked.map((x) => x.id));
//     const el2 = el.filter((x) => !used.has(x.id));
//     const inel2 = inel.filter((x) => !used.has(x.id));
//     for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
//       if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
//       if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
//     }
//   }

//   return picked.map((x) => ({
//     personaId: persona.id,
//     edge: persona.edge ?? "",
//     schemeKey: x.id,
//     schemeName: schemeNameById(x.id),
//     expected: x.expected,
//   }));
// }

// /** Compares the deterministic rule engine with the hand labels. */
// function checkEngineAgreement(personas) {
//   const mismatches = [];
//   let checked = 0;

//   for (const p of personas) {
//     const results = evaluateAllSchemes(p.profile, SCHEMES);
//     const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
//     const labelled = [
//       ...p.expected.eligible.map((id) => [id, true]),
//       ...p.expected.ineligible.map((id) => [id, false]),
//     ];
//     for (const [id, expected] of labelled) {
//       checked++;
//       const engine = byKey.get(id);
//       if (engine !== expected) {
//         mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
//       }
//     }
//   }
//   return { checked, agree: checked - mismatches.length, mismatches };
// }

// /** Keyword-based classifier — see HONESTY NOTE 1. */
// function classifyAnswer(text) {
//   const t = text.trim().toLowerCase();
//   const firstWord = t.split(/[\s,.:;!]+/)[0];

//   if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
//   if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

//   const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
//   if (negPhrases.some((p) => t.includes(p))) return false;

//   const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
//   if (posPhrases.some((p) => t.includes(p))) return true;

//   return null; // unclear
// }

// // const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;


// const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;
// async function runOne(mode, question, questionText) {
//   const runTurn = MODES[mode];
//   const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

//   const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
//   let start = Date.now();
//   let finalText = "";
//   let error = null;
//   let attempts = 0;
//   let usedFallbackModel = null;

//   for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
//     start = Date.now();
//     try {
//       const result = await runTurn(sessionId, [], questionText);
//       finalText = result.finalText;
//       usedFallbackModel = result.usedFallbackModel ?? null;
//       error = null;
//       break;
//     } catch (err) {
//       error = err.message || String(err);
//       if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
//       await sleep(8000 * attempts); // back off 8s, 16s, 24s
//     }
//   }

//   const latencyMs = Date.now() - start; // final attempt only
//   const classification = error ? null : classifyAnswer(finalText);

//   return {
//     mode,
//     ...question,
//     latencyMs,
//     attempts,
//     usedFallbackModel,
//     error,
//     // true when the failure is a rate/quota problem: not a model answer, so it is NOT saved or scored
//     quotaHit: !!error && TRANSIENT.test(error),
//     responseText: finalText,
//     classification, // true = said eligible, false = said not eligible, null = unclear
//     correct: error ? false : classification === question.expected,
//   };
// }

// function summarize(records) {
//   const byMode = {};

//   for (const mode of Object.keys(MODES)) {
//     const rows = records.filter((r) => r.mode === mode);
//     const total = rows.length;
//     const errors = rows.filter((r) => r.error).length;
//     const unclear = rows.filter((r) => !r.error && r.classification === null).length;
//     const correct = rows.filter((r) => r.correct).length;

//     const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
//     const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
//     const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
//     const fn = rows.filter((r) => r.expected === true && r.classification === false).length;

//     const avgLatencyMs = total ? Math.round(rows.reduce((s, r) => s + r.latencyMs, 0) / total) : 0;

//     byMode[mode] = {
//       total,
//       correct,
//       accuracy: total ? +(correct / total).toFixed(3) : 0,
//       unclear,
//       unclearRate: total ? +(unclear / total).toFixed(3) : 0,
//       errors,
//       avgLatencyMs,
//       confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
//     };
//   }

//   return byMode;
// }

// function toMarkdown(byMode, records, hindiPilot, engineCheck, personaCount) {
//   const modeLabel = { v1: "V1 — single-shot", v2: "V2 — RAG single-shot", v3: "V3 — multi-agent" };
//   const perMode = records.length / Object.keys(MODES).length;

//   let md = `# Evaluation summary\n\nGenerated ${new Date().toISOString()}\n\n`;
//   md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Ground truth: hand-labelled expected eligibility (eval/personas.js).\n`;
//   md += `Questions per persona: ${QPP === Infinity ? "all focus schemes" : QPP}.\n\n`;

//   md += `| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |\n`;
//   md += `|---|---|---|---|---|---|\n`;
//   for (const mode of Object.keys(MODES)) {
//     const s = byMode[mode];
//     md += `| ${modeLabel[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${(s.unclearRate * 100).toFixed(1)}% | ${s.errors} | ${s.avgLatencyMs} |\n`;
//   }

//   md += `\n## Confusion matrix (positive class = "eligible")\n\n`;
//   md += `| Architecture | True Positive | False Positive | True Negative | False Negative |\n`;
//   md += `|---|---|---|---|---|\n`;
//   for (const mode of Object.keys(MODES)) {
//     const c = byMode[mode].confusion;
//     md += `| ${modeLabel[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
//   }

//   md += `\n## Rule-engine agreement with hand labels\n\n`;
//   md += `${engineCheck.agree}/${engineCheck.checked} (persona, scheme) labels agree with lib/eligibility.js.\n\n`;
//   if (engineCheck.mismatches.length) {
//     md += `| Persona | Scheme | Hand label | Engine |\n|---|---|---|---|\n`;
//     for (const m of engineCheck.mismatches) {
//       md += `| ${m.personaId} | ${m.schemeKey} | ${m.handLabel ? "eligible" : "not eligible"} | ${m.engine === true ? "eligible" : m.engine === false ? "not eligible" : m.engine} |\n`;
//     }
//     md += `\nEach mismatch is either a labelling mistake or a rule-engine bug — resolve before reporting.\n`;
//   }

//   const bad = records.filter((r) => !r.correct);
//   md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n`;
//   md += `| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
//   for (const r of bad) {
//     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
//     md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said} |\n`;
//   }

//   if (hindiPilot?.length) {
//     md += `\n## Language robustness pilot (Hindi, one question, unverified translation — qualitative only)\n\n`;
//     for (const r of hindiPilot) {
//       md += `**${modeLabel[r.mode]}:** ${r.error ? `ERROR: ${r.error}` : r.responseText}\n\n`;
//     }
//   }

//   md += `\n## Raw per-question results\n\n`;
//   md += `| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |\n`;
//   md += `|---|---|---|---|---|---|---|\n`;
//   for (const r of records) {
//     const said = r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
//     md += `| ${r.mode} | ${r.personaId} | ${r.schemeName} | ${r.expected ? "eligible" : "not eligible"} | ${said} | ${r.correct ? "✓" : "✗"} | ${r.latencyMs} |\n`;
//   }

//   return md;
// }

// function csvField(v) {
//   return `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
// }

// /** Seeded random sample of answers for manual labelling of the classifier. */
// function buildSpotcheckCsv(records) {
//   const pool = records.filter((r) => !r.error);
//   const rand = mulberry32(SPOTCHECK_SEED);
//   const idx = pool.map((_, i) => i);
//   for (let i = idx.length - 1; i > 0; i--) {
//     const j = Math.floor(rand() * (i + 1));
//     [idx[i], idx[j]] = [idx[j], idx[i]];
//   }
//   const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);

//   const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
//   const lines = [header.map(csvField).join(",")];
//   for (const r of sample) {
//     const cl = r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible";
//     lines.push(
//       [r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", cl, r.responseText, ""]
//         .map(csvField)
//         .join(",")
//     );
//   }
//   return lines.join("\n");
// }

// async function main() {
//   if (!process.env.GEMINI_API_KEY) {
//     console.error("GEMINI_API_KEY is missing from .env.local — can't call any of the three architectures. Aborting.");
//     process.exit(1);
//   }

//   const personas = QUICK ? PERSONAS.slice(0, 1) : PERSONAS;

//   // Check the labels against the rule engine before spending any API calls.
//   const engineCheck = checkEngineAgreement(personas);
//   console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
//   for (const m of engineCheck.mismatches) {
//     console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
//   }

//   const totalQuestions = personas.reduce((n, p) => n + buildQuestionsForPersona(p).length, 0);
//   console.log(`${personas.length} persona(s), ${totalQuestions} question(s), ${totalQuestions * Object.keys(MODES).length} LLM calls\n`);

//   // ---- checkpoint / resume: every finished answer is saved at once, so hitting the
//   // ---- API limit never loses work. Re-run the same command later to continue.
//   const CKPT = `${RESULTS_DIR}/checkpoint.json`;
//   mkdirSync(RESULTS_DIR, { recursive: true });
//   const FRESH = process.argv.includes("--fresh");
//   let records = [];
//   let hindiPilot = [];
//   if (!QUICK && !FRESH && existsSync(CKPT)) {
//     try {
//       const c = JSON.parse(readFileSync(CKPT, "utf-8"));
//       records = c.records || [];
//       hindiPilot = c.hindiPilot || [];
//       console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)\n`);
//     } catch {
//       console.log("Checkpoint unreadable, starting fresh\n");
//     }
//   }
//   const saveCkpt = () => {
//     if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records, hindiPilot }, null, 2));
//   };
//   const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));
//   let stopped = false;
//   const stopForQuota = (record) => {
//     saveCkpt();
//     console.log(`\nAPI limit reached (${record.error.slice(0, 120)}).`);
//     console.log(`${records.length} answers are saved. Wait for the quota to reset (or a few minutes for a per-minute limit),`);
//     console.log("then run the SAME command again. It will continue where it stopped.");
//     stopped = true;
//   };

//   outer: for (const persona of personas) {
//     const questions = buildQuestionsForPersona(persona);
//     const sentence = personaToSentence(persona.profile);

//     for (const q of questions) {
//       const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;

//       for (const mode of Object.keys(MODES)) {
//         if (done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) continue;
//         process.stdout.write(`[${mode}] ${persona.id} / ${q.schemeKey} ... `);
//         const record = await runOne(mode, q, questionText);
//         console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : `${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
//         if (record.quotaHit) { stopForQuota(record); break outer; }
//         records.push(record);
//         saveCkpt();
//         await sleep(DELAY_MS);
//       }
//     }
//   }

//   // Language robustness pilot — one Hindi question, all three modes, logged raw (not auto-scored)
//   if (!QUICK && !stopped && !PERSONAS_FILE) {
//     for (const mode of Object.keys(MODES)) {
//       if (hindiPilot.some((r) => r.mode === mode)) continue;
//       process.stdout.write(`[${mode}] hindi-pilot / ${HINDI_PILOT_QUESTION.schemeKey} ... `);
//       const record = await runOne(mode, HINDI_PILOT_QUESTION, HINDI_PILOT_QUESTION.text);
//       console.log(record.error ? `ERROR (${record.error.slice(0, 100)})` : "done");
//       if (record.quotaHit) { stopForQuota(record); break; }
//       hindiPilot.push(record);
//       saveCkpt();
//       await sleep(DELAY_MS);
//     }
//   }

//   if (stopped) return;

//   const byMode = summarize(records);

//   mkdirSync(RESULTS_DIR, { recursive: true });
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const summaryMd = toMarkdown(byMode, records, hindiPilot, engineCheck, personas.length);

//   writeFileSync(
//     `${RESULTS_DIR}/results-${timestamp}.json`,
//     JSON.stringify({ records, hindiPilot, summary: byMode, engineCheck }, null, 2)
//   );
//   writeFileSync(`${RESULTS_DIR}/summary-${timestamp}.md`, summaryMd);
//   writeFileSync(`${RESULTS_DIR}/summary.md`, summaryMd);
//   writeFileSync(`${RESULTS_DIR}/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));

//   if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `${RESULTS_DIR}/checkpoint-done-${timestamp}.json`);

//   console.log("\n=== Summary ===");
//   console.table(byMode);
//   console.log(`\nFull results:     ${RESULTS_DIR}/results-${timestamp}.json`);
//   console.log(`Markdown summary: ${RESULTS_DIR}/summary-${timestamp}.md (also summary.md)`);
//   console.log(`Spot-check CSV:   ${RESULTS_DIR}/spotcheck-${timestamp}.csv`);
// }

// main().catch((err) => {
//   console.error("Evaluation run failed:", err);
//   process.exit(1);
// });
// scripts/evaluate.js
//
// Comparative-evaluation harness for the BTP / paper.
// Architectures: v1 (single-shot), v2 (RAG), v3 (tool-calling + rule engine),
// v1r (rule-aware single-shot baseline: V1 plus the plain-English rules).
//
// By default ONLY v1r is run (the other three are already evaluated); use --modes
// to choose others. All architectures get identical question text (see
// eval/personas.js: personaToSentence()). Ground truth is the hand-labelled
// persona.expected, NOT the rule engine.
//
// Usage (PowerShell: set the model first, same as the earlier runs):
//   $env:EVAL_MODEL="gemini-3.5-flash-lite"
//   node scripts/evaluate.js --quick                       # smoke test: 1 persona, 2 questions
//   node scripts/evaluate.js                               # Run A personas (eval/personas.js), v1r only
//   node scripts/evaluate.js --personas eval/personas-extra/part1.json,eval/personas-extra/part2.json
//   node scripts/evaluate.js --modes v1,v2,v3,v1r          # run several architectures
//   node scripts/evaluate.js --check-only                  # labels vs rule engine, no API calls
//   node scripts/evaluate.js --fresh                       # ignore the saved checkpoint
//
// Env: EVAL_QPP (questions per persona, default 4), EVAL_CONC (parallel calls, default 3),
//      EVAL_DELAY_MS (pause per call, default 800), EVAL_MAX_ATTEMPTS (default 4).
//
// Results go to eval/results/<set>-<modes>/ so earlier results are never overwritten.
// Every answer is checkpointed; after an API-limit stop, run the same command again.

import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from "fs";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const [, key, rawValue = ""] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const { evaluateAllSchemes } = await import("../lib/eligibility.js");
const { SCHEMES } = await import("../data/schemes.js");
const { PERSONAS, personaToSentence } = await import("../eval/personas.js");
const { runPlannerTurn } = await import("../agents/planner.js");
const { runPlannerTurnV1 } = await import("../agents/plannerV1.js");
const { runPlannerTurnV2 } = await import("../agents/plannerV2.js");
const { runPlannerTurnV1R } = await import("../agents/plannerV1R.js");

// ---------- options ----------
const argVal = (flag) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
};
const QUICK = process.argv.includes("--quick");
const FRESH = process.argv.includes("--fresh");
const CHECK_ONLY = process.argv.includes("--check-only");
const ONLY_SCHEME = argVal("--only-scheme");

const ALL_MODES = { v1: runPlannerTurnV1, v2: runPlannerTurnV2, v3: runPlannerTurn, v1r: runPlannerTurnV1R };
const MODE_LABEL = {
  v1: "V1 — single-shot",
  v2: "V2 — RAG single-shot",
  v3: "V3 — tool-calling + rule engine",
  v1r: "V1R — rule-aware single-shot",
};
const modeNames = (argVal("--modes") || "v1r").split(",").map((s) => s.trim()).filter(Boolean);
for (const m of modeNames) {
  if (!ALL_MODES[m]) {
    console.error(`Unknown mode "${m}". Choose from: ${Object.keys(ALL_MODES).join(", ")}`);
    process.exit(1);
  }
}
const MODES = Object.fromEntries(modeNames.map((m) => [m, ALL_MODES[m]]));

const PERSONAS_FILES = (argVal("--personas") || "").split(",").map((s) => s.trim()).filter(Boolean);
const ACTIVE_PERSONAS = PERSONAS_FILES.length
  ? PERSONAS_FILES.flatMap((f) => JSON.parse(readFileSync(f, "utf-8")))
  : PERSONAS;
const SET_NAME = PERSONAS_FILES.length
  ? PERSONAS_FILES.length === 1
    ? PERSONAS_FILES[0].split(/[\\/]/).pop().replace(/\.json$/i, "")
    : "personas-extra-combined"
  : "main";
const TAG = process.env.EVAL_TAG ? `-${process.env.EVAL_TAG}` : "";
const RESULTS_DIR = `eval/results/${SET_NAME}-${modeNames.join("+")}${TAG}`;

const DELAY_MS = Number(process.env.EVAL_DELAY_MS) || 800;
const CONC = Math.max(1, Number(process.env.EVAL_CONC) || 3);
const QPP = QUICK ? 2 : Number(process.env.EVAL_QPP) || 4;
const MAX_ATTEMPTS = Number(process.env.EVAL_MAX_ATTEMPTS) || 4;
const SPOTCHECK_N = 10;
const SPOTCHECK_SEED = 42;
const TRANSIENT = /503|429|high demand|overloaded|unavailable|RESOURCE_EXHAUSTED|rate limit/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const schemeNameById = (id) => SCHEMES.find((s) => s.id === id)?.name ?? id;

const AB_PMJAY_MIN_AGE = 70;

/** Corrected AB-PMJAY label: true for 70+, null (undetermined, not scored) otherwise. */
function relabel(persona, schemeKey, expected) {
  if (schemeKey !== "ab-pmjay") return expected;
  return persona.profile.age >= AB_PMJAY_MIN_AGE ? true : null;
}

// Scheme(s) each Run A edge-case persona was designed to test (always asked first).
// Run B personas carry their own `focusSchemes`.
const FOCUS_BY_PERSONA = {
  sunita: ["up-widow-pension", "pmuy"],
  ramesh: ["ignoaps"],
  fatima: ["nsp-post-matric-sc", "up-widow-pension"],
  arjun: ["igndps", "pm-sym"],
  mohan_60: ["ignoaps"],
  kishan_59: ["ignoaps"],
  sym_age_40: ["pm-sym"],
  sym_age_41: ["pm-sym"],
  sym_inc_179999: ["pm-sym"],
  sym_inc_180000: ["pm-sym"],
  sc_249999: ["nsp-post-matric-sc"],
  sc_250000: ["nsp-post-matric-sc"],
  widow_up_199999: ["up-widow-pension"],
  widow_up_200000: ["up-widow-pension"],
  widow_wrong_state: ["up-widow-pension"],
  bhola_noland: ["pm-kisan"],
  sanjay_dis_nobpl: ["igndps"],
  vikas_18: ["igndps"],
  anil_17: ["igndps", "pm-sym"],
  pmjay_70_nobpl: ["ab-pmjay"],
  karan_none: ["ignoaps"],
};

/** Same question selection as the earlier runs. */
function buildQuestionsForPersona(persona) {
  const el = [...persona.expected.eligible].sort().map((id) => ({ id, expected: true }));
  const inel = [...persona.expected.ineligible].sort().map((id) => ({ id, expected: false }));

  let picked = [...el, ...inel];
  if (QPP < picked.length) {
    const focusIds = persona.focusSchemes || FOCUS_BY_PERSONA[persona.id] || [];
    const all = [...el, ...inel];
    picked = focusIds.map((id) => all.find((x) => x.id === id)).filter(Boolean).slice(0, QPP);
    const used = new Set(picked.map((x) => x.id));
    const el2 = el.filter((x) => !used.has(x.id));
    const inel2 = inel.filter((x) => !used.has(x.id));
    for (let i = 0; picked.length < QPP && (i < el2.length || i < inel2.length); i++) {
      if (i < el2.length && picked.length < QPP) picked.push(el2[i]);
      if (i < inel2.length && picked.length < QPP) picked.push(inel2[i]);
    }
  }

  return picked
    .map((x) => ({
      personaId: persona.id,
      edge: persona.edge ?? "",
      schemeKey: x.id,
      schemeName: schemeNameById(x.id),
      expected: relabel(persona, x.id, x.expected),
    }))
    .filter((q) => q.expected !== null); // under-70 AB-PMJAY: not scored
}

/** Compares the deterministic rule engine with the hand labels. */
function checkEngineAgreement(personas) {
  const mismatches = [];
  let checked = 0;
  let skipped = 0;
  for (const p of personas) {
    const results = evaluateAllSchemes(p.profile, SCHEMES);
    const byKey = new Map(results.map((r) => [r.schemeKey, r.eligible]));
    const labelled = [
      ...p.expected.eligible.map((id) => [id, true]),
      ...p.expected.ineligible.map((id) => [id, false]),
    ];
    for (const [id, oldLabel] of labelled) {
      const expected = relabel(p, id, oldLabel);
      if (expected === null) { skipped++; continue; }
      checked++;
      const engine = byKey.get(id);
      if (engine !== expected) {
        mismatches.push({ personaId: p.id, schemeKey: id, handLabel: expected, engine: engine ?? "missing" });
      }
    }
  }
  return { checked, skipped, agree: checked - mismatches.length, mismatches };
}

/** Keyword classifier — identical to the earlier runs. */
function classifyAnswer(text) {
  const t = text.trim().toLowerCase();
  const firstWord = t.split(/[\s,.:;!]+/)[0];

  if (firstWord === "yes" || firstWord === "हाँ" || firstWord === "haan") return true;
  if (firstWord === "no" || firstWord === "नहीं" || firstWord === "nahi" || firstWord === "nahin") return false;

  const negPhrases = ["not eligible", "do not qualify", "don't qualify", "doesn't qualify", "not qualify", "are not eligible"];
  if (negPhrases.some((p) => t.includes(p))) return false;

  const posPhrases = ["you are eligible", "you qualify", "you're eligible", "yes, you"];
  if (posPhrases.some((p) => t.includes(p))) return true;

  return null; // unclear
}

async function runOne(mode, question, questionText) {
  const runTurn = MODES[mode];
  const sessionId = `eval-${mode}-${question.personaId}-${question.schemeKey}-${Date.now()}`;

  let start = Date.now();
  let finalText = "";
  let error = null;
  let attempts = 0;
  let usedFallbackModel = null;

  for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
    start = Date.now();
    try {
      const result = await runTurn(sessionId, [], questionText);
      finalText = result.finalText;
      usedFallbackModel = result.usedFallbackModel ?? null;
      error = null;
      break;
    } catch (err) {
      error = err.message || String(err);
      if (!TRANSIENT.test(error) || attempts === MAX_ATTEMPTS) break;
      await sleep(8000 * attempts); // back off 8s, 16s, 24s
    }
  }

  const latencyMs = Date.now() - start; // final attempt only
  const classification = error ? null : classifyAnswer(finalText);

  return {
    mode,
    ...question,
    latencyMs,
    attempts,
    usedFallbackModel,
    error,
    quotaHit: !!error && TRANSIENT.test(error), // rate/quota failure: not saved, not scored
    responseText: finalText,
    classification, // true = said eligible, false = said not eligible, null = unclear
    correct: error ? false : classification === question.expected,
  };
}

function summarize(records) {
  const byMode = {};
  for (const mode of Object.keys(MODES)) {
    const rows = records.filter((r) => r.mode === mode);
    const total = rows.length;
    const errors = rows.filter((r) => r.error).length;
    const unclear = rows.filter((r) => !r.error && r.classification === null).length;
    const correct = rows.filter((r) => r.correct).length;
    const tp = rows.filter((r) => r.expected === true && r.classification === true).length;
    const fp = rows.filter((r) => r.expected === false && r.classification === true).length;
    const tn = rows.filter((r) => r.expected === false && r.classification === false).length;
    const fn = rows.filter((r) => r.expected === true && r.classification === false).length;
    const lat = rows.filter((r) => !r.error).map((r) => r.latencyMs).sort((a, b) => a - b);
    const pct = (q) => (lat.length ? lat[Math.min(lat.length - 1, Math.floor(q * lat.length))] : 0);

    byMode[mode] = {
      total,
      correct,
      accuracy: total ? +(correct / total).toFixed(3) : 0,
      unclear,
      errors,
      p50LatencyMs: pct(0.5),
      p95LatencyMs: pct(0.95),
      confusion: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
    };
  }
  return byMode;
}

const said = (r) => (r.error ? "ERROR" : r.classification === null ? "unclear" : r.classification ? "eligible" : "not eligible");

function toMarkdown(byMode, records, engineCheck, personaCount) {
  const perMode = records.length / Object.keys(MODES).length;
  let md = `# Evaluation summary (${SET_NAME}; ${modeNames.join(", ")})\n\nGenerated ${new Date().toISOString()}\n\n`;
  md += `Personas: ${personaCount}. Questions per architecture: ${perMode}. Model override: ${process.env.EVAL_MODEL || "default"}.\n\n`;

  md += `| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |\n|---|---|---|---|---|---|---|\n`;
  for (const mode of Object.keys(MODES)) {
    const s = byMode[mode];
    md += `| ${MODE_LABEL[mode]} | ${(s.accuracy * 100).toFixed(1)}% | ${s.correct}/${s.total} | ${s.unclear} | ${s.errors} | ${s.p50LatencyMs} | ${s.p95LatencyMs} |\n`;
  }

  md += `\n## Confusion matrix (positive class = "eligible")\n\n| Architecture | TP | FP | TN | FN |\n|---|---|---|---|---|\n`;
  for (const mode of Object.keys(MODES)) {
    const c = byMode[mode].confusion;
    md += `| ${MODE_LABEL[mode]} | ${c.truePositive} | ${c.falsePositive} | ${c.trueNegative} | ${c.falseNegative} |\n`;
  }

  md += `\n## Rule-engine agreement with hand labels\n\n${engineCheck.agree}/${engineCheck.checked} labels agree with lib/eligibility.js (${engineCheck.skipped} under-70 AB-PMJAY skipped as undetermined).\n`;
  for (const m of engineCheck.mismatches) {
    md += `- MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}\n`;
  }

  const bad = records.filter((r) => !r.correct);
  md += `\n## Wrong, unclear or errored answers (${bad.length})\n\n| Architecture | Persona | Edge case | Scheme | Expected | Model said |\n|---|---|---|---|---|---|\n`;
  for (const r of bad) {
    md += `| ${r.mode} | ${r.personaId} | ${r.edge} | ${r.schemeKey} | ${r.expected ? "eligible" : "not eligible"} | ${said(r)} |\n`;
  }
  return md;
}

const csvField = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

function buildSpotcheckCsv(records) {
  const pool = records.filter((r) => !r.error);
  const rand = mulberry32(SPOTCHECK_SEED);
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const sample = idx.slice(0, SPOTCHECK_N).map((i) => pool[i]);
  const header = ["mode", "persona", "scheme", "expected", "classifier_label", "response_text", "your_label (eligible / not eligible / unclear)"];
  const lines = [header.map(csvField).join(",")];
  for (const r of sample) {
    lines.push([r.mode, r.personaId, r.schemeKey, r.expected ? "eligible" : "not eligible", said(r), r.responseText, ""].map(csvField).join(","));
  }
  return lines.join("\n");
}

async function main() {
  const personas = QUICK ? ACTIVE_PERSONAS.slice(0, 1) : ACTIVE_PERSONAS;

  // Free check of the labels against the rule engine.
  const engineCheck = checkEngineAgreement(personas);
  console.log(`Rule-engine vs hand labels: ${engineCheck.agree}/${engineCheck.checked} agree`);
  for (const m of engineCheck.mismatches) {
    console.log(`  MISMATCH ${m.personaId} / ${m.schemeKey}: hand=${m.handLabel} engine=${m.engine}`);
  }
  if (CHECK_ONLY) {
    console.log("--check-only: no API calls made.");
    return;
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from .env.local. Aborting.");
    process.exit(1);
  }

  // Resume support.
  const CKPT = `${RESULTS_DIR}/checkpoint.json`;
  mkdirSync(RESULTS_DIR, { recursive: true });
  let records = [];
  if (!QUICK && !FRESH && existsSync(CKPT)) {
    try {
      records = JSON.parse(readFileSync(CKPT, "utf-8")).records || [];
      console.log(`Resuming: ${records.length} answers already saved (use --fresh to start over)`);
    } catch {
      console.log("Checkpoint unreadable, starting fresh");
    }
  }
  const saveCkpt = () => {
    if (!QUICK) writeFileSync(CKPT, JSON.stringify({ records }, null, 2));
  };
  const done = new Set(records.map((r) => `${r.mode}|${r.personaId}|${r.schemeKey}`));

  // Build the task list (skipping anything already answered).
  const tasks = [];
  for (const persona of personas) {
    const sentence = personaToSentence(persona.profile);
    for (const q of buildQuestionsForPersona(persona)) {
      if (ONLY_SCHEME && q.schemeKey !== ONLY_SCHEME) continue;
      const questionText = `${sentence} Am I eligible for the "${q.schemeName}" scheme? Answer with exactly one word first — "Yes" or "No" — then a one-sentence explanation.`;
      for (const mode of Object.keys(MODES)) {
        if (!done.has(`${mode}|${q.personaId}|${q.schemeKey}`)) tasks.push({ mode, q, questionText, persona });
      }
    }
  }
  const total = tasks.length;
  console.log(
    `${personas.length} persona(s), modes: ${modeNames.join("+")}, ${total} call(s) to run, ${CONC} in parallel\n`
  );

  let next = 0;
  let finished = 0;
  let stopped = false;

  const worker = async () => {
    while (!stopped) {
      const i = next++;
      if (i >= tasks.length) return;
      const { mode, q, questionText } = tasks[i];
      const record = await runOne(mode, q, questionText);
      finished++;
      const tag = `[${finished}/${total}] [${mode}] ${q.personaId} / ${q.schemeKey}`;
      console.log(record.error ? `${tag} ERROR (${record.error.slice(0, 100)})` : `${tag} ${record.correct ? "correct" : "WRONG"} (${record.latencyMs}ms)`);
      if (record.quotaHit) {
        if (!stopped) {
          stopped = true;
          console.log(`\nAPI limit reached. ${records.length} answers are saved. Wait for the quota to reset, then run the SAME command again.`);
        }
        return;
      }
      records.push(record);
      saveCkpt();
      await sleep(DELAY_MS);
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));

  saveCkpt();
  if (stopped) return;

  const byMode = summarize(records);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const summaryMd = toMarkdown(byMode, records, engineCheck, personas.length);

  writeFileSync(`${RESULTS_DIR}/results-${timestamp}.json`, JSON.stringify({ records, summary: byMode, engineCheck }, null, 2));
  writeFileSync(`${RESULTS_DIR}/summary-${timestamp}.md`, summaryMd);
  writeFileSync(`${RESULTS_DIR}/summary.md`, summaryMd);
  writeFileSync(`${RESULTS_DIR}/spotcheck-${timestamp}.csv`, buildSpotcheckCsv(records));
  if (!QUICK && existsSync(CKPT)) renameSync(CKPT, `${RESULTS_DIR}/checkpoint-done-${timestamp}.json`);

  console.log("\n=== Summary ===");
  console.table(byMode);
  console.log(`\nFull results: ${RESULTS_DIR}/results-${timestamp}.json`);
}

main().catch((err) => {
  console.error("Evaluation run failed:", err);
  process.exit(1);
});
