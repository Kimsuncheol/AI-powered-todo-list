"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { useAuth } from "../lib/auth/useAuth";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const hideSearchAndCta = pathname === "/signin" || pathname === "/signup";

  const handleMenuClose = () => setAnchorEl(null);

  const initials = user?.name?.[0] ?? user?.email?.[0];

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
    router.push("/signin");
  };

  return (
    <AppBar position="sticky" elevation={0} color="default">
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          component={Link}
          href="/"
          aria-label="Navigate home"
          sx={{ color: "inherit" }}
        >
          <Image src={'/logo.png'} alt="" width={100} height={50}/>
        </IconButton>

        {!hideSearchAndCta && <SearchBar />}

        {user ? (
          <>
            <Tooltip title={user.email} arrow>
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                aria-label="Open profile menu"
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {initials ? initials.toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push("/profile");
                }}
              >
                {user.name ?? user.email}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  void handleSignOut();
                }}
              >
                Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          !hideSearchAndCta && (
          <Button component={Link} href="/signin" variant="text">
            Sign in
          </Button>
          )
        )}
      </Toolbar>
    </AppBar>
  );
}
