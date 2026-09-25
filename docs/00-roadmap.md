# Invicta — Roadmap

Status: Draft 1 · Source: `basics.md` and the scoping Q&A

## 1. Purpose

A private web app for one homeopathy doctor and her trainee. It records oral and esophageal oncology cases, tracks patients over time, and later supports research. It is not a public product. Two users only.

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

## 4. Modules

Each module has its own requirements document. We write it just before we build it.

| Module | Content | Depends on | Document |
|--------|---------|------------|----------|
| M1 Base | Login, patients, visits, metrics, lesion photos, trend chart, audit log | — | `01-base-module.md` |
| M2 Remedy library | Parse the 600-page Word file into a searchable database. Browse and search. | M1 | Not yet written |
| M3 Endoscopy extraction | Read endoscopy PDFs. Suggest tumor site, size, morphology. The user confirms each value. | M1 | Not yet written |
| M4 Matching | Rank remedies for a patient from M1, M2, M3 data. | M1, M2, M3 | Not yet written |
| M5 Analytics | Charts of prescriptions, outcomes, and trends. | M1 | Not yet written |
| M6 De-identification and export | Strip identity data. Export CSV or XLSX. | M1 | Not yet written |
| M7 Automated ML | Scheduled analysis of de-identified data. | M6, enough data | Not yet written |

Notes on the order:

- M6 comes before M7. Both need de-identification. Export is simpler and more useful first.
- M4 needs a design review with the doctor. See gate G1.
- M7 needs enough outcome data to mean anything. A new system has little data. Do not promise ML insight at go-live.

## 5. Gates

- **G1 — before M4.** The doctor defines what a "match" means. It must be a transparent score, not a probability of cure. The screen must say it is decision support for her judgment. The match must show which inputs caused each score.
- **G2 — before M6.** The doctor confirms that patients gave consent for research use. M1 records this consent from day one.
- **G3 — before any research use.** The doctor confirms whether ethics committee approval is needed for journal submission.

## 6. Open questions

- Client questions and requests: `02-client-questions.md`.
- Technical decisions and open items: `03-technical-decisions.md`.
