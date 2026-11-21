# Evaluation summary (part1; v1r)

Generated 2026-11-20T06:15:03.372Z

Personas: 21. Questions per architecture: 84. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 89.3% | 75/84 | 0 | 0 | 1363 | 2465 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 19 | 1 | 56 | 8 |

## Rule-engine agreement with hand labels

168/168 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (9)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_dis_18_d_bpl | disabled, exactly at minimum age | ab-pmjay | eligible | not eligible |
| v1r | x_combo_dis_sc_student | disabled SC student, BPL | igndps | eligible | not eligible |
| v1r | x_combo_dis_sc_student | disabled SC student, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_oldage_55_bpl | well below old-age cut-off | ab-pmjay | eligible | not eligible |
| v1r | x_dis_59_d_bpl | disabled, 59, BPL | igndps | eligible | not eligible |
| v1r | x_dis_59_d_bpl | disabled, 59, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_pmuy_f19_bpl | woman 19, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_pmjay_25_nobpl | 25, no BPL | pm-sym | eligible | not eligible |
