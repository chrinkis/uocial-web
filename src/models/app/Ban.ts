export interface BanAdminInfo {
  user_id: number;
  notes: string | null;
  thread_closed: boolean;
  lifted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ban {
  readonly id: number;
  reason: string;
  banned_at: string;
  expires_at: string | null;
  admin?: BanAdminInfo;
}
