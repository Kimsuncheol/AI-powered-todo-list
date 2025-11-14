"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";

export interface DashboardCardProps {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
}

export default function DashboardCard({
  title,
  description,
  href,
  icon,
}: DashboardCardProps) {
  return (
    <Card
      sx={(theme) => ({
        minWidth: 200,
        minHeight: 200,
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
        transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: theme.shadows[6],
        },
      })}
      variant="outlined"
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
            gap: 1,
          }}
        >
          <Box>
            {icon && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                  fontSize: 32,
                  color: "primary.main",
                }}
              >
                {icon}
              </Box>
            )}
            <Typography component="h3" variant="h6">
              {title}
            </Typography>
          </Box>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
