# Evaluation summary (personas-extra-combined; v3)

Generated 2026-11-21T07:14:04.523Z

Personas: 121. Questions per architecture: 375. Model override: default.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V3 — tool-calling + rule engine | 73.9% | 277/375 | 0 | 96 | 24953 | 52475 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V3 — tool-calling + rule engine | 93 | 0 | 184 | 2 |

## Rule-engine agreement with hand labels

858/858 labels agree with lib/eligibility.js (110 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (98)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v3 | x_oldage_85_bpl | 85 with BPL | igndps | not eligible | ERROR |
| v3 | x_oldage_85_bpl | 85 with BPL | ab-pmjay | eligible | ERROR |
| v3 | x_oldage_85_bpl | 85 with BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_widow_up_inc200000 | widow, UP, exactly at strict limit: not eligible | up-widow-pension | not eligible | ERROR |
| v3 | x_dis_18_d_bpl | disabled, exactly at minimum age | pm-sym | eligible | ERROR |
| v3 | x_kisan_land_bpl68 | retired farmer 68, BPL and land | pm-kisan | eligible | not eligible |
| v3 | x_sym_inc_180001 | PM-SYM income 180001, age 30 | pm-sym | not eligible | ERROR |
| v3 | x_sc_zero | SC, zero income | nsp-post-matric-sc | eligible | ERROR |
| v3 | x_sym_inc_180001 | PM-SYM income 180001, age 30 | ignoaps | not eligible | ERROR |
| v3 | x_sc_zero | SC, zero income | pm-sym | eligible | ERROR |
| v3 | x_sc_zero | SC, zero income | igndps | not eligible | ERROR |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pm-kisan | eligible | ERROR |
| v3 | x_pmjay_71_nobpl | 71, no BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pmuy | eligible | ERROR |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | ERROR |
| v3 | x_none_student_gen | General student, 4,00,000 | ignoaps | not eligible | ERROR |
| v3 | x_none_student_gen | General student, 4,00,000 | igndps | not eligible | ERROR |
| v3 | x_none_student_gen | General student, 4,00,000 | pm-kisan | not eligible | ERROR |
| v3 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ignoaps | not eligible | ERROR |
| v3 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ab-pmjay | eligible | ERROR |
| v3 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | igndps | not eligible | ERROR |
| v3 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_dis_17_d_bpl | disabled, one year below minimum age | igndps | not eligible | ERROR |
| v3 | x_dis_17_d_bpl | disabled, one year below minimum age | ignoaps | not eligible | ERROR |
| v3 | x_dis_17_d_bpl | disabled, one year below minimum age | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_widow_up_inc200001 | widow, UP, just over limit | up-widow-pension | not eligible | ERROR |
| v3 | x_widow_up_inc200001 | widow, UP, just over limit | igndps | not eligible | ERROR |
| v3 | x_widow_up_inc200001 | widow, UP, just over limit | ignoaps | not eligible | ERROR |
| v3 | x_pmuy_f62_bpl | woman 62, BPL (also old-age eligible) | pmuy | eligible | ERROR |
| v3 | x_pmuy_f62_bpl | woman 62, BPL (also old-age eligible) | igndps | not eligible | ERROR |
| v3 | x_pmuy_f62_bpl | woman 62, BPL (also old-age eligible) | ignoaps | eligible | ERROR |
| v3 | x_kisan_land_f | woman farmer with land | pm-kisan | eligible | ERROR |
| v3 | x_kisan_land_f | woman farmer with land | pm-sym | eligible | ERROR |
| v3 | x_kisan_land_f | woman farmer with land | igndps | not eligible | ERROR |
| v3 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | pm-sym | not eligible | ERROR |
| v3 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | igndps | not eligible | ERROR |
| v3 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | ignoaps | not eligible | ERROR |
| v3 | x_sc_inc900k | SC, high income | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_sc_inc900k | SC, high income | igndps | not eligible | ERROR |
| v3 | x_sc_inc900k | SC, high income | ignoaps | not eligible | ERROR |
| v3 | x_pmjay_69_nobpl | 69 without BPL | igndps | not eligible | ERROR |
| v3 | x_pmjay_69_nobpl | 69 without BPL | ignoaps | not eligible | ERROR |
| v3 | x_pmjay_69_nobpl | 69 without BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_combo_widow66 | elderly widow, UP, BPL | up-widow-pension | eligible | ERROR |
| v3 | x_combo_widow66 | elderly widow, UP, BPL | ignoaps | eligible | ERROR |
| v3 | x_combo_widow66 | elderly widow, UP, BPL | pmuy | eligible | ERROR |
| v3 | x_none_man45 | man 45, 10,00,000 | ignoaps | not eligible | ERROR |
| v3 | x_none_man45 | man 45, 10,00,000 | igndps | not eligible | ERROR |
| v3 | x_none_man45 | man 45, 10,00,000 | pm-kisan | not eligible | ERROR |
| v3 | x_oldage_61_bpl | one year above cut-off, BPL | ignoaps | eligible | ERROR |
| v3 | x_oldage_61_bpl | one year above cut-off, BPL | igndps | not eligible | ERROR |
| v3 | x_oldage_61_bpl | one year above cut-off, BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | x_dis_30_d_nobpl | disabled adult without BPL | igndps | not eligible | ERROR |
| v3 | x_dis_30_d_nobpl | disabled adult without BPL | pm-sym | eligible | ERROR |
| v3 | x_dis_30_d_nobpl | disabled adult without BPL | ignoaps | not eligible | ERROR |
| v3 | x_widow_delhi | widow, low income, wrong state (Delhi) | up-widow-pension | not eligible | ERROR |
| v3 | x_widow_delhi | widow, low income, wrong state (Delhi) | igndps | not eligible | ERROR |
| v3 | x_widow_delhi | widow, low income, wrong state (Delhi) | ignoaps | not eligible | ERROR |
| v3 | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | pmuy | eligible | ERROR |
| v3 | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | igndps | not eligible | ERROR |
| v3 | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | pm-sym | eligible | ERROR |
| v3 | x_kisan_landless_bpl | landless farmer with BPL | pm-kisan | not eligible | ERROR |
| v3 | x_kisan_landless_bpl | landless farmer with BPL | igndps | not eligible | ERROR |
| v3 | x_kisan_landless_bpl | landless farmer with BPL | ignoaps | not eligible | ERROR |
| v3 | x_sym_age_40 | PM-SYM age 40, income 1,20,000 | pm-sym | eligible | ERROR |
| v3 | x_sym_age_40 | PM-SYM age 40, income 1,20,000 | igndps | not eligible | ERROR |
| v3 | x_sym_age_40 | PM-SYM age 40, income 1,20,000 | ignoaps | not eligible | ERROR |
| v3 | x_sc_farmer45 | SC farmer 45 | nsp-post-matric-sc | eligible | ERROR |
| v3 | x_sc_farmer45 | SC farmer 45 | pm-kisan | eligible | ERROR |
| v3 | x_sc_farmer45 | SC farmer 45 | igndps | not eligible | ERROR |
| v3 | x_pmjay_80_nobpl | 80, no BPL | ab-pmjay | eligible | ERROR |
| v3 | x_pmjay_80_nobpl | 80, no BPL | igndps | not eligible | ERROR |
| v3 | x_pmjay_80_nobpl | 80, no BPL | ignoaps | not eligible | ERROR |
| v3 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
| v3 | ramesh | near-miss: age 66 but no BPL card, so old-age pension fails | igndps | not eligible | ERROR |
| v3 | fatima | clear positive: SC scholarship + Ujjwala | pmuy | eligible | ERROR |
| v3 | widow_up_200000 | income exactly at widow-pension limit (strict lt, so NOT eligible) | pmuy | eligible | ERROR |
| v3 | widow_wrong_state | wrong state: meets every widow-pension criterion except state | pmuy | eligible | ERROR |
| v3 | bhola_noland | near-miss: occupation farmer but landOwned = false | igndps | not eligible | ERROR |
| v3 | bhola_noland | near-miss: occupation farmer but landOwned = false | ignoaps | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | igndps | not eligible | ERROR |
| v3 | bhola_noland | near-miss: occupation farmer but landOwned = false | pm-kisan | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | ignoaps | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | ignoaps | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | igndps | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | pm-sym | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ignoaps | not eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ab-pmjay | eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | igndps | not eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ignoaps | not eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | karan_none | clearly eligible for none of the focus schemes | ignoaps | not eligible | ERROR |
| v3 | karan_none | clearly eligible for none of the focus schemes | igndps | not eligible | ERROR |
| v3 | karan_none | clearly eligible for none of the focus schemes | up-widow-pension | not eligible | ERROR |
| v3 | karan_none | clearly eligible for none of the focus schemes | pmuy | not eligible | ERROR |
