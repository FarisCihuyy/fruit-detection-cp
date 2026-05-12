import { LayoutPanelLeft, Upload, Camera } from "lucide-react";
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
      label: "Dashboard",
      icon: LayoutPanelLeft,
      href: "/playground",
    },
    {
      label: "Upload",
      icon: Upload,
      href: "/playground/upload",
    },
    {
      label: "Live Camera",
      icon: Camera,
      href: "/playground/live-camera",
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
