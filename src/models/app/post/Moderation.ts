export interface Moderation {
  is_hidden: boolean;
  by_system: boolean;
  reports: {
    total: number;
  };
}
