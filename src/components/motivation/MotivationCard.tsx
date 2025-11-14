"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import type { MotivationResponse } from "@/types/motivation";
import { getCurrentMotivation } from "@/lib/api/motivation";
import { useAuth } from "@/lib/auth/useAuth";

export function MotivationCard() {
  const { user } = useAuth();
  const [data, setData] = useState<MotivationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCurrentMotivation({
          name: user?.name,
          locale: user?.locale || "en",
        });
        if (mounted) {
          setData(res);
        }
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "Failed to load motivation");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.name, user?.locale]);

  if (loading) {
    return (
      <Card sx={{ minWidth: 200, minHeight: 200 }}>
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  if (err || !data) {
    return (
      <Card sx={{ minWidth: 200, minHeight: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Motivation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Couldn&apos;t load this hour&apos;s motivation. Try again later.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        minWidth: 200,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          This Hour&apos;s Motivation
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {data.message}
        </Typography>
        {data.quote && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              “{data.quote.text}”
            </Typography>
            {data.quote.author && (
              <Typography variant="caption" color="text.secondary">
                — {data.quote.author}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
