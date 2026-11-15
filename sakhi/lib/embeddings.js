// // lib/embeddings.js
// //
// // Thin wrapper around Gemini's embedding model, shared by the ingestion
// // script (lib/embeddings.js -> scripts/ingest-schemes.js) and the live
// // query path (lib/ragSearch.js). Uses the same GEMINI_API_KEY the rest of
// // the app already reads — no new env var or dependency needed.

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const EMBEDDING_MODEL = "gemini-embedding-001";
// const EMBEDDING_DIMENSIONS = 3072;

// let embeddingModel = null;

// function getEmbeddingModel() {
//   if (!process.env.GEMINI_API_KEY) return null;

//   if (!embeddingModel) {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
//   }

//   return embeddingModel;
// }

// /**
//  * Embeds a single string. `taskType` should be "RETRIEVAL_DOCUMENT" when
//  * embedding corpus chunks at ingest time, and "RETRIEVAL_QUERY" when
//  * embedding a citizen's question at search time — Gemini's embedding model
//  * is trained asymmetrically, so matching these correctly meaningfully
//  * improves retrieval quality over using the same task type for both.
//  *
//  * Returns null (rather than throwing) if GEMINI_API_KEY isn't set, so
//  * callers can fall back to keyword search — same "degrade, don't crash"
//  * pattern as lib/supabase.js.
//  */
// export async function embedText(text, taskType = "RETRIEVAL_DOCUMENT") {
//   const model = getEmbeddingModel();
//   if (!model) return null;

//   const result = await model.embedContent({
//     content: { role: "user", parts: [{ text }] },
//     taskType,
//   });

//   return result.embedding.values;
// }

// /**
//  * Embeds many strings sequentially with a small delay between calls to stay
//  * comfortably under the free-tier embedding rate limit. For a corpus in the
//  * thousands this takes a while (that's expected) — run it as a one-off
//  * ingestion job, not on a request path.
//  */
// export async function embedTexts(texts, { taskType = "RETRIEVAL_DOCUMENT", delayMs = 150, onProgress } = {}) {
//   const vectors = [];

//   for (let i = 0; i < texts.length; i++) {
//     vectors.push(await embedText(texts[i], taskType));
//     onProgress?.(i + 1, texts.length);
//     if (delayMs && i < texts.length - 1) {
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }

//   return vectors;
// }

// export { EMBEDDING_DIMENSIONS };


// // lib/embeddings.js
// //
// // Thin wrapper around Gemini's embedding model, shared by the ingestion
// // script (lib/embeddings.js -> scripts/ingest-schemes.js) and the live
// // query path (lib/ragSearch.js). Uses the same GEMINI_API_KEY the rest of
// // the app already reads — no new env var or dependency needed.

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const EMBEDDING_MODEL = "gemini-embedding-001";
// const EMBEDDING_DIMENSIONS = 3072;

// let embeddingModel = null;

// function getEmbeddingModel() {
//   if (!process.env.GEMINI_API_KEY) return null;

//   if (!embeddingModel) {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
//   }

//   return embeddingModel;
// }

// /**
//  * Embeds a single string. `taskType` should be "RETRIEVAL_DOCUMENT" when
//  * embedding corpus chunks at ingest time, and "RETRIEVAL_QUERY" when
//  * embedding a citizen's question at search time — Gemini's embedding model
//  * is trained asymmetrically, so matching these correctly meaningfully
//  * improves retrieval quality over using the same task type for both.
//  *
//  * Returns null (rather than throwing) if GEMINI_API_KEY isn't set, so
//  * callers can fall back to keyword search — same "degrade, don't crash"
//  * pattern as lib/supabase.js.
//  */
// export async function embedText(text, taskType = "RETRIEVAL_DOCUMENT") {
//   const model = getEmbeddingModel();
//   if (!model) return null;

//   const result = await model.embedContent({
//     content: { role: "user", parts: [{ text }] },
//     taskType,
//   });

//   return result.embedding.values;
// }

// /**
//  * Embeds many strings sequentially with a small delay between calls to stay
//  * comfortably under the free-tier embedding rate limit. For a corpus in the
//  * thousands this takes a while (that's expected) — run it as a one-off
//  * ingestion job, not on a request path.
//  */
// export async function embedTexts(texts, { taskType = "RETRIEVAL_DOCUMENT", delayMs = 150, onProgress } = {}) {
//   const vectors = [];

//   for (let i = 0; i < texts.length; i++) {
//     vectors.push(await embedText(texts[i], taskType));
//     onProgress?.(i + 1, texts.length);
//     if (delayMs && i < texts.length - 1) {
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }

//   return vectors;
// }

// export { EMBEDDING_DIMENSIONS };


// lib/embeddings.js
//
// Thin wrapper around Gemini's embedding model, shared by the ingestion
// script (lib/embeddings.js -> scripts/ingest-schemes.js) and the live
// query path (lib/ragSearch.js). Uses the same GEMINI_API_KEY the rest of
// the app already reads — no new env var or dependency needed.
//
// IMPORTANT: the scheme_documents.embedding column is vector(768), and the
// stored corpus vectors were produced by gemini-embedding-001 with
// outputDimensionality = 768. Query-time embeddings MUST use the same model
// and the same dimension, otherwise pgvector rejects the query with
// "different vector dimensions". If you ever change either value, update
// db/rag_schema.sql and re-ingest the whole corpus.

import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768; // gemini-embedding-001 defaults to 3072; we request 768 explicitly

let embeddingModel = null;

function getEmbeddingModel() {
  if (!process.env.GEMINI_API_KEY) return null;

  if (!embeddingModel) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  }

  return embeddingModel;
}

/**
 * Embeds a single string. `taskType` should be "RETRIEVAL_DOCUMENT" when
 * embedding corpus chunks at ingest time, and "RETRIEVAL_QUERY" when
 * embedding a citizen's question at search time — Gemini's embedding model
 * is trained asymmetrically, so matching these correctly meaningfully
 * improves retrieval quality over using the same task type for both.
 *
 * Returns null (rather than throwing) if GEMINI_API_KEY isn't set, so
 * callers can fall back to keyword search — same "degrade, don't crash"
 * pattern as lib/supabase.js.
 *
 * Throws if the API returns a vector of the wrong length, so a dimension
 * mismatch fails loudly instead of silently degrading to keyword search.
 */
export async function embedText(text, taskType = "RETRIEVAL_DOCUMENT") {
  const model = getEmbeddingModel();
  if (!model) return null;

  const result = await model.embedContent({
    content: { role: "user", parts: [{ text }] },
    taskType,
    outputDimensionality: EMBEDDING_DIMENSIONS,
  });

  const values = result.embedding.values;

  if (values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Embedding has ${values.length} dimensions, expected ${EMBEDDING_DIMENSIONS} ` +
        `(check outputDimensionality and the vector(${EMBEDDING_DIMENSIONS}) column).`
    );
  }

  return values;
}

/**
 * embedText with retry + exponential backoff for rate limits (HTTP 429) and
 * transient 5xx errors. Used by embedTexts() so a single throttled call
 * doesn't kill a multi-thousand-document ingest run.
 */
async function embedTextWithRetry(text, taskType, maxRetries = 5) {
  let attempt = 0;

  for (;;) {
    try {
      return await embedText(text, taskType);
    } catch (err) {
      const msg = String(err?.message ?? err);
      const retriable = /429|rate|quota|503|500|overloaded|timeout|fetch failed/i.test(msg);

      if (!retriable || attempt >= maxRetries) throw err;

      const waitMs = Math.min(30000, 1000 * 2 ** attempt); // 1s, 2s, 4s, 8s, 16s (capped at 30s)
      attempt++;
      console.warn(`[embeddings] transient error, retry ${attempt}/${maxRetries} in ${waitMs}ms: ${msg.slice(0, 100)}`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

/**
 * Embeds many strings sequentially with a small delay between calls to stay
 * comfortably under the free-tier embedding rate limit. For a corpus in the
 * thousands this takes a while (that's expected) — run it as a one-off
 * ingestion job, not on a request path.
 *
 * A text that still fails after retries yields null for that slot (the
 * ingest script drops null rows) rather than aborting the whole run.
 */
export async function embedTexts(texts, { taskType = "RETRIEVAL_DOCUMENT", delayMs = 150, onProgress } = {}) {
  const vectors = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      vectors.push(await embedTextWithRetry(texts[i], taskType));
    } catch (err) {
      console.error(`\n[embeddings] giving up on item ${i}: ${String(err?.message ?? err).slice(0, 120)}`);
      vectors.push(null);
    }

    onProgress?.(i + 1, texts.length);

    if (delayMs && i < texts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return vectors;
}

export { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL };
