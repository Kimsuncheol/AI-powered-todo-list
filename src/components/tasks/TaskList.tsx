"use client";

import { Box, Typography } from "@mui/material";
import { Task } from "@/types/task";
import { TaskListItem } from "./TaskListItem";

interface Props {
  tasks: Task[];
}

export function TaskList({ tasks }: Props) {
  if (!tasks.length) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body2" color="text.secondary">
          No tasks yet. Create one to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskListItem task={task} />
        </li>
      ))}
    </Box>
  );
}
