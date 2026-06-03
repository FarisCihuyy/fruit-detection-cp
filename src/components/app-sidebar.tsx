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
        <Link href="/" className="font-bebasNeue text-xl px-4 py-2">
          Fresh or Rotten
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton tooltip={item.label}>
                <a href={item.href} className="flex gap-x-4">
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
