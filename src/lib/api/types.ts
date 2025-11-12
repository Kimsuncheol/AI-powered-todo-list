export type LocationPath = (string | number)[];

export type ValidationDetail = {
  loc: LocationPath;
  msg: string;
  type?: string;
};

export type HttpErrorPayload =
  | { detail?: string | ValidationDetail[] }
  | { error?: { message?: string } }
  | Record<string, unknown>;

export class ApiError extends Error {
  status?: number;
  details?: ValidationDetail[];

  constructor(message: string, opts?: { status?: number; details?: ValidationDetail[] }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.details = opts?.details;
  }
}

export type SignUpIn = {
  email: string;
  password: string;
  name?: string;
};

export type SignInIn = {
  email: string;
  password: string;
  remember_me?: boolean;
};

export type UserSummary = {
  id: string;
  email: string;
  name?: string;
  display_name?: string;
  avatar_url?: string | null;
  tz?: string;
  locale?: string;
  email_verified?: boolean;
};

export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
};

export type AuthEnvelope = {
  user: UserSummary;
  tokens?: AuthTokens;
};

export type ValidationErrorsMap = Record<string, string>;
