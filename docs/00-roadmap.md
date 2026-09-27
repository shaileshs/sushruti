# Invicta — Roadmap

Status: Draft 1 · Source: `basics.md` and the scoping Q&A

## 1. Purpose

A private web app for one homeopathy doctor and her trainee. It records oral and esophageal oncology cases, tracks patients over time, and later supports research. It is not a public product. Two users only.

This is phase one of a larger system the client calls OCIS (Oncology Clinical Intelligence System). See `basics.md` §1 for the full long-term vision. This roadmap covers only what we build now.

## 2. Principles

- Start with the smallest version that works end to end.
- Add each module on top of a working system. Never ship unfinished complexity.
- Usability and function first. Polish later.
- Remove dead paths. No compatibility layers.
- The client owns all accounts, code, and data.

## 3. Decisions made

| # | Decision | Reason |
|---|----------|--------|
| D1 | Users: the doctor and one trainee. Same rights. No public access. | Client answer. |
| D2 | Stack: Next.js (TypeScript) on Vercel, Supabase for database, login, and photo storage. | Least work for two users. Supabase is Postgres, so export is easy. |
| D3 | Vercel and Supabase accounts belong to the client. | IP ownership. |
| D4 | Country: India. Plan for the DPDP Act 2023. | Client answer. |
| D5 | Devices: laptop and phone. Phone must take photos. | Client answer. |
| D6 | Start fresh. No data import. | Client answer. |
| D7 | Patient identity fields: name, age or date of birth, sex, phone, address. No government ID. | Client answer. Less legal risk. |
| D8 | No login module in the first build. We add it once the rest of the system is functional. | Team decision: prove the functional system first, add access control after. |

## 4. Modules

Each module has its own requirements document. We write it just before we build it.

| Module | Content | Depends on | Document |
|--------|---------|------------|----------|
| M1 Base | Login, patients, visits, metrics, lesion photos, trend chart, audit log | — | `01-base-module.md` |
| M2 Remedy library | Parse the 600-page Word file into a searchable database. Browse and search. | M1 | Not yet written |
| M3 Endoscopy extraction | Read endoscopy PDFs. Suggest tumor site, size, morphology. The user confirms each value. | M1 | Not yet written |
| M4 Matching | Rank remedies for a patient from M1, M2, M3 data, as a shortlist with reasons. | M1, M2, M3 | Not yet written |
| M5 Analytics | Charts of prescriptions, outcomes, and trends. | M1 | Not yet written |
| M6 De-identification and export | Strip identity data. Export CSV or XLSX. | M1 | Not yet written |
| M7 Automated ML | Scheduled analysis of de-identified data. | M6, enough data | Not yet written |
| M8 Image/lesion analysis | AI analysis of lesion photos. Named in the vision as a separate module. | M1 | Not yet written |

Notes on the order:

- M6 comes before M7. Both need de-identification. Export is simpler and more useful first.
- M4 needs a design review with the doctor. See gate G1.
- M7 needs enough outcome data to mean anything. A new system has little data. Do not promise ML insight at go-live.
- M8 comes after the base modules are stable. It is not part of the first release.

Notes on scope growth (from the long-term vision, `basics.md` §1):

- M2 may grow from a search database into a fuller knowledge base — organ affinity and oncology associations, not only remedy text search.
- M3 may expand to pathology reports and to the patient's own words, not only endoscopy PDFs.
- M4 as scoped here is a transparent rules and text-search score (see `03-technical-decisions.md`). The client's long-term ask is a clinical reasoning engine that weighs symptoms the way an experienced clinician does. That depends on her work observing Dr. Sunirmal Sarkar's consultations (client question N13) and is a separate, later effort — not a rewrite of M4.
- M4's output must be a ranked shortlist with reasons, not one remedy: a case can have 50 or more candidates, and picking the exact one needs the doctor's own judgment (`basics.md` §3.1). M4 also needs to handle a case as a sequence — a remedy given, a response observed, then continue, repeat, change, or stop before ranking the next one (`basics.md` §3.2). This is a bigger shape than a one-time intake-to-remedy lookup, though M1's visit timeline already gives it a foundation.
- M1's case fields (FR-14) will eventually need to capture deep constitutional and particular symptom detail — physical build, mental state, food and thirst preferences, thermal sensitivity, sleep, and more (`basics.md` §3.3) — not just short free text. This does not change M1's scope now; it is context for the doctor's case form (client request N1).
- The outcome-learning loop (M7) needs case-level "what worked, what did not" data tied to each prescription in sequence, not only aggregate stats (`basics.md` §3.4). The client's own timeline for research use is 2–3 years (`basics.md` §3.5), which matches M7's gate below — but the data model should be able to hold this detail well before then.

## 5. Gates

- **G1 — before M4.** The doctor defines what a "match" means. It must be a transparent score, not a probability of cure. The screen must say it is decision support for her judgment. The match must show which inputs caused each score. It must show a ranked shortlist, not one answer — that is how remedies are actually chosen (`basics.md` §3.1).
- **G2 — before M6.** The doctor confirms that patients gave consent for research use. M1 records this consent from day one.
- **G3 — before any research use.** The doctor confirms whether ethics committee approval is needed for journal submission.

## 6. Open questions

- Client questions and requests: `02-client-questions.md`.
- Technical decisions and open items: `03-technical-decisions.md`.
