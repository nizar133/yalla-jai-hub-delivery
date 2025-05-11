
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OrderProvider } from "./contexts/OrderContext";
import { DirectionProvider } from "./components/DirectionProvider";
import { StoreProvider } from "./contexts/StoreContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AppLayout } from "./components/layout/AppLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StoreDetails from "./pages/StoreDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DirectionProvider>
      <AuthProvider>
        <CurrencyProvider>
          <StoreProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route element={<AppLayout requireAuth={true} />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/store/:id" element={<StoreDetails />} />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </OrderProvider>
          </StoreProvider>
        </CurrencyProvider>
      </AuthProvider>
    </DirectionProvider>
  </QueryClientProvider>
);

export default App;
