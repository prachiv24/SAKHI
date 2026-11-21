# Evaluation summary (personas-extra-combined; v1r)

Generated 2026-11-20T21:03:54.233Z

Personas: 121. Questions per architecture: 375. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 91.2% | 342/375 | 0 | 0 | 795 | 1425 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 95 | 4 | 247 | 29 |

## Rule-engine agreement with hand labels

858/858 labels agree with lib/eligibility.js (110 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (33)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_combo_dis_sc_student | disabled SC student, BPL | igndps | eligible | not eligible |
| v1r | x_dis_59_d_bpl | disabled, 59, BPL | igndps | eligible | not eligible |
| v1r | x_divorced_up_f | divorced woman in UP, low income | pm-sym | eligible | not eligible |
| v1r | x_pmuy_f19_bpl | woman 19, BPL | pm-sym | eligible | not eligible |
| v1r | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_dis_45_d_bpl_f | disabled woman with BPL | igndps | eligible | not eligible |
| v1r | x_pmjay_25_nobpl | 25, no BPL | pm-sym | eligible | not eligible |
| v1r | x_married_up_f | married woman in UP, low income | pm-sym | eligible | not eligible |
| v1r | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1r | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_dis_30_d_nobpl | disabled adult without BPL | pm-sym | eligible | not eligible |
| v1r | x_sc_farmer45 | SC farmer 45 | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_sym_age_40 | PM-SYM age 40, income 1,20,000 | pm-sym | eligible | not eligible |
| v1r | x_dis_30_nd_bpl | BPL adult without disability | pm-sym | eligible | not eligible |
| v1r | x_pmuy_f18_bpl | woman exactly 18, BPL | pm-sym | eligible | not eligible |
| v1r | x_combo_widow_dis | disabled widow, UP, BPL | igndps | eligible | not eligible |
| v1r | x_pmuy_f30_bpl | woman 30, BPL | pm-sym | eligible | not eligible |
| v1r | x_dis_25_d_bpl_stu | disabled student, BPL | igndps | eligible | not eligible |
| v1r | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1r | x_dis_30_d_bpl | disabled adult with BPL | igndps | eligible | not eligible |
| v1r | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v1r | x_dis_70_d_bpl | disabled senior, BPL | igndps | eligible | not eligible |
| v1r | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc100k | SC, 1,00,000 | pm-sym | eligible | not eligible |
| v1r | x_sym_inc_0 | PM-SYM income 0, age 30 | pm-sym | eligible | not eligible |
| v1r | x_sym_inc_100000 | PM-SYM income 100000, age 30 | pm-sym | eligible | not eligible |
| v1r | x_sym_age_39 | PM-SYM age 39, income 1,20,000 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1r | x_sym_age_60 | PM-SYM age 60, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | igndps | eligible | not eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1r | sym_age_40 | age at pm-sym inclusive upper limit (40 is eligible) | pm-sym | eligible | not eligible |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | not eligible |
