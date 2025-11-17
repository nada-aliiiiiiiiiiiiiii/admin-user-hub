import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserGuard } from "./components/UserGuard";
import { DashboardLayout } from "./components/DashboardLayout";
import { UserLayout } from "./components/UserLayout";
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
import Feed from "./pages/user/Feed";
import PostDetail from "./pages/user/PostDetail";
import CreatePost from "./pages/user/CreatePost";
import EditPost from "./pages/user/EditPost";
import MyPosts from "./pages/user/MyPosts";
import UserPackages from "./pages/user/UserPackages";
import PackageDetail from "./pages/user/PackageDetail";
import PaymentHistory from "./pages/user/PaymentHistory";
import DiamondWallet from "./pages/user/DiamondWallet";
import UserProjects from "./pages/user/UserProjects";
import UserSocialMedia from "./pages/user/UserSocialMedia";
import UserMaterials from "./pages/user/UserMaterials";
import UserNationalID from "./pages/user/UserNationalID";
import UserFeedback from "./pages/user/UserFeedback";
import UserProfile from "./pages/user/UserProfile";
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

            {/* User Panel Routes */}
            <Route path="/user/feed" element={<UserGuard><UserLayout><Feed /></UserLayout></UserGuard>} />
            <Route path="/user/post/:id" element={<UserGuard><UserLayout><PostDetail /></UserLayout></UserGuard>} />
            <Route path="/user/create-post" element={<UserGuard><UserLayout><CreatePost /></UserLayout></UserGuard>} />
            <Route path="/user/edit-post/:id" element={<UserGuard><UserLayout><EditPost /></UserLayout></UserGuard>} />
            <Route path="/user/my-posts" element={<UserGuard><UserLayout><MyPosts /></UserLayout></UserGuard>} />
            <Route path="/user/packages" element={<UserGuard><UserLayout><UserPackages /></UserLayout></UserGuard>} />
            <Route path="/user/package/:id" element={<UserGuard><UserLayout><PackageDetail /></UserLayout></UserGuard>} />
            <Route path="/user/payments" element={<UserGuard><UserLayout><PaymentHistory /></UserLayout></UserGuard>} />
            <Route path="/user/wallet" element={<UserGuard><UserLayout><DiamondWallet /></UserLayout></UserGuard>} />
            <Route path="/user/projects" element={<UserGuard><UserLayout><UserProjects /></UserLayout></UserGuard>} />
            <Route path="/user/social-media" element={<UserGuard><UserLayout><UserSocialMedia /></UserLayout></UserGuard>} />
            <Route path="/user/materials" element={<UserGuard><UserLayout><UserMaterials /></UserLayout></UserGuard>} />
            <Route path="/user/id-verification" element={<UserGuard><UserLayout><UserNationalID /></UserLayout></UserGuard>} />
            <Route path="/user/feedback" element={<UserGuard><UserLayout><UserFeedback /></UserLayout></UserGuard>} />
            <Route path="/user/profile" element={<UserGuard><UserLayout><UserProfile /></UserLayout></UserGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
