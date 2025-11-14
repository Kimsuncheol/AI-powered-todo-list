"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Container } from "@mui/material";
import { TaskWorkspace } from "@/components/tasks/TaskWorkspace";
import { TasksAiChatWidget } from "@/components/tasks/TasksAiChatWidget";
import { TasksAPI, type TaskCreatePayload, type TaskUpdatePayload } from "@/lib/api/tasks";

export default function NewTaskPage() {
  const router = useRouter();

  const handleSave = useCallback(async (payload: TaskCreatePayload | TaskUpdatePayload) => {
    const response = await TasksAPI.create(payload as TaskCreatePayload);
    router.push(`/tasks/${response.data.id}`);
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
          height: "80vh",
        }}
      >
        <Box sx={{ flex: 1, width: { xs: "100%", md: "50%" }, height: '80vh' }}>
          <TaskWorkspace mode="create" onSave={handleSave} />
        </Box>
        <TasksAiChatWidget />
      </Box>
    </Container>
  );
}
