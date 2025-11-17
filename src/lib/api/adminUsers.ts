import { api } from "@/lib/api/client";
import type {
  AdminUser,
  AdminUserListOut,
  AdminUserUpdatePayload,
  AdminStatsOverview,
  AdminUserStatus,
  AdminRole,
} from "@/types/admin";

export interface ListAdminUsersParams {
  q?: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  page?: number;
  pageSize?: number;
}

export const AdminUsersAPI = {
  list(params: ListAdminUsersParams = {}) {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.role) search.set("role", params.role);
    if (params.status) search.set("status", params.status);
    if (params.page) search.set("page", String(params.page));
    if (params.pageSize) search.set("pageSize", String(params.pageSize));
    const qs = search.toString();
    return api<AdminUserListOut>(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  get(userId: string) {
    return api<AdminUser>(`/admin/users/${userId}`);
  },

  update(userId: string, payload: AdminUserUpdatePayload) {
    return api<AdminUser>(`/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  delete(userId: string) {
    return api<void>(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  ban(userId: string) {
    return api<AdminUser>(`/admin/users/${userId}/ban`, {
      method: "POST",
    });
  },
};

export const AdminStatsAPI = {
  overview() {
    return api<AdminStatsOverview>("/admin/stats/overview");
  },
};
