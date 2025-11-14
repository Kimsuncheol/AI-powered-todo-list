"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/tasksAssist";
import { TasksAssistAPI } from "@/lib/api/tasksAssist";
import { useAuth } from "@/lib/auth/useAuth";

interface TasksAiChatWidgetProps {
  taskId?: string;
  initialMessages?: ChatMessage[];
}

export function TasksAiChatWidget({ taskId, initialMessages = [] }: TasksAiChatWidgetProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, newUserMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await TasksAssistAPI.assist({
        query: trimmed,
        messages: nextMessages,
        locale: user?.locale ?? "en",
      });

      const assistantReply: ChatMessage = { role: "assistant", content: res.answer };
      const updatedMessages = res.messages?.length ? res.messages : [...nextMessages, assistantReply];
      setMessages(updatedMessages);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to get AI assistance.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        width: { xs: "100%", md: "50%" },
        height: "75%",
      }}
    >
      <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CardHeader
          title={
            <Typography variant="subtitle1" fontWeight={600}>
              AI Task Assistant
            </Typography>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              Ask for help planning, prioritizing, or refining this task
              {taskId ? ` (Task ${taskId})` : ""}.
            </Typography>
          }
        />
        <Divider />
        <CardContent
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            pb: 1,
          }}
        >
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Try asking:
              <br />- &quot;Help me break this task into subtasks.&quot;
              <br />- &quot;Suggest tags and priority.&quot;
              <br />- &quot;What should I focus on first?&quot;
            </Typography>
          )}

          {messages.map((m, idx) => (
            <Box
              key={`${m.role}-${idx}`}
              sx={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                bgcolor: m.role === "user" ? "primary.main" : "action.hover",
                color: m.role === "user" ? "primary.contrastText" : "text.primary",
                fontSize: 14,
                overflowWrap: "break-word",
              }}
            >
              {m.role === "assistant" ? (
                <ReactMarkdown>{m.content}</ReactMarkdown>
              ) : (
                <Typography variant="body2" component="div">
                  {m.content}
                </Typography>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1.5,
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Ask the assistant about this task..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
          >
            {loading ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
