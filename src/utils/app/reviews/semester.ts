import type { Semester, Term } from "@/models/app/reviews/Term";

export function getYearFor(startYear: number, semester: Semester) {
  return semester === "fall" ? startYear : startYear + 1;
}

export function formatTerm({ year, semester }: Term) {
  const term = semester === "fall" ? "Fall" : "Spring";

  return `${term} ${String(getYearFor(year, semester))}`;
}
