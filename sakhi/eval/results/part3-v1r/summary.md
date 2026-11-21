# Evaluation summary (part3; v1r)

Generated 2026-11-20T06:24:18.294Z

Personas: 21. Questions per architecture: 84. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 86.9% | 73/84 | 0 | 0 | 1201 | 2071 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 21 | 0 | 52 | 11 |

## Rule-engine agreement with hand labels

168/168 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (11)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | pm-sym | eligible | not eligible |
| v1r | x_kisan_landless_bpl | landless farmer with BPL | ab-pmjay | eligible | not eligible |
| v1r | x_dis_30_nd_bpl | BPL adult without disability | ab-pmjay | eligible | not eligible |
| v1r | x_pmuy_f18_bpl | woman exactly 18, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_pmuy_f18_bpl | woman exactly 18, BPL | pm-sym | eligible | not eligible |
| v1r | x_combo_widow_dis | disabled widow, UP, BPL | igndps | eligible | not eligible |
| v1r | x_oldage_58_bpl | two years below cut-off | ab-pmjay | eligible | not eligible |
| v1r | x_dis_19_d_bpl | disabled, one year above minimum | igndps | eligible | not eligible |
| v1r | x_dis_19_d_bpl | disabled, one year above minimum | ab-pmjay | eligible | not eligible |
| v1r | x_pmuy_f30_bpl | woman 30, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_pmuy_f30_bpl | woman 30, BPL | pm-sym | eligible | not eligible |
