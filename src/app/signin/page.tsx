import SignInForm from "@/components/forms/SignInForm";
import { Stack, Typography } from "@mui/material";

export default function SignInPage() {
  return (
    <Stack spacing={2} sx={{
      height: 'calc(100vh - 72px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="overline" color="text.secondary">
        Welcome back
      </Typography>
      <SignInForm />
    </Stack>
  );
}
