export interface UserPublic {
  id: string;
  email: string;
  name?: string;
  tz: string;
  locale: string;
  emailVerified: boolean;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export type AuthEnvelope = ApiEnvelope<UserPublic>;

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}
