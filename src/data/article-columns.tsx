"use client";

import { cn } from "@/lib/utils";
import { Articles } from "@/services/types/article";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Articles["data"]>[] = [
  {
    id: "no",
    header: "No.",
    size: 60,
    cell: ({ row }) => <div className="w-[60px]">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 300,
    cell: ({ row }) => (
      <p className="max-w-[270px] truncate">{row.original.title}</p>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 500,
    cell: ({ row }) => (
      <p className="max-w-[500px] truncate" title={row.original.description}>
        {row.original.description}
      </p>
    ),
  },
  {
    id: "view",
    header: "View",
    size: 100,
    cell: ({ row }) => (
      <a
        href={`/blog/${row.original.id}/${row.original.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center",
          "rounded-sm border px-2 py-1",
          "font-medium",
          "text-blue-500 border-blue-500/50 bg-blue-500/10",
        )}
      >
        View
      </a>
    ),
  },
];
