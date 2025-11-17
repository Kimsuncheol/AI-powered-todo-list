"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/lib/auth/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">403 – Admin only</Typography>
        <Typography variant="body2" color="text.secondary">
          You must be an administrator to view this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
