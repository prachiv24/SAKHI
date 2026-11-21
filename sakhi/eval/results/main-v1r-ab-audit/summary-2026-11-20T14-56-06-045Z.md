# Evaluation summary (main; v1r)

Generated 2026-11-20T14:56:06.051Z

Personas: 21. Questions per architecture: 64. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 95.3% | 61/64 | 0 | 0 | 8664 | 21251 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 17 | 2 | 44 | 1 |

## Rule-engine agreement with hand labels

148/148 labels agree with lib/eligibility.js (20 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (3)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | igndps | eligible | not eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1r | sym_age_41 | age exactly at pm-sym exclusive upper limit (41 is NOT eligible) | pm-sym | not eligible | eligible |
