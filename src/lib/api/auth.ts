import { api } from "./client";
import type {
  SignInRequest,
  SignUpRequest,
  AuthEnvelope,
} from "@/types/auth";

export const AuthAPI = {
  me: () => api<AuthEnvelope>("/auth/me"),
  signin: (dto: SignInRequest, csrf: string) =>
    api<AuthEnvelope>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(dto),
      csrf,
    }),
  signup: (dto: SignUpRequest, csrf: string) =>
    api<AuthEnvelope>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(dto),
      csrf,
    }),
  signout: (csrf: string) =>
    api<void>("/auth/signout", {
      method: "POST",
      csrf,
    }),
};
