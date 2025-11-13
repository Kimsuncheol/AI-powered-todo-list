import { apiFetch } from "./http";
import type { AuthEnvelope, SignInIn, SignUpIn } from "./types";

export type AuthData = AuthEnvelope;

export async function fetchCurrentUser(): Promise<AuthEnvelope> {
  return apiFetch<AuthEnvelope>("/auth/me", {
    method: "GET",
  });
}

export async function signUp(body: SignUpIn): Promise<AuthEnvelope> {
  return apiFetch<AuthEnvelope>("/auth/signup", {
    headers: {"Content-Type": "application/json"},
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function signIn(body: SignInIn): Promise<AuthEnvelope> {
  return apiFetch<AuthEnvelope>("/auth/signin", {
    headers: {"Content-Type": "application/json"},
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include"
  });
}

export async function signOut(): Promise<void> {
  await apiFetch<void>("/auth/signout", {
    method: "POST",
  });
}
