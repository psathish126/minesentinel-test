import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import UploadData from "./pages/UploadData";
import AIAssistant from "./pages/AIAssistant";
import GeospatialView from "./pages/GeospatialView";
import SensorMonitoring from "./pages/SensorMonitoring";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/upload" element={<UploadData />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/geospatial" element={<GeospatialView />} />
          <Route path="/sensors" element={<SensorMonitoring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
