"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { signInSchema } from "@/lib/validation/auth";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";

type FormValues = z.infer<typeof signInSchema>;

const GENERIC_ERROR = "Invalid credentials or rate limited.";

export default function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await signIn(data);
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
      width={'30%'}
    >
      <Typography variant="h4" component="h1">
        Sign in
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
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
      />

      <FormControlLabel
        control={<Checkbox {...register("rememberMe")} />}
        label="Remember me"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        aria-label="Submit sign-in form"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <Button
        type="button"
        variant="outlined"
        disabled={isSubmitting}
        onClick={() => {
          window.location.assign("/auth/oauth/google");
        }}
      >
        Sign in with Google
      </Button>

      <Typography component="span" variant="body2">
        Haven&apos;t signed up yet?{" "}
        <MuiLink component={Link} href="/signup" underline="hover">
          Click here
        </MuiLink>
      </Typography>
    </Stack>
  );
}
