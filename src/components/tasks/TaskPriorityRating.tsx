"use client";

import { Rating, RatingProps } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface Props extends Omit<RatingProps, "value" | "onChange"> {
  value: number;
  onChange?: (value: number) => void;
}

export function TaskPriorityRating({ value, onChange, ...rest }: Props) {
  return (
    <Rating
      max={5}
      value={value}
      icon={<StarIcon fontSize="inherit" />}
      emptyIcon={<StarIcon fontSize="inherit" />}
      precision={1}
      onChange={(_, v) => onChange?.(v ?? 1)}
      {...rest}
    />
  );
}
