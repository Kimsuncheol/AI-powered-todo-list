"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthAPI } from "@/lib/api/auth";
import type {
  SignInRequest,
  SignUpRequest,
  UserPublic,
} from "@/types/auth";

export type AuthContextType = {
  user: UserPublic | null;
  hydrated: boolean;
  csrf: string | null;
  signIn: (dto: SignInRequest) => Promise<void>;
  signUp: (dto: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const CSRF_COOKIE_NAME = "csrf_token";

function getCsrfFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<string> {
  let token = getCsrfFromCookie();
  if (token) return token;

  try {
    await AuthAPI.me();
  } catch {
    // unauthenticated, but backend may still set csrf cookie
  }

  token = getCsrfFromCookie();
  if (!token) {
    throw new Error("Missing CSRF token");
  }
  return token;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [csrf, setCsrf] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const env = await AuthAPI.me();
        if (mounted) setUser(env.data);
      } catch {
        // user not signed in or session expired
      } finally {
        if (mounted) {
          setCsrf(getCsrfFromCookie());
          setHydrated(true);
        }
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (dto: SignInRequest) => {
    const token = await ensureCsrfCookie();
    const env = await AuthAPI.signin(dto, token);
    setUser(env.data);
    setCsrf(getCsrfFromCookie());
  }, []);

  const signUp = useCallback(async (dto: SignUpRequest) => {
    const token = await ensureCsrfCookie();
    const env = await AuthAPI.signup(dto, token);
    setUser(env.data);
    setCsrf(getCsrfFromCookie());
  }, []);

  const signOut = useCallback(async () => {
    const token = await ensureCsrfCookie();
    await AuthAPI.signout(token);
    setUser(null);
    setCsrf(getCsrfFromCookie());
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
