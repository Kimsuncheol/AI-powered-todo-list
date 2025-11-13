"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskGrid } from "@/components/tasks/TaskGrid";
import { TaskToolbar } from "@/components/tasks/TaskToolbar";
import { TasksAPI } from "@/lib/api/tasks";
import type { Task, TaskSortKey } from "@/types/task";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortKey, setSortKey] = useState<TaskSortKey>("createdAt");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (key: TaskSortKey) => {
    setLoading(true);
    setError(null);
    try {
      const sortOrder = key === "title" ? "asc" : "desc";
      const response = await TasksAPI.list({ sortKey: key, sortOrder });
      setTasks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks(sortKey);
  }, [fetchTasks, sortKey]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TaskToolbar
        view={view}
        sortKey={sortKey}
        onViewChange={setView}
        onSortKeyChange={setSortKey}
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : view === "grid" ? (
        <TaskGrid tasks={tasks} />
      ) : (
        <TaskList tasks={tasks} />
      )}
    </Box>
  );
}
