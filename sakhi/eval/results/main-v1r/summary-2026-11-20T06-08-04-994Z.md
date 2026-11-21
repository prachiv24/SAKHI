# Evaluation summary (main; v1r)

Generated 2026-11-20T06:08:04.998Z

Personas: 21. Questions per architecture: 84. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1R — rule-aware single-shot | 83.3% | 70/84 | 0 | 0 | 1227 | 2623 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1R — rule-aware single-shot | 21 | 2 | 49 | 12 |

## Rule-engine agreement with hand labels

168/168 labels agree with lib/eligibility.js.

## Wrong, unclear or errored answers (14)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1r | fatima | clear positive: SC scholarship + Ujjwala; wrong state for widow pension | ab-pmjay | eligible | not eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1r | mohan_60 | age exactly at old-age pension cut-off (inclusive) | ab-pmjay | eligible | not eligible |
| v1r | sym_age_40 | age one below pm-sym upper limit (40 is eligible) | ab-pmjay | eligible | not eligible |
| v1r | sym_age_41 | age exactly at pm-sym exclusive upper limit (41 is NOT eligible) | pm-sym | not eligible | eligible |
| v1r | sym_age_41 | age exactly at pm-sym exclusive upper limit (41 is NOT eligible) | ab-pmjay | eligible | not eligible |
| v1r | sym_inc_180000 | income exactly at pm-sym limit (inclusive limit,  eligible) | ab-pmjay | eligible | not eligible |
| v1r | sc_250000 | income exactly at SC scholarship limit (inclusive limit,  eligible) | nsp-post-matric-sc | eligible | not eligible |
| v1r | widow_up_199999 | income just under widow-pension limit, correct state | ab-pmjay | eligible | not eligible |
| v1r | widow_up_200000 | income exactly at widow-pension limit (strict lt, so NOT eligible) | ab-pmjay | eligible | not eligible |
| v1r | bhola_noland | near-miss: occupation farmer but landOwned = false | ab-pmjay | eligible | not eligible |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | ab-pmjay | eligible | not eligible |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | not eligible |
| v1r | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ab-pmjay | eligible | not eligible |
