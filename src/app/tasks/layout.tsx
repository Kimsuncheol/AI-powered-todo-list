"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/signin");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading workspace...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 3 }}>
      {children}
    </Box>
  );
}
