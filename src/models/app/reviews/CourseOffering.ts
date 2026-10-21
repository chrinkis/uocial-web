import type { Instructor } from "@/models/app/reviews/Instructor";
import type { Semester } from "@/models/app/reviews/Term";

export interface CourseOfferingsBySemester {
  fall: number;
  spring: number;
}

export interface CourseOffering {
  readonly id: number;
  course_id: number;
  year: number;
  semester: Semester;
  instructors: Instructor[];
  created_at: string;
  updated_at: string;
}
