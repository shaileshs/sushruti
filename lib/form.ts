// Case form definition for the demo. Source: docs/04-form-definition.md.
// `opt` fields come from the Word template and stay collapsed until the user asks for them.

export type Col = { k: string; label: string };
export type Field = {
  k: string;
  label: string;
  t: "text" | "long" | "num" | "enum" | "multi" | "list";
  opts?: string[];
  cols?: Col[];
  opt?: boolean;
  unit?: string;
  state?: boolean; // numeric measure with value / not assessed / not known / absent
  hint?: string;
};
export type Section = { id: string; n: string; title: string; fields: Field[] };
export type Row = Record<string, string>;
export type Val = string | string[] | Row[];

export const MEASURE_STATES = ["Value", "Absent", "Not assessed", "Not known"] as const;

const text = (k: string, label: string, o: Partial<Field> = {}): Field => ({ k, label, t: "text", ...o });
const long = (k: string, label: string, o: Partial<Field> = {}): Field => ({ k, label, t: "long", ...o });
const num = (k: string, label: string, o: Partial<Field> = {}): Field => ({ k, label, t: "num", state: true, ...o });
const en = (k: string, label: string, opts: string[], o: Partial<Field> = {}): Field => ({ k, label, t: "enum", opts, ...o });
const multi = (k: string, label: string, opts: string[], o: Partial<Field> = {}): Field => ({ k, label, t: "multi", opts, ...o });
const list = (k: string, label: string, cols: string[], o: Partial<Field> = {}): Field => ({
  k, label, t: "list", cols: cols.map((c) => ({ k: c.toLowerCase().replace(/\W+/g, "_"), label: c })), ...o,
});

export const sections: Section[] = [
  {
    id: "since", n: "F", title: "Since last visit",
    fields: [
      long("change", "Patient’s exact description of change", { hint: "Write the patient’s own words." }),
      long("newsym", "New symptoms, adverse events, safety concerns"),
      en("response", "Patient-reported response", ["Improved", "Unchanged", "Mixed", "Worsened", "Unclear"]),
      long("assess", "Clinician assessment, with basis"),
      long("since_onc", "Oncology treatment or tests since last visit", { opt: true }),
    ],
  },
  {
    id: "s1", n: "1", title: "Diagnosis and type",
    fields: [
      text("dx", "Diagnosis / type of carcinoma"),
      en("side", "Side", ["Left", "Right", "Midline", "Bilateral"]),
      text("dx_site", "Primary site and subsite"),
      text("dx_when", "Diagnosed on, at which institution", { opt: true }),
    ],
  },
  {
    id: "s2", n: "2", title: "Histopathology",
    fields: [text("hp_type", "Type"), text("hp_grade", "Grade"), long("hp_find", "Key findings")],
  },
  {
    id: "s3", n: "3", title: "Investigations",
    fields: [
      list("imaging", "Imaging (MRI, CT, PET-CT, other)", ["Study", "Date", "Result"]),
      list("blood", "Blood work and markers", ["Test", "Result", "Date"]),
    ],
  },
  {
    id: "s4", n: "4", title: "TNM, stage, metastasis",
    fields: [
      text("t", "T"), text("n", "N"), text("m", "M"), text("stage", "Stage"),
      list("nodes", "Nodes / metastasis", ["Site", "Evidence", "Date"]),
      text("sys", "Staging system and edition, date", { opt: true }),
    ],
  },
  {
    id: "s5", n: "5", title: "Oncology history and treatment",
    fields: [
      list("prevtx", "Previous cancer treatment", ["Type", "Dates", "Response"]),
      text("curtx", "Current oncology treatment, treating centre"),
      list("meds", "Current medicines", ["Name", "Dose", "Reason"], { opt: true }),
      text("comorb", "Comorbidities", { opt: true }),
      text("goal", "Patient’s main goal or concern for this visit", { opt: true }),
    ],
  },
  {
    id: "s6", n: "6", title: "Chief complaint and lesion",
    fields: [
      long("complaint", "Chief complaint, exact patient words"),
      text("onset", "Origin, duration, first noticed"),
      en("progress", "Progress", ["Improving", "Unchanged", "Gradual increase", "Rapid increase", "Fluctuating", "Unsure"]),
      text("site", "Lesion location"),
      num("size", "Size", { unit: "mm" }),
      en("morph", "Morphology", ["Ulcerative", "Exophytic", "Infiltrative", "Proliferative", "White/red patch", "Mixed", "Other"]),
      text("surface", "Surface, margin, base, induration"),
      text("bleed", "Bleeding, discharge, necrosis, odour"),
      text("pain_where", "Pain: type, location, extension"),
      num("pain", "Pain intensity (0–10)"),
      text("pain_mod", "Modalities of pain (better / worse from)"),
      text("pain_conc", "Concomitants with pain"),
      multi("dry", "Dryness of mouth / salivation", ["Normal", "Reduced", "Increased", "Thick", "Ropy", "Frothy", "Sticky", "Offensive", "Blood-stained"]),
      text("tongue", "Tongue, teeth, gums"),
      num("mouth", "Trismus: mouth opening", { unit: "mm" }),
      text("swallow", "Dysphagia; chewing, speech, taste"),
      text("subsite", "Subsite and number of lesions", { opt: true }),
      num("size2", "Second dimension", { unit: "mm", opt: true }),
      num("depth", "Depth", { unit: "mm", opt: true }),
      text("pain_time", "Pain timing", { opt: true }),
      text("hygiene", "Halitosis, oral hygiene, nutrition impact", { opt: true }),
    ],
  },
  {
    id: "s7", n: "7", title: "Other complaints",
    fields: [list("other", "Other complaints", ["Complaint (exact words)", "Onset and duration", "Sensation and location", "Modalities and concomitants", "Frequency and impact"])],
  },
  {
    id: "s8", n: "8", title: "Characteristic / peculiar symptoms",
    fields: [list("peculiar", "Peculiar symptoms", ["Symptom (exact words)", "Why it stands out", "Source", "Clinician note"])],
  },
  {
    id: "s9", n: "9", title: "Past history",
    fields: [
      long("past", "Past illnesses, operations, injuries"),
      text("prior_oral", "Previous oral lesions / precancerous conditions", { opt: true }),
      list("prior_hom", "Previous homeopathic treatment", ["Remedy", "Potency", "Duration", "Response"], { opt: true }),
    ],
  },
  { id: "s10", n: "10", title: "Family history", fields: [long("family", "Cancer and other illness in the family")] },
  {
    id: "s11", n: "11", title: "History of addiction",
    fields: [list("addict", "Addictions", ["Substance", "Frequency", "Duration", "Stopped when"])],
  },
  {
    id: "s12", n: "12", title: "Personal history",
    fields: [
      en("appetite", "Appetite", ["Usual", "Increased", "Reduced", "Variable"]),
      text("desire", "Desires"), text("aversion", "Aversions"),
      en("thirst", "Thirst", ["Low", "Usual", "Increased"]),
      text("stool", "Stool"), text("urine", "Urine"), text("sweat", "Perspiration"),
      en("thermal", "Thermal sensitivity", ["Hot", "Chilly", "Variable"]),
      text("sun", "Reaction to sun"), text("draught", "Reaction to draught of air"),
      text("hunger", "Reaction to hunger"), text("motion", "Reaction to motion / car sickness"),
      text("closed", "Reaction to closed room"), text("tight", "Reaction to tight clothing"),
      text("sleep", "Sleep: position and habits"),
      long("dreams", "Dreams, in the patient’s words"),
      long("fear", "Fear / phobia"),
      long("mind", "Mental symptoms: what affected the patient emotionally before the disease progressed"),
      text("energy", "Energy and daily activity", { opt: true }),
      text("menstrual", "Menstrual / reproductive", { opt: true }),
      long("worries", "Main worries and concerns", { opt: true }),
      long("coping", "Coping, comfort, support", { opt: true }),
      long("interp", "Clinician interpretation (separate from patient report)", { opt: true }),
    ],
  },
  {
    id: "s13", n: "13", title: "Scoring",
    fields: [
      num("weight", "Weight", { unit: "kg" }),
      text("qol_tool", "Quality-of-life tool and version"),
      num("qol", "Quality-of-life score"),
      en("ecog", "Performance status (ECOG)", ["0", "1", "2", "3", "4", "5"], { opt: true }),
      text("vitals", "Vitals", { opt: true }),
      text("systemic", "Systemic findings", { opt: true }),
      list("scores", "Other scores", ["Name", "Version", "Value"], { opt: true }),
    ],
  },
  {
    id: "s14", n: "14", title: "Evaluation of case",
    fields: [
      en("decision", "Decision", ["Start", "Continue", "Repeat", "Change", "Withhold / observe", "Investigate", "Refer"]),
      long("rationale", "Rationale, uncertainty, review points"),
      long("chosen", "Characteristic symptoms selected", { opt: true }),
      long("generals", "Generals, particulars and mind features considered", { opt: true }),
      text("miasm", "Miasmatic interpretation", { opt: true }),
      text("reperto", "Repertorisation method and source", { opt: true }),
      list("cand", "Remedy candidates", ["Remedy", "Differentiating features"], { opt: true }),
      list("alt", "Alternatives considered", ["Remedy", "Reason not selected"], { opt: true }),
      list("expert", "Expert input", ["Name", "Date", "Quote or summary"], { opt: true }),
    ],
  },
  {
    id: "s15", n: "15", title: "Treatment plan",
    fields: [
      text("remedy", "Remedy"), text("potency", "Potency"), text("dose", "Dose"), text("repeat", "Repetition"),
      long("why", "Reason and symptoms linked to the decision"),
      text("oncplan", "Conventional oncology plan, next appointment"),
      text("interval", "Follow-up interval, what to reassess"),
      text("support", "Supportive care (nutrition, pain, oral care)", { opt: true }),
      text("invest", "Investigations, referral, safety action", { opt: true }),
    ],
  },
];

export const PHOTO_VIEWS = ["Front", "Lateral", "Other"];
