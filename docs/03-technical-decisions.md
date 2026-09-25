# Technical Decisions and Open Items

Status: Draft 1 · For the engineering side only. We decide these without the client. Client questions are in `02-client-questions.md`.

Each item has a status:

- **Decided** — we chose it. Change it only with a reason.
- **Verify** — we chose a default, but a fact must be checked first.
- **Open** — we need more information, often from a client answer.

## 1. Decided

| # | Decision | Reason | Trade-off |
|---|----------|--------|-----------|
| T1 | Next.js (TypeScript) on Vercel. Supabase for Postgres, login, and photo storage. | Least work for two users. Supabase is standard Postgres, so we can move away. | Depends on two vendors. Later OCR or ML work may need a small Python worker. |
| T2 | Two-step login (TOTP) for both users. No public sign-up. | Patient data is sensitive. | Users need an authenticator app. |
| T3 | Session ends after 30 minutes of no use. | Shared clinic devices. | Users log in again more often. |
| T4 | Row-level security on every table. | The database enforces access, not only the app. | Rules need tests. |
| T5 | A database trigger writes the audit log. | The app cannot skip it. | Slightly more database code. |
| T6 | Photos live in a private bucket. The app uses short-lived links. | No public URLs. | Links expire, so the app must refresh them. |
| T7 | The app shrinks photos to 2000 px on the long side and removes GPS data before upload. | Smaller files. Location privacy. | A little client-side code. |
| T8 | Patients get a code (`P-0001`). It holds no identity data. | Later modules use the code, not the name. | None. |
| T9 | No hard delete in the first release. Archive and restore only. | Safe default. Legal rule is not known yet (Q6). | The database grows. Fine at this scale. |
| T10 | Store `dob` or `age_years`, not both required. The app shows age from `dob` when it exists. | Some patients do not know their birth date. | Two paths for age display. |

## 2. Verify before build or launch

| # | Item | How we check | Blocks |
|---|------|--------------|--------|
| V1 | Supabase offers an India region on the client's plan. Vercel can run functions in India. | Read the current provider docs. Confirm in the dashboard. | Deployment |
| V2 | Database backups: which plan tier gives daily backups? Do backups include photo files? | Read the current docs. Do one test restore. | Launch |
| V3 | Supabase TOTP login works with the Next.js login flow we use. | Build a small test. | Login |
| V4 | A phone browser opens the camera from the upload button on both Chrome (Android) and Safari (iPhone). | Test on real phones. | Photos |

## 3. Open

| # | Item | Options | Depends on |
|---|------|---------|------------|
| O1 | Store measures inside `visits`, or in a separate `measures` table? | Inline: simpler. Separate: allows several lesions without a rewrite. | Client answer Q4 |
| O2 | Photo model: attached to visits, or to patients. | Visit: shows change over time. Patient: simpler. | Client answer Q3 |
| O3 | Fields for grade and quality-of-life scores. | Placeholders now. Real scales later. | Client answers Q1 and Q2 |
| O4 | Visit form fields. | Free text now. Real fields later. | Client request N1 |
| O5 | Photo backup method, if the plan does not cover storage files. | Scheduled copy to a second bucket, or a script that runs on demand. | V2 |
| O6 | Data retention and erasure behavior. | Archive only, or a hard delete with a delay. | Client answer Q6 and lawyer review |

## 4. Engineering practices (defaults)

| # | Practice | Choice |
|---|----------|--------|
| P1 | Database changes | Migration files kept in the repository. |
| P2 | Environments | One production project and one development project. No separate staging until needed. |
| P3 | Tests | Automated tests for access rules (T4) and audit log (T5). Manual test on real phones for photos. End-to-end tests for the acceptance list in `01-base-module.md`. |
| P4 | Charts | Use a library already common in Next.js projects. Do not write our own. |
| P5 | Secrets | Environment variables only. Never in the repository. |
| P6 | Error tracking | None at first. Add only if problems appear. |
| P7 | Code hosting | A repository under the client's account, so the client owns the code. |

## 5. Notes for later modules (technical only)

- **Remedy library.** Parse the Word file with a standard library. Check the parse against a hand-checked sample. Keep original text beside the parsed fields.
- **Endoscopy reading.** First check if the PDFs hold text or are scans. Use an LLM with a fixed output schema. The user confirms every value before it is saved.
- **De-identification.** Use patient codes, not names. Shift dates. Remove photos with faces. Check for small groups that could identify a person.
- **Matching.** Start with a transparent score built from rules and text search. Do not train a model without outcome data.
