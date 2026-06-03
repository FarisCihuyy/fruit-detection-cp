import { House } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar() {
  const menuItems = [
    {
      label: "Home",
      icon: House,
      href: "/playground",
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-2">
          <Image
            src="/icons/logo.svg"
            alt="Fresh or Rotten"
            width={24}
            height={24}
            className="shrink-0"
          />

          <span className="truncate group-data-[collapsible=icon]:hidden font-bebasNeue text-lg">
            Fresh or Rotten
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.label}
                className="group-data-[collapsible=icon]:mx-auto"
              >
                <Link
                  href={item.href}
                  className="flex gap-x-4 items-center text-base"
                >
                  <item.icon className="size-6" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
