# Evaluation summary

Generated 2026-11-19T14:46:41.042Z

Personas: 21. Questions per architecture: 84. Ground truth: hand-labelled expected eligibility (eval/personas.js).
Questions per persona: 4.

| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |
|---|---|---|---|---|---|
| V1 — single-shot | 85.7% | 72/84 | 0.0% | 1 | 12381 |
| V2 — RAG single-shot | 76.2% | 64/84 | 19.0% | 0 | 14799 |
| V3 — multi-agent | 97.6% | 82/84 | 0.0% | 2 | 43748 |

## Confusion matrix (positive class = "eligible")

| Architecture | True Positive | False Positive | True Negative | False Negative |
|---|---|---|---|---|
| V1 — single-shot | 30 | 5 | 42 | 6 |
| V2 — RAG single-shot | 27 | 0 | 37 | 4 |
| V3 — multi-agent | 36 | 0 | 46 | 0 |

## Rule-engine agreement with hand labels

168/168 (persona, scheme) labels agree with lib/eligibility.js.


## Wrong, unclear or errored answers (34)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_sym_inc_500000 | PM-SYM income 500000, age 30 | pm-sym | not eligible | eligible |
| v2 | x_sym_inc_500000 | PM-SYM income 500000, age 30 | igndps | not eligible | unclear |
| v2 | x_sc_inc250000 | SC, exactly at inclusive limit | ignoaps | not eligible | unclear |
| v2 | x_pmjay_70_bpl | 70 with BPL | ignoaps | eligible | unclear |
| v2 | x_combo_old_farmer | retired farmer 68, land, BPL | ignoaps | eligible | unclear |
| v2 | x_oldage_69_bpl | 69 with BPL | ignoaps | eligible | unclear |
| v2 | x_oldage_69_bpl | 69 with BPL | igndps | not eligible | unclear |
| v2 | x_dis_25_d_bpl_stu | disabled student, BPL | ignoaps | not eligible | unclear |
| v1 | x_dis_25_d_bpl_stu | disabled student, BPL | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc0 | widow, UP, zero income | pm-sym | eligible | not eligible |
| v1 | x_widow_up_inc0 | widow, UP, zero income | ab-pmjay | not eligible | eligible |
| v1 | x_pmuy_f17_bpl | girl aged 17 with BPL household | pmuy | not eligible | eligible |
| v2 | x_pmuy_f17_bpl | girl aged 17 with BPL household | ab-pmjay | eligible | not eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ab-pmjay | eligible | not eligible |
| v1 | x_kisan_land70 | farmer with land, aged 70 | ignoaps | not eligible | eligible |
| v1 | x_sc_student19 | SC student 19 | pm-sym | eligible | not eligible |
| v2 | x_pmjay_40_bpl | 40 with BPL | ignoaps | not eligible | unclear |
| v2 | x_combo_rich_senior | wealthy senior 72, no BPL | ignoaps | not eligible | unclear |
| v1 | x_combo_rich_senior | wealthy senior 72, no BPL | ab-pmjay | eligible | not eligible |
| v2 | x_combo_rich_senior | wealthy senior 72, no BPL | igndps | not eligible | unclear |
| v1 | x_oldage_59_bpl | one year below cut-off | ignoaps | not eligible | eligible |
| v3 | x_oldage_59_bpl | one year below cut-off | nsp-post-matric-sc | not eligible | ERROR |
| v2 | x_dis_30_d_bpl | disabled adult with BPL | igndps | eligible | not eligible |
| v2 | x_dis_30_d_bpl | disabled adult with BPL | ignoaps | not eligible | unclear |
| v2 | x_dis_30_d_bpl | disabled adult with BPL | pm-sym | eligible | not eligible |
| v2 | x_widow_up_55_bpl | widow, UP, 55, BPL | ab-pmjay | eligible | not eligible |
| v3 | x_widow_up_55_bpl | widow, UP, 55, BPL | igndps | not eligible | ERROR |
| v2 | x_sym_age40_inc180000 | both PM-SYM limits exactly at the edge (still eligible) | igndps | not eligible | unclear |
| v1 | x_sym_age40_inc180000 | both PM-SYM limits exactly at the edge (still eligible) | ignoaps | not eligible | ERROR |
| v2 | x_sym_age40_inc180000 | both PM-SYM limits exactly at the edge (still eligible) | ignoaps | not eligible | unclear |
| v1 | x_obc_inc100k | OBC, low income | pm-sym | eligible | not eligible |
| v2 | x_oldage_60_bpl | exactly at cut-off, BPL | ignoaps | eligible | unclear |
| v2 | x_oldage_60_bpl | exactly at cut-off, BPL | igndps | not eligible | unclear |
| v2 | x_dis_70_d_bpl | disabled senior, BPL | ignoaps | eligible | unclear |

## Raw per-question results

| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |
|---|---|---|---|---|---|---|
| v1 | x_kisan_land | pm-kisan | eligible | eligible | ✓ | 6903 |
| v2 | x_kisan_land | pm-kisan | eligible | eligible | ✓ | 11033 |
| v3 | x_kisan_land | pm-kisan | eligible | eligible | ✓ | 36948 |
| v1 | x_kisan_land | ab-pmjay | not eligible | not eligible | ✓ | 8767 |
| v2 | x_kisan_land | ab-pmjay | not eligible | not eligible | ✓ | 9659 |
| v3 | x_kisan_land | ab-pmjay | not eligible | not eligible | ✓ | 22554 |
| v1 | x_kisan_land | igndps | not eligible | not eligible | ✓ | 9155 |
| v2 | x_kisan_land | igndps | not eligible | not eligible | ✓ | 11594 |
| v3 | x_kisan_land | igndps | not eligible | not eligible | ✓ | 19280 |
| v1 | x_kisan_land | ignoaps | not eligible | not eligible | ✓ | 8910 |
| v2 | x_kisan_land | ignoaps | not eligible | not eligible | ✓ | 8554 |
| v3 | x_kisan_land | ignoaps | not eligible | not eligible | ✓ | 42132 |
| v1 | x_sym_inc_500000 | pm-sym | not eligible | eligible | ✗ | 9429 |
| v2 | x_sym_inc_500000 | pm-sym | not eligible | not eligible | ✓ | 8603 |
| v3 | x_sym_inc_500000 | pm-sym | not eligible | not eligible | ✓ | 17309 |
| v1 | x_sym_inc_500000 | ab-pmjay | not eligible | not eligible | ✓ | 8787 |
| v2 | x_sym_inc_500000 | ab-pmjay | not eligible | not eligible | ✓ | 20070 |
| v3 | x_sym_inc_500000 | ab-pmjay | not eligible | not eligible | ✓ | 39234 |
| v1 | x_sym_inc_500000 | igndps | not eligible | not eligible | ✓ | 9753 |
| v2 | x_sym_inc_500000 | igndps | not eligible | unclear | ✗ | 10531 |
| v3 | x_sym_inc_500000 | igndps | not eligible | not eligible | ✓ | 26756 |
| v1 | x_sym_inc_500000 | ignoaps | not eligible | not eligible | ✓ | 8901 |
| v2 | x_sym_inc_500000 | ignoaps | not eligible | not eligible | ✓ | 10625 |
| v3 | x_sym_inc_500000 | ignoaps | not eligible | not eligible | ✓ | 23417 |
| v1 | x_sc_inc250000 | nsp-post-matric-sc | eligible | eligible | ✓ | 7866 |
| v2 | x_sc_inc250000 | nsp-post-matric-sc | eligible | eligible | ✓ | 8656 |
| v3 | x_sc_inc250000 | nsp-post-matric-sc | eligible | eligible | ✓ | 25673 |
| v1 | x_sc_inc250000 | ab-pmjay | not eligible | not eligible | ✓ | 8057 |
| v2 | x_sc_inc250000 | ab-pmjay | not eligible | not eligible | ✓ | 8011 |
| v3 | x_sc_inc250000 | ab-pmjay | not eligible | not eligible | ✓ | 17002 |
| v1 | x_sc_inc250000 | igndps | not eligible | not eligible | ✓ | 5654 |
| v2 | x_sc_inc250000 | igndps | not eligible | not eligible | ✓ | 8430 |
| v3 | x_sc_inc250000 | igndps | not eligible | not eligible | ✓ | 9047 |
| v1 | x_sc_inc250000 | ignoaps | not eligible | not eligible | ✓ | 7553 |
| v2 | x_sc_inc250000 | ignoaps | not eligible | unclear | ✗ | 9060 |
| v3 | x_sc_inc250000 | ignoaps | not eligible | not eligible | ✓ | 21812 |
| v1 | x_pmjay_70_bpl | ab-pmjay | eligible | eligible | ✓ | 5640 |
| v2 | x_pmjay_70_bpl | ab-pmjay | eligible | eligible | ✓ | 6934 |
| v3 | x_pmjay_70_bpl | ab-pmjay | eligible | eligible | ✓ | 8340 |
| v1 | x_pmjay_70_bpl | ignoaps | eligible | eligible | ✓ | 5732 |
| v2 | x_pmjay_70_bpl | ignoaps | eligible | unclear | ✗ | 6405 |
| v3 | x_pmjay_70_bpl | ignoaps | eligible | eligible | ✓ | 24776 |
| v1 | x_pmjay_70_bpl | igndps | not eligible | not eligible | ✓ | 6003 |
| v2 | x_pmjay_70_bpl | igndps | not eligible | not eligible | ✓ | 6305 |
| v3 | x_pmjay_70_bpl | igndps | not eligible | not eligible | ✓ | 21063 |
| v1 | x_pmjay_70_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 5595 |
| v2 | x_pmjay_70_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8157 |
| v3 | x_pmjay_70_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 22162 |
| v1 | x_combo_old_farmer | pm-kisan | eligible | eligible | ✓ | 7553 |
| v2 | x_combo_old_farmer | pm-kisan | eligible | eligible | ✓ | 9182 |
| v3 | x_combo_old_farmer | pm-kisan | eligible | eligible | ✓ | 23833 |
| v1 | x_combo_old_farmer | ignoaps | eligible | eligible | ✓ | 6178 |
| v2 | x_combo_old_farmer | ignoaps | eligible | unclear | ✗ | 7928 |
| v3 | x_combo_old_farmer | ignoaps | eligible | eligible | ✓ | 19669 |
| v1 | x_combo_old_farmer | ab-pmjay | eligible | eligible | ✓ | 7088 |
| v2 | x_combo_old_farmer | ab-pmjay | eligible | eligible | ✓ | 17146 |
| v3 | x_combo_old_farmer | ab-pmjay | eligible | eligible | ✓ | 27596 |
| v1 | x_combo_old_farmer | igndps | not eligible | not eligible | ✓ | 7944 |
| v2 | x_combo_old_farmer | igndps | not eligible | not eligible | ✓ | 7743 |
| v3 | x_combo_old_farmer | igndps | not eligible | not eligible | ✓ | 15756 |
| v1 | x_oldage_69_bpl | ignoaps | eligible | eligible | ✓ | 1090 |
| v2 | x_oldage_69_bpl | ignoaps | eligible | unclear | ✗ | 8612 |
| v3 | x_oldage_69_bpl | ignoaps | eligible | eligible | ✓ | 16299 |
| v1 | x_oldage_69_bpl | ab-pmjay | eligible | eligible | ✓ | 7249 |
| v2 | x_oldage_69_bpl | ab-pmjay | eligible | eligible | ✓ | 9099 |
| v3 | x_oldage_69_bpl | ab-pmjay | eligible | eligible | ✓ | 10038 |
| v1 | x_oldage_69_bpl | igndps | not eligible | not eligible | ✓ | 6736 |
| v2 | x_oldage_69_bpl | igndps | not eligible | unclear | ✗ | 8040 |
| v3 | x_oldage_69_bpl | igndps | not eligible | not eligible | ✓ | 21787 |
| v1 | x_oldage_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 6752 |
| v2 | x_oldage_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8671 |
| v3 | x_oldage_69_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 24938 |
| v1 | x_dis_25_d_bpl_stu | igndps | eligible | eligible | ✓ | 8411 |
| v2 | x_dis_25_d_bpl_stu | igndps | eligible | eligible | ✓ | 8738 |
| v3 | x_dis_25_d_bpl_stu | igndps | eligible | eligible | ✓ | 16331 |
| v1 | x_dis_25_d_bpl_stu | ab-pmjay | eligible | eligible | ✓ | 6712 |
| v2 | x_dis_25_d_bpl_stu | ab-pmjay | eligible | eligible | ✓ | 2955 |
| v3 | x_dis_25_d_bpl_stu | ab-pmjay | eligible | eligible | ✓ | 12848 |
| v1 | x_dis_25_d_bpl_stu | ignoaps | not eligible | not eligible | ✓ | 5955 |
| v2 | x_dis_25_d_bpl_stu | ignoaps | not eligible | unclear | ✗ | 6487 |
| v3 | x_dis_25_d_bpl_stu | ignoaps | not eligible | not eligible | ✓ | 23105 |
| v1 | x_dis_25_d_bpl_stu | pm-sym | eligible | not eligible | ✗ | 7489 |
| v2 | x_dis_25_d_bpl_stu | pm-sym | eligible | eligible | ✓ | 8773 |
| v3 | x_dis_25_d_bpl_stu | pm-sym | eligible | eligible | ✓ | 21846 |
| v1 | x_widow_up_inc0 | up-widow-pension | eligible | eligible | ✓ | 7677 |
| v2 | x_widow_up_inc0 | up-widow-pension | eligible | eligible | ✓ | 9439 |
| v3 | x_widow_up_inc0 | up-widow-pension | eligible | eligible | ✓ | 14360 |
| v1 | x_widow_up_inc0 | pm-sym | eligible | not eligible | ✗ | 6950 |
| v2 | x_widow_up_inc0 | pm-sym | eligible | eligible | ✓ | 7801 |
| v3 | x_widow_up_inc0 | pm-sym | eligible | eligible | ✓ | 27034 |
| v1 | x_widow_up_inc0 | ab-pmjay | not eligible | eligible | ✗ | 8430 |
| v2 | x_widow_up_inc0 | ab-pmjay | not eligible | not eligible | ✓ | 12862 |
| v3 | x_widow_up_inc0 | ab-pmjay | not eligible | not eligible | ✓ | 24428 |
| v1 | x_widow_up_inc0 | igndps | not eligible | not eligible | ✓ | 7732 |
| v2 | x_widow_up_inc0 | igndps | not eligible | not eligible | ✓ | 16508 |
| v3 | x_widow_up_inc0 | igndps | not eligible | not eligible | ✓ | 33250 |
| v1 | x_pmuy_f17_bpl | pmuy | not eligible | eligible | ✗ | 9598 |
| v2 | x_pmuy_f17_bpl | pmuy | not eligible | not eligible | ✓ | 10635 |
| v3 | x_pmuy_f17_bpl | pmuy | not eligible | not eligible | ✓ | 19242 |
| v1 | x_pmuy_f17_bpl | ab-pmjay | eligible | eligible | ✓ | 9557 |
| v2 | x_pmuy_f17_bpl | ab-pmjay | eligible | not eligible | ✗ | 2085 |
| v3 | x_pmuy_f17_bpl | ab-pmjay | eligible | eligible | ✓ | 36020 |
| v1 | x_pmuy_f17_bpl | igndps | not eligible | not eligible | ✓ | 8218 |
| v2 | x_pmuy_f17_bpl | igndps | not eligible | not eligible | ✓ | 10602 |
| v3 | x_pmuy_f17_bpl | igndps | not eligible | not eligible | ✓ | 40731 |
| v1 | x_pmuy_f17_bpl | ignoaps | not eligible | not eligible | ✓ | 9607 |
| v2 | x_pmuy_f17_bpl | ignoaps | not eligible | not eligible | ✓ | 11440 |
| v3 | x_pmuy_f17_bpl | ignoaps | not eligible | not eligible | ✓ | 20350 |
| v1 | x_kisan_land70 | pm-kisan | eligible | eligible | ✓ | 8621 |
| v2 | x_kisan_land70 | pm-kisan | eligible | eligible | ✓ | 18123 |
| v3 | x_kisan_land70 | pm-kisan | eligible | eligible | ✓ | 37203 |
| v1 | x_kisan_land70 | ab-pmjay | eligible | not eligible | ✗ | 9056 |
| v2 | x_kisan_land70 | ab-pmjay | eligible | eligible | ✓ | 10667 |
| v3 | x_kisan_land70 | ab-pmjay | eligible | eligible | ✓ | 24260 |
| v1 | x_kisan_land70 | igndps | not eligible | not eligible | ✓ | 10304 |
| v2 | x_kisan_land70 | igndps | not eligible | not eligible | ✓ | 35812 |
| v3 | x_kisan_land70 | igndps | not eligible | not eligible | ✓ | 30734 |
| v1 | x_kisan_land70 | ignoaps | not eligible | eligible | ✗ | 9389 |
| v2 | x_kisan_land70 | ignoaps | not eligible | not eligible | ✓ | 11194 |
| v3 | x_kisan_land70 | ignoaps | not eligible | not eligible | ✓ | 29143 |
| v1 | x_sym_age_17 | pm-sym | not eligible | not eligible | ✓ | 9601 |
| v2 | x_sym_age_17 | pm-sym | not eligible | not eligible | ✓ | 15507 |
| v3 | x_sym_age_17 | pm-sym | not eligible | not eligible | ✓ | 48687 |
| v1 | x_sym_age_17 | ab-pmjay | not eligible | not eligible | ✓ | 9309 |
| v2 | x_sym_age_17 | ab-pmjay | not eligible | not eligible | ✓ | 10993 |
| v3 | x_sym_age_17 | ab-pmjay | not eligible | not eligible | ✓ | 31163 |
| v1 | x_sym_age_17 | igndps | not eligible | not eligible | ✓ | 18934 |
| v2 | x_sym_age_17 | igndps | not eligible | not eligible | ✓ | 9283 |
| v3 | x_sym_age_17 | igndps | not eligible | not eligible | ✓ | 30532 |
| v1 | x_sym_age_17 | ignoaps | not eligible | not eligible | ✓ | 9738 |
| v2 | x_sym_age_17 | ignoaps | not eligible | not eligible | ✓ | 104016 |
| v3 | x_sym_age_17 | ignoaps | not eligible | not eligible | ✓ | 29256 |
| v1 | x_sc_student19 | nsp-post-matric-sc | eligible | eligible | ✓ | 13050 |
| v2 | x_sc_student19 | nsp-post-matric-sc | eligible | eligible | ✓ | 10195 |
| v3 | x_sc_student19 | nsp-post-matric-sc | eligible | eligible | ✓ | 19572 |
| v1 | x_sc_student19 | pm-sym | eligible | not eligible | ✗ | 9441 |
| v2 | x_sc_student19 | pm-sym | eligible | eligible | ✓ | 10180 |
| v3 | x_sc_student19 | pm-sym | eligible | eligible | ✓ | 47307 |
| v1 | x_sc_student19 | ab-pmjay | not eligible | not eligible | ✓ | 8863 |
| v2 | x_sc_student19 | ab-pmjay | not eligible | not eligible | ✓ | 5541 |
| v3 | x_sc_student19 | ab-pmjay | not eligible | not eligible | ✓ | 42692 |
| v1 | x_sc_student19 | igndps | not eligible | not eligible | ✓ | 9799 |
| v2 | x_sc_student19 | igndps | not eligible | not eligible | ✓ | 10483 |
| v3 | x_sc_student19 | igndps | not eligible | not eligible | ✓ | 19908 |
| v1 | x_pmjay_40_bpl | ab-pmjay | eligible | eligible | ✓ | 23420 |
| v2 | x_pmjay_40_bpl | ab-pmjay | eligible | eligible | ✓ | 10245 |
| v3 | x_pmjay_40_bpl | ab-pmjay | eligible | eligible | ✓ | 24715 |
| v1 | x_pmjay_40_bpl | pm-sym | eligible | eligible | ✓ | 9292 |
| v2 | x_pmjay_40_bpl | pm-sym | eligible | eligible | ✓ | 13709 |
| v3 | x_pmjay_40_bpl | pm-sym | eligible | eligible | ✓ | 50703 |
| v1 | x_pmjay_40_bpl | igndps | not eligible | not eligible | ✓ | 8961 |
| v2 | x_pmjay_40_bpl | igndps | not eligible | not eligible | ✓ | 9821 |
| v3 | x_pmjay_40_bpl | igndps | not eligible | not eligible | ✓ | 49197 |
| v1 | x_pmjay_40_bpl | ignoaps | not eligible | not eligible | ✓ | 8042 |
| v2 | x_pmjay_40_bpl | ignoaps | not eligible | unclear | ✗ | 10808 |
| v3 | x_pmjay_40_bpl | ignoaps | not eligible | not eligible | ✓ | 20941 |
| v1 | x_combo_rich_senior | ignoaps | not eligible | not eligible | ✓ | 8780 |
| v2 | x_combo_rich_senior | ignoaps | not eligible | unclear | ✗ | 10418 |
| v3 | x_combo_rich_senior | ignoaps | not eligible | not eligible | ✓ | 22219 |
| v1 | x_combo_rich_senior | ab-pmjay | eligible | not eligible | ✗ | 9710 |
| v2 | x_combo_rich_senior | ab-pmjay | eligible | eligible | ✓ | 8723 |
| v3 | x_combo_rich_senior | ab-pmjay | eligible | eligible | ✓ | 13380 |
| v1 | x_combo_rich_senior | pm-kisan | not eligible | not eligible | ✓ | 9434 |
| v2 | x_combo_rich_senior | pm-kisan | not eligible | not eligible | ✓ | 8535 |
| v3 | x_combo_rich_senior | pm-kisan | not eligible | not eligible | ✓ | 16662 |
| v1 | x_combo_rich_senior | igndps | not eligible | not eligible | ✓ | 9326 |
| v2 | x_combo_rich_senior | igndps | not eligible | unclear | ✗ | 10322 |
| v3 | x_combo_rich_senior | igndps | not eligible | not eligible | ✓ | 26400 |
| v1 | x_oldage_59_bpl | ignoaps | not eligible | eligible | ✗ | 9447 |
| v2 | x_oldage_59_bpl | ignoaps | not eligible | not eligible | ✓ | 10485 |
| v3 | x_oldage_59_bpl | ignoaps | not eligible | not eligible | ✓ | 29320 |
| v1 | x_oldage_59_bpl | ab-pmjay | eligible | eligible | ✓ | 8066 |
| v2 | x_oldage_59_bpl | ab-pmjay | eligible | eligible | ✓ | 273210 |
| v3 | x_oldage_59_bpl | ab-pmjay | eligible | eligible | ✓ | 24015 |
| v1 | x_oldage_59_bpl | igndps | not eligible | not eligible | ✓ | 8854 |
| v2 | x_oldage_59_bpl | igndps | not eligible | not eligible | ✓ | 16670 |
| v3 | x_oldage_59_bpl | igndps | not eligible | not eligible | ✓ | 18669 |
| v1 | x_oldage_59_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 2820 |
| v2 | x_oldage_59_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 11928 |
| v3 | x_oldage_59_bpl | nsp-post-matric-sc | not eligible | ERROR | ✗ | 304086 |
| v1 | x_dis_30_d_bpl | igndps | eligible | eligible | ✓ | 10111 |
| v2 | x_dis_30_d_bpl | igndps | eligible | not eligible | ✗ | 5435 |
| v3 | x_dis_30_d_bpl | igndps | eligible | eligible | ✓ | 24805 |
| v1 | x_dis_30_d_bpl | ab-pmjay | eligible | eligible | ✓ | 19843 |
| v2 | x_dis_30_d_bpl | ab-pmjay | eligible | eligible | ✓ | 10650 |
| v3 | x_dis_30_d_bpl | ab-pmjay | eligible | eligible | ✓ | 15372 |
| v1 | x_dis_30_d_bpl | ignoaps | not eligible | not eligible | ✓ | 4213 |
| v2 | x_dis_30_d_bpl | ignoaps | not eligible | unclear | ✗ | 5493 |
| v3 | x_dis_30_d_bpl | ignoaps | not eligible | not eligible | ✓ | 205572 |
| v1 | x_dis_30_d_bpl | pm-sym | eligible | eligible | ✓ | 8289 |
| v2 | x_dis_30_d_bpl | pm-sym | eligible | not eligible | ✗ | 10006 |
| v3 | x_dis_30_d_bpl | pm-sym | eligible | eligible | ✓ | 224194 |
| v1 | x_widow_up_55_bpl | up-widow-pension | eligible | eligible | ✓ | 9877 |
| v2 | x_widow_up_55_bpl | up-widow-pension | eligible | eligible | ✓ | 3513 |
| v3 | x_widow_up_55_bpl | up-widow-pension | eligible | eligible | ✓ | 14858 |
| v1 | x_widow_up_55_bpl | ab-pmjay | eligible | eligible | ✓ | 5625 |
| v2 | x_widow_up_55_bpl | ab-pmjay | eligible | not eligible | ✗ | 4279 |
| v3 | x_widow_up_55_bpl | ab-pmjay | eligible | eligible | ✓ | 20496 |
| v1 | x_widow_up_55_bpl | igndps | not eligible | not eligible | ✓ | 9208 |
| v2 | x_widow_up_55_bpl | igndps | not eligible | not eligible | ✓ | 3689 |
| v3 | x_widow_up_55_bpl | igndps | not eligible | ERROR | ✗ | 302658 |
| v1 | x_widow_up_55_bpl | pmuy | eligible | eligible | ✓ | 8300 |
| v2 | x_widow_up_55_bpl | pmuy | eligible | eligible | ✓ | 2750 |
| v3 | x_widow_up_55_bpl | pmuy | eligible | eligible | ✓ | 26472 |
| v1 | x_sym_age40_inc180000 | pm-sym | eligible | eligible | ✓ | 6247 |
| v2 | x_sym_age40_inc180000 | pm-sym | eligible | eligible | ✓ | 9271 |
| v3 | x_sym_age40_inc180000 | pm-sym | eligible | eligible | ✓ | 8791 |
| v1 | x_sym_age40_inc180000 | ab-pmjay | not eligible | not eligible | ✓ | 5975 |
| v2 | x_sym_age40_inc180000 | ab-pmjay | not eligible | not eligible | ✓ | 34082 |
| v3 | x_sym_age40_inc180000 | ab-pmjay | not eligible | not eligible | ✓ | 9518 |
| v1 | x_sym_age40_inc180000 | igndps | not eligible | not eligible | ✓ | 8093 |
| v2 | x_sym_age40_inc180000 | igndps | not eligible | unclear | ✗ | 7978 |
| v3 | x_sym_age40_inc180000 | igndps | not eligible | not eligible | ✓ | 21238 |
| v1 | x_sym_age40_inc180000 | ignoaps | not eligible | ERROR | ✗ | 303060 |
| v2 | x_sym_age40_inc180000 | ignoaps | not eligible | unclear | ✗ | 8099 |
| v3 | x_sym_age40_inc180000 | ignoaps | not eligible | not eligible | ✓ | 28588 |
| v1 | x_obc_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8034 |
| v2 | x_obc_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 9514 |
| v3 | x_obc_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 27929 |
| v1 | x_obc_inc100k | pm-sym | eligible | not eligible | ✗ | 7600 |
| v2 | x_obc_inc100k | pm-sym | eligible | eligible | ✓ | 9386 |
| v3 | x_obc_inc100k | pm-sym | eligible | eligible | ✓ | 29044 |
| v1 | x_obc_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 9269 |
| v2 | x_obc_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 9501 |
| v3 | x_obc_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 22369 |
| v1 | x_obc_inc100k | igndps | not eligible | not eligible | ✓ | 8880 |
| v2 | x_obc_inc100k | igndps | not eligible | not eligible | ✓ | 10481 |
| v3 | x_obc_inc100k | igndps | not eligible | not eligible | ✓ | 286978 |
| v1 | x_oldage_60_bpl | ignoaps | eligible | eligible | ✓ | 8569 |
| v2 | x_oldage_60_bpl | ignoaps | eligible | unclear | ✗ | 6139 |
| v3 | x_oldage_60_bpl | ignoaps | eligible | eligible | ✓ | 135852 |
| v1 | x_oldage_60_bpl | ab-pmjay | eligible | eligible | ✓ | 8489 |
| v2 | x_oldage_60_bpl | ab-pmjay | eligible | eligible | ✓ | 21628 |
| v3 | x_oldage_60_bpl | ab-pmjay | eligible | eligible | ✓ | 27272 |
| v1 | x_oldage_60_bpl | igndps | not eligible | not eligible | ✓ | 17579 |
| v2 | x_oldage_60_bpl | igndps | not eligible | unclear | ✗ | 18523 |
| v3 | x_oldage_60_bpl | igndps | not eligible | not eligible | ✓ | 122807 |
| v1 | x_oldage_60_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8840 |
| v2 | x_oldage_60_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 10063 |
| v3 | x_oldage_60_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 28812 |
| v1 | x_dis_70_d_bpl | igndps | eligible | eligible | ✓ | 23121 |
| v2 | x_dis_70_d_bpl | igndps | eligible | eligible | ✓ | 10108 |
| v3 | x_dis_70_d_bpl | igndps | eligible | eligible | ✓ | 28804 |
| v1 | x_dis_70_d_bpl | ab-pmjay | eligible | eligible | ✓ | 9477 |
| v2 | x_dis_70_d_bpl | ab-pmjay | eligible | eligible | ✓ | 22624 |
| v3 | x_dis_70_d_bpl | ab-pmjay | eligible | eligible | ✓ | 29676 |
| v1 | x_dis_70_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 8820 |
| v2 | x_dis_70_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 9874 |
| v3 | x_dis_70_d_bpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 182797 |
| v1 | x_dis_70_d_bpl | ignoaps | eligible | eligible | ✓ | 10622 |
| v2 | x_dis_70_d_bpl | ignoaps | eligible | unclear | ✗ | 15756 |
| v3 | x_dis_70_d_bpl | ignoaps | eligible | eligible | ✓ | 32204 |
