import SignUpForm from "@/components/forms/SignUpForm";
import { Stack, Typography } from "@mui/material";

export default function SignUpPage() {
  return (
    <Stack spacing={2} sx={{
      height: 'calc(100vh - 72px)',
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="overline" color="text.secondary">
        Create your workspace
      </Typography>
      <SignUpForm />
    </Stack>
  );
}
