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
import Comments from "./pages/Comments";
import Likes from "./pages/Likes";
import Materials from "./pages/Materials";
import Packages from "./pages/Packages";
import Diamonds from "./pages/Diamonds";
import Payments from "./pages/Payments";
import Projects from "./pages/Projects";
import SocialMedia from "./pages/SocialMedia";
import IDVerification from "./pages/IDVerification";
import Feedback from "./pages/Feedback";
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
                    <Comments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/likes"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Likes />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Materials />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/packages"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Packages />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/diamonds"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Diamonds />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Payments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Projects />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/social-media"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SocialMedia />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/id-verification"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <IDVerification />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Feedback />
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
