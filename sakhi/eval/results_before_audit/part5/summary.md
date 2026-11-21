# Evaluation summary

Generated 2026-11-19T17:18:09.341Z

Personas: 16. Questions per architecture: 64. Ground truth: hand-labelled expected eligibility (eval/personas.js).
Questions per persona: 4.

| Architecture | Accuracy | Correct/Total | Unclear rate | Errors | Avg latency (ms) |
|---|---|---|---|---|---|
| V1 — single-shot | 84.4% | 54/64 | 0.0% | 0 | 25070 |
| V2 — RAG single-shot | 82.8% | 53/64 | 10.9% | 0 | 23267 |
| V3 — multi-agent | 100.0% | 64/64 | 0.0% | 0 | 84470 |

## Confusion matrix (positive class = "eligible")

| Architecture | True Positive | False Positive | True Negative | False Negative |
|---|---|---|---|---|
| V1 — single-shot | 11 | 8 | 43 | 2 |
| V2 — RAG single-shot | 9 | 0 | 44 | 4 |
| V3 — multi-agent | 13 | 0 | 51 | 0 |

## Rule-engine agreement with hand labels

128/128 (persona, scheme) labels agree with lib/eligibility.js.


## Wrong, unclear or errored answers (21)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | x_widow_up_19 | young widow, UP, age 19 | pm-sym | eligible | not eligible |
| v1 | x_widow_up_19 | young widow, UP, age 19 | ab-pmjay | not eligible | eligible |
| v2 | x_sc_inc100k | SC, 1,00,000 | ab-pmjay | not eligible | unclear |
| v1 | x_oldage_65_nobpl | old enough but no BPL card | ignoaps | not eligible | eligible |
| v2 | x_oldage_65_nobpl | old enough but no BPL card | ignoaps | not eligible | unclear |
| v1 | x_oldage_65_nobpl | old enough but no BPL card | ab-pmjay | not eligible | eligible |
| v1 | x_widow_bihar | widow, low income, wrong state (Bihar) | up-widow-pension | not eligible | eligible |
| v2 | x_widow_bihar | widow, low income, wrong state (Bihar) | ignoaps | not eligible | unclear |
| v2 | x_sym_inc_0 | PM-SYM income 0, age 30 | pm-sym | eligible | not eligible |
| v1 | x_sym_inc_0 | PM-SYM income 0, age 30 | ab-pmjay | not eligible | eligible |
| v2 | x_sc_inc249999 | SC, just under limit | ignoaps | not eligible | unclear |
| v1 | x_unmarried_up_f | unmarried woman in UP, low income | pm-sym | eligible | not eligible |
| v2 | x_unmarried_up_f | unmarried woman in UP, low income | pm-sym | eligible | not eligible |
| v2 | x_sym_age_18 | PM-SYM age 18, income 1,20,000 | pm-sym | eligible | not eligible |
| v2 | x_sym_age_18 | PM-SYM age 18, income 1,20,000 | ignoaps | not eligible | unclear |
| v1 | x_widow_up_inc100k | widow, UP, 1,00,000 | ab-pmjay | not eligible | eligible |
| v2 | x_sym_inc_100000 | PM-SYM income 100000, age 30 | pm-sym | eligible | not eligible |
| v1 | x_sc_inc300k | SC, 3,00,000 | nsp-post-matric-sc | not eligible | eligible |
| v1 | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | pm-sym | not eligible | eligible |
| v2 | x_sym_age_42 | PM-SYM age 42, income 1,20,000 | ignoaps | not eligible | unclear |
| v2 | x_sym_age_60 | PM-SYM age 60, income 1,20,000 | ignoaps | not eligible | unclear |

## Raw per-question results

| Architecture | Persona | Scheme | Expected | Model said | Correct | Latency (ms) |
|---|---|---|---|---|---|---|
| v1 | x_widow_up_19 | up-widow-pension | eligible | eligible | ✓ | 9323 |
| v2 | x_widow_up_19 | up-widow-pension | eligible | eligible | ✓ | 9325 |
| v3 | x_widow_up_19 | up-widow-pension | eligible | eligible | ✓ | 15089 |
| v1 | x_widow_up_19 | pm-sym | eligible | not eligible | ✗ | 8094 |
| v2 | x_widow_up_19 | pm-sym | eligible | eligible | ✓ | 9342 |
| v3 | x_widow_up_19 | pm-sym | eligible | eligible | ✓ | 36836 |
| v1 | x_widow_up_19 | ab-pmjay | not eligible | eligible | ✗ | 1381 |
| v2 | x_widow_up_19 | ab-pmjay | not eligible | not eligible | ✓ | 10060 |
| v3 | x_widow_up_19 | ab-pmjay | not eligible | not eligible | ✓ | 29963 |
| v1 | x_widow_up_19 | igndps | not eligible | not eligible | ✓ | 1529 |
| v2 | x_widow_up_19 | igndps | not eligible | not eligible | ✓ | 4307 |
| v3 | x_widow_up_19 | igndps | not eligible | not eligible | ✓ | 11325 |
| v1 | x_sym_inc_179999 | pm-sym | eligible | eligible | ✓ | 1651 |
| v2 | x_sym_inc_179999 | pm-sym | eligible | eligible | ✓ | 19020 |
| v3 | x_sym_inc_179999 | pm-sym | eligible | eligible | ✓ | 17110 |
| v1 | x_sym_inc_179999 | ab-pmjay | not eligible | not eligible | ✓ | 13474 |
| v2 | x_sym_inc_179999 | ab-pmjay | not eligible | not eligible | ✓ | 11283 |
| v3 | x_sym_inc_179999 | ab-pmjay | not eligible | not eligible | ✓ | 19754 |
| v1 | x_sym_inc_179999 | igndps | not eligible | not eligible | ✓ | 9341 |
| v2 | x_sym_inc_179999 | igndps | not eligible | not eligible | ✓ | 4637 |
| v3 | x_sym_inc_179999 | igndps | not eligible | not eligible | ✓ | 285878 |
| v1 | x_sym_inc_179999 | ignoaps | not eligible | not eligible | ✓ | 9668 |
| v2 | x_sym_inc_179999 | ignoaps | not eligible | not eligible | ✓ | 2234 |
| v3 | x_sym_inc_179999 | ignoaps | not eligible | not eligible | ✓ | 20702 |
| v1 | x_sc_inc100k | nsp-post-matric-sc | eligible | eligible | ✓ | 7529 |
| v2 | x_sc_inc100k | nsp-post-matric-sc | eligible | eligible | ✓ | 18621 |
| v3 | x_sc_inc100k | nsp-post-matric-sc | eligible | eligible | ✓ | 20539 |
| v1 | x_sc_inc100k | pm-sym | eligible | eligible | ✓ | 7415 |
| v2 | x_sc_inc100k | pm-sym | eligible | eligible | ✓ | 9340 |
| v3 | x_sc_inc100k | pm-sym | eligible | eligible | ✓ | 255318 |
| v1 | x_sc_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 156902 |
| v2 | x_sc_inc100k | ab-pmjay | not eligible | unclear | ✗ | 9879 |
| v3 | x_sc_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 184107 |
| v1 | x_sc_inc100k | igndps | not eligible | not eligible | ✓ | 8782 |
| v2 | x_sc_inc100k | igndps | not eligible | not eligible | ✓ | 10223 |
| v3 | x_sc_inc100k | igndps | not eligible | not eligible | ✓ | 141468 |
| v1 | x_oldage_65_nobpl | ignoaps | not eligible | eligible | ✗ | 6723 |
| v2 | x_oldage_65_nobpl | ignoaps | not eligible | unclear | ✗ | 16268 |
| v3 | x_oldage_65_nobpl | ignoaps | not eligible | not eligible | ✓ | 26127 |
| v1 | x_oldage_65_nobpl | ab-pmjay | not eligible | eligible | ✗ | 10232 |
| v2 | x_oldage_65_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 9374 |
| v3 | x_oldage_65_nobpl | ab-pmjay | not eligible | not eligible | ✓ | 20518 |
| v1 | x_oldage_65_nobpl | igndps | not eligible | not eligible | ✓ | 9563 |
| v2 | x_oldage_65_nobpl | igndps | not eligible | not eligible | ✓ | 10502 |
| v3 | x_oldage_65_nobpl | igndps | not eligible | not eligible | ✓ | 58597 |
| v1 | x_oldage_65_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 10526 |
| v2 | x_oldage_65_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 94456 |
| v3 | x_oldage_65_nobpl | nsp-post-matric-sc | not eligible | not eligible | ✓ | 166353 |
| v1 | x_widow_bihar | up-widow-pension | not eligible | eligible | ✗ | 195493 |
| v2 | x_widow_bihar | up-widow-pension | not eligible | not eligible | ✓ | 10889 |
| v3 | x_widow_bihar | up-widow-pension | not eligible | not eligible | ✓ | 106871 |
| v1 | x_widow_bihar | ab-pmjay | not eligible | not eligible | ✓ | 73010 |
| v2 | x_widow_bihar | ab-pmjay | not eligible | not eligible | ✓ | 10185 |
| v3 | x_widow_bihar | ab-pmjay | not eligible | not eligible | ✓ | 152629 |
| v1 | x_widow_bihar | igndps | not eligible | not eligible | ✓ | 33156 |
| v2 | x_widow_bihar | igndps | not eligible | not eligible | ✓ | 5887 |
| v3 | x_widow_bihar | igndps | not eligible | not eligible | ✓ | 135295 |
| v1 | x_widow_bihar | ignoaps | not eligible | not eligible | ✓ | 9367 |
| v2 | x_widow_bihar | ignoaps | not eligible | unclear | ✗ | 10911 |
| v3 | x_widow_bihar | ignoaps | not eligible | not eligible | ✓ | 44495 |
| v1 | x_sym_inc_0 | pm-sym | eligible | eligible | ✓ | 54994 |
| v2 | x_sym_inc_0 | pm-sym | eligible | not eligible | ✗ | 17925 |
| v3 | x_sym_inc_0 | pm-sym | eligible | eligible | ✓ | 62932 |
| v1 | x_sym_inc_0 | ab-pmjay | not eligible | eligible | ✗ | 37683 |
| v2 | x_sym_inc_0 | ab-pmjay | not eligible | not eligible | ✓ | 28595 |
| v3 | x_sym_inc_0 | ab-pmjay | not eligible | not eligible | ✓ | 35522 |
| v1 | x_sym_inc_0 | igndps | not eligible | not eligible | ✓ | 8479 |
| v2 | x_sym_inc_0 | igndps | not eligible | not eligible | ✓ | 10229 |
| v3 | x_sym_inc_0 | igndps | not eligible | not eligible | ✓ | 38420 |
| v1 | x_sym_inc_0 | ignoaps | not eligible | not eligible | ✓ | 10099 |
| v2 | x_sym_inc_0 | ignoaps | not eligible | not eligible | ✓ | 10926 |
| v3 | x_sym_inc_0 | ignoaps | not eligible | not eligible | ✓ | 51893 |
| v1 | x_sc_inc249999 | nsp-post-matric-sc | eligible | eligible | ✓ | 44785 |
| v2 | x_sc_inc249999 | nsp-post-matric-sc | eligible | eligible | ✓ | 39779 |
| v3 | x_sc_inc249999 | nsp-post-matric-sc | eligible | eligible | ✓ | 115779 |
| v1 | x_sc_inc249999 | ab-pmjay | not eligible | not eligible | ✓ | 45294 |
| v2 | x_sc_inc249999 | ab-pmjay | not eligible | not eligible | ✓ | 13109 |
| v3 | x_sc_inc249999 | ab-pmjay | not eligible | not eligible | ✓ | 127148 |
| v1 | x_sc_inc249999 | igndps | not eligible | not eligible | ✓ | 14618 |
| v2 | x_sc_inc249999 | igndps | not eligible | not eligible | ✓ | 19310 |
| v3 | x_sc_inc249999 | igndps | not eligible | not eligible | ✓ | 70396 |
| v1 | x_sc_inc249999 | ignoaps | not eligible | not eligible | ✓ | 75840 |
| v2 | x_sc_inc249999 | ignoaps | not eligible | unclear | ✗ | 26819 |
| v3 | x_sc_inc249999 | ignoaps | not eligible | not eligible | ✓ | 270170 |
| v1 | x_unmarried_up_f | up-widow-pension | not eligible | not eligible | ✓ | 11807 |
| v2 | x_unmarried_up_f | up-widow-pension | not eligible | not eligible | ✓ | 107727 |
| v3 | x_unmarried_up_f | up-widow-pension | not eligible | not eligible | ✓ | 495732 |
| v1 | x_unmarried_up_f | pm-sym | eligible | not eligible | ✗ | 39195 |
| v2 | x_unmarried_up_f | pm-sym | eligible | not eligible | ✗ | 13365 |
| v3 | x_unmarried_up_f | pm-sym | eligible | eligible | ✓ | 94838 |
| v1 | x_unmarried_up_f | ab-pmjay | not eligible | not eligible | ✓ | 8098 |
| v2 | x_unmarried_up_f | ab-pmjay | not eligible | not eligible | ✓ | 42671 |
| v3 | x_unmarried_up_f | ab-pmjay | not eligible | not eligible | ✓ | 100534 |
| v1 | x_unmarried_up_f | igndps | not eligible | not eligible | ✓ | 8491 |
| v2 | x_unmarried_up_f | igndps | not eligible | not eligible | ✓ | 20453 |
| v3 | x_unmarried_up_f | igndps | not eligible | not eligible | ✓ | 119056 |
| v1 | x_sym_age_18 | pm-sym | eligible | eligible | ✓ | 36202 |
| v2 | x_sym_age_18 | pm-sym | eligible | not eligible | ✗ | 23689 |
| v3 | x_sym_age_18 | pm-sym | eligible | eligible | ✓ | 125211 |
| v1 | x_sym_age_18 | ab-pmjay | not eligible | not eligible | ✓ | 8226 |
| v2 | x_sym_age_18 | ab-pmjay | not eligible | not eligible | ✓ | 29444 |
| v3 | x_sym_age_18 | ab-pmjay | not eligible | not eligible | ✓ | 69752 |
| v1 | x_sym_age_18 | igndps | not eligible | not eligible | ✓ | 32593 |
| v2 | x_sym_age_18 | igndps | not eligible | not eligible | ✓ | 86882 |
| v3 | x_sym_age_18 | igndps | not eligible | not eligible | ✓ | 71683 |
| v1 | x_sym_age_18 | ignoaps | not eligible | not eligible | ✓ | 40455 |
| v2 | x_sym_age_18 | ignoaps | not eligible | unclear | ✗ | 28554 |
| v3 | x_sym_age_18 | ignoaps | not eligible | not eligible | ✓ | 102993 |
| v1 | x_gen_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 26325 |
| v2 | x_gen_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 49862 |
| v3 | x_gen_inc100k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 79897 |
| v1 | x_gen_inc100k | pm-sym | eligible | eligible | ✓ | 18579 |
| v2 | x_gen_inc100k | pm-sym | eligible | eligible | ✓ | 17883 |
| v3 | x_gen_inc100k | pm-sym | eligible | eligible | ✓ | 56446 |
| v1 | x_gen_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 29152 |
| v2 | x_gen_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 40200 |
| v3 | x_gen_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 77042 |
| v1 | x_gen_inc100k | igndps | not eligible | not eligible | ✓ | 18329 |
| v2 | x_gen_inc100k | igndps | not eligible | not eligible | ✓ | 27259 |
| v3 | x_gen_inc100k | igndps | not eligible | not eligible | ✓ | 60848 |
| v1 | x_widow_up_inc100k | up-widow-pension | eligible | eligible | ✓ | 13847 |
| v2 | x_widow_up_inc100k | up-widow-pension | eligible | eligible | ✓ | 62459 |
| v3 | x_widow_up_inc100k | up-widow-pension | eligible | eligible | ✓ | 48412 |
| v1 | x_widow_up_inc100k | ab-pmjay | not eligible | eligible | ✗ | 35198 |
| v2 | x_widow_up_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 14497 |
| v3 | x_widow_up_inc100k | ab-pmjay | not eligible | not eligible | ✓ | 72347 |
| v1 | x_widow_up_inc100k | igndps | not eligible | not eligible | ✓ | 11040 |
| v2 | x_widow_up_inc100k | igndps | not eligible | not eligible | ✓ | 16907 |
| v3 | x_widow_up_inc100k | igndps | not eligible | not eligible | ✓ | 62111 |
| v1 | x_widow_up_inc100k | ignoaps | not eligible | not eligible | ✓ | 22226 |
| v2 | x_widow_up_inc100k | ignoaps | not eligible | not eligible | ✓ | 11366 |
| v3 | x_widow_up_inc100k | ignoaps | not eligible | not eligible | ✓ | 46822 |
| v1 | x_sym_inc_100000 | pm-sym | eligible | eligible | ✓ | 21507 |
| v2 | x_sym_inc_100000 | pm-sym | eligible | not eligible | ✗ | 10747 |
| v3 | x_sym_inc_100000 | pm-sym | eligible | eligible | ✓ | 94076 |
| v1 | x_sym_inc_100000 | ab-pmjay | not eligible | not eligible | ✓ | 22104 |
| v2 | x_sym_inc_100000 | ab-pmjay | not eligible | not eligible | ✓ | 21434 |
| v3 | x_sym_inc_100000 | ab-pmjay | not eligible | not eligible | ✓ | 92797 |
| v1 | x_sym_inc_100000 | igndps | not eligible | not eligible | ✓ | 12705 |
| v2 | x_sym_inc_100000 | igndps | not eligible | not eligible | ✓ | 20413 |
| v3 | x_sym_inc_100000 | igndps | not eligible | not eligible | ✓ | 136929 |
| v1 | x_sym_inc_100000 | ignoaps | not eligible | not eligible | ✓ | 43915 |
| v2 | x_sym_inc_100000 | ignoaps | not eligible | not eligible | ✓ | 10862 |
| v3 | x_sym_inc_100000 | ignoaps | not eligible | not eligible | ✓ | 70514 |
| v1 | x_sc_inc300k | nsp-post-matric-sc | not eligible | eligible | ✗ | 11913 |
| v2 | x_sc_inc300k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 15071 |
| v3 | x_sc_inc300k | nsp-post-matric-sc | not eligible | not eligible | ✓ | 28497 |
| v1 | x_sc_inc300k | ab-pmjay | not eligible | not eligible | ✓ | 11871 |
| v2 | x_sc_inc300k | ab-pmjay | not eligible | not eligible | ✓ | 47992 |
| v3 | x_sc_inc300k | ab-pmjay | not eligible | not eligible | ✓ | 37897 |
| v1 | x_sc_inc300k | igndps | not eligible | not eligible | ✓ | 9686 |
| v2 | x_sc_inc300k | igndps | not eligible | not eligible | ✓ | 11537 |
| v3 | x_sc_inc300k | igndps | not eligible | not eligible | ✓ | 35684 |
| v1 | x_sc_inc300k | ignoaps | not eligible | not eligible | ✓ | 9371 |
| v2 | x_sc_inc300k | ignoaps | not eligible | not eligible | ✓ | 19803 |
| v3 | x_sc_inc300k | ignoaps | not eligible | not eligible | ✓ | 29509 |
| v1 | x_sym_age_39 | pm-sym | eligible | eligible | ✓ | 18625 |
| v2 | x_sym_age_39 | pm-sym | eligible | eligible | ✓ | 18657 |
| v3 | x_sym_age_39 | pm-sym | eligible | eligible | ✓ | 50611 |
| v1 | x_sym_age_39 | ab-pmjay | not eligible | not eligible | ✓ | 9408 |
| v2 | x_sym_age_39 | ab-pmjay | not eligible | not eligible | ✓ | 10220 |
| v3 | x_sym_age_39 | ab-pmjay | not eligible | not eligible | ✓ | 26902 |
| v1 | x_sym_age_39 | igndps | not eligible | not eligible | ✓ | 8823 |
| v2 | x_sym_age_39 | igndps | not eligible | not eligible | ✓ | 11180 |
| v3 | x_sym_age_39 | igndps | not eligible | not eligible | ✓ | 37009 |
| v1 | x_sym_age_39 | ignoaps | not eligible | not eligible | ✓ | 9676 |
| v2 | x_sym_age_39 | ignoaps | not eligible | not eligible | ✓ | 11255 |
| v3 | x_sym_age_39 | ignoaps | not eligible | not eligible | ✓ | 74590 |
| v1 | x_sym_age_42 | pm-sym | not eligible | eligible | ✗ | 23201 |
| v2 | x_sym_age_42 | pm-sym | not eligible | not eligible | ✓ | 17398 |
| v3 | x_sym_age_42 | pm-sym | not eligible | not eligible | ✓ | 50371 |
| v1 | x_sym_age_42 | ab-pmjay | not eligible | not eligible | ✓ | 14051 |
| v2 | x_sym_age_42 | ab-pmjay | not eligible | not eligible | ✓ | 10652 |
| v3 | x_sym_age_42 | ab-pmjay | not eligible | not eligible | ✓ | 87411 |
| v1 | x_sym_age_42 | igndps | not eligible | not eligible | ✓ | 42741 |
| v2 | x_sym_age_42 | igndps | not eligible | not eligible | ✓ | 38522 |
| v3 | x_sym_age_42 | igndps | not eligible | not eligible | ✓ | 58601 |
| v1 | x_sym_age_42 | ignoaps | not eligible | not eligible | ✓ | 60882 |
| v2 | x_sym_age_42 | ignoaps | not eligible | unclear | ✗ | 12739 |
| v3 | x_sym_age_42 | ignoaps | not eligible | not eligible | ✓ | 81317 |
| v1 | x_sym_age_60 | pm-sym | not eligible | not eligible | ✓ | 9696 |
| v2 | x_sym_age_60 | pm-sym | not eligible | not eligible | ✓ | 31882 |
| v3 | x_sym_age_60 | pm-sym | not eligible | not eligible | ✓ | 54631 |
| v1 | x_sym_age_60 | ab-pmjay | not eligible | not eligible | ✓ | 16857 |
| v2 | x_sym_age_60 | ab-pmjay | not eligible | not eligible | ✓ | 72886 |
| v3 | x_sym_age_60 | ab-pmjay | not eligible | not eligible | ✓ | 85187 |
| v1 | x_sym_age_60 | igndps | not eligible | not eligible | ✓ | 9667 |
| v2 | x_sym_age_60 | igndps | not eligible | not eligible | ✓ | 44161 |
| v3 | x_sym_age_60 | igndps | not eligible | not eligible | ✓ | 49616 |
| v1 | x_sym_age_60 | ignoaps | not eligible | not eligible | ✓ | 3089 |
| v2 | x_sym_age_60 | ignoaps | not eligible | unclear | ✗ | 5027 |
| v3 | x_sym_age_60 | ignoaps | not eligible | not eligible | ✓ | 19004 |
