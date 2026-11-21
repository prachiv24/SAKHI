# Combined evaluation (extended persona set)

Parts used: 5/5. Model(s) recorded: not recorded.
Personas: 100. Questions per architecture: 400. Questions answered by all three: 400.

## Accuracy (95% Wilson confidence interval)

| Architecture | Correct | Accuracy | 95% CI | API errors | Accuracy excl. errors | Unclear | Avg latency (ms) | Fallback used |
|---|---|---|---|---|---|---|---|---|
| V1 single-shot | 339/400 | 84.8% | 80.9%–87.9% | 1 | 85.0% | 0 | 8212 | 0 |
| V2 RAG single-shot | 320/400 | 80.0% | 75.8%–83.6% | 0 | 80.0% | 59 | 9278 | 0 |
| V3 tool-calling + rule engine | 395/400 | 98.8% | 97.1%–99.5% | 2 | 99.2% | 0 | 29411 | 1 |

"Accuracy" counts an API error as wrong, as in the main run. "Accuracy excl. errors" removes them, so provider failures are not blamed on reasoning.

## Confusion (answered questions only)

| Architecture | TP | FP | TN | FN |
|---|---|---|---|---|
| V1 single-shot | 107 | 31 | 232 | 29 |
| V2 RAG single-shot | 107 | 4 | 213 | 17 |
| V3 tool-calling + rule engine | 133 | 0 | 262 | 3 |

## Paired comparison (exact two-sided McNemar test)

| A vs B | Both correct | A only | B only | Both wrong | p-value |
|---|---|---|---|---|---|
| V3 tool-calling + rule engine vs V1 single-shot | 335 | 60 | 4 | 1 | <0.001 |
| V3 tool-calling + rule engine vs V2 RAG single-shot | 315 | 80 | 5 | 0 | <0.001 |
| V1 single-shot vs V2 RAG single-shot | 270 | 69 | 50 | 11 | 0.0985 |

## Per scheme (correct / asked)

| Scheme | V1 | V2 | V3 |
|---|---|---|---|
| ab-pmjay | 86/100 | 90/100 | 100/100 |
| igndps | 97/98 | 80/98 | 97/98 |
| ignoaps | 62/72 | 31/72 | 72/72 |
| nsp-post-matric-sc | 32/36 | 36/36 | 35/36 |
| pm-kisan | 18/18 | 18/18 | 16/18 |
| pm-sym | 22/48 | 38/48 | 47/48 |
| pmuy | 10/13 | 13/13 | 13/13 |
| up-widow-pension | 12/15 | 14/15 | 15/15 |

## V3 failures

| Part | Persona | Scheme | Expected | Said | Error |
|---|---|---|---|---|---|
| part1 | x_kisan_land_bpl68 | pm-kisan | eligible | not eligible |  |
| part2 | x_combo_sc_woman_farmer | pm-kisan | eligible | not eligible |  |
| part3 | x_dis_19_d_bpl | pm-sym | eligible | not eligible |  |
| part4 | x_oldage_59_bpl | nsp-post-matric-sc | not eligible | - | fetch failed |
| part4 | x_widow_up_55_bpl | igndps | not eligible | - | fetch failed |
