export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type TaskSortKey = "createdAt" | "updatedAt" | "title";
export type TaskSortOrder = "asc" | "desc";
