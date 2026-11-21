# Evaluation summary (part2; v1r)

Generated 2026-11-20T06:20:04.767Z

Personas: 21. Questions per architecture: 84. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 95.2% | 80/84 | 0 | 0 | 1137 | 1693 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 24 | 0 | 56 | 4 |

## Rule-engine agreement with hand labels

168/168 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (4)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_dis_45_d_bpl_f | disabled woman with BPL | igndps | eligible | not eligible |
| v1r | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | ab-pmjay | eligible | not eligible |
| v1r | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1r | x_dis_17_d_bpl | disabled, one year below minimum age | ab-pmjay | eligible | not eligible |
