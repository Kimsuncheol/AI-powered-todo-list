"use client";

import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { TaskSortKey } from "@/types/task";

interface Props {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  sortKey: TaskSortKey;
  onSortKeyChange: (key: TaskSortKey) => void;
}

export function TaskToolbar({ view, onViewChange, sortKey, onSortKeyChange }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        gap: 2,
      }}
    >

      <Button
        component={Link}
        href="/tasks/new"
        variant="contained"
        startIcon={<AddIcon />}
      >
        New Task
      </Button>
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
      }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, next) => next && onViewChange(next)}
          size="small"
        >
          <ToggleButton value="list" aria-label="List view">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="Grid view">
            <GridViewIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="task-sort-label">Order by</InputLabel>
          <Select
            labelId="task-sort-label"
            label="Order by"
            value={sortKey}
            onChange={(event) => onSortKeyChange(event.target.value as TaskSortKey)}
          >
            <MenuItem value="createdAt">Created at</MenuItem>
            <MenuItem value="updatedAt">Updated at</MenuItem>
            <MenuItem value="title">Title (A-Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
