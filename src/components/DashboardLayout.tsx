import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

interface DashboardLayoutProps {
  title?: string;
}

export function DashboardLayout({ title }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <SidebarInset className="print:!ml-0">
        <div className="print:hidden">
          <DashboardHeader title={title} />
        </div>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
