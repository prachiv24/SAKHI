import { readFileSync } from "fs";

const d = JSON.parse(readFileSync("data/corpus/myscheme-schemes.json", "utf-8"));
const arr = Array.isArray(d) ? d : d.schemes ?? d.data;

const r = arr.find((x) => x.level === "State");
console.log("KEYS:", Object.keys(r));

for (const [k, v] of Object.entries(r)) {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  console.log(`${k}: ${s.slice(0, 150)}`);
}