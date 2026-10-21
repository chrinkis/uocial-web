import type {
  CourseOffering,
  CourseOfferingsBySemester,
} from "@/models/app/reviews/CourseOffering";

export interface Course {
  readonly id: number;
  department_id: number;
  code: string;
  name: string;
  instructors_count: number;
  offerings_count: number;
  offerings_by_semester: CourseOfferingsBySemester;
  last_offering?: CourseOffering | null;
  created_at: string;
  updated_at: string;
}
