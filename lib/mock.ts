// All data here is invented for the demo. No real patient, photo, or remedy text.

export type Visit = {
  id: string;
  date: string; // ISO
  type: "First visit" | "Follow-up";
  status: "final" | "draft";
  complaint: string;
  findings: string;
  notes: string;
  site: string;
  sizeMm: number;
  pain: number;
  grade: string;
  qol: number; // 0-100, placeholder scale
};

export type Patient = {
  id: string;
  code: string;
  name: string;
  age: number;
  sex: "F" | "M";
  phone: string;
  address: string;
  consentStorage: boolean;
  consentResearch: boolean;
  visits: Visit[];
};

const v = (
  id: string,
  date: string,
  type: Visit["type"],
  site: string,
  sizeMm: number,
  pain: number,
  grade: string,
  qol: number,
  complaint: string,
  findings: string,
  notes = "",
): Visit => ({ id, date, type, status: "final", complaint, findings, notes, site, sizeMm, pain, grade, qol });

export const patients: Patient[] = [
  {
    id: "p1", code: "P-0001", name: "Meera Iyer", age: 58, sex: "F", phone: "98•••• 1042",
    address: "Sample address, Pune", consentStorage: true, consentResearch: true,
    visits: [
      v("p1v1", "2026-05-06", "First visit", "Left buccal mucosa", 32, 7, "II", 48, "Non-healing ulcer for 3 months; burning on spicy food.", "Ulcero-proliferative lesion, firm edges, no trismus."),
      v("p1v2", "2026-06-03", "Follow-up", "Left buccal mucosa", 28, 6, "II", 55, "Pain slightly less. Eating is easier.", "Edges softer. Surface cleaner."),
      v("p1v3", "2026-07-08", "Follow-up", "Left buccal mucosa", 22, 4, "II", 63, "Sleeping better. Burning only with hot food.", "Lesion smaller, base less indurated."),
      v("p1v4", "2026-08-12", "Follow-up", "Left buccal mucosa", 18, 3, "I", 71, "Little pain. Appetite good.", "Marked reduction in size.", "Continue same plan."),
    ],
  },
  {
    id: "p2", code: "P-0002", name: "Ramesh Kulkarni", age: 64, sex: "M", phone: "97•••• 7781",
    address: "Sample address, Nashik", consentStorage: true, consentResearch: true,
    visits: [
      v("p2v1", "2026-04-22", "First visit", "Lower third esophagus", 45, 5, "III", 40, "Difficulty swallowing solids; weight loss.", "Endoscopy: circumferential growth, 45 mm."),
      v("p2v2", "2026-05-27", "Follow-up", "Lower third esophagus", 48, 6, "III", 38, "Pain on swallowing has increased.", "Slight increase in length."),
      v("p2v3", "2026-07-01", "Follow-up", "Lower third esophagus", 44, 5, "III", 44, "Swallowing semi-solids again.", "Stable to slightly smaller."),
    ],
  },
  {
    id: "p3", code: "P-0003", name: "Anita Deshmukh", age: 47, sex: "F", phone: "99•••• 3320",
    address: "Sample address, Mumbai", consentStorage: true, consentResearch: false,
    visits: [
      v("p3v1", "2026-06-10", "First visit", "Right lateral border of tongue", 20, 6, "I", 60, "Painful patch on tongue for 2 months.", "Erythro-leukoplakic patch with small ulcer."),
      v("p3v2", "2026-07-15", "Follow-up", "Right lateral border of tongue", 18, 5, "I", 64, "Pain less at night.", "Ulcer healing at the centre."),
      v("p3v3", "2026-08-19", "Follow-up", "Right lateral border of tongue", 17, 4, "I", 68, "Comfortable most days.", "Patch flatter."),
    ],
  },
  {
    id: "p4", code: "P-0004", name: "Suresh Patel", age: 71, sex: "M", phone: "98•••• 5567",
    address: "Sample address, Surat", consentStorage: true, consentResearch: true,
    visits: [
      v("p4v1", "2026-05-14", "First visit", "Mid esophagus", 38, 4, "II", 52, "Food sticks at mid chest.", "Ulcerated stricture, 38 mm."),
      v("p4v2", "2026-06-25", "Follow-up", "Mid esophagus", 35, 4, "II", 57, "Swallowing steady.", "Slight reduction."),
    ],
  },
  {
    id: "p5", code: "P-0005", name: "Farida Sheikh", age: 52, sex: "F", phone: "90•••• 2214",
    address: "Sample address, Hyderabad", consentStorage: true, consentResearch: true,
    visits: [
      v("p5v1", "2026-07-02", "First visit", "Right gingivo-buccal sulcus", 26, 8, "II", 42, "Severe pain, cannot open mouth fully.", "Proliferative growth, mild trismus."),
      v("p5v2", "2026-08-06", "Follow-up", "Right gingivo-buccal sulcus", 24, 6, "II", 50, "Pain better with warm water rinses.", "Mouth opening slightly better."),
    ],
  },
  {
    id: "p6", code: "P-0006", name: "Vikram Rao", age: 39, sex: "M", phone: "93•••• 8890",
    address: "Sample address, Bengaluru", consentStorage: true, consentResearch: false,
    visits: [
      v("p6v1", "2026-09-09", "First visit", "Left lateral border of tongue", 14, 3, "I", 72, "Rough spot on tongue, tobacco chewer.", "Small indurated ulcer."),
    ],
  },
  {
    id: "p7", code: "P-0007", name: "Lakshmi Nair", age: 66, sex: "F", phone: "94•••• 6103",
    address: "Sample address, Kochi", consentStorage: true, consentResearch: true,
    visits: [
      v("p7v1", "2026-06-17", "First visit", "Right buccal mucosa", 30, 6, "II", 50, "Ulcer with bleeding on brushing.", "Ulcero-proliferative, 30 mm."),
      v("p7v2", "2026-07-22", "Follow-up", "Right buccal mucosa", 27, 5, "II", 56, "Bleeding less.", "Reduced friability."),
      v("p7v3", "2026-08-26", "Follow-up", "Right buccal mucosa", 25, 4, "II", 60, "Steady.", "Smaller."),
    ],
  },
  {
    id: "p8", code: "P-0008", name: "Arjun Menon", age: 55, sex: "M", phone: "96•••• 4471",
    address: "Sample address, Chennai", consentStorage: true, consentResearch: true,
    visits: [
      v("p8v1", "2026-08-03", "First visit", "Upper third esophagus", 33, 5, "II", 55, "Painful swallowing, hoarse voice.", "Polypoid growth, 33 mm."),
      v("p8v2", "2026-09-07", "Follow-up", "Upper third esophagus", 30, 4, "II", 60, "Voice clearer.", "Slight reduction."),
    ],
  },
];

export const lastVisit = (p: Patient) => p.visits[p.visits.length - 1];
export const findPatient = (id: string) => patients.find((p) => p.id === id);
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ---------- Remedy library (M2 preview). Placeholder text only. ----------

export type Remedy = {
  slug: string;
  name: string;
  sections: { heading: string; bullets: string[] }[];
};

const sample = (extra: string[]) => [
  { heading: "Mind", bullets: ["Sample bullet: anxious about health", "Sample bullet: wants company"] },
  { heading: "Oral and throat", bullets: extra },
  { heading: "Modalities", bullets: ["Better: sample condition A", "Worse: sample condition B"] },
  { heading: "Notes", bullets: ["Placeholder text. The real text comes from the doctor's 600-page document."] },
];

export const remedies: Remedy[] = [
  ["arsenicum-album", "Arsenicum album", ["Burning pain, better with warmth", "Ulcer with thin, acrid discharge"]],
  ["phosphorus", "Phosphorus", ["Bleeds easily", "Burning in the oesophagus"]],
  ["hydrastis", "Hydrastis canadensis", ["Thick, stringy discharge", "Ulcers with raw edges"]],
  ["condurango", "Condurango", ["Cracks at the mouth corners", "Pain on swallowing"]],
  ["carbo-animalis", "Carbo animalis", ["Hard, stony glands", "Burning, stitching pain"]],
  ["kali-bichromicum", "Kali bichromicum", ["Punched-out ulcers", "Ropy discharge"]],
  ["nitricum-acidum", "Nitricum acidum", ["Splinter-like pain", "Ulcers bleed on touch"]],
  ["lachesis", "Lachesis mutus", ["Left-sided complaints", "Worse after sleep"]],
  ["thuja", "Thuja occidentalis", ["Warty growths", "Worse in damp weather"]],
  ["silicea", "Silicea", ["Slow-healing ulcers", "Sensitive to cold"]],
].map(([slug, name, extra]) => ({ slug: slug as string, name: name as string, sections: sample(extra as string[]) }));

// ---------- Matching (M4 preview). Score is a sum of visible points, not a probability. ----------

export type MatchInput = { label: string; points: number; max: number; why: string };
export type MatchRow = { remedy: string; total: number; max: number; inputs: MatchInput[] };

const row = (remedy: string, pts: [number, number, number, number]): MatchRow => {
  const max = [4, 3, 3, 2];
  const labels = [
    ["Symptom overlap", "Complaint terms appear in the remedy text"],
    ["Lesion site", "Lesion site is named in the remedy's oral/throat section"],
    ["Modalities", "Reported better/worse conditions fit the remedy"],
    ["Morphology", "Lesion form fits the remedy description"],
  ];
  const inputs = pts.map((p, i) => ({ label: labels[i][0], points: p, max: max[i], why: labels[i][1] }));
  return { remedy, total: pts.reduce((a, b) => a + b, 0), max: 12, inputs };
};

export const matchRows: MatchRow[] = [
  row("Arsenicum album", [4, 3, 2, 2]),
  row("Phosphorus", [3, 2, 3, 1]),
  row("Nitricum acidum", [3, 2, 2, 1]),
  row("Hydrastis canadensis", [2, 2, 1, 2]),
  row("Kali bichromicum", [2, 1, 2, 1]),
];

// ---------- Analytics (M5 preview) ----------

export const prescriptionMix = [
  { remedy: "Arsenicum album", count: 24 },
  { remedy: "Phosphorus", count: 19 },
  { remedy: "Nitricum acidum", count: 15 },
  { remedy: "Hydrastis", count: 11 },
  { remedy: "Thuja", count: 8 },
  { remedy: "Others", count: 21 },
];

export const outcomeTrend = [
  { month: "Month 0", arsenicum: 0, phosphorus: 0, nitricum: 0 },
  { month: "Month 1", arsenicum: -6, phosphorus: -4, nitricum: -3 },
  { month: "Month 2", arsenicum: -13, phosphorus: -9, nitricum: -7 },
  { month: "Month 3", arsenicum: -21, phosphorus: -15, nitricum: -10 },
  { month: "Month 4", arsenicum: -27, phosphorus: -18, nitricum: -14 },
  { month: "Month 5", arsenicum: -31, phosphorus: -22, nitricum: -15 },
];

export const monthlyVisits = [
  { month: "Apr", visits: 9 }, { month: "May", visits: 16 }, { month: "Jun", visits: 22 },
  { month: "Jul", visits: 27 }, { month: "Aug", visits: 31 }, { month: "Sep", visits: 34 },
];

// ---------- Export (M6 preview): de-identified rows ----------

export const exportRows = patients
  .filter((p) => p.consentResearch)
  .flatMap((p) =>
    p.visits.map((vis, i) => ({
      subject: `S-${p.code.slice(2)}`,
      age_band: `${Math.floor(p.age / 10) * 10}-${Math.floor(p.age / 10) * 10 + 9}`,
      sex: p.sex,
      visit_no: i + 1,
      days_from_first: Math.round((+new Date(vis.date) - +new Date(p.visits[0].date)) / 864e5),
      site: vis.site,
      lesion_size_mm: vis.sizeMm,
      pain_0_10: vis.pain,
      grade: vis.grade,
      qol: vis.qol,
    })),
  );
