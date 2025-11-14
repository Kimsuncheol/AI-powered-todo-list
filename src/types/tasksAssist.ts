export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface TasksAssistRequest {
  query: string;
  messages: ChatMessage[];
  locale?: string | null;
}

export interface TasksAssistTagSuggestion {
  name: string;
  confidence?: number | null;
}

export interface TasksAssistTaskRef {
  id: string;
  title?: string | null;
}

export interface TasksAssistResponse {
  answer: string;
  suggestedTags: TasksAssistTagSuggestion[];
  relatedTasks: TasksAssistTaskRef[];
  messages: ChatMessage[];
}
