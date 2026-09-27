# Question Tracker (internal)

Status: Internal only. Never sent to the client. This is where every N/Q id used across the other docs is defined, tracked, and answered. What we actually send her is `02-client-questions.md` — always in plain language, never by id.

When an id gets answered: move the answer to the module doc that needs it, then move the row here to §5.

## 1. Sent to the client now

| id | Ask | Default if no answer |
|----|-----|------------------------|
| N1 | Send your case-taking form. | Free-text fields. |
| Q5 | Record remedy, potency, dose per visit from the start, or add later? | Later. |
| Q3 | Photos kept per visit, or per patient? | Per visit. |
| Q4 | More than one lesion per patient, ever? | One lesion. |

## 2. Not sent yet — safe default, not blocking

| id | Ask | Default |
|----|-----|---------|
| N2 | Login emails for doctor and trainee. | Not needed — no login in the first build (`00-roadmap.md` D8). |
| Q1 | Grading scale (TNM, WHO, own)? | Placeholder field. |
| Q2 | Quality-of-life scale? | Placeholder field. |
| Q8 | English only for data entry? | English only. |

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
| Q15 | Outcomes | How does she decide a prescription "worked" or "failed"? |

## 4. Paused — lawyer and privacy

Still exploring. Ask once we're closer to a real build with real patient data.

| id | Ask |
|----|-----|
| N3 | Lawyer review of privacy notice, consent text, retention rule. |
| Q6 | Retention/erasure rule. |
| Q7 | Consent form text for storage and research use. |
| Q11 | Research consent given? |
| Q12 | Ethics-committee or journal approval needed? |
| Q17 | OK to run on test data only, private network only, until login ships? |

## 5. Answered

| Question | Answer |
|----------|--------|
| Who uses the app | Doctor + one trainee, same rights, no wider use. |
| Login | Deferred to a later module (D8), not in the first build. |
| Devices | Laptop and phone. |
| Patient identity fields | Name, age/DOB, sex, phone, address. |
| Case form | Will be shared (N1). |
| Existing data | Start fresh, no import. |
| Hosting | Vercel + Supabase, client's own accounts. |
| Scales | Decide later. |
| Photos | Open (see Q3). |
| Timeline | Not a concern for now. |
