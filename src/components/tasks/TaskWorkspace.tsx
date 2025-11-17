"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
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
import Add from "@mui/icons-material/Add";

interface Props {
  initialTask?: Partial<Task>;
  mode?: "create" | "edit";
  onSave: (payload: TaskCreatePayload | TaskUpdatePayload) => Promise<void>;
}

export function TaskWorkspace({ initialTask, mode = "create", onSave }: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [tags, setTags] = useState<string[]>(
    initialTask?.tags?.length ? initialTask.tags : [""]
  );
  const [priority, setPriority] = useState<number>(initialTask?.priority ?? 3);
  const [content, setContent] = useState(initialTask?.description ?? "");
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTask) {
      setTitle("");
      setTags([""]);
      setPriority(3);
      setContent("");
      return;
    }

    const normalizedTags = initialTask.tags?.length
      ? initialTask.tags
      : [""];

    setTitle(initialTask.title ?? "");
    setTags(normalizedTags);
    setPriority(initialTask.priority ?? 3);
    setContent(initialTask.description ?? "");
  }, [initialTask]);

  const handleTagChange = (index: number, value: string) => {
    setTags((prev) => prev.map((tag, idx) => (idx === index ? value : tag)));
  };

  const handleAddTagField = () => {
    setTags((prev) => [...prev, ""]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const normalizedTags = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSave({
        title: title.trim(),
        description: content,
        priority: priority as Task["priority"],
        tags: normalizedTags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
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
          alignItems: "start",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          {tags.map((tag, index) => (
            <TextField
              key={`tag-field-${index}`}
              size="small"
              variant="outlined"
              placeholder="Add tag"
              value={tag}
              onChange={(event) => handleTagChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && index === tags.length - 1) {
                  event.preventDefault();
                  handleAddTagField();
                }
              }}
              sx={{
                minWidth: 120,
                maxWidth: 220,
                "& .MuiInputBase-input": { fontSize: 12, py: 0.5 },
              }}
            />
          ))}
          <IconButton
            aria-label="add tag"
            size="small"
            onClick={handleAddTagField}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
              width: 32,
              height: 32,
            }}
          >
            <Add fontSize="small" />
          </IconButton>
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
