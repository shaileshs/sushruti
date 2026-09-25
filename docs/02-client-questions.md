# Questions and Requests for the Client

Status: Draft 2 · Non-technical items only. Technical decisions are in `03-technical-decisions.md`. We decide those ourselves.

Write each question in plain words. Mark an item **Done** when answered, and move the answer to the module document.

## 1. Needed now (base module)

| # | Request | Why we need it | If not given |
|---|---------|----------------|--------------|
| N1 | Your current case-taking form (paper, Word, or a photo of it) | The visit form in the app will copy your real form. | We use simple free-text fields. |
| N2 | An email address for you and one for your trainee | Each person gets a separate login. | We cannot create logins. |
| N3 | A lawyer to review the privacy notice, the patient consent text, and your record-keeping rule under India's data protection law | Patient data is sensitive. A legal check protects you. | We write a short draft. It is not reviewed. |

## 2. Questions for the doctor (base module)

| # | Question | If not answered |
|---|----------|-----------------|
| Q1 | Which grading scale do you use for the lesion? For example: TNM stage, WHO grade, or your own scale. | Two placeholder fields. |
| Q2 | Which quality-of-life scale do you use? Or do you want a simple scale of your own? | Same placeholder. |
| Q3 | Do you want photos kept with each visit, or with the patient only? | With each visit. |
| Q4 | Does one patient ever have more than one lesion that you measure? | One lesion per patient. |
| Q5 | What else do you write down at each visit? For example: remedy, potency, dose, next visit date. | Not in the first release. |
| Q6 | How long must you keep patient records? What do you do if a patient asks you to erase their data? | We only archive. Nothing is erased for good. |
| Q7 | Do patients sign a consent form now? Do you have text for consent to store their case, and for research use? | We write a short draft for the lawyer. |
| Q8 | Do you and the trainee enter data in English only? | English only. |

## 3. Needed later (ask early, because these take time)

| # | Module | Request | Why we need it |
|---|--------|---------|----------------|
| N6 | Remedy library | The 600-page Word document. If it is private, send 5 remedies (about 20 pages) first. | We check its structure before we build. |
| N7 | Remedy library | The list of the 150 remedies, and the bullet headings used in each. | To define what we store for each remedy. |
| N8 | Endoscopy reading | 5 to 10 sample endoscopy PDFs, with patient details removed | Layouts differ between hospitals. We need real samples. |
| N9 | Endoscopy reading | Which findings matter to you (tumor site, size, shape), and the words you expect for each | To define what the tool must find. |
| N10 | Matching | A written description of how you choose a remedy today. Which inputs count most? | We cannot design a "match" without this. |
| N11 | Charts | The charts you want to see. For example: prescriptions per month, or lesion size change by remedy. | To avoid building charts nobody uses. |
| N12 | Export | The journal formats you must meet, and which fields a journal needs | To design the export file. |

## 4. Questions for the doctor (later modules)

| # | Module | Question |
|---|--------|----------|
| Q9 | Matching | What must the "percentage match" mean to you? A rank order, or a claimed chance of benefit? |
| Q10 | Matching | Do you want the screen to show why each remedy scored as it did? (We recommend yes.) |
| Q11 | Export | Have patients agreed to research use of their anonymized data? |
| Q12 | Export | Does a journal or an ethics committee need to approve your research? |
| Q13 | Machine learning | How many patients do you expect in the first year? This tells us whether ML can give a useful result. |

## 5. Answers received

| Question | Answer |
|----------|--------|
| Base module scope | Login, patient intake, tracking |
| Country | India |
| Who uses the app | The doctor and one trainee. Same rights. No wider use. |
| Devices | Laptop and phone |
| Patient identity fields | Name, age or date of birth, sex, phone, address |
| Case form | The doctor will share it (see N1) |
| Existing data | Start fresh |
| Hosting | Vercel and Supabase in the client's own accounts. Accepted. |
| Scales | Decide later |
| Photos | Open |
| Timeline | Not a concern for now |
