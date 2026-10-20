import type { Term } from "@/models/app/reviews/Term";

export interface InstructorDepartmentContext {
  courses_count: number;
  offerings_count: number;
  last_taught: Term | null;
}

export interface InstructorCourseContext {
  offerings_count: number;
  last_taught: Term | null;
}

export interface Instructor {
  readonly id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  in_department?: InstructorDepartmentContext;
  in_course?: InstructorCourseContext;
  created_at: string;
  updated_at: string;
}
