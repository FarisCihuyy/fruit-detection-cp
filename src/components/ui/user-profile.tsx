"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useLoading } from "@/context/loading-context";

export function UserProfile() {
  const { user, logout } = useAuth();
  const { setLoading } = useLoading();

  const handleLogout = () => {
    setLoading(true);
    try {
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-x-2 rounded-sm px-2 py-1 shadow max-w-45">
          <span className="font-sourceSerif font-light rounded-full min-w-8 min-h-8 bg-accent text-background text-lg grid place-items-center">
            {user?.name?.charAt(0) || "U"}
          </span>
          <span className="truncate text-sm font-medium">{user?.name}</span>
          <ChevronDownIcon className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-fit">
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
