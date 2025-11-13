"use client";

import { Box, Chip } from "@mui/material";

export function TaskTags({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{ fontSize: 10, height: 18 }}
        />
      ))}
    </Box>
  );
}
