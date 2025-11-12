import { apiFetch, bootstrapCsrf } from "./http";
import type { AuthEnvelope, SignInIn, SignUpIn } from "./types";

/** Call once on app start or before the first mutating auth request. */
export async function initCsrf(): Promise<void> {
  await bootstrapCsrf();
}

export type AuthData = AuthEnvelope;

let csrfBootstrapped = false;

async function ensureCsrfReady(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }
  if (!csrfBootstrapped) {
    await initCsrf();
    csrfBootstrapped = true;
  }
}

export async function fetchCurrentUser(): Promise<AuthEnvelope> {
  return apiFetch<AuthEnvelope>("/auth/me", {
    method: "GET",
  });
}

export async function signUp(body: SignUpIn): Promise<AuthEnvelope> {
  await ensureCsrfReady();
  return apiFetch<AuthEnvelope>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
    requireCsrf: true,
  });
}

export async function signIn(body: SignInIn): Promise<AuthEnvelope> {
  await ensureCsrfReady();
  return apiFetch<AuthEnvelope>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
    requireCsrf: true,
  });
}

export async function signOut(): Promise<void> {
  await ensureCsrfReady();
  await apiFetch<void>("/auth/signout", {
    method: "POST",
    requireCsrf: true,
  });
}
