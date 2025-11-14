export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type TaskSortKey = "createdAt" | "updatedAt" | "title";
export type TaskSortOrder = "asc" | "desc";

export interface TasksListOut {
  data: Task[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface TaskEnvelope {
  data: Task;
}
