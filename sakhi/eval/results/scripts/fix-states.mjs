// scripts/fix-states.mjs
//
// Repairs scheme_documents.state WITHOUT re-embedding (state is not part of
// the vector). Rows currently have the government *level* ("State"/"Central")
// instead of a real state name.
//
// Usage (from project root):
//   node --env-file=.env.local scripts/fix-states.mjs          # dry run: prints plan + samples, changes nothing
//   node --env-file=.env.local scripts/fix-states.mjs --apply  # writes the changes
//
// Rules:
//   "Central" / "central"        -> "central"
//   "State" (state-level scheme) -> state named in the TITLE, else the state
//                                   mentioned most often in the text (word-boundary
//                                   match), else "unknown"
//   anything else                -> left alone

import { supabase } from "../lib/supabase.js";

const APPLY = process.argv.includes("--apply");

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
const ALIASES = { Orissa: "Odisha", Pondicherry: "Puducherry", "NCT of Delhi": "Delhi" };

// Build [regex, canonicalName] pairs; longest names first so "Uttar Pradesh" beats "Pradesh" overlaps.
const patterns = [
  ...STATES.map((s) => [s, s]),
  ...Object.entries(ALIASES),
]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([name, canon]) => [new RegExp(`\\b${name.replace(/ /g, "\\s+")}\\b`, "gi"), canon]);

function countStates(text) {
  const counts = {};
  if (!text) return counts;
  for (const [re, canon] of patterns) {
    const m = text.match(re);
    if (m) counts[canon] = (counts[canon] ?? 0) + m.length;
  }
  return counts;
}

function pickState(title, content) {
  const inTitle = countStates(title);
  const titleStates = Object.keys(inTitle);
  if (titleStates.length === 1) return { state: titleStates[0], how: "title" };
  if (titleStates.length > 1) {
    return { state: titleStates.sort((a, b) => inTitle[b] - inTitle[a])[0], how: "title" };
  }

  const inText = countStates(content);
  const ranked = Object.entries(inText).sort((a, b) => b[1] - a[1]);
  if (ranked.length && ranked[0][1] < 2) return { state: "unknown", how: "weak" };
  if (!ranked.length) return { state: "unknown", how: "none" };
  // Require the top state to clearly lead when several are mentioned.
  if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return { state: "unknown", how: "tie" };
  return { state: ranked[0][0], how: "text" };
}

async function fetchAll() {
  const rows = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from("scheme_documents")
      .select("id, scheme_id, title, state, content")
      .order("id")
      .range(from, from + page - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < page) break;
  }
  return rows;
}

const rows = await fetchAll();
console.log(`Fetched ${rows.length} rows.`);

const updates = []; // { id, newState, how, title }
for (const r of rows) {
  const s = (r.state ?? "").trim();
  if (/^central$/i.test(s)) {
    if (s !== "central") updates.push({ id: r.id, newState: "central", how: "level", title: r.title });
  } else if (/^state$/i.test(s)) {
    const { state, how } = pickState(r.title, r.content);
    updates.push({ id: r.id, newState: state, how, title: r.title });
  }
}

// Summary
const dist = {};
const byHow = {};
for (const u of updates) {
  dist[u.newState] = (dist[u.newState] ?? 0) + 1;
  byHow[u.how] = (byHow[u.how] ?? 0) + 1;
}
console.log(`\n${updates.length} rows to change. Source of decision:`, byHow);
console.log("New state distribution (top 25):");
console.table(Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([state, count]) => ({ state, count })));
console.log(`"unknown" rows: ${dist.unknown ?? 0}`);

// Random samples for manual checking
const samples = updates.filter((u) => u.how === "text" || u.how === "title").sort(() => Math.random() - 0.5).slice(0, 15);
console.log("\nSample assignments (check these by eye):");
for (const s of samples) console.log(`  [${s.how}] ${s.newState.padEnd(18)} <- ${s.title}`);

if (!APPLY) {
  console.log("\nDRY RUN: nothing written. Re-run with --apply to write the changes.");
  process.exit(0);
}

// Apply: one UPDATE per target state, batching ids.
const byState = {};
for (const u of updates) (byState[u.newState] ??= []).push(u.id);

let done = 0;
for (const [state, ids] of Object.entries(byState)) {
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const { error } = await supabase.from("scheme_documents").update({ state }).in("id", chunk);
    if (error) {
      console.error(`Update failed for state=${state}:`, error.message);
      process.exit(1);
    }
    done += chunk.length;
  }
}
console.log(`\nApplied. Updated ${done} rows.`);
