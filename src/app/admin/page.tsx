import { Container, Typography, Divider } from "@mui/material";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export default function AdminPage() {
  return (
    <AdminGuard>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Review and manage users across the workspace. Adjust roles, enforce bans,
          and keep an eye on account status.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <AdminUsersTable />
      </Container>
    </AdminGuard>
  );
}
