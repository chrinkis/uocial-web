export interface Moderation {
  is_hidden: boolean;
  is_auto_hidden: boolean;
  reports: {
    total: number;
  };
}
