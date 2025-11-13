"use client";

import { Grid, Typography, Box } from "@mui/material";
import { Task } from "@/types/task";
import { TaskGridItem } from "./TaskGridItem";

interface Props {
  tasks: Task[];
}

export function TaskGrid({ tasks }: Props) {
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
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <TaskGridItem task={task} />
        </Grid>
      ))}
    </Grid>
  );
}
