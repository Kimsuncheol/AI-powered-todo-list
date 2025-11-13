"use client";

import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, loading, error, fieldErrors } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const passwordRules = useMemo(
    () => [
      {
        label: "• At least 8 characters",
        valid: password.length >= 8,
      },
      {
        label: "• Uppercase & lowercase letters",
        valid: /[A-Z]/.test(password) && /[a-z]/.test(password),
      },
      {
        label: "• A number and a special character",
        valid: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
      },
    ],
    [password]
  );

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const emailInvalid = useMemo(() => {
    if (!email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (passwordsMismatch || emailInvalid) {
      if (passwordsMismatch) {
        setStatus({ type: "error", message: "Passwords do not match." });
      } else if (emailInvalid) {
        setStatus({ type: "error", message: "Please enter a valid email address." });
      }
      return;
    }
    const result = await signUp({ email, password, name });
    if (result.ok) {
      setStatus({ type: "success", message: "Account created successfully. Redirecting..." });
      router.push("/");
      return;
    }
    setStatus({
      type: "error",
      message: result.error ?? "Unable to sign up. Please try again.",
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "28rem",
        "& > * + *": { marginTop: "16px" },
      }}
    >

      <Typography variant="h5" fontWeight={600}>
        Create your account
      </Typography>

      {status ? (
        <Alert severity={status.type}>{status.message}</Alert>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : null}

      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        fullWidth
        error={!!fieldErrors?.name}
        helperText={fieldErrors?.name}
        sx={{ marginTop: '16px' }}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        fullWidth
        autoComplete="email"
        required
        error={!!fieldErrors?.email || emailInvalid}
        helperText={fieldErrors?.email ?? (emailInvalid ? "Enter a valid email address" : undefined)}
        sx={{ marginTop: '16px' }}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
        autoComplete="new-password"
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

      <Box>
        <Typography variant="caption">Password must include:</Typography>
        <List dense sx={{ my: 0 }}>
          {passwordRules.map((rule) => (
            <ListItem key={rule.label} disablePadding>
              <ListItemText
                primary={rule.label}
                primaryTypographyProps={{
                  color: rule.valid ? "success.main" : "error.main",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <TextField
        label="Confirm password"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        fullWidth
        autoComplete="new-password"
        required
        error={passwordsMismatch}
        helperText={
          confirmPassword
            ? passwordsMismatch
              ? "Passwords do not match"
              : "Passwords match"
            : ""
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="column" spacing={2}>
        <Button type="submit" size="large" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Sign up"}
        </Button>
        <Button
          type="button"
          size="large"
          variant="outlined"
          onClick={() => {
            window.location.href =
              process.env.NEXT_PUBLIC_API_BASE_URL
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`
                : "/auth/google";
          }}
        >
          Sign up with Google
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <MuiLink component={Link} href="/signin" underline="hover">
          Sign in
        </MuiLink>
      </Typography>
    </Box>
  );
}
