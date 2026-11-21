# Evaluation summary

Generated 2026-11-19T13:00:31.984Z

Personas: 21. Questions per architecture: 84. Ground truth: hand-labelled expected eligibility (eval/personas.js).
Questions per persona: 4.

| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |
|---|---|---|---|---|---|
| V1 — single-shot | 88.1% | 74/84 | 0.0% | 0 | 3253 |
| V2 — RAG single-shot | 81.0% | 68/84 | 15.5% | 0 | 5242 |
| V3 — multi-agent | 98.8% | 83/84 | 0.0% | 0 | 12936 |

## Confusion matrix (positive class = "eligible")

| Architecture | True Positive | False Positive | True Negative | False Negative |
|---|---|---|---|---|
| V1 — single-shot | 27 | 5 | 47 | 5 |
| V2 — RAG single-shot | 28 | 1 | 40 | 2 |
| V3 — multi-agent | 31 | 0 | 52 | 1 |

## Rule-engine agreement with hand labels

168/168 (persona, scheme) labels agree with lib/eligibility.js.


## Wrong, unclear or errored answers (27)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_widow_delhi | widow, low income, wrong state (Delhi) | up-widow-pension | not eligible | eligible |
| v1 | x_pmuy_widow40_bpl | widow 40, BPL (outside UP) | pm-sym | eligible | not eligible |
| v2 | x_kisan_landless_bpl | landless farmer with BPL | ignoaps | not eligible | unclear |
| v2 | x_sym_age_40 | PM-SYM age 40, income 1,20,000 | ignoaps | not eligible | unclear |
| v1 | x_sc_farmer45 | SC farmer 45 | nsp-post-matric-sc | eligible | not eligible |
| v1 | x_sc_farmer45 | SC farmer 45 | ab-pmjay | not eligible | eligible |
| v1 | x_pmjay_80_nobpl | 80, no BPL | ignoaps | not eligible | eligible |
| v2 | x_pmjay_80_nobpl | 80, no BPL | ignoaps | not eligible | unclear |
| v1 | x_combo_young_farmer | young landowning farmer, no BPL | pm-sym | eligible | not eligible |
| v2 | x_combo_young_farmer | young landowning farmer, no BPL | ab-pmjay | not eligible | unclear |
| v2 | x_oldage_75_bpl | 75 with BPL | ignoaps | eligible | unclear |
| v2 | x_oldage_75_bpl | 75 with BPL | igndps | not eligible | unclear |
| v2 | x_dis_30_nd_bpl | BPL adult without disability | igndps | not eligible | unclear |
| v2 | x_pmuy_f18_bpl | woman exactly 18, BPL | ab-pmjay | eligible | not eligible |
| v1 | x_pmuy_f18_bpl | woman exactly 18, BPL | pm-sym | eligible | not eligible |
| v2 | x_kisan_landless | farmer without land | ab-pmjay | not eligible | eligible |
| v2 | x_kisan_landless | farmer without land | ignoaps | not eligible | unclear |
| v2 | x_pmjay_69_bpl | 69 with BPL | ignoaps | eligible | unclear |
| v2 | x_pmjay_69_bpl | 69 with BPL | igndps | not eligible | unclear |
| v1 | x_oldage_58_bpl | two years below cut-off | ignoaps | not eligible | eligible |
| v2 | x_oldage_58_bpl | two years below cut-off | ignoaps | not eligible | unclear |
| v2 | x_dis_19_d_bpl | disabled, one year above minimum | ab-pmjay | eligible | not eligible |
| v1 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
| v3 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc199999 | widow, UP, just under strict limit | ab-pmjay | not eligible | eligible |
| v2 | x_widow_up_inc199999 | widow, UP, just under strict limit | igndps | not eligible | unclear |
| v2 | x_widow_up_inc199999 | widow, UP, just under strict limit | ignoaps | not eligible | unclear |

## Raw per-question results

| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |
|---|---|---|---|---|---|---|
| v1 | x_widow_delhi | up-widow-pension | not eligible | eligible | ✗ | 1948 |
| v2 | x_widow_delhi | up-widow-pension | not eligible | not eligible | ✓ | 7228 |
| v3 | x_widow_delhi | up-widow-pension | not eligible | not eligible | ✓ | 13728 |
| v1 | x_widow_delhi | ab-pmjay | not eligible | not eligible | ✓ | 1454 |
| v2 | x_widow_delhi | ab-pmjay | not eligible | not eligible | ✓ | 3068 |
| v3 | x_widow_delhi | ab-pmjay | not eligible | not eligible | ✓ | 19648 |
| v1 | x_widow_delhi | igndps | not eligible | not eligible | ✓ | 5259 |
| v2 | x_widow_delhi | igndps | not eligible | not eligible | ✓ | 2010 |
| v3 | x_widow_delhi | igndps | not eligible | not eligible | ✓ | 9028 |
| v1 | x_widow_delhi | ignoaps | not eligible | not eligible | ✓ | 4989 |
| v2 | x_widow_delhi | ignoaps | not eligible | not eligible | ✓ | 2126 |
| v3 | x_widow_delhi | ignoaps | not eligible | not eligible | ✓ | 22165 |
| v1 | x_pmuy_widow40_bpl | pmuy | eligible | eligible | ✓ | 1107 |
| v2 | x_pmuy_widow40_bpl | pmuy | eligible | eligible | ✓ | 7033 |
| v3 | x_pmuy_widow40_bpl | pmuy | eligible | eligible | ✓ | 15454 |
| v1 | x_pmuy_widow40_bpl | ab-pmjay | eligible | eligible | ✓ | 1405 |
| v2 | x_pmuy_widow40_bpl | ab-pmjay | eligible | eligible | ✓ | 7812 |
| v3 | x_pmuy_widow40_bpl | ab-pmjay | eligible | eligible | ✓ | 7653 |
| v1 | x_pmuy_widow40_bpl | igndps | not eligible | not eligible | ✓ | 1950 |
| v2 | x_pmuy_widow40_bpl | igndps | not eligible | not eligible | ✓ | 5641 |
| v3 | x_pmuy_widow40_bpl | igndps | not eligible | not eligible | ✓ | 9688 |
| v1 | x_pmuy_widow40_bpl | pm-sym | eligible | not eligible | ✗ | 4816 |
| v2 | x_pmuy_widow40_bpl | pm-sym | eligible | eligible | ✓ | 5168 |
| v3 | x_pmuy_widow40_bpl | pm-sym | eligible | eligible | ✓ | 13041 |
| v1 | x_kisan_landless_bpl | pm-kisan | not eligible | not eligible | ✓ | 1389 |
| v2 | x_kisan_landless_bpl | pm-kisan | not eligible | not eligible | ✓ | 7627 |
| v3 | x_kisan_landless_bpl | pm-kisan | not eligible | not eligible | ✓ | 17415 |
| v1 | x_kisan_landless_bpl | ab-pmjay | eligible | eligible | ✓ | 5197 |
| v2 | x_kisan_landless_bpl | ab-pmjay | eligible | eligible | ✓ | 5014 |
| v3 | x_kisan_landless_bpl | ab-pmjay | eligible | eligible | ✓ | 13682 |
| v1 | x_kisan_landless_bpl | igndps | not eligible | not eligible | ✓ | 7635 |
| v2 | x_kisan_landless_bpl | igndps | not eligible | not eligible | ✓ | 7832 |
| v3 | x_kisan_landless_bpl | igndps | not eligible | not eligible | ✓ | 13852 |
| v1 | x_kisan_landless_bpl | ignoaps | not eligible | not eligible | ✓ | 753 |
| v2 | x_kisan_landless_bpl | ignoaps | not eligible | unclear | ✗ | 7048 |
| v3 | x_kisan_landless_bpl | ignoaps | not eligible | not eligible | ✓ | 17247 |
| v1 | x_sym_age_40 | pm-sym | eligible | eligible | ✓ | 4284 |
| v2 | x_sym_age_40 | pm-sym | eligible | eligible | ✓ | 2007 |
| v3 | x_sym_age_40 | pm-sym | eligible | eligible | ✓ | 11266 |
| v1 | x_sym_age_40 | ab-pmjay | not eligible | not eligible | ✓ | 1040 |
| v2 | x_sym_age_40 | ab-pmjay | not eligible | not eligible | ✓ | 5009 |
| v3 | x_sym_age_40 | ab-pmjay | not eligible | not eligible | ✓ | 13262 |
| v1 | x_sym_age_40 | igndps | not eligible | not eligible | ✓ | 4584 |
| v2 | x_sym_age_40 | igndps | not eligible | not eligible | ✓ | 6535 |
| v3 | x_sym_age_40 | igndps | not eligible | not eligible | ✓ | 18707 |
| v1 | x_sym_age_40 | ignoaps | not eligible | not eligible | ✓ | 2206 |
| v2 | x_sym_age_40 | ignoaps | not eligible | unclear | ✗ | 1711 |
| v3 | x_sym_age_40 | ignoaps | not eligible | not eligible | ✓ | 6205 |
| v1 | x_sc_farmer45 | nsp-post-matric-sc | eligible | not eligible | ✗ | 1034 |
| v2 | x_sc_farmer45 | nsp-post-matric-sc | eligible | eligible | ✓ | 5341 |
| v3 | x_sc_farmer45 | nsp-post-matric-sc | eligible | eligible | ✓ | 14173 |
| v1 | x_sc_farmer45 | pm-kisan | eligible | eligible | ✓ | 1988 |
| v2 | x_sc_farmer45 | pm-kisan | eligible | eligible | ✓ | 6488 |
| v3 | x_sc_farmer45 | pm-kisan | eligible | eligible | ✓ | 15463 |
| v1 | x_sc_farmer45 | ab-pmjay | not eligible | eligible | ✗ | 7488 |
| v2 | x_sc_farmer45 | ab-pmjay | not eligible | not eligible | ✓ | 8951 |
| v3 | x_sc_farmer45 | ab-pmjay | not eligible | not eligible | ✓ | 18454 |
| v1 | x_sc_farmer45 | igndps | not eligible | not eligible | ✓ | 3224 |
| v2 | x_sc_farmer45 | igndps | not eligible | not eligible | ✓ | 7070 |
| v3 | x_sc_farmer45 | igndps | not eligible | not eligible | ✓ | 12592 |
| v1 | x_pmjay_80_nobpl | ab-pmjay | eligible | eligible | ✓ | 7549 |
| v2 | x_pmjay_80_nobpl | ab-pmjay | eligible | eligible | ✓ | 2071 |
| v3 | x_pmjay_80_nobpl | ab-pmjay | eligible | eligible | ✓ | 15172 |
| v1 | x_pmjay_80_nobpl | igndps | not eligible | not eligible | ✓ | 4591 |
| v2 | x_pmjay_80_nobpl | igndps | not eligible | not eligible | ✓ | 10998 |
| v3 | x_pmjay_80_nobpl | igndps | not eligible | not eligible | ✓ | 23177 |
| v1 | x_pmjay_80_nobpl | ignoaps | not eligible | eligible | ✗ | 6677 |
| v2 | x_pmjay_80_nobpl | ignoaps | not eligible | unclear | ✗ | 8069 |
| v3 | x_pmjay_80_nobpl | ignoaps | not eligible | not eligible | ✓ | 20429 |
| v1 | x_pmjay_80_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1450 |
| v2 | x_pmjay_80_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 6602 |
| v3 | x_pmjay_80_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 12368 |
| v1 | x_combo_young_farmer | pm-kisan | eligible | eligible | ✓ | 1289 |
| v2 | x_combo_young_farmer | pm-kisan | eligible | eligible | ✓ | 2166 |
| v3 | x_combo_young_farmer | pm-kisan | eligible | eligible | ✓ | 9471 |
| v1 | x_combo_young_farmer | pm-sym | eligible | not eligible | ✗ | 5274 |
| v2 | x_combo_young_farmer | pm-sym | eligible | eligible | ✓ | 2002 |
| v3 | x_combo_young_farmer | pm-sym | eligible | eligible | ✓ | 10916 |
| v1 | x_combo_young_farmer | ab-pmjay | not eligible | not eligible | ✓ | 4666 |
| v2 | x_combo_young_farmer | ab-pmjay | not eligible | unclear | ✗ | 7150 |
| v3 | x_combo_young_farmer | ab-pmjay | not eligible | not eligible | ✓ | 16440 |
| v1 | x_combo_young_farmer | igndps | not eligible | not eligible | ✓ | 4976 |
| v2 | x_combo_young_farmer | igndps | not eligible | not eligible | ✓ | 7182 |
| v3 | x_combo_young_farmer | igndps | not eligible | not eligible | ✓ | 12971 |
| v1 | x_none_married35 | ignoaps | not eligible | not eligible | ✓ | 4525 |
| v2 | x_none_married35 | ignoaps | not eligible | not eligible | ✓ | 4748 |
| v3 | x_none_married35 | ignoaps | not eligible | not eligible | ✓ | 7421 |
| v1 | x_none_married35 | igndps | not eligible | not eligible | ✓ | 2099 |
| v2 | x_none_married35 | igndps | not eligible | not eligible | ✓ | 6339 |
| v3 | x_none_married35 | igndps | not eligible | not eligible | ✓ | 13111 |
| v1 | x_none_married35 | pm-kisan | not eligible | not eligible | ✓ | 7103 |
| v2 | x_none_married35 | pm-kisan | not eligible | not eligible | ✓ | 2130 |
| v3 | x_none_married35 | pm-kisan | not eligible | not eligible | ✓ | 8737 |
| v1 | x_none_married35 | ab-pmjay | not eligible | not eligible | ✓ | 1666 |
| v2 | x_none_married35 | ab-pmjay | not eligible | not eligible | ✓ | 2259 |
| v3 | x_none_married35 | ab-pmjay | not eligible | not eligible | ✓ | 5316 |
| v1 | x_oldage_75_bpl | ignoaps | eligible | eligible | ✓ | 3017 |
| v2 | x_oldage_75_bpl | ignoaps | eligible | unclear | ✗ | 4135 |
| v3 | x_oldage_75_bpl | ignoaps | eligible | eligible | ✓ | 7980 |
| v1 | x_oldage_75_bpl | ab-pmjay | eligible | eligible | ✓ | 1046 |
| v2 | x_oldage_75_bpl | ab-pmjay | eligible | eligible | ✓ | 7505 |
| v3 | x_oldage_75_bpl | ab-pmjay | eligible | eligible | ✓ | 12518 |
| v1 | x_oldage_75_bpl | igndps | not eligible | not eligible | ✓ | 5627 |
| v2 | x_oldage_75_bpl | igndps | not eligible | unclear | ✗ | 1606 |
| v3 | x_oldage_75_bpl | igndps | not eligible | not eligible | ✓ | 18982 |
| v1 | x_oldage_75_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1199 |
| v2 | x_oldage_75_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 4748 |
| v3 | x_oldage_75_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 5516 |
| v1 | x_dis_30_nd_bpl | igndps | not eligible | not eligible | ✓ | 2261 |
| v2 | x_dis_30_nd_bpl | igndps | not eligible | unclear | ✗ | 1843 |
| v3 | x_dis_30_nd_bpl | igndps | not eligible | not eligible | ✓ | 21526 |
| v1 | x_dis_30_nd_bpl | ab-pmjay | eligible | eligible | ✓ | 892 |
| v2 | x_dis_30_nd_bpl | ab-pmjay | eligible | eligible | ✓ | 1732 |
| v3 | x_dis_30_nd_bpl | ab-pmjay | eligible | eligible | ✓ | 8362 |
| v1 | x_dis_30_nd_bpl | ignoaps | not eligible | not eligible | ✓ | 5089 |
| v2 | x_dis_30_nd_bpl | ignoaps | not eligible | not eligible | ✓ | 2474 |
| v3 | x_dis_30_nd_bpl | ignoaps | not eligible | not eligible | ✓ | 9021 |
| v1 | x_dis_30_nd_bpl | pm-sym | eligible | eligible | ✓ | 793 |
| v2 | x_dis_30_nd_bpl | pm-sym | eligible | eligible | ✓ | 5224 |
| v3 | x_dis_30_nd_bpl | pm-sym | eligible | eligible | ✓ | 13841 |
| v1 | x_widower_up_m | up-widow-pension | not eligible | not eligible | ✓ | 5035 |
| v2 | x_widower_up_m | up-widow-pension | not eligible | not eligible | ✓ | 5781 |
| v3 | x_widower_up_m | up-widow-pension | not eligible | not eligible | ✓ | 9800 |
| v1 | x_widower_up_m | ab-pmjay | not eligible | not eligible | ✓ | 879 |
| v2 | x_widower_up_m | ab-pmjay | not eligible | not eligible | ✓ | 4966 |
| v3 | x_widower_up_m | ab-pmjay | not eligible | not eligible | ✓ | 8751 |
| v1 | x_widower_up_m | igndps | not eligible | not eligible | ✓ | 4693 |
| v2 | x_widower_up_m | igndps | not eligible | not eligible | ✓ | 6281 |
| v3 | x_widower_up_m | igndps | not eligible | not eligible | ✓ | 6287 |
| v1 | x_widower_up_m | ignoaps | not eligible | not eligible | ✓ | 2273 |
| v2 | x_widower_up_m | ignoaps | not eligible | not eligible | ✓ | 2251 |
| v3 | x_widower_up_m | ignoaps | not eligible | not eligible | ✓ | 5238 |
| v1 | x_pmuy_f18_bpl | pmuy | eligible | eligible | ✓ | 1606 |
| v2 | x_pmuy_f18_bpl | pmuy | eligible | eligible | ✓ | 2469 |
| v3 | x_pmuy_f18_bpl | pmuy | eligible | eligible | ✓ | 9427 |
| v1 | x_pmuy_f18_bpl | ab-pmjay | eligible | eligible | ✓ | 4001 |
| v2 | x_pmuy_f18_bpl | ab-pmjay | eligible | not eligible | ✗ | 5160 |
| v3 | x_pmuy_f18_bpl | ab-pmjay | eligible | eligible | ✓ | 10759 |
| v1 | x_pmuy_f18_bpl | igndps | not eligible | not eligible | ✓ | 3619 |
| v2 | x_pmuy_f18_bpl | igndps | not eligible | not eligible | ✓ | 2499 |
| v3 | x_pmuy_f18_bpl | igndps | not eligible | not eligible | ✓ | 3107 |
| v1 | x_pmuy_f18_bpl | pm-sym | eligible | not eligible | ✗ | 905 |
| v2 | x_pmuy_f18_bpl | pm-sym | eligible | eligible | ✓ | 2412 |
| v3 | x_pmuy_f18_bpl | pm-sym | eligible | eligible | ✓ | 11122 |
| v1 | x_kisan_landless | pm-kisan | not eligible | not eligible | ✓ | 4058 |
| v2 | x_kisan_landless | pm-kisan | not eligible | not eligible | ✓ | 4988 |
| v3 | x_kisan_landless | pm-kisan | not eligible | not eligible | ✓ | 15418 |
| v1 | x_kisan_landless | ab-pmjay | not eligible | not eligible | ✓ | 1169 |
| v2 | x_kisan_landless | ab-pmjay | not eligible | eligible | ✗ | 2743 |
| v3 | x_kisan_landless | ab-pmjay | not eligible | not eligible | ✓ | 15980 |
| v1 | x_kisan_landless | igndps | not eligible | not eligible | ✓ | 1112 |
| v2 | x_kisan_landless | igndps | not eligible | not eligible | ✓ | 6720 |
| v3 | x_kisan_landless | igndps | not eligible | not eligible | ✓ | 13525 |
| v1 | x_kisan_landless | ignoaps | not eligible | not eligible | ✓ | 4175 |
| v2 | x_kisan_landless | ignoaps | not eligible | unclear | ✗ | 2942 |
| v3 | x_kisan_landless | ignoaps | not eligible | not eligible | ✓ | 14265 |
| v1 | x_sym_inc_180000 | pm-sym | eligible | eligible | ✓ | 3878 |
| v2 | x_sym_inc_180000 | pm-sym | eligible | eligible | ✓ | 5405 |
| v3 | x_sym_inc_180000 | pm-sym | eligible | eligible | ✓ | 12428 |
| v1 | x_sym_inc_180000 | ab-pmjay | not eligible | not eligible | ✓ | 6455 |
| v2 | x_sym_inc_180000 | ab-pmjay | not eligible | not eligible | ✓ | 9004 |
| v3 | x_sym_inc_180000 | ab-pmjay | not eligible | not eligible | ✓ | 20591 |
| v1 | x_sym_inc_180000 | igndps | not eligible | not eligible | ✓ | 6432 |
| v2 | x_sym_inc_180000 | igndps | not eligible | not eligible | ✓ | 7707 |
| v3 | x_sym_inc_180000 | igndps | not eligible | not eligible | ✓ | 14595 |
| v1 | x_sym_inc_180000 | ignoaps | not eligible | not eligible | ✓ | 1054 |
| v2 | x_sym_inc_180000 | ignoaps | not eligible | not eligible | ✓ | 1958 |
| v3 | x_sym_inc_180000 | ignoaps | not eligible | not eligible | ✓ | 12644 |
| v1 | x_sc_inc250001 | nsp-post-matric-sc | not eligible | not eligible | ✓ | 6600 |
| v2 | x_sc_inc250001 | nsp-post-matric-sc | not eligible | not eligible | ✓ | 6982 |
| v3 | x_sc_inc250001 | nsp-post-matric-sc | not eligible | not eligible | ✓ | 13708 |
| v1 | x_sc_inc250001 | ab-pmjay | not eligible | not eligible | ✓ | 1006 |
| v2 | x_sc_inc250001 | ab-pmjay | not eligible | not eligible | ✓ | 6386 |
| v3 | x_sc_inc250001 | ab-pmjay | not eligible | not eligible | ✓ | 15243 |
| v1 | x_sc_inc250001 | igndps | not eligible | not eligible | ✓ | 4681 |
| v2 | x_sc_inc250001 | igndps | not eligible | not eligible | ✓ | 2806 |
| v3 | x_sc_inc250001 | igndps | not eligible | not eligible | ✓ | 19110 |
| v1 | x_sc_inc250001 | ignoaps | not eligible | not eligible | ✓ | 2671 |
| v2 | x_sc_inc250001 | ignoaps | not eligible | not eligible | ✓ | 5035 |
| v3 | x_sc_inc250001 | ignoaps | not eligible | not eligible | ✓ | 12152 |
| v1 | x_pmjay_69_bpl | ab-pmjay | eligible | eligible | ✓ | 1178 |
| v2 | x_pmjay_69_bpl | ab-pmjay | eligible | eligible | ✓ | 10290 |
| v3 | x_pmjay_69_bpl | ab-pmjay | eligible | eligible | ✓ | 27807 |
| v1 | x_pmjay_69_bpl | ignoaps | eligible | eligible | ✓ | 1323 |
| v2 | x_pmjay_69_bpl | ignoaps | eligible | unclear | ✗ | 2817 |
| v3 | x_pmjay_69_bpl | ignoaps | eligible | eligible | ✓ | 14388 |
| v1 | x_pmjay_69_bpl | igndps | not eligible | not eligible | ✓ | 4471 |
| v2 | x_pmjay_69_bpl | igndps | not eligible | unclear | ✗ | 6814 |
| v3 | x_pmjay_69_bpl | igndps | not eligible | not eligible | ✓ | 12615 |
| v1 | x_pmjay_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1189 |
| v2 | x_pmjay_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 9924 |
| v3 | x_pmjay_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 15219 |
| v1 | x_combo_widow_dis | up-widow-pension | eligible | eligible | ✓ | 1008 |
| v2 | x_combo_widow_dis | up-widow-pension | eligible | eligible | ✓ | 5983 |
| v3 | x_combo_widow_dis | up-widow-pension | eligible | eligible | ✓ | 8366 |
| v1 | x_combo_widow_dis | igndps | eligible | eligible | ✓ | 5952 |
| v2 | x_combo_widow_dis | igndps | eligible | eligible | ✓ | 5973 |
| v3 | x_combo_widow_dis | igndps | eligible | eligible | ✓ | 9375 |
| v1 | x_combo_widow_dis | pmuy | eligible | eligible | ✓ | 5633 |
| v2 | x_combo_widow_dis | pmuy | eligible | eligible | ✓ | 6721 |
| v3 | x_combo_widow_dis | pmuy | eligible | eligible | ✓ | 7180 |
| v1 | x_combo_widow_dis | ab-pmjay | eligible | eligible | ✓ | 900 |
| v2 | x_combo_widow_dis | ab-pmjay | eligible | eligible | ✓ | 4832 |
| v3 | x_combo_widow_dis | ab-pmjay | eligible | eligible | ✓ | 11168 |
| v1 | x_oldage_58_bpl | ignoaps | not eligible | eligible | ✗ | 5690 |
| v2 | x_oldage_58_bpl | ignoaps | not eligible | unclear | ✗ | 2378 |
| v3 | x_oldage_58_bpl | ignoaps | not eligible | not eligible | ✓ | 6856 |
| v1 | x_oldage_58_bpl | ab-pmjay | eligible | eligible | ✓ | 6948 |
| v2 | x_oldage_58_bpl | ab-pmjay | eligible | eligible | ✓ | 6760 |
| v3 | x_oldage_58_bpl | ab-pmjay | eligible | eligible | ✓ | 18818 |
| v1 | x_oldage_58_bpl | igndps | not eligible | not eligible | ✓ | 771 |
| v2 | x_oldage_58_bpl | igndps | not eligible | not eligible | ✓ | 6753 |
| v3 | x_oldage_58_bpl | igndps | not eligible | not eligible | ✓ | 15558 |
| v1 | x_oldage_58_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 5598 |
| v2 | x_oldage_58_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 5236 |
| v3 | x_oldage_58_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 13996 |
| v1 | x_dis_19_d_bpl | igndps | eligible | eligible | ✓ | 878 |
| v2 | x_dis_19_d_bpl | igndps | eligible | eligible | ✓ | 1616 |
| v3 | x_dis_19_d_bpl | igndps | eligible | eligible | ✓ | 8046 |
| v1 | x_dis_19_d_bpl | ab-pmjay | eligible | eligible | ✓ | 757 |
| v2 | x_dis_19_d_bpl | ab-pmjay | eligible | not eligible | ✗ | 6602 |
| v3 | x_dis_19_d_bpl | ab-pmjay | eligible | eligible | ✓ | 19044 |
| v1 | x_dis_19_d_bpl | ignoaps | not eligible | not eligible | ✓ | 5871 |
| v2 | x_dis_19_d_bpl | ignoaps | not eligible | not eligible | ✓ | 6358 |
| v3 | x_dis_19_d_bpl | ignoaps | not eligible | not eligible | ✓ | 18124 |
| v1 | x_dis_19_d_bpl | pm-sym | eligible | not eligible | ✗ | 881 |
| v2 | x_dis_19_d_bpl | pm-sym | eligible | eligible | ✓ | 7744 |
| v3 | x_dis_19_d_bpl | pm-sym | eligible | not eligible | ✗ | 7875 |
| v1 | x_widow_up_inc199999 | up-widow-pension | eligible | eligible | ✓ | 5635 |
| v2 | x_widow_up_inc199999 | up-widow-pension | eligible | eligible | ✓ | 7063 |
| v3 | x_widow_up_inc199999 | up-widow-pension | eligible | eligible | ✓ | 7760 |
| v1 | x_widow_up_inc199999 | ab-pmjay | not eligible | eligible | ✗ | 1317 |
| v2 | x_widow_up_inc199999 | ab-pmjay | not eligible | not eligible | ✓ | 6146 |
| v3 | x_widow_up_inc199999 | ab-pmjay | not eligible | not eligible | ✓ | 9921 |
| v1 | x_widow_up_inc199999 | igndps | not eligible | not eligible | ✓ | 783 |
| v2 | x_widow_up_inc199999 | igndps | not eligible | unclear | ✗ | 7321 |
| v3 | x_widow_up_inc199999 | igndps | not eligible | not eligible | ✓ | 21937 |
| v1 | x_widow_up_inc199999 | ignoaps | not eligible | not eligible | ✓ | 770 |
| v2 | x_widow_up_inc199999 | ignoaps | not eligible | unclear | ✗ | 1746 |
| v3 | x_widow_up_inc199999 | ignoaps | not eligible | not eligible | ✓ | 9949 |
| v1 | x_pmuy_f30_bpl | pmuy | eligible | eligible | ✓ | 888 |
| v2 | x_pmuy_f30_bpl | pmuy | eligible | eligible | ✓ | 8006 |
| v3 | x_pmuy_f30_bpl | pmuy | eligible | eligible | ✓ | 2790 |
| v1 | x_pmuy_f30_bpl | ab-pmjay | eligible | eligible | ✓ | 5977 |
| v2 | x_pmuy_f30_bpl | ab-pmjay | eligible | eligible | ✓ | 8449 |
| v3 | x_pmuy_f30_bpl | ab-pmjay | eligible | eligible | ✓ | 9122 |
| v1 | x_pmuy_f30_bpl | igndps | not eligible | not eligible | ✓ | 915 |
| v2 | x_pmuy_f30_bpl | igndps | not eligible | not eligible | ✓ | 1595 |
| v3 | x_pmuy_f30_bpl | igndps | not eligible | not eligible | ✓ | 7630 |
| v1 | x_pmuy_f30_bpl | pm-sym | eligible | eligible | ✓ | 6092 |
| v2 | x_pmuy_f30_bpl | pm-sym | eligible | eligible | ✓ | 7030 |
| v3 | x_pmuy_f30_bpl | pm-sym | eligible | eligible | ✓ | 22945 |
