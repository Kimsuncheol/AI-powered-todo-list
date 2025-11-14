"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import ReactMarkdown from "react-markdown";
import type { Task } from "@/types/task";
import type { TaskCreatePayload, TaskUpdatePayload } from "@/lib/api/tasks";
import { TaskPriorityRating } from "./TaskPriorityRating";

interface Props {
  initialTask?: Partial<Task>;
  mode?: "create" | "edit";
  onSave: (payload: TaskCreatePayload | TaskUpdatePayload) => Promise<void>;
}

export function TaskWorkspace({ initialTask, mode = "create", onSave }: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [tags, setTags] = useState<string[]>(initialTask?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState<number>(initialTask?.priority ?? 3);
  const [content, setContent] = useState(initialTask?.description ?? "");
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTask) return;
    setTitle(initialTask.title ?? "");
    setTags(initialTask.tags ?? []);
    setPriority(initialTask.priority ?? 3);
    setContent(initialTask.description ?? "");
  }, [initialTask]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        description: content,
        priority: priority as Task["priority"],
        tags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap={2} sx={{height: "100%"}}>
      <TextField
        variant="standard"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        InputProps={{ sx: { fontSize: 32, fontWeight: 600 } }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => handleRemoveTag(tag)}
              sx={{ fontSize: 10, height: 18 }}
            />
          ))}
          <TextField
            size="small"
            placeholder="Add tag"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
            sx={{
              maxWidth: 160,
              "& .MuiInputBase-input": { fontSize: 10, py: 0.5 },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption">Priority</Typography>
          <TaskPriorityRating value={priority} onChange={(value) => setPriority(value)} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="subtitle2">Content</Typography>
        <Button size="small" onClick={() => setIsPreview((prev) => !prev)}>
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </Box>

      <Box sx={{ borderRadius: 1, border: "1px solid rgba(0,0,0,0.12)", height: "80%" }}>
        {isPreview ? (
          <Box sx={{ p: 2 }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        ) : (
          <CodeMirror value={content} height="80%" onChange={(value) => setContent(value)} />
        )}
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !title.trim()}
        >
          {mode === "create" ? "Create Task" : "Save Changes"}
        </Button>
      </Box>
    </Stack>
  );
}
