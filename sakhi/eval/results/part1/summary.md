# Evaluation summary

Generated 2026-11-19T11:17:23.699Z

Personas: 21. Questions per architecture: 84. Ground truth: hand-labelled expected eligibility (eval/personas.js).
Questions per persona: 4.

| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |
|---|---|---|---|---|---|
| V1 — single-shot | 83.3% | 70/84 | 0.0% | 0 | 2408 |
| V2 — RAG single-shot | 81.0% | 68/84 | 10.7% | 0 | 2961 |
| V3 — multi-agent | 98.8% | 83/84 | 0.0% | 0 | 8631 |

## Confusion matrix (positive class = "eligible")

| Architecture | True Positive | False Positive | True Negative | False Negative |
|---|---|---|---|---|
| V1 — single-shot | 18 | 5 | 52 | 9 |
| V2 — RAG single-shot | 20 | 2 | 48 | 5 |
| V3 — multi-agent | 26 | 0 | 57 | 1 |

## Rule-engine agreement with hand labels

168/168 (persona, scheme) labels agree with lib/eligibility.js.


## Wrong, unclear or errored answers (31)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v2 | x_oldage_85_bpl | 85 with BPL | ignoaps | eligible | unclear |
| v1 | x_dis_18_d_bpl | disabled, exactly at minimum age | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc200000 | widow, UP, exactly at strict limit: not eligible | up-widow-pension | not eligible | eligible |
| v2 | x_widow_up_inc200000 | widow, UP, exactly at strict limit: not eligible | up-widow-pension | not eligible | eligible |
| v1 | x_pmuy_f30_nobpl | woman 30, no BPL | pmuy | not eligible | eligible |
| v1 | x_pmuy_f30_nobpl | woman 30, no BPL | pm-sym | eligible | not eligible |
| v2 | x_kisan_unemp_noland | unemployed, no land | pm-sym | eligible | not eligible |
| v1 | x_sym_age_19 | PM-SYM age 19, income 1,20,000 | pm-sym | eligible | not eligible |
| v1 | x_st_inc100k | ST, low income (separate scheme) | pm-sym | eligible | not eligible |
| v2 | x_st_inc100k | ST, low income (separate scheme) | ab-pmjay | not eligible | eligible |
| v1 | x_pmjay_70_nobpl | exactly 70, no BPL | ab-pmjay | eligible | not eligible |
| v2 | x_pmjay_70_nobpl | exactly 70, no BPL | igndps | not eligible | unclear |
| v2 | x_pmjay_70_nobpl | exactly 70, no BPL | ignoaps | not eligible | unclear |
| v1 | x_combo_dis_sc_student | disabled SC student, BPL | pm-sym | eligible | not eligible |
| v2 | x_dis_59_d_bpl | disabled, 59, BPL | igndps | eligible | not eligible |
| v2 | x_dis_59_d_bpl | disabled, 59, BPL | ignoaps | not eligible | unclear |
| v1 | x_divorced_up_f | divorced woman in UP, low income | pm-sym | eligible | not eligible |
| v2 | x_divorced_up_f | divorced woman in UP, low income | pm-sym | eligible | not eligible |
| v1 | x_pmuy_f19_bpl | woman 19, BPL | pm-sym | eligible | not eligible |
| v3 | x_kisan_land_bpl68 | retired farmer 68, BPL and land | pm-kisan | eligible | not eligible |
| v2 | x_kisan_land_bpl68 | retired farmer 68, BPL and land | ignoaps | eligible | unclear |
| v1 | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | pm-sym | not eligible | eligible |
| v2 | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | igndps | not eligible | unclear |
| v2 | x_sym_age_41 | PM-SYM age 41, income 1,20,000 | ignoaps | not eligible | unclear |
| v1 | x_sc_f28 | SC woman 28 | nsp-post-matric-sc | eligible | not eligible |
| v2 | x_sc_f28 | SC woman 28 | pm-sym | eligible | not eligible |
| v2 | x_pmjay_25_nobpl | 25, no BPL | pm-sym | eligible | not eligible |
| v2 | x_combo_professional | well-off professional, 38 | igndps | not eligible | unclear |
| v1 | x_oldage_60_nobpl | at cut-off but no BPL card | ignoaps | not eligible | eligible |
| v2 | x_oldage_60_nobpl | at cut-off but no BPL card | ignoaps | not eligible | unclear |
| v1 | x_oldage_60_nobpl | at cut-off but no BPL card | ab-pmjay | not eligible | eligible |

## Raw per-question results

| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |
|---|---|---|---|---|---|---|
| v1 | x_oldage_85_bpl | ignoaps | eligible | eligible | ✓ | 1816 |
| v2 | x_oldage_85_bpl | ignoaps | eligible | unclear | ✗ | 4010 |
| v3 | x_oldage_85_bpl | ignoaps | eligible | eligible | ✓ | 7495 |
| v1 | x_oldage_85_bpl | ab-pmjay | eligible | eligible | ✓ | 2986 |
| v2 | x_oldage_85_bpl | ab-pmjay | eligible | eligible | ✓ | 3524 |
| v3 | x_oldage_85_bpl | ab-pmjay | eligible | eligible | ✓ | 5740 |
| v1 | x_oldage_85_bpl | igndps | not eligible | not eligible | ✓ | 1836 |
| v2 | x_oldage_85_bpl | igndps | not eligible | not eligible | ✓ | 2478 |
| v3 | x_oldage_85_bpl | igndps | not eligible | not eligible | ✓ | 16421 |
| v1 | x_oldage_85_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8331 |
| v2 | x_oldage_85_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 3410 |
| v3 | x_oldage_85_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8226 |
| v1 | x_dis_18_d_bpl | igndps | eligible | eligible | ✓ | 3149 |
| v2 | x_dis_18_d_bpl | igndps | eligible | eligible | ✓ | 3047 |
| v3 | x_dis_18_d_bpl | igndps | eligible | eligible | ✓ | 6203 |
| v1 | x_dis_18_d_bpl | ab-pmjay | eligible | eligible | ✓ | 1988 |
| v2 | x_dis_18_d_bpl | ab-pmjay | eligible | eligible | ✓ | 4085 |
| v3 | x_dis_18_d_bpl | ab-pmjay | eligible | eligible | ✓ | 9735 |
| v1 | x_dis_18_d_bpl | ignoaps | not eligible | not eligible | ✓ | 2226 |
| v2 | x_dis_18_d_bpl | ignoaps | not eligible | not eligible | ✓ | 3554 |
| v3 | x_dis_18_d_bpl | ignoaps | not eligible | not eligible | ✓ | 13576 |
| v1 | x_dis_18_d_bpl | pm-sym | eligible | not eligible | ✗ | 2482 |
| v2 | x_dis_18_d_bpl | pm-sym | eligible | eligible | ✓ | 2892 |
| v3 | x_dis_18_d_bpl | pm-sym | eligible | eligible | ✓ | 9399 |
| v1 | x_widow_up_inc200000 | up-widow-pension | not eligible | eligible | ✗ | 6527 |
| v2 | x_widow_up_inc200000 | up-widow-pension | not eligible | eligible | ✗ | 3529 |
| v3 | x_widow_up_inc200000 | up-widow-pension | not eligible | not eligible | ✓ | 6544 |
| v1 | x_widow_up_inc200000 | ab-pmjay | not eligible | not eligible | ✓ | 4337 |
| v2 | x_widow_up_inc200000 | ab-pmjay | not eligible | not eligible | ✓ | 3679 |
| v3 | x_widow_up_inc200000 | ab-pmjay | not eligible | not eligible | ✓ | 20739 |
| v1 | x_widow_up_inc200000 | igndps | not eligible | not eligible | ✓ | 2128 |
| v2 | x_widow_up_inc200000 | igndps | not eligible | not eligible | ✓ | 3811 |
| v3 | x_widow_up_inc200000 | igndps | not eligible | not eligible | ✓ | 6771 |
| v1 | x_widow_up_inc200000 | ignoaps | not eligible | not eligible | ✓ | 8499 |
| v2 | x_widow_up_inc200000 | ignoaps | not eligible | not eligible | ✓ | 2748 |
| v3 | x_widow_up_inc200000 | ignoaps | not eligible | not eligible | ✓ | 9798 |
| v1 | x_pmuy_f30_nobpl | pmuy | not eligible | eligible | ✗ | 7169 |
| v2 | x_pmuy_f30_nobpl | pmuy | not eligible | not eligible | ✓ | 11246 |
| v3 | x_pmuy_f30_nobpl | pmuy | not eligible | not eligible | ✓ | 15894 |
| v1 | x_pmuy_f30_nobpl | pm-sym | eligible | not eligible | ✗ | 1727 |
| v2 | x_pmuy_f30_nobpl | pm-sym | eligible | eligible | ✓ | 2898 |
| v3 | x_pmuy_f30_nobpl | pm-sym | eligible | eligible | ✓ | 19141 |
| v1 | x_pmuy_f30_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 1842 |
| v2 | x_pmuy_f30_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 10012 |
| v3 | x_pmuy_f30_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 12899 |
| v1 | x_pmuy_f30_nobpl | igndps | not eligible | not eligible | ✓ | 2188 |
| v2 | x_pmuy_f30_nobpl | igndps | not eligible | not eligible | ✓ | 3438 |
| v3 | x_pmuy_f30_nobpl | igndps | not eligible | not eligible | ✓ | 19784 |
| v1 | x_kisan_unemp_noland | pm-kisan | not eligible | not eligible | ✓ | 6093 |
| v2 | x_kisan_unemp_noland | pm-kisan | not eligible | not eligible | ✓ | 3044 |
| v3 | x_kisan_unemp_noland | pm-kisan | not eligible | not eligible | ✓ | 13301 |
| v1 | x_kisan_unemp_noland | pm-sym | eligible | eligible | ✓ | 1192 |
| v2 | x_kisan_unemp_noland | pm-sym | eligible | not eligible | ✗ | 2099 |
| v3 | x_kisan_unemp_noland | pm-sym | eligible | eligible | ✓ | 14928 |
| v1 | x_kisan_unemp_noland | ab-pmjay | not eligible | not eligible | ✓ | 2233 |
| v2 | x_kisan_unemp_noland | ab-pmjay | not eligible | not eligible | ✓ | 3170 |
| v3 | x_kisan_unemp_noland | ab-pmjay | not eligible | not eligible | ✓ | 6118 |
| v1 | x_kisan_unemp_noland | igndps | not eligible | not eligible | ✓ | 2498 |
| v2 | x_kisan_unemp_noland | igndps | not eligible | not eligible | ✓ | 6004 |
| v3 | x_kisan_unemp_noland | igndps | not eligible | not eligible | ✓ | 15777 |
| v1 | x_sym_age_19 | pm-sym | eligible | not eligible | ✗ | 3275 |
| v2 | x_sym_age_19 | pm-sym | eligible | eligible | ✓ | 3021 |
| v3 | x_sym_age_19 | pm-sym | eligible | eligible | ✓ | 12432 |
| v1 | x_sym_age_19 | ab-pmjay | not eligible | not eligible | ✓ | 2526 |
| v2 | x_sym_age_19 | ab-pmjay | not eligible | not eligible | ✓ | 2377 |
| v3 | x_sym_age_19 | ab-pmjay | not eligible | not eligible | ✓ | 13714 |
| v1 | x_sym_age_19 | igndps | not eligible | not eligible | ✓ | 1197 |
| v2 | x_sym_age_19 | igndps | not eligible | not eligible | ✓ | 2405 |
| v3 | x_sym_age_19 | igndps | not eligible | not eligible | ✓ | 5209 |
| v1 | x_sym_age_19 | ignoaps | not eligible | not eligible | ✓ | 1349 |
| v2 | x_sym_age_19 | ignoaps | not eligible | not eligible | ✓ | 5539 |
| v3 | x_sym_age_19 | ignoaps | not eligible | not eligible | ✓ | 14324 |
| v1 | x_st_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2267 |
| v2 | x_st_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2715 |
| v3 | x_st_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 13558 |
| v1 | x_st_inc100k | pm-sym | eligible | not eligible | ✗ | 1630 |
| v2 | x_st_inc100k | pm-sym | eligible | eligible | ✓ | 2620 |
| v3 | x_st_inc100k | pm-sym | eligible | eligible | ✓ | 15659 |
| v1 | x_st_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 2497 |
| v2 | x_st_inc100k | ab-pmjay | not eligible | eligible | ✗ | 2805 |
| v3 | x_st_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 8504 |
| v1 | x_st_inc100k | igndps | not eligible | not eligible | ✓ | 1072 |
| v2 | x_st_inc100k | igndps | not eligible | not eligible | ✓ | 2539 |
| v3 | x_st_inc100k | igndps | not eligible | not eligible | ✓ | 4500 |
| v1 | x_pmjay_70_nobpl | ab-pmjay | eligible | not eligible | ✗ | 9403 |
| v2 | x_pmjay_70_nobpl | ab-pmjay | eligible | eligible | ✓ | 2110 |
| v3 | x_pmjay_70_nobpl | ab-pmjay | eligible | eligible | ✓ | 3426 |
| v1 | x_pmjay_70_nobpl | igndps | not eligible | not eligible | ✓ | 9393 |
| v2 | x_pmjay_70_nobpl | igndps | not eligible | unclear | ✗ | 1901 |
| v3 | x_pmjay_70_nobpl | igndps | not eligible | not eligible | ✓ | 4837 |
| v1 | x_pmjay_70_nobpl | ignoaps | not eligible | not eligible | ✓ | 1709 |
| v2 | x_pmjay_70_nobpl | ignoaps | not eligible | unclear | ✗ | 1990 |
| v3 | x_pmjay_70_nobpl | ignoaps | not eligible | not eligible | ✓ | 4622 |
| v1 | x_pmjay_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1078 |
| v2 | x_pmjay_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2485 |
| v3 | x_pmjay_70_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 11602 |
| v1 | x_combo_dis_sc_student | igndps | eligible | eligible | ✓ | 1187 |
| v2 | x_combo_dis_sc_student | igndps | eligible | eligible | ✓ | 2530 |
| v3 | x_combo_dis_sc_student | igndps | eligible | eligible | ✓ | 4874 |
| v1 | x_combo_dis_sc_student | nsp-post-matric-sc | eligible | eligible | ✓ | 1349 |
| v2 | x_combo_dis_sc_student | nsp-post-matric-sc | eligible | eligible | ✓ | 2111 |
| v3 | x_combo_dis_sc_student | nsp-post-matric-sc | eligible | eligible | ✓ | 4339 |
| v1 | x_combo_dis_sc_student | pm-sym | eligible | not eligible | ✗ | 1076 |
| v2 | x_combo_dis_sc_student | pm-sym | eligible | eligible | ✓ | 2101 |
| v3 | x_combo_dis_sc_student | pm-sym | eligible | eligible | ✓ | 11165 |
| v1 | x_combo_dis_sc_student | ab-pmjay | eligible | eligible | ✓ | 1067 |
| v2 | x_combo_dis_sc_student | ab-pmjay | eligible | eligible | ✓ | 2228 |
| v3 | x_combo_dis_sc_student | ab-pmjay | eligible | eligible | ✓ | 27155 |
| v1 | x_none_woman30 | ignoaps | not eligible | not eligible | ✓ | 6677 |
| v2 | x_none_woman30 | ignoaps | not eligible | not eligible | ✓ | 2472 |
| v3 | x_none_woman30 | ignoaps | not eligible | not eligible | ✓ | 8099 |
| v1 | x_none_woman30 | igndps | not eligible | not eligible | ✓ | 1070 |
| v2 | x_none_woman30 | igndps | not eligible | not eligible | ✓ | 5911 |
| v3 | x_none_woman30 | igndps | not eligible | not eligible | ✓ | 4597 |
| v1 | x_none_woman30 | pm-kisan | not eligible | not eligible | ✓ | 1216 |
| v2 | x_none_woman30 | pm-kisan | not eligible | not eligible | ✓ | 3706 |
| v3 | x_none_woman30 | pm-kisan | not eligible | not eligible | ✓ | 8062 |
| v1 | x_none_woman30 | ab-pmjay | not eligible | not eligible | ✓ | 1178 |
| v2 | x_none_woman30 | ab-pmjay | not eligible | not eligible | ✓ | 2258 |
| v3 | x_none_woman30 | ab-pmjay | not eligible | not eligible | ✓ | 4493 |
| v1 | x_oldage_55_bpl | ignoaps | not eligible | not eligible | ✓ | 1197 |
| v2 | x_oldage_55_bpl | ignoaps | not eligible | not eligible | ✓ | 2411 |
| v3 | x_oldage_55_bpl | ignoaps | not eligible | not eligible | ✓ | 4439 |
| v1 | x_oldage_55_bpl | ab-pmjay | eligible | eligible | ✓ | 5552 |
| v2 | x_oldage_55_bpl | ab-pmjay | eligible | eligible | ✓ | 1890 |
| v3 | x_oldage_55_bpl | ab-pmjay | eligible | eligible | ✓ | 6037 |
| v1 | x_oldage_55_bpl | igndps | not eligible | not eligible | ✓ | 1060 |
| v2 | x_oldage_55_bpl | igndps | not eligible | not eligible | ✓ | 2906 |
| v3 | x_oldage_55_bpl | igndps | not eligible | not eligible | ✓ | 9436 |
| v1 | x_oldage_55_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1704 |
| v2 | x_oldage_55_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 3008 |
| v3 | x_oldage_55_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 4839 |
| v1 | x_dis_59_d_bpl | igndps | eligible | eligible | ✓ | 1082 |
| v2 | x_dis_59_d_bpl | igndps | eligible | not eligible | ✗ | 2355 |
| v3 | x_dis_59_d_bpl | igndps | eligible | eligible | ✓ | 5630 |
| v1 | x_dis_59_d_bpl | ab-pmjay | eligible | eligible | ✓ | 4311 |
| v2 | x_dis_59_d_bpl | ab-pmjay | eligible | eligible | ✓ | 2227 |
| v3 | x_dis_59_d_bpl | ab-pmjay | eligible | eligible | ✓ | 7920 |
| v1 | x_dis_59_d_bpl | ignoaps | not eligible | not eligible | ✓ | 981 |
| v2 | x_dis_59_d_bpl | ignoaps | not eligible | unclear | ✗ | 2497 |
| v3 | x_dis_59_d_bpl | ignoaps | not eligible | not eligible | ✓ | 4721 |
| v1 | x_dis_59_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1082 |
| v2 | x_dis_59_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2359 |
| v3 | x_dis_59_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8765 |
| v1 | x_divorced_up_f | up-widow-pension | not eligible | not eligible | ✓ | 1185 |
| v2 | x_divorced_up_f | up-widow-pension | not eligible | not eligible | ✓ | 1724 |
| v3 | x_divorced_up_f | up-widow-pension | not eligible | not eligible | ✓ | 4458 |
| v1 | x_divorced_up_f | pm-sym | eligible | not eligible | ✗ | 1069 |
| v2 | x_divorced_up_f | pm-sym | eligible | not eligible | ✗ | 2514 |
| v3 | x_divorced_up_f | pm-sym | eligible | eligible | ✓ | 4949 |
| v1 | x_divorced_up_f | ab-pmjay | not eligible | not eligible | ✓ | 1215 |
| v2 | x_divorced_up_f | ab-pmjay | not eligible | not eligible | ✓ | 1950 |
| v3 | x_divorced_up_f | ab-pmjay | not eligible | not eligible | ✓ | 4416 |
| v1 | x_divorced_up_f | igndps | not eligible | not eligible | ✓ | 3656 |
| v2 | x_divorced_up_f | igndps | not eligible | not eligible | ✓ | 1832 |
| v3 | x_divorced_up_f | igndps | not eligible | not eligible | ✓ | 10009 |
| v1 | x_pmuy_f19_bpl | pmuy | eligible | eligible | ✓ | 1062 |
| v2 | x_pmuy_f19_bpl | pmuy | eligible | eligible | ✓ | 1963 |
| v3 | x_pmuy_f19_bpl | pmuy | eligible | eligible | ✓ | 18732 |
| v1 | x_pmuy_f19_bpl | ab-pmjay | eligible | eligible | ✓ | 1314 |
| v2 | x_pmuy_f19_bpl | ab-pmjay | eligible | eligible | ✓ | 1867 |
| v3 | x_pmuy_f19_bpl | ab-pmjay | eligible | eligible | ✓ | 4564 |
| v1 | x_pmuy_f19_bpl | igndps | not eligible | not eligible | ✓ | 1078 |
| v2 | x_pmuy_f19_bpl | igndps | not eligible | not eligible | ✓ | 1854 |
| v3 | x_pmuy_f19_bpl | igndps | not eligible | not eligible | ✓ | 4793 |
| v1 | x_pmuy_f19_bpl | pm-sym | eligible | not eligible | ✗ | 2796 |
| v2 | x_pmuy_f19_bpl | pm-sym | eligible | eligible | ✓ | 2236 |
| v3 | x_pmuy_f19_bpl | pm-sym | eligible | eligible | ✓ | 5071 |
| v1 | x_kisan_land_bpl68 | pm-kisan | eligible | eligible | ✓ | 1343 |
| v2 | x_kisan_land_bpl68 | pm-kisan | eligible | eligible | ✓ | 2515 |
| v3 | x_kisan_land_bpl68 | pm-kisan | eligible | not eligible | ✗ | 5381 |
| v1 | x_kisan_land_bpl68 | ab-pmjay | eligible | eligible | ✓ | 934 |
| v2 | x_kisan_land_bpl68 | ab-pmjay | eligible | eligible | ✓ | 2116 |
| v3 | x_kisan_land_bpl68 | ab-pmjay | eligible | eligible | ✓ | 3167 |
| v1 | x_kisan_land_bpl68 | igndps | not eligible | not eligible | ✓ | 950 |
| v2 | x_kisan_land_bpl68 | igndps | not eligible | not eligible | ✓ | 2137 |
| v3 | x_kisan_land_bpl68 | igndps | not eligible | not eligible | ✓ | 3280 |
| v1 | x_kisan_land_bpl68 | ignoaps | eligible | eligible | ✓ | 1070 |
| v2 | x_kisan_land_bpl68 | ignoaps | eligible | unclear | ✗ | 1836 |
| v3 | x_kisan_land_bpl68 | ignoaps | eligible | eligible | ✓ | 4466 |
| v1 | x_sym_age_41 | pm-sym | not eligible | eligible | ✗ | 1732 |
| v2 | x_sym_age_41 | pm-sym | not eligible | not eligible | ✓ | 2544 |
| v3 | x_sym_age_41 | pm-sym | not eligible | not eligible | ✓ | 4093 |
| v1 | x_sym_age_41 | ab-pmjay | not eligible | not eligible | ✓ | 1852 |
| v2 | x_sym_age_41 | ab-pmjay | not eligible | not eligible | ✓ | 2202 |
| v3 | x_sym_age_41 | ab-pmjay | not eligible | not eligible | ✓ | 4074 |
| v1 | x_sym_age_41 | igndps | not eligible | not eligible | ✓ | 1066 |
| v2 | x_sym_age_41 | igndps | not eligible | unclear | ✗ | 2357 |
| v3 | x_sym_age_41 | igndps | not eligible | not eligible | ✓ | 4057 |
| v1 | x_sym_age_41 | ignoaps | not eligible | not eligible | ✓ | 1096 |
| v2 | x_sym_age_41 | ignoaps | not eligible | unclear | ✗ | 2752 |
| v3 | x_sym_age_41 | ignoaps | not eligible | not eligible | ✓ | 4203 |
| v1 | x_sc_f28 | nsp-post-matric-sc | eligible | not eligible | ✗ | 1518 |
| v2 | x_sc_f28 | nsp-post-matric-sc | eligible | eligible | ✓ | 2582 |
| v3 | x_sc_f28 | nsp-post-matric-sc | eligible | eligible | ✓ | 4766 |
| v1 | x_sc_f28 | pm-sym | eligible | eligible | ✓ | 1371 |
| v2 | x_sc_f28 | pm-sym | eligible | not eligible | ✗ | 2632 |
| v3 | x_sc_f28 | pm-sym | eligible | eligible | ✓ | 3027 |
| v1 | x_sc_f28 | ab-pmjay | not eligible | not eligible | ✓ | 1064 |
| v2 | x_sc_f28 | ab-pmjay | not eligible | not eligible | ✓ | 2105 |
| v3 | x_sc_f28 | ab-pmjay | not eligible | not eligible | ✓ | 11519 |
| v1 | x_sc_f28 | igndps | not eligible | not eligible | ✓ | 800 |
| v2 | x_sc_f28 | igndps | not eligible | not eligible | ✓ | 1863 |
| v3 | x_sc_f28 | igndps | not eligible | not eligible | ✓ | 18139 |
| v1 | x_pmjay_25_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 1603 |
| v2 | x_pmjay_25_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 11218 |
| v3 | x_pmjay_25_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 4356 |
| v1 | x_pmjay_25_nobpl | pm-sym | eligible | eligible | ✓ | 1237 |
| v2 | x_pmjay_25_nobpl | pm-sym | eligible | not eligible | ✗ | 2102 |
| v3 | x_pmjay_25_nobpl | pm-sym | eligible | eligible | ✓ | 4202 |
| v1 | x_pmjay_25_nobpl | igndps | not eligible | not eligible | ✓ | 1014 |
| v2 | x_pmjay_25_nobpl | igndps | not eligible | not eligible | ✓ | 2942 |
| v3 | x_pmjay_25_nobpl | igndps | not eligible | not eligible | ✓ | 22851 |
| v1 | x_pmjay_25_nobpl | ignoaps | not eligible | not eligible | ✓ | 1339 |
| v2 | x_pmjay_25_nobpl | ignoaps | not eligible | not eligible | ✓ | 2112 |
| v3 | x_pmjay_25_nobpl | ignoaps | not eligible | not eligible | ✓ | 4342 |
| v1 | x_combo_professional | pm-sym | not eligible | not eligible | ✓ | 7363 |
| v2 | x_combo_professional | pm-sym | not eligible | not eligible | ✓ | 2097 |
| v3 | x_combo_professional | pm-sym | not eligible | not eligible | ✓ | 4195 |
| v1 | x_combo_professional | nsp-post-matric-sc | not eligible | not eligible | ✓ | 957 |
| v2 | x_combo_professional | nsp-post-matric-sc | not eligible | not eligible | ✓ | 1959 |
| v3 | x_combo_professional | nsp-post-matric-sc | not eligible | not eligible | ✓ | 4200 |
| v1 | x_combo_professional | ab-pmjay | not eligible | not eligible | ✓ | 1192 |
| v2 | x_combo_professional | ab-pmjay | not eligible | not eligible | ✓ | 2468 |
| v3 | x_combo_professional | ab-pmjay | not eligible | not eligible | ✓ | 10792 |
| v1 | x_combo_professional | igndps | not eligible | not eligible | ✓ | 6844 |
| v2 | x_combo_professional | igndps | not eligible | unclear | ✗ | 2159 |
| v3 | x_combo_professional | igndps | not eligible | not eligible | ✓ | 5068 |
| v1 | x_none_salaried28 | ignoaps | not eligible | not eligible | ✓ | 1456 |
| v2 | x_none_salaried28 | ignoaps | not eligible | not eligible | ✓ | 1977 |
| v3 | x_none_salaried28 | ignoaps | not eligible | not eligible | ✓ | 4471 |
| v1 | x_none_salaried28 | igndps | not eligible | not eligible | ✓ | 3406 |
| v2 | x_none_salaried28 | igndps | not eligible | not eligible | ✓ | 5550 |
| v3 | x_none_salaried28 | igndps | not eligible | not eligible | ✓ | 4694 |
| v1 | x_none_salaried28 | pm-kisan | not eligible | not eligible | ✓ | 1160 |
| v2 | x_none_salaried28 | pm-kisan | not eligible | not eligible | ✓ | 1726 |
| v3 | x_none_salaried28 | pm-kisan | not eligible | not eligible | ✓ | 3795 |
| v1 | x_none_salaried28 | ab-pmjay | not eligible | not eligible | ✓ | 1213 |
| v2 | x_none_salaried28 | ab-pmjay | not eligible | not eligible | ✓ | 1973 |
| v3 | x_none_salaried28 | ab-pmjay | not eligible | not eligible | ✓ | 4388 |
| v1 | x_oldage_60_nobpl | ignoaps | not eligible | eligible | ✗ | 1062 |
| v2 | x_oldage_60_nobpl | ignoaps | not eligible | unclear | ✗ | 2097 |
| v3 | x_oldage_60_nobpl | ignoaps | not eligible | not eligible | ✓ | 20257 |
| v1 | x_oldage_60_nobpl | ab-pmjay | not eligible | eligible | ✗ | 1347 |
| v2 | x_oldage_60_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 2631 |
| v3 | x_oldage_60_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 11371 |
| v1 | x_oldage_60_nobpl | igndps | not eligible | not eligible | ✓ | 1497 |
| v2 | x_oldage_60_nobpl | igndps | not eligible | not eligible | ✓ | 1735 |
| v3 | x_oldage_60_nobpl | igndps | not eligible | not eligible | ✓ | 3833 |
| v1 | x_oldage_60_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 939 |
| v2 | x_oldage_60_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2228 |
| v3 | x_oldage_60_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 9536 |
