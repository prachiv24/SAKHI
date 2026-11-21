# Evaluation summary

Generated 2026-11-19T12:21:50.888Z

Personas: 21. Questions per architecture: 84. Ground truth: hand-labelled expected eligibility (eval/personas.js).
Questions per persona: 4.

| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |
|---|---|---|---|---|---|
| V1 — single-shot | 82.1% | 69/84 | 0.0% | 0 | 1963 |
| V2 — RAG single-shot | 79.8% | 67/84 | 16.7% | 0 | 3452 |
| V3 — multi-agent | 98.8% | 83/84 | 0.0% | 0 | 10379 |

## Confusion matrix (positive class = "eligible")

| Architecture | True Positive | False Positive | True Negative | False Negative |
|---|---|---|---|---|
| V1 — single-shot | 21 | 8 | 48 | 7 |
| V2 — RAG single-shot | 23 | 1 | 44 | 2 |
| V3 — multi-agent | 27 | 0 | 56 | 1 |

## Rule-engine agreement with hand labels

168/168 (persona, scheme) labels agree with lib/eligibility.js.


## Wrong, unclear or errored answers (33)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_married_up_f | married woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pmuy | not eligible | eligible |
| v2 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | igndps | not eligible | unclear |
| v2 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pm-sym | eligible | not eligible |
| v1 | x_kisan_student | student, no land | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_180001 | PM-SYM income 180001, age 30 | pm-sym | not eligible | eligible |
| v1 | x_sc_zero | SC, zero income | pm-sym | eligible | not eligible |
| v1 | x_pmjay_71_nobpl | 71, no BPL | ab-pmjay | eligible | not eligible |
| v2 | x_pmjay_71_nobpl | 71, no BPL | igndps | not eligible | unclear |
| v1 | x_pmjay_71_nobpl | 71, no BPL | ignoaps | not eligible | eligible |
| v2 | x_pmjay_71_nobpl | 71, no BPL | ignoaps | not eligible | unclear |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pm-kisan | eligible | not eligible |
| v1 | x_combo_sc_woman_farmer | SC woman farmer, BPL | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ignoaps | not eligible | eligible |
| v2 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ignoaps | not eligible | unclear |
| v1 | x_oldage_70_nobpl | 70, no BPL: pension fails, AB-PMJAY age route holds | ab-pmjay | eligible | not eligible |
| v2 | x_dis_17_d_bpl | disabled, one year below minimum age | ab-pmjay | eligible | not eligible |
| v2 | x_widow_up_inc200001 | widow, UP, just over limit | igndps | not eligible | unclear |
| v2 | x_widow_up_inc200001 | widow, UP, just over limit | ignoaps | not eligible | unclear |
| v2 | x_pmuy_f62_bpl | woman 62, BPL (also old-age eligible) | ignoaps | eligible | unclear |
| v1 | x_kisan_land_f | woman farmer with land | pm-sym | eligible | not eligible |
| v2 | x_kisan_land_f | woman farmer with land | ab-pmjay | not eligible | eligible |
| v1 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | pm-sym | not eligible | eligible |
| v2 | x_sym_inc_200000 | PM-SYM income 200000, age 30 | ignoaps | not eligible | unclear |
| v2 | x_sc_inc900k | SC, high income | ignoaps | not eligible | unclear |
| v1 | x_pmjay_69_nobpl | 69 without BPL | ignoaps | not eligible | eligible |
| v2 | x_pmjay_69_nobpl | 69 without BPL | ignoaps | not eligible | unclear |
| v2 | x_combo_widow66 | elderly widow, UP, BPL | ignoaps | eligible | unclear |
| v2 | x_none_man45 | man 45, 10,00,000 | ignoaps | not eligible | unclear |
| v2 | x_oldage_61_bpl | one year above cut-off, BPL | ignoaps | eligible | unclear |
| v2 | x_oldage_61_bpl | one year above cut-off, BPL | igndps | not eligible | unclear |
| v1 | x_dis_30_d_nobpl | disabled adult without BPL | igndps | not eligible | eligible |
| v1 | x_dis_30_d_nobpl | disabled adult without BPL | ab-pmjay | not eligible | eligible |

## Raw per-question results

| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |
|---|---|---|---|---|---|---|
| v1 | x_dis_45_d_bpl_f | igndps | eligible | eligible | ✓ | 1456 |
| v2 | x_dis_45_d_bpl_f | igndps | eligible | eligible | ✓ | 2447 |
| v3 | x_dis_45_d_bpl_f | igndps | eligible | eligible | ✓ | 3418 |
| v1 | x_dis_45_d_bpl_f | ab-pmjay | eligible | eligible | ✓ | 1197 |
| v2 | x_dis_45_d_bpl_f | ab-pmjay | eligible | eligible | ✓ | 2395 |
| v3 | x_dis_45_d_bpl_f | ab-pmjay | eligible | eligible | ✓ | 4308 |
| v1 | x_dis_45_d_bpl_f | ignoaps | not eligible | not eligible | ✓ | 1053 |
| v2 | x_dis_45_d_bpl_f | ignoaps | not eligible | not eligible | ✓ | 2933 |
| v3 | x_dis_45_d_bpl_f | ignoaps | not eligible | not eligible | ✓ | 5195 |
| v1 | x_dis_45_d_bpl_f | pmuy | eligible | eligible | ✓ | 1045 |
| v2 | x_dis_45_d_bpl_f | pmuy | eligible | eligible | ✓ | 2126 |
| v3 | x_dis_45_d_bpl_f | pmuy | eligible | eligible | ✓ | 3574 |
| v1 | x_married_up_f | up-widow-pension | not eligible | not eligible | ✓ | 1056 |
| v2 | x_married_up_f | up-widow-pension | not eligible | not eligible | ✓ | 2001 |
| v3 | x_married_up_f | up-widow-pension | not eligible | not eligible | ✓ | 3273 |
| v1 | x_married_up_f | pm-sym | eligible | not eligible | ✗ | 1336 |
| v2 | x_married_up_f | pm-sym | eligible | eligible | ✓ | 3045 |
| v3 | x_married_up_f | pm-sym | eligible | eligible | ✓ | 18734 |
| v1 | x_married_up_f | ab-pmjay | not eligible | not eligible | ✓ | 1859 |
| v2 | x_married_up_f | ab-pmjay | not eligible | not eligible | ✓ | 2883 |
| v3 | x_married_up_f | ab-pmjay | not eligible | not eligible | ✓ | 4642 |
| v1 | x_married_up_f | igndps | not eligible | not eligible | ✓ | 1162 |
| v2 | x_married_up_f | igndps | not eligible | not eligible | ✓ | 2451 |
| v3 | x_married_up_f | igndps | not eligible | not eligible | ✓ | 5407 |
| v1 | x_pmuy_m30_bpl | pmuy | not eligible | eligible | ✗ | 1226 |
| v2 | x_pmuy_m30_bpl | pmuy | not eligible | not eligible | ✓ | 3042 |
| v3 | x_pmuy_m30_bpl | pmuy | not eligible | not eligible | ✓ | 6430 |
| v1 | x_pmuy_m30_bpl | ab-pmjay | eligible | eligible | ✓ | 1179 |
| v2 | x_pmuy_m30_bpl | ab-pmjay | eligible | eligible | ✓ | 1457 |
| v3 | x_pmuy_m30_bpl | ab-pmjay | eligible | eligible | ✓ | 4596 |
| v1 | x_pmuy_m30_bpl | igndps | not eligible | not eligible | ✓ | 947 |
| v2 | x_pmuy_m30_bpl | igndps | not eligible | unclear | ✗ | 2767 |
| v3 | x_pmuy_m30_bpl | igndps | not eligible | not eligible | ✓ | 4717 |
| v1 | x_pmuy_m30_bpl | pm-sym | eligible | eligible | ✓ | 1196 |
| v2 | x_pmuy_m30_bpl | pm-sym | eligible | not eligible | ✗ | 2292 |
| v3 | x_pmuy_m30_bpl | pm-sym | eligible | eligible | ✓ | 14602 |
| v1 | x_kisan_student | pm-kisan | not eligible | not eligible | ✓ | 1421 |
| v2 | x_kisan_student | pm-kisan | not eligible | not eligible | ✓ | 2269 |
| v3 | x_kisan_student | pm-kisan | not eligible | not eligible | ✓ | 4841 |
| v1 | x_kisan_student | pm-sym | eligible | not eligible | ✗ | 1354 |
| v2 | x_kisan_student | pm-sym | eligible | eligible | ✓ | 2886 |
| v3 | x_kisan_student | pm-sym | eligible | eligible | ✓ | 4321 |
| v1 | x_kisan_student | ab-pmjay | not eligible | not eligible | ✓ | 1588 |
| v2 | x_kisan_student | ab-pmjay | not eligible | not eligible | ✓ | 2360 |
| v3 | x_kisan_student | ab-pmjay | not eligible | not eligible | ✓ | 3419 |
| v1 | x_kisan_student | igndps | not eligible | not eligible | ✓ | 1209 |
| v2 | x_kisan_student | igndps | not eligible | not eligible | ✓ | 1957 |
| v3 | x_kisan_student | igndps | not eligible | not eligible | ✓ | 22159 |
| v1 | x_sym_inc_180001 | pm-sym | not eligible | eligible | ✗ | 2070 |
| v2 | x_sym_inc_180001 | pm-sym | not eligible | not eligible | ✓ | 1844 |
| v3 | x_sym_inc_180001 | pm-sym | not eligible | not eligible | ✓ | 5342 |
| v1 | x_sym_inc_180001 | ab-pmjay | not eligible | not eligible | ✓ | 1395 |
| v2 | x_sym_inc_180001 | ab-pmjay | not eligible | not eligible | ✓ | 2431 |
| v3 | x_sym_inc_180001 | ab-pmjay | not eligible | not eligible | ✓ | 3685 |
| v1 | x_sym_inc_180001 | igndps | not eligible | not eligible | ✓ | 1100 |
| v2 | x_sym_inc_180001 | igndps | not eligible | not eligible | ✓ | 2301 |
| v3 | x_sym_inc_180001 | igndps | not eligible | not eligible | ✓ | 14502 |
| v1 | x_sym_inc_180001 | ignoaps | not eligible | not eligible | ✓ | 1533 |
| v2 | x_sym_inc_180001 | ignoaps | not eligible | not eligible | ✓ | 2592 |
| v3 | x_sym_inc_180001 | ignoaps | not eligible | not eligible | ✓ | 4882 |
| v1 | x_sc_zero | nsp-post-matric-sc | eligible | eligible | ✓ | 1094 |
| v2 | x_sc_zero | nsp-post-matric-sc | eligible | eligible | ✓ | 2747 |
| v3 | x_sc_zero | nsp-post-matric-sc | eligible | eligible | ✓ | 4324 |
| v1 | x_sc_zero | pm-sym | eligible | not eligible | ✗ | 1575 |
| v2 | x_sc_zero | pm-sym | eligible | eligible | ✓ | 2497 |
| v3 | x_sc_zero | pm-sym | eligible | eligible | ✓ | 4452 |
| v1 | x_sc_zero | ab-pmjay | not eligible | not eligible | ✓ | 1742 |
| v2 | x_sc_zero | ab-pmjay | not eligible | not eligible | ✓ | 2674 |
| v3 | x_sc_zero | ab-pmjay | not eligible | not eligible | ✓ | 4584 |
| v1 | x_sc_zero | igndps | not eligible | not eligible | ✓ | 1215 |
| v2 | x_sc_zero | igndps | not eligible | not eligible | ✓ | 2149 |
| v3 | x_sc_zero | igndps | not eligible | not eligible | ✓ | 5561 |
| v1 | x_pmjay_71_nobpl | ab-pmjay | eligible | not eligible | ✗ | 1687 |
| v2 | x_pmjay_71_nobpl | ab-pmjay | eligible | eligible | ✓ | 2517 |
| v3 | x_pmjay_71_nobpl | ab-pmjay | eligible | eligible | ✓ | 2798 |
| v1 | x_pmjay_71_nobpl | igndps | not eligible | not eligible | ✓ | 1361 |
| v2 | x_pmjay_71_nobpl | igndps | not eligible | unclear | ✗ | 4495 |
| v3 | x_pmjay_71_nobpl | igndps | not eligible | not eligible | ✓ | 5129 |
| v1 | x_pmjay_71_nobpl | ignoaps | not eligible | eligible | ✗ | 1178 |
| v2 | x_pmjay_71_nobpl | ignoaps | not eligible | unclear | ✗ | 1897 |
| v3 | x_pmjay_71_nobpl | ignoaps | not eligible | not eligible | ✓ | 4231 |
| v1 | x_pmjay_71_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1028 |
| v2 | x_pmjay_71_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1723 |
| v3 | x_pmjay_71_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 4562 |
| v1 | x_combo_sc_woman_farmer | pm-kisan | eligible | eligible | ✓ | 2306 |
| v2 | x_combo_sc_woman_farmer | pm-kisan | eligible | eligible | ✓ | 2231 |
| v3 | x_combo_sc_woman_farmer | pm-kisan | eligible | not eligible | ✗ | 25112 |
| v1 | x_combo_sc_woman_farmer | pmuy | eligible | eligible | ✓ | 1270 |
| v2 | x_combo_sc_woman_farmer | pmuy | eligible | eligible | ✓ | 2876 |
| v3 | x_combo_sc_woman_farmer | pmuy | eligible | eligible | ✓ | 12343 |
| v1 | x_combo_sc_woman_farmer | nsp-post-matric-sc | eligible | not eligible | ✗ | 1064 |
| v2 | x_combo_sc_woman_farmer | nsp-post-matric-sc | eligible | eligible | ✓ | 2364 |
| v3 | x_combo_sc_woman_farmer | nsp-post-matric-sc | eligible | eligible | ✓ | 3952 |
| v1 | x_combo_sc_woman_farmer | ab-pmjay | eligible | eligible | ✓ | 1419 |
| v2 | x_combo_sc_woman_farmer | ab-pmjay | eligible | eligible | ✓ | 2144 |
| v3 | x_combo_sc_woman_farmer | ab-pmjay | eligible | eligible | ✓ | 3442 |
| v1 | x_none_student_gen | ignoaps | not eligible | not eligible | ✓ | 1070 |
| v2 | x_none_student_gen | ignoaps | not eligible | not eligible | ✓ | 2879 |
| v3 | x_none_student_gen | ignoaps | not eligible | not eligible | ✓ | 4353 |
| v1 | x_none_student_gen | igndps | not eligible | not eligible | ✓ | 659 |
| v2 | x_none_student_gen | igndps | not eligible | not eligible | ✓ | 1981 |
| v3 | x_none_student_gen | igndps | not eligible | not eligible | ✓ | 4530 |
| v1 | x_none_student_gen | pm-kisan | not eligible | not eligible | ✓ | 749 |
| v2 | x_none_student_gen | pm-kisan | not eligible | not eligible | ✓ | 2152 |
| v3 | x_none_student_gen | pm-kisan | not eligible | not eligible | ✓ | 4835 |
| v1 | x_none_student_gen | ab-pmjay | not eligible | not eligible | ✓ | 1382 |
| v2 | x_none_student_gen | ab-pmjay | not eligible | not eligible | ✓ | 3241 |
| v3 | x_none_student_gen | ab-pmjay | not eligible | not eligible | ✓ | 15569 |
| v1 | x_oldage_70_nobpl | ignoaps | not eligible | eligible | ✗ | 1338 |
| v2 | x_oldage_70_nobpl | ignoaps | not eligible | unclear | ✗ | 2490 |
| v3 | x_oldage_70_nobpl | ignoaps | not eligible | not eligible | ✓ | 11480 |
| v1 | x_oldage_70_nobpl | ab-pmjay | eligible | not eligible | ✗ | 1521 |
| v2 | x_oldage_70_nobpl | ab-pmjay | eligible | eligible | ✓ | 3159 |
| v3 | x_oldage_70_nobpl | ab-pmjay | eligible | eligible | ✓ | 18281 |
| v1 | x_oldage_70_nobpl | igndps | not eligible | not eligible | ✓ | 1221 |
| v2 | x_oldage_70_nobpl | igndps | not eligible | not eligible | ✓ | 2136 |
| v3 | x_oldage_70_nobpl | igndps | not eligible | not eligible | ✓ | 4507 |
| v1 | x_oldage_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1340 |
| v2 | x_oldage_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2119 |
| v3 | x_oldage_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 7872 |
| v1 | x_dis_17_d_bpl | igndps | not eligible | not eligible | ✓ | 1054 |
| v2 | x_dis_17_d_bpl | igndps | not eligible | not eligible | ✓ | 2252 |
| v3 | x_dis_17_d_bpl | igndps | not eligible | not eligible | ✓ | 5090 |
| v1 | x_dis_17_d_bpl | ab-pmjay | eligible | eligible | ✓ | 4944 |
| v2 | x_dis_17_d_bpl | ab-pmjay | eligible | not eligible | ✗ | 2856 |
| v3 | x_dis_17_d_bpl | ab-pmjay | eligible | eligible | ✓ | 17682 |
| v1 | x_dis_17_d_bpl | ignoaps | not eligible | not eligible | ✓ | 3672 |
| v2 | x_dis_17_d_bpl | ignoaps | not eligible | not eligible | ✓ | 3063 |
| v3 | x_dis_17_d_bpl | ignoaps | not eligible | not eligible | ✓ | 3144 |
| v1 | x_dis_17_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1053 |
| v2 | x_dis_17_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1731 |
| v3 | x_dis_17_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 81095 |
| v1 | x_widow_up_inc200001 | up-widow-pension | not eligible | not eligible | ✓ | 1403 |
| v2 | x_widow_up_inc200001 | up-widow-pension | not eligible | not eligible | ✓ | 2661 |
| v3 | x_widow_up_inc200001 | up-widow-pension | not eligible | not eligible | ✓ | 4719 |
| v1 | x_widow_up_inc200001 | ab-pmjay | not eligible | not eligible | ✓ | 1168 |
| v2 | x_widow_up_inc200001 | ab-pmjay | not eligible | not eligible | ✓ | 1999 |
| v3 | x_widow_up_inc200001 | ab-pmjay | not eligible | not eligible | ✓ | 5524 |
| v1 | x_widow_up_inc200001 | igndps | not eligible | not eligible | ✓ | 1591 |
| v2 | x_widow_up_inc200001 | igndps | not eligible | unclear | ✗ | 2108 |
| v3 | x_widow_up_inc200001 | igndps | not eligible | not eligible | ✓ | 3700 |
| v1 | x_widow_up_inc200001 | ignoaps | not eligible | not eligible | ✓ | 669 |
| v2 | x_widow_up_inc200001 | ignoaps | not eligible | unclear | ✗ | 2803 |
| v3 | x_widow_up_inc200001 | ignoaps | not eligible | not eligible | ✓ | 10950 |
| v1 | x_pmuy_f62_bpl | pmuy | eligible | eligible | ✓ | 1437 |
| v2 | x_pmuy_f62_bpl | pmuy | eligible | eligible | ✓ | 2797 |
| v3 | x_pmuy_f62_bpl | pmuy | eligible | eligible | ✓ | 22522 |
| v1 | x_pmuy_f62_bpl | ab-pmjay | eligible | eligible | ✓ | 1333 |
| v2 | x_pmuy_f62_bpl | ab-pmjay | eligible | eligible | ✓ | 3221 |
| v3 | x_pmuy_f62_bpl | ab-pmjay | eligible | eligible | ✓ | 3086 |
| v1 | x_pmuy_f62_bpl | igndps | not eligible | not eligible | ✓ | 1064 |
| v2 | x_pmuy_f62_bpl | igndps | not eligible | not eligible | ✓ | 6804 |
| v3 | x_pmuy_f62_bpl | igndps | not eligible | not eligible | ✓ | 3963 |
| v1 | x_pmuy_f62_bpl | ignoaps | eligible | eligible | ✓ | 1066 |
| v2 | x_pmuy_f62_bpl | ignoaps | eligible | unclear | ✗ | 1942 |
| v3 | x_pmuy_f62_bpl | ignoaps | eligible | eligible | ✓ | 9023 |
| v1 | x_kisan_land_f | pm-kisan | eligible | eligible | ✓ | 2035 |
| v2 | x_kisan_land_f | pm-kisan | eligible | eligible | ✓ | 2902 |
| v3 | x_kisan_land_f | pm-kisan | eligible | eligible | ✓ | 4126 |
| v1 | x_kisan_land_f | pm-sym | eligible | not eligible | ✗ | 1044 |
| v2 | x_kisan_land_f | pm-sym | eligible | eligible | ✓ | 1639 |
| v3 | x_kisan_land_f | pm-sym | eligible | eligible | ✓ | 4367 |
| v1 | x_kisan_land_f | ab-pmjay | not eligible | not eligible | ✓ | 1091 |
| v2 | x_kisan_land_f | ab-pmjay | not eligible | eligible | ✗ | 2387 |
| v3 | x_kisan_land_f | ab-pmjay | not eligible | not eligible | ✓ | 12389 |
| v1 | x_kisan_land_f | igndps | not eligible | not eligible | ✓ | 1123 |
| v2 | x_kisan_land_f | igndps | not eligible | not eligible | ✓ | 2228 |
| v3 | x_kisan_land_f | igndps | not eligible | not eligible | ✓ | 7483 |
| v1 | x_sym_inc_200000 | pm-sym | not eligible | eligible | ✗ | 805 |
| v2 | x_sym_inc_200000 | pm-sym | not eligible | not eligible | ✓ | 5348 |
| v3 | x_sym_inc_200000 | pm-sym | not eligible | not eligible | ✓ | 21423 |
| v1 | x_sym_inc_200000 | ab-pmjay | not eligible | not eligible | ✓ | 949 |
| v2 | x_sym_inc_200000 | ab-pmjay | not eligible | not eligible | ✓ | 7639 |
| v3 | x_sym_inc_200000 | ab-pmjay | not eligible | not eligible | ✓ | 19737 |
| v1 | x_sym_inc_200000 | igndps | not eligible | not eligible | ✓ | 5999 |
| v2 | x_sym_inc_200000 | igndps | not eligible | not eligible | ✓ | 2253 |
| v3 | x_sym_inc_200000 | igndps | not eligible | not eligible | ✓ | 14566 |
| v1 | x_sym_inc_200000 | ignoaps | not eligible | not eligible | ✓ | 1184 |
| v2 | x_sym_inc_200000 | ignoaps | not eligible | unclear | ✗ | 1848 |
| v3 | x_sym_inc_200000 | ignoaps | not eligible | not eligible | ✓ | 3551 |
| v1 | x_sc_inc900k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1115 |
| v2 | x_sc_inc900k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2301 |
| v3 | x_sc_inc900k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 3797 |
| v1 | x_sc_inc900k | ab-pmjay | not eligible | not eligible | ✓ | 1068 |
| v2 | x_sc_inc900k | ab-pmjay | not eligible | not eligible | ✓ | 5024 |
| v3 | x_sc_inc900k | ab-pmjay | not eligible | not eligible | ✓ | 5857 |
| v1 | x_sc_inc900k | igndps | not eligible | not eligible | ✓ | 2032 |
| v2 | x_sc_inc900k | igndps | not eligible | not eligible | ✓ | 2890 |
| v3 | x_sc_inc900k | igndps | not eligible | not eligible | ✓ | 5226 |
| v1 | x_sc_inc900k | ignoaps | not eligible | not eligible | ✓ | 2296 |
| v2 | x_sc_inc900k | ignoaps | not eligible | unclear | ✗ | 5786 |
| v3 | x_sc_inc900k | ignoaps | not eligible | not eligible | ✓ | 16898 |
| v1 | x_pmjay_69_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 3122 |
| v2 | x_pmjay_69_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 4656 |
| v3 | x_pmjay_69_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 13771 |
| v1 | x_pmjay_69_nobpl | igndps | not eligible | not eligible | ✓ | 1066 |
| v2 | x_pmjay_69_nobpl | igndps | not eligible | not eligible | ✓ | 2167 |
| v3 | x_pmjay_69_nobpl | igndps | not eligible | not eligible | ✓ | 9406 |
| v1 | x_pmjay_69_nobpl | ignoaps | not eligible | eligible | ✗ | 1532 |
| v2 | x_pmjay_69_nobpl | ignoaps | not eligible | unclear | ✗ | 2765 |
| v3 | x_pmjay_69_nobpl | ignoaps | not eligible | not eligible | ✓ | 4608 |
| v1 | x_pmjay_69_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2059 |
| v2 | x_pmjay_69_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 3820 |
| v3 | x_pmjay_69_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 13036 |
| v1 | x_combo_widow66 | up-widow-pension | eligible | eligible | ✓ | 8203 |
| v2 | x_combo_widow66 | up-widow-pension | eligible | eligible | ✓ | 8406 |
| v3 | x_combo_widow66 | up-widow-pension | eligible | eligible | ✓ | 10671 |
| v1 | x_combo_widow66 | ignoaps | eligible | eligible | ✓ | 2508 |
| v2 | x_combo_widow66 | ignoaps | eligible | unclear | ✗ | 3162 |
| v3 | x_combo_widow66 | ignoaps | eligible | eligible | ✓ | 6050 |
| v1 | x_combo_widow66 | pmuy | eligible | eligible | ✓ | 6402 |
| v2 | x_combo_widow66 | pmuy | eligible | eligible | ✓ | 1967 |
| v3 | x_combo_widow66 | pmuy | eligible | eligible | ✓ | 7714 |
| v1 | x_combo_widow66 | ab-pmjay | eligible | eligible | ✓ | 1388 |
| v2 | x_combo_widow66 | ab-pmjay | eligible | eligible | ✓ | 2263 |
| v3 | x_combo_widow66 | ab-pmjay | eligible | eligible | ✓ | 4352 |
| v1 | x_none_man45 | ignoaps | not eligible | not eligible | ✓ | 1284 |
| v2 | x_none_man45 | ignoaps | not eligible | unclear | ✗ | 2210 |
| v3 | x_none_man45 | ignoaps | not eligible | not eligible | ✓ | 7626 |
| v1 | x_none_man45 | igndps | not eligible | not eligible | ✓ | 6004 |
| v2 | x_none_man45 | igndps | not eligible | not eligible | ✓ | 3274 |
| v3 | x_none_man45 | igndps | not eligible | not eligible | ✓ | 9772 |
| v1 | x_none_man45 | pm-kisan | not eligible | not eligible | ✓ | 1059 |
| v2 | x_none_man45 | pm-kisan | not eligible | not eligible | ✓ | 7414 |
| v3 | x_none_man45 | pm-kisan | not eligible | not eligible | ✓ | 16416 |
| v1 | x_none_man45 | ab-pmjay | not eligible | not eligible | ✓ | 5225 |
| v2 | x_none_man45 | ab-pmjay | not eligible | not eligible | ✓ | 10730 |
| v3 | x_none_man45 | ab-pmjay | not eligible | not eligible | ✓ | 11614 |
| v1 | x_oldage_61_bpl | ignoaps | eligible | eligible | ✓ | 3133 |
| v2 | x_oldage_61_bpl | ignoaps | eligible | unclear | ✗ | 6953 |
| v3 | x_oldage_61_bpl | ignoaps | eligible | eligible | ✓ | 19329 |
| v1 | x_oldage_61_bpl | ab-pmjay | eligible | eligible | ✓ | 1538 |
| v2 | x_oldage_61_bpl | ab-pmjay | eligible | eligible | ✓ | 7958 |
| v3 | x_oldage_61_bpl | ab-pmjay | eligible | eligible | ✓ | 25137 |
| v1 | x_oldage_61_bpl | igndps | not eligible | not eligible | ✓ | 4869 |
| v2 | x_oldage_61_bpl | igndps | not eligible | unclear | ✗ | 13864 |
| v3 | x_oldage_61_bpl | igndps | not eligible | not eligible | ✓ | 24075 |
| v1 | x_oldage_61_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 4870 |
| v2 | x_oldage_61_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 5464 |
| v3 | x_oldage_61_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 19060 |
| v1 | x_dis_30_d_nobpl | igndps | not eligible | eligible | ✗ | 3337 |
| v2 | x_dis_30_d_nobpl | igndps | not eligible | not eligible | ✓ | 1959 |
| v3 | x_dis_30_d_nobpl | igndps | not eligible | not eligible | ✓ | 21002 |
| v1 | x_dis_30_d_nobpl | pm-sym | eligible | eligible | ✓ | 1435 |
| v2 | x_dis_30_d_nobpl | pm-sym | eligible | eligible | ✓ | 9906 |
| v3 | x_dis_30_d_nobpl | pm-sym | eligible | eligible | ✓ | 20831 |
| v1 | x_dis_30_d_nobpl | ab-pmjay | not eligible | eligible | ✗ | 6805 |
| v2 | x_dis_30_d_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 8536 |
| v3 | x_dis_30_d_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 22744 |
| v1 | x_dis_30_d_nobpl | ignoaps | not eligible | not eligible | ✓ | 5250 |
| v2 | x_dis_30_d_nobpl | ignoaps | not eligible | not eligible | ✓ | 7073 |
| v3 | x_dis_30_d_nobpl | ignoaps | not eligible | not eligible | ✓ | 20749 |
