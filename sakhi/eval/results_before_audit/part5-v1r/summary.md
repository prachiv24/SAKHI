# Evaluation summary (part5; v1r)

Generated 2026-11-20T06:32:56.972Z

Personas: 16. Questions per architecture: 64. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 92.2% | 59/64 | 0 | 0 | 1171 | 1712 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 10 | 2 | 49 | 3 |

## Rule-engine agreement with hand labels

128/128 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (5)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1r | x_sym_inc_0 | PM-SYM income 0, age 30 | pm-sym | eligible | not eligible |
| v1r | x_gen_inc100k | General, low income | pm-sym | eligible | not eligible |
| v1r | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1r | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | pm-sym | not eligible | eligible |
