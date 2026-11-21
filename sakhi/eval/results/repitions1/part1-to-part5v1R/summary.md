# Evaluation summary (personas-extra-combined; v1r)

Generated 2026-11-20T15:31:37.040Z

Personas: 100. Questions per architecture: 310. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 92.9% | 288/310 | 0 | 0 | 8399 | 34359 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 86 | 3 | 202 | 19 |

## Rule-engine agreement with hand labels

710/710 labels agree with lib/eligibility.js (90 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (22)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_dis_18_d_bpl | disabled, exactly at minimum age | igndps | eligible | not eligible |
| v1r | x_st_inc100k | ST, low income (separate scheme) | pm-sym | eligible | not eligible |
| v1r | x_combo_dis_sc_student | disabled SC student, BPL | igndps | eligible | not eligible |
| v1r | x_combo_dis_sc_student | disabled SC student, BPL | pm-sym | eligible | not eligible |
| v1r | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_dis_45_d_bpl_f | disabled woman with BPL | igndps | eligible | not eligible |
| v1r | x_married_up_f | married woman in UP, low income | pm-sym | eligible | not eligible |
| v1r | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1r | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_sym_inc_180000 | PM-SYM income 180000, age 30 | pm-sym | eligible | not eligible |
| v1r | x_combo_widow_dis | disabled widow, UP, BPL | igndps | eligible | not eligible |
| v1r | x_dis_19_d_bpl | disabled, one year above minimum | igndps | eligible | not eligible |
| v1r | x_dis_25_d_bpl_stu | disabled student, BPL | igndps | eligible | not eligible |
| v1r | x_dis_30_d_bpl | disabled adult with BPL | igndps | eligible | not eligible |
| v1r | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v1r | x_dis_70_d_bpl | disabled senior, BPL | igndps | eligible | not eligible |
| v1r | x_sym_inc_0 | PM-SYM income 0, age 30 | pm-sym | eligible | not eligible |
| v1r | x_gen_inc100k | General, low income | pm-sym | eligible | not eligible |
| v1r | x_sym_inc_100000 | PM-SYM income 100000, age 30 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1r | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_dis_30_nd_bpl | BPL adult without disability | pm-sym | eligible | not eligible |
