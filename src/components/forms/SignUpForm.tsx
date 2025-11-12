"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
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
import Link from "next/link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signUpSchema } from "@/lib/validation/auth";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";

type FormValues = z.infer<typeof signUpSchema>;

const GENERIC_ERROR = "Unable to create your account right now.";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });
  const password = useWatch({ control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const passwordRules = React.useMemo(
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

  const onSubmit = async (data: FormValues) => {
    setError(null);
    const dto = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    try {
      await signUp(dto);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts, please try later.");
      } else {
        setError(GENERIC_ERROR);
      }
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={2}
      width={'35%'}
    >
      <Typography variant="h4" component="h1">
        Sign up
      </Typography>

      {error && (
        <Alert severity="error" role="alert">
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Username"
        autoComplete="nickname"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name")}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
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
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={
          errors.confirmPassword?.message ??
          (confirmPassword
            ? password === confirmPassword
              ? "Passwords match"
              : "Passwords do not match"
            : "")
        }
        {...register("confirmPassword")}
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

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        aria-label="Submit sign-up form"
      >
        {isSubmitting ? "Signing up…" : "Sign up"}
      </Button>

      <Button
        type="button"
        variant="outlined"
        disabled={isSubmitting}
        onClick={() => {
          window.location.assign("/auth/oauth/google");
        }}
      >
        Sign up with Google
      </Button>

      <Typography component="span" variant="body2">
        Have signed up yet?{" "}
        <MuiLink component={Link} href="/signin" underline="hover">
          Click here
        </MuiLink>
      </Typography>
    </Stack>
  );
}
