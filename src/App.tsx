import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/patients" element={<PlaceholderPage title="Patients" />} />
            <Route path="/patients/new" element={<PlaceholderPage title="New Patient" />} />
            <Route path="/services" element={<PlaceholderPage title="Services" />} />
            <Route path="/appointments" element={<PlaceholderPage title="Appointments" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for pages not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">This page is coming soon.</p>
      </div>
      <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-dashed">
        <p className="text-muted-foreground">{title} module will be implemented here</p>
      </div>
    </div>
  );
}

export default App;
