"use client";

import { cn } from "@/lib/utils";
import { Articles } from "@/services/types/article";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Articles["data"]>[] = [
  {
    id: "no",
    header: "No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "view",
    header: "View",
    cell: ({ row }) => (
      <a
        href={`/blog/${row.original.id}/${row.original.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "font-medium border rounded-sm px-2 py-1",
          "text-blue-500 border-blue-500/50 bg-blue-500/10",
        )}
      >
        View
      </a>
    ),
  },
];
