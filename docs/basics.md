# Client Basics

Status: Source document. Two emails from the client, Dr. Shruti Shah, distilled. This is not a spec. See `00-roadmap.md` for what we build first.

## 1. Long-term vision: OCIS

Dr. Shah wants an AI clinical assistant for oncology. She calls it OCIS — Oncology Clinical Intelligence System. The first target is oral cancer, mainly oral squamous cell carcinoma.

### 1.1 The flow she wants

Patient data — structured clinical facts, the patient's own words, pathology reports, imaging, lesion photos — goes through AI-assisted analysis. The system suggests groups of homeopathic remedies. The doctor makes the final choice.

### 1.2 Knowledge she is building herself

- A structured library of about 150 homeopathic remedies. She is translating the Materia Medica into: clinical/pathological language, patient language, characteristic symptoms and sensations, modalities and generals, organ affinity, and oncology links where science supports them.
- A clinical ontology for oral cancer: anatomy, lesion shape, histopathology, staging, symptoms, and molecular/biological features.

### 1.3 Clinical reasoning, not just symptom matching

She wants the system to learn how an experienced clinician thinks: which features matter most in a case, how symptoms are weighed against each other, remedy differentials, when to continue, repeat, change, or stop a remedy, and how a case changes over time.

She works with a mentor, Dr. Sunirmal Sarkar, an experienced cancer homeopath. She plans to observe several hundred of his consultations and record his reasoning. This becomes an "expert-reasoning" layer for the system, built over time.

### 1.4 Technical components she named

1. Doctor-facing clinical case interface
2. Structured clinical database / ontology
3. Pathology report and medical document extraction
4. Patient-language to structured clinical concept NLP
5. Image / lesion analysis (a separate module at first)
6. Homeopathic knowledge base / knowledge graph
7. AI retrieval and reasoning engine
8. Longitudinal patient / case tracking
9. Explainable recommendations (why a remedy group was suggested)
10. Follow-up / outcome database for research

### 1.5 What she does not want

A simple chatbot, or a system that just searches symptoms and returns one remedy.

### 1.6 Her practical first version

Case entry → structured phenotype → retrieval and reasoning from a validated knowledge base → remedy clusters with reasons → doctor review → follow-up. Image analysis and deeper AI come later.

She builds the clinical knowledge and ontology herself. She wants us to build the technical system on top of it.

## 2. First release ask (concrete spec)

Her second email turned the vision above into a specific build request.

- **Product:** Cloud-based Clinical AI Assistant & Research SaaS platform, for oral and esophageal oncology.
- **Timeline:** go-live targeted for mid-February.
- **Hosting:** on her own corporate cloud account, for full IP ownership.
- **Remedy data pipeline:** parse her 600-page Word document (150 remedies, 3–4 pages each, in consistent bullet points) into a searchable database.
- **Document AI:** OCR/NLP to read unstructured English endoscopy report PDFs and pull out tumor site, dimensions, and morphology.
- **Clinical intake:** a dashboard for assistant doctors to enter case forms, log lesion photos, and track lesion size (mm), pain (0–10), clinical grade, and quality-of-life scores over time.
- **Matching engine:** cross-reference endoscopy data, lesion metadata, and symptoms to rank the 150 remedies by percentage match.
- **Research analytics:** a live dashboard of prescription distributions, outcome trends, and efficacy curves.
- **Automated ML:** a scheduled pipeline that strips all patient-identifying information, then trains on the anonymized data to surface long-term therapeutic patterns.
- **Data export:** one-click download of filtered, anonymized data as CSV or XLSX, for journal submission.
