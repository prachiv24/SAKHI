# Evaluation summary (personas-extra-combined; v1)

Generated 2026-11-20T16:10:21.493Z

Personas: 100. Questions per architecture: 310. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1 — single-shot | 82.6% | 256/310 | 0 | 0 | 9594 | 22725 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1 — single-shot | 73 | 22 | 183 | 32 |

## Rule-engine agreement with hand labels

710/710 labels agree with lib/eligibility.js (90 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (54)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_dis_18_d_bpl | disabled, exactly at minimum age | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc200000 | widow, UP, exactly at strict limit: not eligible | up-widow-pension | not eligible | eligible |
| v1 | x_pmuy_f30_nobpl | woman 30, no BPL | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f30_nobpl | woman 30, no BPL | pmuy | not eligible | eligible |
| v1 | x_st_inc100k | ST, low income (separate scheme) | pm-sym | eligible | not eligible |
| v1 | x_pmjay_70_nobpl | exactly 70, no BPL | ignoaps | not eligible | eligible |
| v1 | x_combo_dis_sc_student | disabled SC student, BPL | pm-sym | eligible | not eligible |
| v1 | x_divorced_up_f | divorced woman in UP, low income | up-widow-pension | not eligible | eligible |
| v1 | x_divorced_up_f | divorced woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f19_bpl | woman 19, BPL | pm-sym | eligible | not eligible |
| v1 | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | pm-sym | not eligible | eligible |
| v1 | x_sc_f28 | SC woman 28 | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_sc_f28 | SC woman 28 | pm-sym | eligible | not eligible |
| v1 | x_oldage_60_nobpl | at cut-off but no BPL card | ignoaps | not eligible | eligible |
| v1 | x_married_up_f | married woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pmuy | not eligible | eligible |
| v1 | x_kisan_student | student, no land | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_180001 | PM-SYM income 180001, age 30 | pm-sym | not eligible | eligible |
| v1 | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1 | x_pmjay_71_nobpl | 71, no BPL | ignoaps | not eligible | eligible |
| v1 | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ignoaps | not eligible | eligible |
| v1 | x_dis_17_d_bpl | disabled, one year below minimum age | igndps | not eligible | eligible |
| v1 | x_kisan_land_f | woman farmer with land | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | pm-sym | not eligible | eligible |
| v1 | x_pmjay_69_nobpl | 69 without BPL | ignoaps | not eligible | eligible |
| v1 | x_dis_30_d_nobpl | disabled adult without BPL | igndps | not eligible | eligible |
| v1 | x_dis_30_d_nobpl | disabled adult without BPL | pm-sym | eligible | not eligible |
| v1 | x_widow_delhi | widow, low income, wrong state (Delhi) | up-widow-pension | not eligible | eligible |
| v1 | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | pm-sym | eligible | not eligible |
| v1 | x_sc_farmer45 | SC farmer 45 | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_pmjay_80_nobpl | 80, no BPL | ab-pmjay | eligible | not eligible |
| v1 | x_pmjay_80_nobpl | 80, no BPL | ignoaps | not eligible | eligible |
| v1 | x_combo_young_farmer | young landowning farmer, no BPL | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f18_bpl | woman exactly 18, BPL | pm-sym | eligible | not eligible |
| v1 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f30_bpl | woman 30, BPL | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_500000 | PM-SYM income 500000, age 30 | pm-sym | not eligible | eligible |
| v1 | x_sc_inc250000 | SC, exactly at inclusive limit | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_dis_25_d_bpl_stu | disabled student, BPL | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f17_bpl | girl aged 17 with BPL household | pmuy | not eligible | eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ab-pmjay | eligible | not eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ignoaps | not eligible | eligible |
| v1 | x_sc_student19 | SC student 19 | pm-sym | eligible | not eligible |
| v1 | x_combo_rich_senior | wealthy senior 72, no BPL | ab-pmjay | eligible | not eligible |
| v1 | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v1 | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1 | x_oldage_65_nobpl | old enough but no BPL card | ignoaps | not eligible | eligible |
| v1 | x_widow_bihar | widow, low income, wrong state (Bihar) | up-widow-pension | not eligible | eligible |
| v1 | x_unmarried_up_f | unmarried woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_sym_age_18 | PM-SYM age 18, income 1,20,000 | pm-sym | eligible | not eligible |
| v1 | x_gen_inc100k | General, low income | pm-sym | eligible | not eligible |
| v1 | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
