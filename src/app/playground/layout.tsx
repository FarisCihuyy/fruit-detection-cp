import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/ui/user-profile";

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "12rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="w-full">
        <header className="min-h-12 px-6 xl:min-h-16 flex items-center justify-between gap-x-4 bg-sidebar border-b">
          <SidebarTrigger className="hover:bg-accent/5 rounded -ml-4 hover:text-accent" />
          <UserProfile />
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default PlaygroundLayout;
