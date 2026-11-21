# Evaluation summary (personas-extra-combined; v1r)

Generated 2026-11-20T18:40:34.727Z

Personas: 100. Questions per architecture: 310. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 91.3% | 283/310 | 0 | 1 | 1355 | 14905 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 83 | 6 | 200 | 20 |

## Rule-engine agreement with hand labels

709/709 labels agree with lib/eligibility.js (91 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (27)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | x_dis_45_d_bpl_f | disabled woman with BPL | igndps | eligible | not eligible |
| v1r | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1r | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_sym_inc_200000 | PM-SYM income 200000, age 30 | pm-sym | not eligible | eligible |
| v1r | x_sc_farmer45 | SC farmer 45 | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_combo_widow_dis | disabled widow, UP, BPL | igndps | eligible | not eligible |
| v1r | x_dis_19_d_bpl | disabled, one year above minimum | igndps | eligible | not eligible |
| v1r | x_pmuy_f30_bpl | woman 30, BPL | pm-sym | eligible | not eligible |
| v1r | x_dis_25_d_bpl_stu | disabled student, BPL | igndps | eligible | not eligible |
| v1r | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1r | x_sym_age_17 | PM-SYM age 17, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_pmjay_40_bpl | 40 with BPL | pm-sym | eligible | not eligible |
| v1r | x_dis_30_d_bpl | disabled adult with BPL | igndps | eligible | not eligible |
| v1r | x_dis_70_d_bpl | disabled senior, BPL | igndps | eligible | not eligible |
| v1r | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc100k | SC, 1,00,000 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc100k | SC, 1,00,000 | nsp-post-matric-sc | eligible | not eligible |
| v1r | x_sym_inc_0 | PM-SYM income 0, age 30 | pm-sym | eligible | not eligible |
| v1r | x_gen_inc100k | General, low income | pm-sym | eligible | not eligible |
| v1r | x_sym_inc_100000 | PM-SYM income 100000, age 30 | pm-sym | eligible | not eligible |
| v1r | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1r | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | x_sym_age_60 | PM-SYM age 60, income 1,20,000 | pm-sym | not eligible | eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | igndps | eligible | not eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | not eligible |
| v1r | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ignoaps | not eligible | ERROR |
