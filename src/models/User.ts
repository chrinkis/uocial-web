export type UserRole = "Regular" | "Moderator" | "Admin";

export interface User {
  readonly id: number;
  name: string;
  email: string;
  email_verified_at: Date | null;
  role: UserRole;
  legal: {
    privacy_policy: {
      needs_acceptance: boolean;
    };
    terms_of_use: {
      needs_acceptance: boolean;
    };
  };
}
