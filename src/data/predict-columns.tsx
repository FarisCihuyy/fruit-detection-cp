"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Predict = {
  class: string;
  condition: "busuk" | "segar";
  segar_confidence: number;
  busuk_confidence: number;
};

export const columns: ColumnDef<Predict>[] = [
  {
    id: "no",
    header: "No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    id: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
      const confidence =
        Math.max(row.original.segar_confidence, row.original.busuk_confidence) *
        100;
      return (
        <span
          className={cn(
            "font-medium border rounded-sm px-2 py-1",
            row.original.condition === "busuk"
              ? "text-red-500 border-red-500/50 bg-red-500/10"
              : "text-green-500 border-green-500/50 bg-green-500/10",
          )}
        >
          {confidence.toFixed(1)}%
        </span>
      );
    },
  },
];
