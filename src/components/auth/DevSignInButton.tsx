"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

export function DevSignInButton() {
  const router = useRouter();
  const { devSignIn } = useAuth();

  return (
    <Button
      type="button"
      variant="outlined"
      color="secondary"
      onClick={() => {
        // TODO: remove Dev login flow after real auth is wired end-to-end.
        devSignIn({
          id: "dev-user",
          email: "dev@example.com",
          name: "Dev User",
          tz: "Asia/Seoul",
          locale: "ko-KR",
          email_verified: true,
        });
        router.push("/tasks");
      }}
    >
      Dev Login
    </Button>
  );
}
