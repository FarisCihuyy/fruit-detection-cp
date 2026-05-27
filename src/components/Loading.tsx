"use client";

import { useLoading } from "@/context/loading-context";

export default function GlobalLoading() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-primary/40 backdrop-blur-sm">
      <div className="size-12 rounded-full border-4 border-background border-t-transparent animate-spin" />
    </div>
  );
}
