import type { Instructor } from "@/models/app/reviews/Instructor";
import type { Term } from "@/models/app/reviews/Term";
import { formatTerm } from "@/utils/app/reviews/semester";

export function getInstructorFullName(instructor: Instructor) {
  return [instructor.first_name, instructor.middle_name, instructor.last_name]
    .filter(Boolean)
    .join(" ");
}

function pluralize(count: number, singular: string) {
  return `${String(count)} ${singular}${count === 1 ? "" : "s"}`;
}

function formatLastTaught(term: Term | null) {
  return term ? `Last taught ${formatTerm(term)}` : null;
}

export function getInstructorStats(instructor: Instructor) {
  const inCourse = instructor.in_course;

  if (inCourse) {
    return {
      summary: pluralize(inCourse.offerings_count, "offering"),
      lastTaught: formatLastTaught(inCourse.last_taught),
    };
  }

  const inDepartment = instructor.in_department;

  if (inDepartment) {
    return {
      summary: pluralize(inDepartment.courses_count, "course"),
      lastTaught: formatLastTaught(inDepartment.last_taught),
    };
  }

  return null;
}
