"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";

export type AppearanceMode = "light" | "dark" | "system";

interface AppearanceContextValue {
  mode: AppearanceMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: AppearanceMode) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined
);

const APPEARANCE_KEY = "appearance";

function isStoredMode(value: unknown): value is AppearanceMode {
  return value === "light" || value === "dark" || value === "system";
}

function getInitialMode(): AppearanceMode {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(APPEARANCE_KEY);
  if (isStoredMode(stored)) {
    return stored;
  }
  return "light";
}

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState<AppearanceMode>(() => getInitialMode());

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
    defaultMatches: false,
  });

  const resolvedMode = useMemo<"light" | "dark">(
    () =>
      mode === "system"
        ? prefersDarkMode
          ? "dark"
          : "light"
        : mode,
    [mode, prefersDarkMode]
  );

  const setMode = useCallback((nextMode: AppearanceMode) => {
    setModeState(nextMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APPEARANCE_KEY, nextMode);
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
        },
      }),
    [resolvedMode]
  );

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode]
  );

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return ctx;
}
