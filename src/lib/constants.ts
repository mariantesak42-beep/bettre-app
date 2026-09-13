import type { GoalKind } from "@/generated/prisma/client";

export type CategoryPreset = {
  label: string;
  goalKind: GoalKind;
};

export const CATEGORY_PRESETS: CategoryPreset[] = [
  { label: "Quit smoking", goalKind: "SUBJECTIVE" },
  { label: "Drink less alcohol", goalKind: "SUBJECTIVE" },
  { label: "Exercise", goalKind: "OBJECTIVE" },
  { label: "Running", goalKind: "OBJECTIVE" },
  { label: "Eat healthier", goalKind: "SUBJECTIVE" },
  { label: "Sleep schedule", goalKind: "OBJECTIVE" },
  { label: "Reduce screen time / social media", goalKind: "SUBJECTIVE" },
  { label: "Read more", goalKind: "SUBJECTIVE" },
  { label: "Learn a language", goalKind: "OBJECTIVE" },
  { label: "Meditation / mindfulness", goalKind: "SUBJECTIVE" },
  { label: "Save money", goalKind: "SUBJECTIVE" },
  { label: "Study / exam prep", goalKind: "OBJECTIVE" },
  { label: "Creative project", goalKind: "OBJECTIVE" },
  { label: "Custom", goalKind: "SUBJECTIVE" },
];

export const MIN_WITNESSES = 2;

// Canonical charity categories, in the order they should appear in filters
// and on the /charities directory page.
export const CHARITY_CATEGORIES = [
  "Humanitarian & Disaster Relief",
  "Human Rights & Minorities",
  "Environment & Wildlife",
  "Animal Welfare",
  "Children & Family",
  "Health & Disability",
  "Poverty & Homelessness",
  "Education & Community Development",
] as const;
