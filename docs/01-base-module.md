# M1 Base Module — Requirements

Status: Draft 1 · Depends on: nothing · See `00-roadmap.md` for decisions D1–D8.

## 1. Goal

The doctor and her trainee keep a complete record of each patient. They add visits, numeric measures, and lesion photos. They see change over time. All work happens on a laptop or a phone.

This first build has no login (decision D8). Anyone who can open the app can use it. Section 4.1 covers what this means and what it does not cover yet.

Success test: the doctor can run a real clinic day on this app, and the trainee can enter the same data without help.

## 2. Users

| User | Rights |
|------|--------|
| Doctor | Full access. |
| Trainee | Same as doctor (decision D1). |

There is no login and no accounts in this first build (decision D8). Both people share the same open app. Because of this, the audit log (4.8) cannot yet tell the doctor and the trainee apart — see open item O7 in `03-technical-decisions.md`.

## 3. Scope

**In scope:** patient records, visit records, numeric measures, lesion photos, trend chart, search, consent record, audit log, archive and restore.

**Out of scope for M1:** login and accounts (decision D8), remedy library, PDF extraction, matching, analytics, export, ML, data import, roles beyond "both users equal", multi-clinic use, patient login, notifications.

## 4. Functional requirements

### 4.1 Login — deferred

FR-1 to FR-4 (email/password login, two-factor login, session timeout, no public sign-up) are deferred to a later module, per decision D8. We build them once the rest of M1 is functional.

Until then: **the app must not run on a public URL, and must not hold real patient data** (see NFR-13). It should run on a private network, or hold only invented or de-identified test data, until login ships.

### 4.2 Patients

- FR-5 A user can create a patient with: name, date of birth or age, sex, phone, address.
- FR-6 The system gives each patient a short code (`P-0001`, `P-0002`, and so on). The code never contains identity data. Later modules use this code in place of the name.
- FR-7 The patient list shows code, name, age, sex, and last visit date. It is sorted by last visit.
- FR-8 A user can search by name, phone, or code.
- FR-9 A user can edit patient details.
- FR-10 A user can archive a patient. Archived patients do not show in the list by default. A user can restore them. M1 has no hard delete.

### 4.3 Consent

- FR-11 Each patient has two consent records: (a) consent to store the case, (b) consent to use anonymized data for research. Each record has a yes or no value, a date, and an optional note.
- FR-12 The system does not block work if consent (b) is "no." It only records the choice. Later modules must respect it (gate G2).

### 4.4 Visits

- FR-13 A user can add a visit to a patient. A visit has a date, a type (first visit or follow-up), and the case fields in FR-14.
- FR-14 Case fields: chief complaint, history, symptoms, oral or esophageal findings, and notes. All are free text. **The final field list comes from the doctor's case form (N1 in `question-tracker.md`, asked now in `02-client-questions.md`). Update this section when we have it.**
- FR-15 A user can edit a visit after saving. The audit log records each edit.
- FR-16 A patient page shows visits in date order, newest first.
- FR-17 A user can save a visit as a draft and finish it later.

### 4.5 Measures

Each visit can hold these values. All are optional.

| Measure | Type | Range or unit |
|---------|------|---------------|
| Lesion site | Text | Free text (for example "left buccal mucosa") |
| Lesion size | Number | Millimeters. Longest dimension. Second dimension is optional. |
| Pain | Whole number | 0 to 10 |
| Clinical grade | Text | Placeholder. Scale not chosen yet (client Q1, Q2). |
| Quality-of-life score | Number and scale name | Placeholder. Scale not chosen yet (client Q1, Q2). |

- FR-18 The form rejects values outside the range (for example pain 11, or negative size).
- FR-19 When the doctor chooses scales (client Q1, Q2), we replace the two placeholder fields. This is a small change. We do not build a scale-management feature now.
- FR-20 One lesion per patient is assumed in M1. If the doctor tracks several lesions, we raise it before build (client Q4).

### 4.6 Photos

Default design (client Q3 is open): photos attach to a visit.

- FR-21 A user can add one or more photos to a visit.
- FR-22 On a phone, the upload button opens the camera or the photo library.
- FR-23 Each photo has a site label and an optional note. The date comes from the visit.
- FR-24 The app shrinks each photo to at most 2000 pixels on the long side before upload. It removes GPS data from the file.
- FR-25 Photos are private. Only logged-in users can view them, through short-lived links.
- FR-26 A user can view a photo full size and remove it. Removal is a soft delete with restore (see FR-10).
- FR-27 A patient page shows a photo strip in date order, so the doctor can see change over time.

If the doctor prefers photos on the patient only (client Q3), FR-21 to FR-27 change in small ways. The rest of M1 stays the same.

### 4.7 Trends

- FR-28 A patient page shows a line chart of lesion size over time and a line chart of pain over time. Each point is one visit.
- FR-29 Hovering or tapping a point shows the visit date and value.
- FR-30 If a patient has fewer than two values, the chart shows a short message instead.

### 4.8 Audit log

- FR-31 The system records every create, edit, archive, and restore: who, when, which record, and the old and new values.
- FR-32 Users can view the audit log for one patient. There is no global log screen in M1. The client can read the full log in Supabase.
- FR-33 Users cannot edit or delete the audit log.

## 5. Screens

1. Login — deferred (4.1). Not in this build.
2. Patient list, with search and "New patient"
3. New or edit patient
4. Patient page: details, consent, trend charts, photo strip, visit list, audit log
5. New or edit visit: case fields, measures, photos

Each screen works at phone width (360 px) and on a laptop.

## 6. Data model

All tables have `id`, `created_at`, `updated_at`, `created_by`, and `archived_at` (null means active).

| Table | Main fields |
|-------|-------------|
| `patients` | `code`, `name`, `dob`, `age_years`, `sex`, `phone`, `address` |
| `consents` | `patient_id`, `kind` (`storage` or `research`), `granted`, `date`, `note` |
| `visits` | `patient_id`, `visit_date`, `visit_type`, `status` (`draft` or `final`), case fields (per client request N1) |
| `measures` | `visit_id`, `lesion_site`, `lesion_size_mm`, `lesion_size_mm_2`, `pain_0_10`, `clinical_grade`, `qol_scale`, `qol_score` |
| `photos` | `visit_id`, `storage_path`, `site_label`, `note` |
| `audit_log` | `table_name`, `record_id`, `action`, `old_values`, `new_values`, `user_id`, `at` |

Notes:

- Either `dob` or `age_years` is set. If `dob` is set, the app shows age from it.
- `measures` could sit inside `visits`. A separate table keeps the door open for several lesions without a rewrite. It costs one join. Decide at build time after client Q4.
- Photos live in a private Supabase storage bucket. The table holds only the path.
- A database trigger writes `audit_log`. The app cannot skip it.

## 7. Non-functional requirements

**Security and privacy**

- NFR-1 All traffic uses HTTPS.
- NFR-2 Row-level security is on for every table. Only the two logged-in users can read or write. Deferred with login (decision D8) — see NFR-13.
- NFR-3 The photo bucket is private. No public URLs.
- NFR-4 Secrets stay in environment variables. They never enter the code repository.
- NFR-5 The app shows a short notice that explains what data it stores and why (DPDP purpose limit). A lawyer reviews the text.
- NFR-6 The data stays in India if the client's plan allows it (technical item V1). If not, we record this as a risk and the client decides.

**Reliability**

- NFR-7 Daily database backups are on. We test one restore before go-live.
- NFR-8 Photos are backed up too. Database backups may not include storage files (technical item V2). We confirm this, and add a scheduled copy of the photo bucket if needed.

**Usability**

- NFR-9 A new patient and a first visit take under 5 minutes to enter with typical data.
- NFR-10 Forms save drafts, so a lost connection does not lose work.
- NFR-11 English UI only.

**Performance**

- NFR-12 Pages load in under 3 seconds on a normal mobile connection for up to 5,000 patients.

**Interim safeguard, no login (decision D8)**

- NFR-13 Until the login module ships, the app runs only on a private network or localhost, never a public URL, and holds only invented or de-identified test data. No real patient data goes in before login exists.

## 8. Acceptance tests

1. Deferred to the login module (D8): a logged-out visitor cannot see any patient or photo, even with a direct link.
2. The doctor creates a patient, adds a first visit with measures and two photos, and sees them on the patient page.
3. The trainee adds a follow-up visit on a phone with a camera photo, and the doctor sees it.
4. A pain value of 11 is rejected.
5. The trend charts show the correct points for three visits.
6. An edit to a visit appears in that patient's audit log with old and new values.
7. An archived patient disappears from the list and returns after restore.
8. Search finds a patient by partial name, phone, and code.
9. A photo taken with GPS data has no GPS data after upload.
10. Deferred to the login module (D8): after 30 minutes of no use, the app asks for login.
11. A test restore of the database backup succeeds.
12. The app is confirmed to run only on a private network or localhost, per NFR-13, before any real patient data is entered.

## 9. Open questions for M1

What we're asking the client right now is in `02-client-questions.md`. Every question, its id, and its default is tracked in `question-tracker.md`. Technical items are in `03-technical-decisions.md`. This document uses the default for each one until the answer arrives.

## 10. Risks

- **Loss of patient data.** Backups must be tested. Photos need their own backup (NFR-8).
- **No login (D8).** Until the login module ships, anyone with access to the app or device can see and change everything, and the audit log cannot tell the doctor and trainee apart (O7). Mitigation: NFR-13 — private network only, test data only, until login exists.
- **Placeholder scales.** If the doctor delays client Q1 and Q2 for months, the grade and QoL data may be inconsistent. Free text makes comparison hard. Ask again before M5.
- **Scope creep.** Every new field the doctor requests adds work. Log requests and add them by module.
