"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { TaskWorkspace } from "@/components/tasks/TaskWorkspace";
import { TasksAPI } from "@/lib/api/tasks";
import type { Task } from "@/types/task";

export default function NewTaskPage() {
  const router = useRouter();

  const handleSave = useCallback(async (payload: Partial<Task>) => {
    const response = await TasksAPI.create(payload);
    router.push(`/tasks/${response.data.id}`);
  }, [router]);

  return <TaskWorkspace mode="create" onSave={handleSave} />;
}
