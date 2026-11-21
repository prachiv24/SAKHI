import { supabase } from "../lib/supabase.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { data, error } = await supabase
  .from("scheme_documents")
  .select("scheme_id, content, embedding")
  .eq("scheme_id", "up-widow-pension")
  .single();

if (error) { console.error(error.message); process.exit(1); }

const stored = typeof data.embedding === "string" ? JSON.parse(data.embedding) : data.embedding;
console.log("stored dims:", stored.length);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cos(a, b) {
  let d = 0, x = 0, y = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; x += a[i] ** 2; y += b[i] ** 2; }
  return d / Math.sqrt(x * y);
}

async function tryModel(name, extra = {}) {
  try {
    const m = genAI.getGenerativeModel({ model: name });
    const r = await m.embedContent({
      content: { role: "user", parts: [{ text: data.content }] },
      taskType: "RETRIEVAL_DOCUMENT",
      ...extra,
    });
    const v = r.embedding.values;
    console.log(name, JSON.stringify(extra), "dims", v.length,
      v.length === stored.length ? "COSINE " + cos(v, stored).toFixed(4) : "(dimension differs)");
  } catch (e) {
    console.log(name, JSON.stringify(extra), "ERROR", e.message.slice(0, 150));
  }
}

await tryModel("gemini-embedding-001");
await tryModel("gemini-embedding-001", { outputDimensionality: 768 });
await tryModel("text-embedding-004");