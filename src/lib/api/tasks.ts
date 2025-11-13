import { apiFetch } from "./http";
import type { Task, TaskSortKey, TaskSortOrder } from "@/types/task";

export interface GetTasksParams {
  sortKey?: TaskSortKey;
  sortOrder?: TaskSortOrder;
  view?: "list" | "grid";
  page?: number;
  pageSize?: number;
}

export interface TasksEnvelope {
  data: Task[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export const TasksAPI = {
  list: (params: GetTasksParams = {}) => {
    const search = new URLSearchParams({
      sortKey: params.sortKey ?? "createdAt",
      sortOrder: params.sortOrder ?? "desc",
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 20),
    });
    return apiFetch<TasksEnvelope>(`/tasks?${search.toString()}`);
  },
  get: (id: string) => apiFetch<{ data: Task }>(`/tasks/${id}`),
  create: (payload: Partial<Task>, csrf?: string) =>
    apiFetch<{ data: Task }>(`/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
    }),
  update: (id: string, payload: Partial<Task>, csrf?: string) =>
    apiFetch<{ data: Task }>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
    }),
};
