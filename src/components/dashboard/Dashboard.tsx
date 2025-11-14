"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import DashboardGrid from "./DashboardGrid";

export default function Dashboard() {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/signin");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          py: 6,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verifying your workspace…
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          Stay on top of today&apos;s tasks, upcoming work, and quick actions without leaving this page.
        </Typography>
      </Stack>
      <DashboardGrid />
    </Container>
  );
}
