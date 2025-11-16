import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Posts from "./pages/Posts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Categories />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Posts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/comments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Comments module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/likes"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Likes module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Materials module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/packages"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Packages module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/diamonds"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Diamond System - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Payments module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Projects module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/social-media"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Social Media module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/id-verification"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">ID Verification module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-8">Feedback module - Coming soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
