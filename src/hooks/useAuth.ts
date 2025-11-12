"use client";

import { useCallback, useMemo, useState } from "react";
import { signIn, signOut, signUp } from "@/lib/api/auth";
import type {
  AuthEnvelope,
  SignInIn,
  SignUpIn,
  ValidationDetail,
} from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

type AuthState = {
  user?: AuthEnvelope["user"];
  loading: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const DEFAULT_ERROR = "Something went wrong, please try again.";

function parseFieldErrors(details?: ValidationDetail[]): Record<string, string> | undefined {
  if (!details?.length) return undefined;
  return details.reduce<Record<string, string>>((acc, detail) => {
    if (!detail?.loc) return acc;
    const key = detail.loc[detail.loc.length - 1];
    if (key !== undefined) {
      acc[String(key)] = detail.msg ?? "Invalid value";
    }
    return acc;
  }, {});
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ loading: false });

  const begin = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
        fieldErrors: undefined,
      })),
    []
  );

  const handleFailure = useCallback((error: unknown, fallback: string) => {
    const response =
      error instanceof ApiError
        ? {
            message: error.message || fallback,
            fieldErrors: parseFieldErrors(error.details),
          }
        : {
            message:
              error instanceof Error ? error.message || fallback : fallback,
            fieldErrors: undefined,
          };

    setState((prev) => ({
      ...prev,
      loading: false,
      error: response.message,
      fieldErrors: response.fieldErrors,
    }));

    return response.message;
  }, []);

  const doSignIn = useCallback(
    async (payload: SignInIn) => {
      begin();
      try {
        const data = await signIn(payload);
        setState((prev) => ({
          ...prev,
          loading: false,
          user: data.user,
          error: undefined,
          fieldErrors: undefined,
        }));
        return { ok: true as const, data };
      } catch (error) {
        const message = handleFailure(error, DEFAULT_ERROR);
        return { ok: false as const, error: message };
      }
    },
    [begin, handleFailure]
  );

  const doSignUp = useCallback(
    async (payload: SignUpIn) => {
      begin();
      try {
        const data = await signUp(payload);
        setState((prev) => ({
          ...prev,
          loading: false,
          user: data.user,
          error: undefined,
          fieldErrors: undefined,
        }));
        return { ok: true as const, data };
      } catch (error) {
        const message = handleFailure(error, DEFAULT_ERROR);
        return { ok: false as const, error: message };
      }
    },
    [begin, handleFailure]
  );

  const doSignOut = useCallback(async () => {
    begin();
    try {
      await signOut();
      setState((prev) => ({
        ...prev,
        loading: false,
        user: undefined,
        error: undefined,
        fieldErrors: undefined,
      }));
      return { ok: true as const };
    } catch (error) {
      const message = handleFailure(error, DEFAULT_ERROR);
      return { ok: false as const, error: message };
    }
  }, [begin, handleFailure]);

  return useMemo(
    () => ({
      ...state,
      signIn: doSignIn,
      signUp: doSignUp,
      signOut: doSignOut,
    }),
    [state, doSignIn, doSignOut, doSignUp]
  );
}
