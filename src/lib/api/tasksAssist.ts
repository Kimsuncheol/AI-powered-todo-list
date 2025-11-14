import { apiFetch } from "@/lib/api/http";
import type { TasksAssistRequest, TasksAssistResponse } from "@/types/tasksAssist";

export const TasksAssistAPI = {
  assist(body: TasksAssistRequest) {
    return apiFetch<TasksAssistResponse>("/tasks/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },
};
