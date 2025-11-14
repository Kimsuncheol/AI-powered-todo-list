"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useParams } from "next/navigation";
import { TaskWorkspace } from "@/components/tasks/TaskWorkspace";
import { TasksAiChatWidget } from "@/components/tasks/TasksAiChatWidget";
import { TasksAPI, type TaskUpdatePayload } from "@/lib/api/tasks";
import type { Task } from "@/types/task";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const taskId = params?.id;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!taskId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await TasksAPI.get(taskId);
        if (active) {
          setTask(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load task");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [taskId]);

  const handleSave = useCallback(
    async (payload: TaskUpdatePayload) => {
      if (!taskId) return;
      const response = await TasksAPI.update(taskId, payload);
      setTask(response.data);
    },
    [taskId]
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!task) {
    return <Alert severity="warning">Task not found.</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
          minHeight: "80vh",
        }}
      >
        <Box sx={{ flex: 1, width: { xs: "100%", md: "50%" } }}>
          <TaskWorkspace mode="edit" initialTask={task} onSave={handleSave} />
        </Box>
        <TasksAiChatWidget taskId={task.id} />
      </Box>
    </Container>
  );
}
