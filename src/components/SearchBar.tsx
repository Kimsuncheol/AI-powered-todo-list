"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");

  const encodedQuery = useMemo(
    () => encodeURIComponent(query.trim()),
    [query]
  );

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodedQuery}`);
  };

  return (
    <Box component="form" width={'30%'} onSubmit={onSearch} sx={{ flex: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search tasks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          width: '30%'
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          "aria-label": "Search tasks",
        }}
      />
    </Box>
  );
}
