import type { Instructor } from "@/models/app/reviews/Instructor";
import { formatTerm } from "@/utils/app/reviews/semester";

export function getInstructorFullName(instructor: Instructor) {
  return [instructor.first_name, instructor.middle_name, instructor.last_name]
    .filter(Boolean)
    .join(" ");
}

function pluralize(count: number, singular: string) {
  return `${String(count)} ${singular}${count === 1 ? "" : "s"}`;
}

export function getInstructorStats(instructor: Instructor) {
  const meta = instructor.in_department;

  if (!meta) {
    return null;
  }

  return {
    courses: pluralize(meta.courses_count, "course"),
    lastTaught: meta.last_taught
      ? `Last taught ${formatTerm(meta.last_taught)}`
      : null,
  };
}
