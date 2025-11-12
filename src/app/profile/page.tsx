"use client";

import { Alert, Stack, Typography } from "@mui/material";
import { useAuth } from "@/lib/auth/useAuth";

export default function ProfilePage() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <Typography variant="body1" color="text.secondary">
        Loading profile…
      </Typography>
    );
  }

  if (!user) {
    return (
      <Alert severity="info">
        You need to sign in to view your profile. Head to the sign-in page to
        continue.
      </Alert>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h4">Profile</Typography>
      <Typography>Name: {user.name ?? "No display name"}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Locale: {user.locale}</Typography>
      <Typography>Time zone: {user.tz}</Typography>
    </Stack>
  );
}
