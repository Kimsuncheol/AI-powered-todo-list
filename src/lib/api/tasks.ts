import { apiFetch } from "./http";
import type {
  Task,
  TaskEnvelope,
  TasksListOut,
  TaskSortKey,
  TaskSortOrder,
} from "@/types/task";

export interface ListTasksParams {
  sortKey?: TaskSortKey;
  sortOrder?: TaskSortOrder;
  page?: number;
  pageSize?: number;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  priority?: number;
  tags?: string[];
  projectId?: string | null;
  sectionId?: string | null;
}

export type TaskUpdatePayload = Partial<TaskCreatePayload>;

const withJsonHeaders = (csrf?: string) => ({
  "Content-Type": "application/json",
  ...(csrf ? { "X-CSRF-Token": csrf } : {}),
});

export const TasksAPI = {
  list(params: ListTasksParams = {}) {
    const search = new URLSearchParams();
    if (params.sortKey) search.set("sortKey", params.sortKey);
    if (params.sortOrder) search.set("sortOrder", params.sortOrder);
    if (typeof params.page === "number") search.set("page", String(params.page));
    if (typeof params.pageSize === "number") search.set("pageSize", String(params.pageSize));
    const qs = search.toString();
    return apiFetch<TasksListOut>(`/tasks${qs ? `?${qs}` : ""}`);
  },

  create(payload: TaskCreatePayload, csrf?: string) {
    return apiFetch<TaskEnvelope>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: withJsonHeaders(csrf),
    });
  },

  get(taskId: string) {
    return apiFetch<TaskEnvelope>(`/tasks/${taskId}`);
  },

  update(taskId: string, payload: TaskUpdatePayload, csrf?: string) {
    return apiFetch<TaskEnvelope>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: withJsonHeaders(csrf),
    });
  },

  delete(taskId: string, csrf?: string) {
    return apiFetch<void>(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: csrf ? { "X-CSRF-Token": csrf } : undefined,
    });
  },
};
