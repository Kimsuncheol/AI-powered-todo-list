import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, Container } from "@mui/material";
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI To-Do",
  description: "AI-powered task manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <AuthProvider>
            <Header />
            <Container component="main" sx={{ py: 4 }}>
              {children}
            </Container>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
