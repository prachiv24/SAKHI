# Evaluation summary (part4; v1r)

Generated 2026-11-20T06:29:05.989Z

Personas: 21. Questions per architecture: 84. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 88.1% | 74/84 | 0 | 0 | 1125 | 1847 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 27 | 1 | 47 | 9 |

## Rule-engine agreement with hand labels

168/168 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (10)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_dis_25_d_bpl_stu | disabled student, BPL | ab-pmjay | eligible | not eligible |
| v1r | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1r | x_pmuy_f17_bpl | girl aged 17 with BPL household | ab-pmjay | eligible | not eligible |
| v1r | x_dis_25_d_bpl_stu | disabled student, BPL | igndps | eligible | not eligible |
| v1r | x_sym_age_17 | PM-SYM age 17, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_pmjay_40_bpl | 40 with BPL | ab-pmjay | eligible | not eligible |
| v1r | x_oldage_59_bpl | one year below cut-off | ab-pmjay | eligible | not eligible |
| v1r | x_dis_30_d_bpl | disabled adult with BPL | igndps | eligible | not eligible |
| v1r | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v1r | x_dis_70_d_bpl | disabled senior, BPL | igndps | eligible | not eligible |
