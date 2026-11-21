const key = process.env.GEMINI_API_KEY;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=200`);
const { models = [] } = await res.json();
console.log("Models that support generateContent:");
for (const m of models) {
  if (m.supportedGenerationMethods?.includes("generateContent")) console.log(" ", m.name.replace("models/", ""));
}

for (const name of ["gemini-1.5-flash", "gemini-2.0-flash"]) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "say ok" }] }] }),
  });
  console.log(name, "->", r.status, r.status === 200 ? "OK" : "FAILED");
}