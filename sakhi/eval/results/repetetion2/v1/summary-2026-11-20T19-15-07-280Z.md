# Evaluation summary (personas-extra-combined; v1)

Generated 2026-11-20T19:15:07.284Z

Personas: 100. Questions per architecture: 310. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1 — single-shot | 83.9% | 260/310 | 0 | 0 | 1177 | 1794 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1 — single-shot | 77 | 24 | 183 | 26 |

## Rule-engine agreement with hand labels

709/709 labels agree with lib/eligibility.js (91 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (50)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pmuy | not eligible | eligible |
| v1 | x_kisan_student | student, no land | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_180001 | PM-SYM income 180001, age 30 | pm-sym | not eligible | eligible |
| v1 | x_pmjay_71_nobpl | 71, no BPL | ab-pmjay | eligible | not eligible |
| v1 | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1 | x_pmjay_71_nobpl | 71, no BPL | ignoaps | not eligible | eligible |
| v1 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pm-kisan | eligible | not eligible |
| v1 | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ignoaps | not eligible | eligible |
| v1 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ab-pmjay | eligible | not eligible |
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
| v1 | x_sym_inc_500000 | PM-SYM income 500000, age 30 | pm-sym | not eligible | eligible |
| v1 | x_pmjay_70_bpl | 70 with BPL | ab-pmjay | eligible | not eligible |
| v1 | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f17_bpl | girl aged 17 with BPL household | pmuy | not eligible | eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ab-pmjay | eligible | not eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ignoaps | not eligible | eligible |
| v1 | x_sc_student19 | SC student 19 | pm-sym | eligible | not eligible |
| v1 | x_combo_rich_senior | wealthy senior 72, no BPL | ab-pmjay | eligible | not eligible |
| v1 | x_oldage_59_bpl | one year below cut-off | ignoaps | not eligible | eligible |
| v1 | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v1 | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1 | x_widow_bihar | widow, low income, wrong state (Bihar) | up-widow-pension | not eligible | eligible |
| v1 | x_unmarried_up_f | unmarried woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_sym_age_18 | PM-SYM age 18, income 1,20,000 | pm-sym | eligible | not eligible |
| v1 | x_gen_inc100k | General, low income | pm-sym | eligible | not eligible |
| v1 | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1 | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | pm-sym | not eligible | eligible |
| v1 | x_sym_age_60 | PM-SYM age 60, income 1,20,000 | ignoaps | not eligible | eligible |
| v1 | ramesh | near-miss: age 66 but no BPL card, so old-age pension fails | ignoaps | not eligible | eligible |
| v1 | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1 | kishan_59 | age one year below old-age pension cut-off | ignoaps | not eligible | eligible |
| v1 | fatima | clear positive: SC scholarship + Ujjwala | nsp-post-matric-sc | eligible | not eligible |
| v1 | sym_age_41 | age one above pm-sym upper limit (41 is NOT eligible) | pm-sym | not eligible | eligible |
| v1 | widow_up_200000 | income exactly at widow-pension limit (strict lt, so NOT eligible) | up-widow-pension | not eligible | eligible |
| v1 | widow_wrong_state | wrong state: meets every widow-pension criterion except state | up-widow-pension | not eligible | eligible |
| v1 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | igndps | not eligible | eligible |
| v1 | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | not eligible |
| v1 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ab-pmjay | eligible | not eligible |
