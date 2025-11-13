"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, loading, error, fieldErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await signIn({
      email,
      password,
      remember_me: remember,
    });

    if (result.ok) {
      router.push("/");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '28rem', '& > * + *': { marginTop: '16px' } }}>
      <Typography variant="h5" fontWeight={600}>
        Sign in
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        fullWidth
        autoComplete="email"
        required
        error={!!fieldErrors?.email}
        helperText={fieldErrors?.email}
        sx={{ marginTop: '16px' }}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
        autoComplete="current-password"
        required
        error={!!fieldErrors?.password}
        helperText={fieldErrors?.password}
        sx={{ marginTop: '16px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
        }
        label="Remember me"
      />

      <Stack direction="column" spacing={2}>
        <Button type="submit" size="large" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={() => {
            window.location.href =
              process.env.NEXT_PUBLIC_API_BASE_URL
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`
                : "/auth/google";
          }}
        >
          Sign in with Google
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ marginTop: '16px' }}>
        Haven&apos;t signed up yet?{" "}
        <MuiLink component={Link} href="/signup" underline="hover">
          Create an account
        </MuiLink>
      </Typography>
    </Box>
  );
}
