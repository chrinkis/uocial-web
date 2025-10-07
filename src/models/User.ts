export type UserRole = "Regular" | "Moderator" | "Admin";

export interface User {
  readonly id: number;
  name: string;
  email: string;
  email_verified_at: Date | null;
  role: UserRole;
}
