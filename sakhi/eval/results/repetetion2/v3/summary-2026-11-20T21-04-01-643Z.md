# Evaluation summary (personas-extra-combined; v3)

Generated 2026-11-20T21:04:01.644Z

Personas: 121. Questions per architecture: 375. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V3 — tool-calling + rule engine | 95.2% | 357/375 | 0 | 13 | 4284 | 27152 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V3 — tool-calling + rule engine | 113 | 0 | 244 | 5 |

## Rule-engine agreement with hand labels

858/858 labels agree with lib/eligibility.js (110 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (18)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v3 | x_dis_45_d_bpl_f | disabled woman with BPL | igndps | eligible | ERROR |
| v3 | x_dis_45_d_bpl_f | disabled woman with BPL | ignoaps | not eligible | ERROR |
| v3 | x_dis_45_d_bpl_f | disabled woman with BPL | pmuy | eligible | ERROR |
| v3 | x_married_up_f | married woman in UP, low income | up-widow-pension | not eligible | ERROR |
| v3 | x_married_up_f | married woman in UP, low income | pm-sym | eligible | ERROR |
| v3 | x_married_up_f | married woman in UP, low income | igndps | not eligible | ERROR |
| v3 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pmuy | not eligible | ERROR |
| v3 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | igndps | not eligible | ERROR |
| v3 | x_pmuy_m30_bpl | man 30, BPL: scheme is for women | pm-sym | eligible | ERROR |
| v3 | x_kisan_student | student, no land | pm-kisan | not eligible | ERROR |
| v3 | x_kisan_student | student, no land | pm-sym | eligible | ERROR |
| v3 | x_kisan_student | student, no land | igndps | not eligible | ERROR |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pm-kisan | eligible | not eligible |
| v3 | x_kisan_land_bpl68 | retired farmer 68, BPL and land | pm-kisan | eligible | not eligible |
| v3 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
| v3 | x_combo_old_farmer | retired farmer 68, land, BPL | pm-kisan | eligible | not eligible |
| v3 | x_unmarried_up_f | unmarried woman in UP, low income | pm-sym | eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | not eligible |
