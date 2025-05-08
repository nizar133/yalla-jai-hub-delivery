
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OrderProvider } from "./contexts/OrderContext";
import { DirectionProvider } from "./components/DirectionProvider";
import { AppLayout } from "./components/layout/AppLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DirectionProvider>
      <AuthProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route element={<AppLayout requireAuth={true} />}>
                  <Route path="/dashboard/customer" element={<CustomerDashboard />} />
                  <Route path="/dashboard/vendor" element={<VendorDashboard />} />
                  <Route path="/dashboard/driver" element={<DriverDashboard />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrderProvider>
      </AuthProvider>
    </DirectionProvider>
  </QueryClientProvider>
);

export default App;

