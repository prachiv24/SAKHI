# Evaluation summary (personas-extra-combined; v3)

Generated 2026-11-20T17:19:31.956Z

Personas: 79. Questions per architecture: 310. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V3 — tool-calling + rule engine | 99.0% | 307/310 | 0 | 0 | 23902 | 61564 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V3 — tool-calling + rule engine | 102 | 0 | 205 | 3 |

## Rule-engine agreement with hand labels

561/561 labels agree with lib/eligibility.js (71 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (3)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v3 | x_kisan_land_bpl68 | retired farmer 68, BPL and land | pm-kisan | eligible | not eligible |
| v3 | x_combo_sc_woman_farmer | SC woman farmer, BPL | pm-kisan | eligible | not eligible |
| v3 | x_dis_19_d_bpl | disabled, one year above minimum | pm-sym | eligible | not eligible |
