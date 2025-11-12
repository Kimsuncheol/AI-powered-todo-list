"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  initCsrf,
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
} from "@/lib/api/auth";
import { CSRF_COOKIE_NAME, getCookie } from "@/lib/api/http";
import type { SignInIn, SignUpIn, UserSummary } from "@/lib/api/types";

export type AuthContextType = {
  user: UserSummary | null;
  hydrated: boolean;
  csrf: string | null;
  signIn: (dto: SignInIn) => Promise<void>;
  signUp: (dto: SignUpIn) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

async function ensureCsrfCookie(): Promise<string> {
  let token = getCookie(CSRF_COOKIE_NAME);
  if (token) return token;

  try {
    await initCsrf();
  } catch {
    // ignore failures, we just need the cookie
  }

  token = getCookie(CSRF_COOKIE_NAME);
  if (!token) {
    throw new Error("Missing CSRF token");
  }
  return token;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [csrf, setCsrf] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const env = await fetchCurrentUser();
        if (mounted) setUser(env.user);
      } catch {
        // user not signed in or session expired
      } finally {
        if (mounted) {
          setCsrf(getCookie(CSRF_COOKIE_NAME) ?? null);
          setHydrated(true);
        }
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (dto: SignInIn) => {
    const token = await ensureCsrfCookie();
    const env = await signInRequest(dto);
    setUser(env.user);
    setCsrf(getCookie(CSRF_COOKIE_NAME) ?? token);
  }, []);

  const signUp = useCallback(async (dto: SignUpIn) => {
    const token = await ensureCsrfCookie();
    const env = await signUpRequest(dto);
    setUser(env.user);
    setCsrf(getCookie(CSRF_COOKIE_NAME) ?? token);
  }, []);

  const signOut = useCallback(async () => {
    const token = await ensureCsrfCookie();
    await signOutRequest();
    setUser(null);
    setCsrf(getCookie(CSRF_COOKIE_NAME) ?? token);
  }, []);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      csrf,
      signIn,
      signUp,
      signOut,
    }),
    [user, hydrated, csrf, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
