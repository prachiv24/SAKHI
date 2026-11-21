# Evaluation summary (main; v1, v1r, v3)

Generated 2026-11-20T17:36:49.726Z

Personas: 21. Questions per architecture: 64. Model override: gemini-3.5-flash-lite.

| Architecture | Accuracy | Correct/Total | Unclear | Errors | p50 (ms) | p95 (ms) |
|---|---|---|---|---|---|---|
| V1 — single-shot | 68.8% | 44/64 | 0 | 13 | 1634 | 7558 |
| V1R — rule-aware single-shot | 79.7% | 51/64 | 0 | 11 | 1513 | 6614 |
| V3 — tool-calling + rule engine | 79.7% | 51/64 | 0 | 13 | 8785 | 43924 |

## Confusion matrix (positive class = "eligible")

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1 — single-shot | 14 | 6 | 30 | 1 |
| V1R — rule-aware single-shot | 15 | 2 | 36 | 0 |
| V3 — tool-calling + rule engine | 15 | 0 | 36 | 0 |

## Rule-engine agreement with hand labels

148/148 labels agree with lib/eligibility.js (20 under-70 AB-PMJAY skipped as undetermined).

## Wrong, unclear or errored answers (46)

| Architecture | Persona | Edge case | Scheme | Expected | Model said |
|---|---|---|---|---|---|
| v1 | ramesh | near-miss: age 66 but no BPL card, so old-age pension fails | ignoaps | not eligible | eligible |
| v1 | fatima | clear positive: SC scholarship + Ujjwala; wrong state for widow pension | nsp-post-matric-sc | eligible | not eligible |
| v1r | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1 | arjun | clear positive: disability pension; too old (45) for pm-sym | pm-sym | not eligible | eligible |
| v1 | kishan_59 | age one year below old-age pension cut-off | ignoaps | not eligible | eligible |
| v1 | sym_age_41 | age exactly at pm-sym exclusive upper limit (41 is NOT eligible) | pm-sym | not eligible | eligible |
| v1r | sym_age_41 | age exactly at pm-sym exclusive upper limit (41 is NOT eligible) | pm-sym | not eligible | eligible |
| v1 | widow_up_200000 | income exactly at widow-pension limit (strict lt, so NOT eligible) | up-widow-pension | not eligible | eligible |
| v1 | widow_wrong_state | wrong state: meets every widow-pension criterion except state | up-widow-pension | not eligible | eligible |
| v1 | bhola_noland | near-miss: occupation farmer but landOwned = false | ignoaps | not eligible | ERROR |
| v1 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | igndps | not eligible | ERROR |
| v3 | bhola_noland | near-miss: occupation farmer but landOwned = false | igndps | not eligible | ERROR |
| v1r | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | igndps | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | igndps | not eligible | ERROR |
| v1 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | ignoaps | not eligible | ERROR |
| v1r | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | ignoaps | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | ignoaps | not eligible | ERROR |
| v1 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | nsp-post-matric-sc | not eligible | ERROR |
| v1r | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | nsp-post-matric-sc | not eligible | ERROR |
| v3 | sanjay_dis_nobpl | near-miss: disability + age ok but fails BPL | nsp-post-matric-sc | not eligible | ERROR |
| v1 | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | ERROR |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | igndps | eligible | ERROR |
| v1 | vikas_18 | age exactly at disability-pension minimum (inclusive) | ignoaps | not eligible | ERROR |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | ignoaps | not eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | ignoaps | not eligible | ERROR |
| v1 | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | ERROR |
| v1r | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | ERROR |
| v3 | bhola_noland | near-miss: occupation farmer but landOwned = false | ignoaps | not eligible | ERROR |
| v3 | vikas_18 | age exactly at disability-pension minimum (inclusive) | pm-sym | eligible | ERROR |
| v1 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | igndps | not eligible | ERROR |
| v1r | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | igndps | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | igndps | not eligible | ERROR |
| v1 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | pm-sym | not eligible | ERROR |
| v1r | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | pm-sym | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | pm-sym | not eligible | ERROR |
| v1 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ignoaps | not eligible | ERROR |
| v1r | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ignoaps | not eligible | ERROR |
| v3 | anil_17 | age one below disability-pension minimum; also below pm-sym minimum | ignoaps | not eligible | ERROR |
| v1 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ab-pmjay | eligible | ERROR |
| v1r | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ab-pmjay | eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ab-pmjay | eligible | ERROR |
| v1 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | igndps | not eligible | ERROR |
| v1r | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | igndps | not eligible | ERROR |
| v3 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | igndps | not eligible | ERROR |
| v1 | pmjay_70_nobpl | ab-pmjay OR-route: age >= 70 qualifies regardless of income/BPL | ignoaps | not eligible | ERROR |
