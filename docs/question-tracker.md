# Question Tracker (internal)

Status: Internal only. Never sent to the client. This is where every N/Q id used across the other docs is defined, tracked, and answered. What we actually send her is `02-client-questions.md` — always in plain language, never by id.

When an id gets answered: move the answer to the module doc that needs it, then move the row here to §5.

## 1. Sent to the client now

| id | Ask | Default if no answer |
|----|-----|------------------------|
| Q1 | What is "Scoring" (her outline item 13)? Which QoL tool? | Pain, lesion size, TNM. |
| Q5 | Record remedy, potency, dose per visit from the start? | Yes. |
| Q3 | Photos kept per visit? | Per visit. |
| Q4 | More than one lesion per patient? | One lesion. |
| Q16 | Oral only, or esophageal too? | Oral first. |
| Q8 | Patient language, and language she records in? | Store any script. |

## 2. Not sent yet — safe default, not blocking

| id | Ask | Default |
|----|-----|---------|
| N2 | Login emails for doctor and trainee. | Not needed — no login in the first build (`00-roadmap.md` D8). |
| Q2 | Quality-of-life scale? | Folded into Q1. |

## 2a. Needed now — not yet sent (from the 2026-10-10 message)

Ordered by urgency. Each has a default, so none stops the build, but the first two change what we build next.

| id | Ask | Default if no answer |
|----|-----|------------------------|
| Q17 | She plans to use the app on new patients. OK to use test data only, on a private network only, until login ships? Or should login come first? | Test data only (`00-roadmap.md` G0, NFR-13). |
| N18 | Priority order. Her message asks for six report types, several cancers, statistics, and a reasoning aid. Which comes first after the base module? | Base, then remedy library, then endoscopy reports, then the rest. |
| Q15 | How does she decide a prescription "worked" or "failed"? Are cure, remission, pain management, quality of life, and life expectancy the right categories? How does she define each? | Use her five names as a dropdown. |
| N15 | Charges: currency, one amount per visit or per medicine, what accounts needs to see. | One amount per visit, in rupees. |
| N16 | Which cancers after oral, and in what order? Does breast come within this build? | Oral only. |
| N14 | Which statistics software (SPSS, R, Excel, other)? Tests inside the app, or clean export only? | CSV export. |
| N17 | Which report types first? Sample biopsy, MRI, PET, CT, and sonography reports, patient details removed. | Endoscopy first. |

## 3. Later modules — ask when we start that module

| id | Module | Ask |
|----|--------|-----|
| N6 | Remedy library | The 600-page Word document, or 5 remedies first if private. |
| N7 | Remedy library | List of 150 remedies and the bullet headings used. |
| N8 | Endoscopy | 5–10 sample PDFs, patient details removed. |
| N9 | Endoscopy | Which findings matter, and the words used for each. |
| N10 | Matching | How she chooses a remedy today — which inputs count most. |
| N11 | Charts | Which charts she actually wants. |
| N12 | Export | Journal format and required fields. |
| N13 | Matching / reasoning | Timeline for observing Dr. Sarkar; how many cases before trusting a pattern. |
| Q9 | Matching | Does "match" mean rank order, or a claimed chance of benefit? |
| Q10 | Matching | Show why each remedy scored as it did? (We recommend yes.) |
| Q13 | ML | Expected patients in year one. |
| Q14 | Matching / reasoning | Capture Dr. Sarkar's reasoning in-app, or keep separate? |

## 4. Paused — lawyer and privacy

Still exploring. Ask once we're closer to a real build with real patient data.

| id | Ask |
|----|-----|
| N3 | Lawyer review of privacy notice, consent text, retention rule. |
| Q6 | Retention/erasure rule. |
| Q7 | Consent form text for storage and research use. |
| Q11 | Research consent given? |
| Q12 | Ethics-committee or journal approval needed? |

## 5. Answered

| Question | Answer |
|----------|--------|
| Who uses the app | Doctor + one trainee, same rights, no wider use. |
| Login | Deferred to a later module (D8), not in the first build. |
| Devices | Laptop and phone. |
| Patient identity fields | Name, age/DOB, sex, phone, address. |
| Case form (N1) | Received: her outline plus the Word template. Built as a superset, see `04-form-definition.md`. |
| Existing data | Start fresh, no import. |
| Hosting | Vercel + Supabase, client's own accounts. |
| Scales | Decide later. |
| Photos | Open (see Q3). |
| Timeline | Not a concern for now. |
