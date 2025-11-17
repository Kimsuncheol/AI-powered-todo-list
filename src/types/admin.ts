export type AdminRole = "admin" | "user";
export type AdminUserStatus = "active" | "inactive" | "banned";

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: AdminRole;
  status: AdminUserStatus;
  tz?: string | null;
  locale?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  lastLoginAt?: string | null;
}

export interface AdminUserListOut {
  data: AdminUser[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface AdminUserUpdatePayload {
  name?: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  tz?: string;
  locale?: string;
}

export interface AdminStatsOverview {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  admins: number;
}
