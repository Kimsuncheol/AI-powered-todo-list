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
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
} from "@/lib/api/auth";
import type { SignInIn, SignUpIn, UserSummary } from "@/lib/api/types";

export type AuthContextType = {
  user: UserSummary | null;
  hydrated: boolean;
  signIn: (dto: SignInIn) => Promise<void>;
  signUp: (dto: SignUpIn) => Promise<void>;
  signOut: () => Promise<void>;
  devSignIn: (user: UserSummary) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [hydrated, setHydrated] = useState(false);

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
    const env = await signInRequest(dto);
    setUser(env.user);
  }, []);

  const signUp = useCallback(async (dto: SignUpIn) => {
    const env = await signUpRequest(dto);
    setUser(env.user);
  }, []);

  const signOut = useCallback(async () => {
    await signOutRequest();
    setUser(null);
  }, []);

  const devSignIn = useCallback((fakeUser: UserSummary) => {
    setUser(fakeUser);
    setHydrated(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      signIn,
      signUp,
      signOut,
      devSignIn,
    }),
    [user, hydrated, signIn, signUp, signOut, devSignIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
