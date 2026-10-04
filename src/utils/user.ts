import type { User } from "@/models/User";

export function isModerator(user: User) {
  return user.role === "Moderator" || user.role === "Admin";
}

export function isAdmin(user: User) {
  return user.role === "Admin";
}
