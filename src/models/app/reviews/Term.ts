export type Semester = "fall" | "spring";

export interface Term {
  year: number;
  semester: Semester;
}
