"use client";

import { AuthProvider } from "@/context/auth-context";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
