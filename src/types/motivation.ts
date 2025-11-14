export interface Quote {
  text: string;
  author?: string | null;
  locale?: string | null;
}

export interface MotivationResponse {
  /** Motivational message generated for the current hour slot */
  message: string;
  quote?: Quote | null;
  name: string;
  locale?: string | null;
  created_at?: string;
}
