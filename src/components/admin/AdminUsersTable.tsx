"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import type {
  AdminUser,
  AdminRole,
  AdminUserStatus,
} from "@/types/admin";
import { AdminUsersAPI } from "@/lib/api/adminUsers";

export function AdminUsersTable() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "">("");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "">("");
  const [appliedQ, setAppliedQ] = useState("");
  const [appliedRole, setAppliedRole] = useState<AdminRole | "">("");
  const [appliedStatus, setAppliedStatus] = useState<AdminUserStatus | "">("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBanId, setConfirmBanId] = useState<string | null>(null);

  const handleApplyFilters = () => {
    setPage(0);
    setAppliedQ(q.trim());
    setAppliedRole(roleFilter);
    setAppliedStatus(statusFilter);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await AdminUsersAPI.list({
          q: appliedQ || undefined,
          role: appliedRole || undefined,
          status: appliedStatus || undefined,
          page: page + 1,
          pageSize,
        });
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.meta?.total ?? res.data.length);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [appliedQ, appliedRole, appliedStatus, page, pageSize]);

  const handleUpdateField = async (
    userId: string,
    field: "role" | "status",
    value: AdminRole | AdminUserStatus
  ) => {
    const payload =
      field === "role"
        ? { role: value as AdminRole }
        : { status: value as AdminUserStatus };
    const updated = await AdminUsersAPI.update(userId, payload);
    setRows((prev) => prev.map((u) => (u.id === userId ? updated : u)));
  };

  const handleDelete = async () => {
    const targetId = confirmDeleteId;
    if (!targetId) return;
    await AdminUsersAPI.delete(targetId);
    setRows((prev) => prev.filter((u) => u.id !== targetId));
    setTotal((prev) => Math.max(prev - 1, 0));
    setConfirmDeleteId(null);
  };

  const handleBan = async () => {
    const targetId = confirmBanId;
    if (!targetId) return;
    const updated = await AdminUsersAPI.ban(targetId);
    setRows((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setConfirmBanId(null);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Search"
          placeholder="Search by email or name"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleApplyFilters();
            }
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as AdminRole | "")
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as AdminUserStatus | "")
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleApplyFilters}>
          Apply
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !rows.length ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name ?? "—"}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(event) =>
                      void handleUpdateField(
                        user.id,
                        "role",
                        event.target.value as AdminRole
                      )
                    }
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={user.status}
                    onChange={(event) =>
                      void handleUpdateField(
                        user.id,
                        "status",
                        event.target.value as AdminUserStatus
                      )
                    }
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => setConfirmBanId(user.id)}
                    disabled={user.status === "banned"}
                    aria-label="Ban user"
                  >
                    <BlockIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setConfirmDeleteId(user.id)}
                    aria-label="Delete user"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && !loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                  >
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, value) => setPage(value)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 50]}
      />

      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will deactivate or permanently delete the user account. Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmBanId} onClose={() => setConfirmBanId(null)}>
        <DialogTitle>Ban user?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            The user will not be able to sign in until you lift the ban.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBanId(null)}>Cancel</Button>
          <Button color="warning" onClick={handleBan}>
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
