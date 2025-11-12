"use client";

import { Card, CardContent, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        AI-powered productivity, simplified
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Plan, prioritize, and complete your tasks with AI suggestions, smart
        reminders, and collaborative insights.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button component={Link} href="/auth/signup" variant="contained">
          Get started
        </Button>
        <Button component={Link} href="/auth/signin" variant="outlined">
          I already have an account
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2">
            What&apos;s next?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect your calendar, invite teammates, and let our AI assistant
            draft prioritized to-do lists for your day.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
