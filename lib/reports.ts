// Report reader samples (M3 preview).
export type ReportField = { name: string; value: string; from: string };
export type ReportKind = { id: string; label: string; lines: string[]; fields: ReportField[] };

// All reports are invented. Real reports vary in wording and layout.
export const reportKinds: ReportKind[] = [
  {
    id: "endoscopy", label: "Endoscopy",
    lines: [
      "CITY HOSPITAL (SAMPLE) — GASTROENTEROLOGY UNIT",
      "UPPER GI ENDOSCOPY REPORT",
      "Patient ID: P-0002     Date: 22-Apr-2026",
      "Indication: Progressive dysphagia to solids, weight loss.",
      "Findings: An ulcero-proliferative, circumferential growth is seen in the lower third of the esophagus, 32 to 36 cm from the incisors, measuring approximately 4.5 cm in length. Friable, bleeds on contact. Scope passes with difficulty.",
      "Impression: Growth lower third esophagus. Biopsy taken.",
    ],
    fields: [
      { name: "Tumor site", value: "Lower third esophagus", from: "lower third of the esophagus" },
      { name: "Length", value: "45 mm", from: "approximately 4.5 cm in length" },
      { name: "Morphology", value: "Ulcero-proliferative, circumferential", from: "ulcero-proliferative, circumferential growth" },
    ],
  },
  {
    id: "biopsy", label: "Biopsy",
    lines: [
      "SAMPLE PATHOLOGY LABORATORY — HISTOPATHOLOGY REPORT",
      "Patient ID: P-0001     Date: 06-Mar-2026",
      "Specimen: Incision biopsy, left buccal mucosa.",
      "Microscopy: Sheets and nests of atypical squamous cells with keratin pearls and invasion into underlying connective tissue.",
      "Diagnosis: Squamous cell carcinoma, moderately differentiated (Grade 2). Margins not assessed on biopsy.",
    ],
    fields: [
      { name: "Specimen site", value: "Left buccal mucosa", from: "left buccal mucosa" },
      { name: "Type", value: "Squamous cell carcinoma", from: "squamous cell carcinoma" },
      { name: "Grade", value: "Moderately differentiated (G2)", from: "moderately differentiated (grade 2)" },
    ],
  },
  {
    id: "mri", label: "MRI",
    lines: [
      "SAMPLE IMAGING CENTRE — MRI HEAD AND NECK WITH CONTRAST",
      "Patient ID: P-0001     Date: 10-Mar-2026",
      "Findings: Enhancing mass in the left buccal mucosa measuring 2.8 x 2.1 cm. Extension into the adjacent masticator space. Left level II lymph node, 1.4 cm, rounded.",
      "Impression: Primary mass with probable left level II nodal involvement.",
    ],
    fields: [
      { name: "Primary size", value: "28 × 21 mm", from: "2.8 x 2.1 cm" },
      { name: "Local extension", value: "Masticator space", from: "masticator space" },
      { name: "Nodes", value: "Left level II, 14 mm", from: "left level ii lymph node, 1.4 cm" },
    ],
  },
  {
    id: "pet", label: "PET scan",
    lines: [
      "SAMPLE NUCLEAR MEDICINE — FDG PET-CT WHOLE BODY",
      "Patient ID: P-0001     Date: 14-Mar-2026",
      "Findings: FDG-avid mass in the left buccal mucosa, SUVmax 11.2. FDG-avid left level II node, SUVmax 6.4. No distant uptake.",
      "Impression: Loco-regional disease. No distant metastasis seen.",
    ],
    fields: [
      { name: "Primary uptake", value: "SUVmax 11.2", from: "suvmax 11.2" },
      { name: "Nodal uptake", value: "Left level II, SUVmax 6.4", from: "suvmax 6.4" },
      { name: "Distant disease", value: "None seen", from: "no distant metastasis seen" },
    ],
  },
  {
    id: "ct", label: "CT scan",
    lines: [
      "SAMPLE IMAGING CENTRE — CT NECK AND CHEST WITH CONTRAST",
      "Patient ID: P-0001     Date: 12-Mar-2026",
      "Findings: Soft-tissue mass in the left buccal region, 2.7 cm, with mild erosion of the adjacent mandible. Lungs clear. No pulmonary nodules.",
      "Impression: Primary lesion with early bone erosion. Chest clear.",
    ],
    fields: [
      { name: "Primary size", value: "27 mm", from: "2.7 cm" },
      { name: "Bone", value: "Early mandibular erosion", from: "mild erosion of the adjacent mandible" },
      { name: "Chest", value: "Clear", from: "lungs clear" },
    ],
  },
  {
    id: "sono", label: "Sonography",
    lines: [
      "SAMPLE ULTRASOUND CLINIC — NECK AND ABDOMEN",
      "Patient ID: P-0001     Date: 08-Mar-2026",
      "Neck: Two hypoechoic lymph nodes in left level II, the larger 13 mm, loss of fatty hilum.",
      "Abdomen: Liver normal in size and echotexture. No focal lesion.",
    ],
    fields: [
      { name: "Neck nodes", value: "2 nodes, left level II, largest 13 mm", from: "two hypoechoic lymph nodes in left level ii, the larger 13 mm" },
      { name: "Node features", value: "Loss of fatty hilum", from: "loss of fatty hilum" },
      { name: "Liver", value: "No focal lesion", from: "no focal lesion" },
    ],
  },
];
