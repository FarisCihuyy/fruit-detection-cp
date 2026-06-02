"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function UserProfile() {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          size="sm"
          variant="ghost"
          className="flex gap-x-2 items-center rounded-sm hover:bg-transparent hover:text-primary cursor-pointer"
        >
          {/* <>
            <span className="rounded-full min-w-8 min-h-8 bg-foreground font-light text-xl grid place-items-center">
              {user?.name?.charAt(0) || "U"}
            </span>
            <span className="">{user?.name}</span>
          </> */}
          a
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit rounded-sm border">
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
