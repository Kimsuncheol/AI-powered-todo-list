"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Task } from "@/types/task";
import { TaskTags } from "./TaskTags";
import { TaskPriorityRating } from "./TaskPriorityRating";

export function TaskGridItem({ task }: { task: Task }) {
  const dateLabel = new Date(task.updatedAt ?? task.createdAt).toLocaleDateString();

  return (
    <Card
      component={Link}
      href={`/tasks/${task.id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 260,
        textDecoration: "none",
      }}
    >
      <CardContent sx={{ flex: "0 0 20%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>
          <TaskPriorityRating value={task.priority} readOnly size="small" />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TaskTags tags={task.tags} />
          <Typography variant="caption" color="text.secondary">
            {dateLabel}
          </Typography>
        </Box>
      </CardContent>
      <CardContent sx={{ flex: "1 1 80%", overflow: "hidden" }}>
        <Box
          sx={{
            height: "100%",
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </Box>
      </CardContent>
    </Card>
  );
}
