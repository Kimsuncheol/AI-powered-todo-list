"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Task } from "@/types/task";
import { TaskTags } from "./TaskTags";
import { TaskPriorityRating } from "./TaskPriorityRating";

export function TaskListItem({ task }: { task: Task }) {
  const dateLabel = new Date(task.updatedAt ?? task.createdAt).toLocaleString();

  return (
    <Card
      component={Link}
      href={`/tasks/${task.id}`}
      sx={{
        display: "block",
        textDecoration: "none",
        mb: 1.5,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
            {task.title}
          </Typography>
          <TaskPriorityRating value={task.priority} readOnly />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <TaskTags tags={task.tags} />
          <Typography variant="caption" color="text.secondary">
            {dateLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            maxHeight: 72,
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
