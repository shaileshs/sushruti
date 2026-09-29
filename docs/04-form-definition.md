# Case Form Definition

Status: Draft 1 · Sources: Dr. Shah's outline (`clientcom/intake.md`) and the Word template (`clientcom/OCIS_Improvised_Oral_Cancer_Case_Record_Template.docx`). This is the field list for M1 (`01-base-module.md` FR-14). It replaces the free-text case fields.

## 1. Rules

- **Superset.** Sections 1–15 follow Dr. Shah's outline, in her order. Items from the template are added inside those sections.
- **Tier.** `C` = core, from her outline, always visible. `O` = optional, from the template, collapsed by default.
- **Store.** `T` = typed database column (we chart or filter it). `J` = structured JSON on the visit, with a `form_version`. Promote a `J` field to `T` only when we need to chart or filter it.
- **Exact words.** Every free-text field keeps the words as typed, in any language. Interpretation goes in a separate field.
- **Missing values.** Each measure has one of four states: `value`, `absent`, `not_assessed`, `not_known`. An empty cell is not a state. `T` measures get a `<name>_state` column. `J` fields use `{state, value}`.
- **Source tag (O).** Section-level tag: patient, caregiver, observed, report. Report data is marked verified or unverified. We add this to sections 1–5 and 6 first, not to every field.
- **Repeat.** A field marked `repeat` is a child list, with add and remove. It is stored as a child table.
- **Options** are fixed lists from the template. "Other" always has a text box.

## 2. Patient and visit (template A)

Patient (identity table, separate from all case data, see T8):

| Field | Type | Tier |
|---|---|---|
| Name, sex, phone, address | text / enum / text / text | C |
| Date of birth or age | date / number | C |
| Occupation | text | O |
| City / referral source | text | O |
| Code (`P-0001`) | generated. This is the "OCIS Case ID". | C |

Visit:

| Field | Type | Tier | Store |
|---|---|---|---|
| Visit date | date | C | T |
| Visit type | initial / follow-up / review | C | T |
| Status | draft / complete / clinician verified / research-ready | C | T |
| Clinician | picker: doctor or trainee (see O7) | C | T |
| Accompanied by | text | O | J |
| Consent: clinical, photo, research | 3 records: yes/no, date, note | C | T |
| Consent and permitted use verified | yes / no / pending | O | T |

## 3. Sections 1–4: Diagnosis and investigations (template B)

| # | Field | Type / options | Tier | Store |
|---|---|---|---|---|
| 1 | Primary site, subsite, side | text ×3 (side: left/right/midline/bilateral) | C | J |
| 1 | Diagnosis and carcinoma type | text | C | J |
| 1 | Diagnosed on, at institution | date, text | O | J |
| 2 | Histopathology: type, grade, key findings | text ×3 | C | J |
| 3 | Imaging: MRI, CT, PET-CT, other. Each with date and result. | repeat | C | child |
| 3 | Blood work and markers: test, result, date | repeat | C | child |
| 4 | T, N, M, stage | text ×4 | C | T |
| 4 | Staging system and edition, date | text, date | O | T |
| 4 | Nodes / metastasis: site, evidence, date | repeat | C | child |
| — | Reports linked (file or ID) | upload, verified/unverified | O | child |

## 4. Sections 5 and 9–12: History

| # | Field | Type / options | Tier | Store |
|---|---|---|---|---|
| 5 | Previous cancer treatment: type, dates, response | repeat | C | child |
| 5 | Current oncology treatment, treating centre | text | C | J |
| 5 | Current medicines: name, dose, reason | repeat | O | child |
| 5 | Comorbidities | text | O | J |
| 5 | Main goal / concern for this visit | text | O | J |
| 9 | Past illnesses, operations, injuries | text | C | J |
| 9 | Previous oral lesions / precancerous conditions | text | O | J |
| 9 | Previous homeopathic treatment: remedy, potency, duration, response | repeat | O | child |
| 10 | Family history (cancer: relative, cancer, age. Other.) | repeat + text | C | J |
| 11 | Addiction: substance, frequency, duration, stopped when | repeat | C | child |

## 5. Section 6: Chief complaint and lesion (template C)

| Field | Type / options | Tier | Store |
|---|---|---|---|
| Chief complaint, exact words | longtext | C | J |
| Onset, duration, first noticed | text | C | J |
| Progression | improving / unchanged / gradual increase / rapid increase / fluctuating / unsure | C | T |
| Lesion site, subsite, side, number | text ×3, number | C | T |
| Lesion size, mm (longest, second) | number ×2 | C | T |
| Depth, mm | number | O | T |
| Morphology | ulcerative / exophytic / infiltrative / proliferative / white-red patch / mixed / other | C | T |
| Surface, margin, base, induration | text | C | J |
| Bleeding, discharge, necrosis, odour | text | C | J |
| Pain: site, character, extension | text | C | J |
| Pain intensity, 0–10 | number | C | T |
| Pain timing | text | C | J |
| Pain modalities (better / worse from) | text ×2 | C | J |
| Pain concomitants | text | C | J |
| Dryness / salivation | normal / reduced / increased / thick / ropy / frothy / sticky / offensive / blood-stained (multi) | C | J |
| Tongue, teeth, gums | text ×3 | C | J |
| Trismus: mouth opening, mm | number + state | C | T |
| Dysphagia: chewing, swallowing, speech, taste | text | C | J |
| Halitosis, oral hygiene, nutrition impact | text | O | J |
| Photos | see section 10 | C | child |

## 6. Sections 7–8: Other complaints and peculiar symptoms (template D)

Both are `repeat` lists, stored as child tables.

| List | Fields |
|---|---|
| Other complaint (C) | complaint in exact words; onset and duration; sensation and location; modalities and concomitants; frequency, intensity, impact |
| Characteristic / peculiar symptom (C) | the symptom in exact words; why it stands out (O); source: patient / caregiver / observed / report (O); clinician note (O) |

Each peculiar symptom has an ID. Section 14 links to it.

## 7. Section 12: Personal history (template E, F)

All `J`. Text unless noted. Tier C for every item in her outline.

| Group | Fields |
|---|---|
| Appetite, food | appetite (usual / increased / reduced / variable); desires; aversions |
| Thirst | low / usual / increased; quantity, temperature |
| Elimination | stool; urine |
| Perspiration | amount, site, odour, triggers |
| Reactions | sun; draught / wind; hunger; motion / car sickness; closed room / fresh air; tight clothing; thermal (hot / chilly / variable); cold; damp |
| Sleep | onset, continuity, position, habits, snoring |
| Dreams | in the patient's words |
| Mind | fear / phobia; emotional changes since illness (O); life events and stressors, and what affected her or him emotionally before the disease progressed; main worries (O); changes in temperament (O); coping and support (O) |
| Energy | usual and current level, time-of-day pattern (O) |
| Menstrual / reproductive | cycle, menopause, treatment (O) |
| Clinician interpretation of mind | separate field (O) |

## 8. Section 13: Scoring (template G)

| Field | Type | Tier | Store |
|---|---|---|---|
| Vitals | text | O | J |
| Weight, kg | number + state | C | T |
| Performance status (ECOG) | 0–5 + state | O | T |
| Oral intake / swallowing | text | O | J |
| Systemic findings | text | O | J |
| QoL tool, version, score | text, text, number | C | T |
| Other scores: name, version, value | repeat | C | child |

The template's "OCIS symptom score" is not defined. It is left out until Dr. Shah defines it.

## 9. Sections 14–15 and follow-up (template H, I, J)

Section 14 is optional in full, except the decision.

| Field | Type / options | Tier | Store |
|---|---|---|---|
| Characteristic symptoms selected | links to section 8 entries | O | child |
| Generals / particulars considered | text | O | J |
| Mind features considered | text | O | J |
| Miasmatic interpretation | text | O | J |
| Repertorisation method and source | text | O | J |
| Remedy candidates and differentiating features | repeat: remedy, reason | O | child |
| Alternatives considered, reason not selected | repeat: remedy, reason | O | child |
| **Decision** | start / continue / repeat / change / withhold-observe / investigate / refer | C | T |
| Rationale, uncertainty, review points | longtext | C | J |
| Expert input: name, date, quote or summary | repeat | O | child |

Section 15, Treatment plan:

| Field | Type / options | Tier | Store |
|---|---|---|---|
| **Prescription:** remedy, potency, dose, repetition | text ×4 | C | T |
| Reason and linked symptoms | text + links | C | J |
| Conventional oncology plan, next appointment | text | C | J |
| Supportive care (nutrition, pain, oral care) | text | O | J |
| Investigations, referral, safety action | text | O | J |
| Follow-up interval, what to reassess | text | C | J |

Follow-up (template J). Same visit form with visit type `follow-up`. The page shows the last prescription and response at the top. Extra fields:

| Field | Type / options | Tier | Store |
|---|---|---|---|
| Patient's exact description of change | longtext | C | J |
| New symptoms, adverse events, safety concerns | text | C | J |
| Oncology treatment or tests since last visit | text | O | J |
| **Patient-reported response** | improved / unchanged / mixed / worsened / unclear | C | T |
| Clinician assessment, with basis | text | C | J |

## 10. Photos, record and research (template C, K)

| Field | Type / options | Tier | Store |
|---|---|---|---|
| Photo file | image, resized, no GPS (FR-24) | C | child |
| Photo site label, note | text | C | child |
| Photo view (front, lateral, other) | enum | O | child |
| Photo consent | yes / no | C | child |
| Information source | patient / caregiver / examination / original report / other | O | J |
| Missing or uncertain information | text | O | J |
| Research tags | text | O | J |

A fixed safety notice sits at the bottom of every visit: urgent bleeding, breathing difficulty, inability to swallow fluids, dehydration or fast swelling needs prompt medical care. The app never delays urgent care.

## 11. Data model

Extends `01-base-module.md` §6.

| Table | Change |
|---|---|
| `patients` | Add `occupation`, `referral`. Stays the only table holding identity data. |
| `consents` | `kind` becomes `storage`, `photo`, `research`. Add `verified`. |
| `visits` | Add the typed columns marked `T`, `form_version`, `clinician`, and one JSON column `case`. |
| `measures` | Folded into `visits` for the first build (default for Q4: one lesion). |
| `visit_items` | New child table for the `repeat` lists. Columns: `visit_id`, `kind` (imaging, blood, nodes, treatment, medicine, homeopathic_prior, family, addiction, complaint, peculiar, score, candidate, alternative, expert), `position`, `data` JSON. |
| `prescriptions` | New. `visit_id`, `remedy`, `potency`, `dose`, `repetition`, `reason`. One row per prescription event. |
| `photos` | Add `view`, `consent`. |

`visit_items` is one table for all lists, with `kind` and JSON `data`. This keeps the first build simple. If a list needs charting later, we move it to its own table.

## 12. Open items

These depend on answers in `02-client-questions.md`.

- **Scoring and QoL tool:** unknown. Free-text fields until she names them.
- **More than one lesion:** default is one. A yes moves the lesion fields to their own table (open item O1).
- **Esophageal cancer:** not covered. It needs its own form.
- **Potency and dose format:** free text until she shows how she writes them.
- **Template extras:** we build all as optional. She may name some she never wants.
