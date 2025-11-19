// import { ReactNode, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { ThemeToggle } from '@/components/ThemeToggle';
// import { authService } from '@/services/api/authService';
// import {
//   Home,
//   FileText,
//   Package,
//   Gem,
//   CreditCard,
//   FolderOpen,
//   Share2,
//   IdCard,
//   MessageSquare,
//   User,
//   LogOut,
//   Menu,
//   X,
// } from 'lucide-react';

// interface UserLayoutProps {
//   children: ReactNode;
// }

// export const UserLayout = ({ children }: UserLayoutProps) => {
//   const navigate = useNavigate();
//   const user = authService.getCurrentUser();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/auth');
//   };

//   const navItems = [
//     { icon: Home, label: 'Feed', path: '/user/feed' },
//     { icon: FileText, label: 'My Posts', path: '/user/my-posts' },
//     { icon: Package, label: 'Packages', path: '/user/packages' },
//     { icon: Gem, label: 'Diamond Wallet', path: '/user/wallet' },
//     { icon: CreditCard, label: 'Payments', path: '/user/payments' },
//     { icon: FolderOpen, label: 'Projects', path: '/user/projects' },
//     { icon: Share2, label: 'Social Media', path: '/user/social-media' },
//     { icon: IdCard, label: 'ID Verification', path: '/user/id-verification' },
//     { icon: MessageSquare, label: 'Feedback', path: '/user/feedback' },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between px-4">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//             </Button>
//             <Link to="/user/feed" className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                 <Home className="h-5 w-5" />
//               </div>
//               <span className="hidden font-semibold sm:inline-block">User Portal</span>
//             </Link>
//           </div>

//           <nav className="hidden md:flex items-center gap-1">
//             {navItems.slice(0, 5).map((item) => (
//               <Link key={item.path} to={item.path}>
//                 <Button variant="ghost" size="sm" className="gap-2">
//                   <item.icon className="h-4 w-4" />
//                   <span className="hidden lg:inline">{item.label}</span>
//                 </Button>
//               </Link>
//             ))}
//           </nav>

//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                   <Avatar className="h-10 w-10">
//                     <AvatarFallback className="bg-primary text-primary-foreground">
//                       {user?.name?.[0] || user?.email?.[0] || 'U'}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
//                     <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => navigate('/user/profile')}>
//                   <User className="mr-2 h-4 w-4" />
//                   Profile
//                 </DropdownMenuItem>
//                 {user?.role === 'admin' && (
//                   <DropdownMenuItem onClick={() => navigate('/dashboard')}>
//                     <User className="mr-2 h-4 w-4" />
//                     Admin Dashboard
//                   </DropdownMenuItem>
//                 )}
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-b bg-background">
//           <nav className="container flex flex-col gap-2 py-4 px-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <Button variant="ghost" className="w-full justify-start gap-2">
//                   <item.icon className="h-4 w-4" />
//                   {item.label}
//                 </Button>
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="container py-6 px-4">{children}</main>
//     </div>
//   );
// };





import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService } from '@/services/api/authService';
import {
  Home,
  FileText,
  Package,
  Gem,
  CreditCard,
  FolderOpen,
  Share2,
  IdCard,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const UserLayout = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: Home, label: 'Feed', path: '/user/feed' },
    { icon: FileText, label: 'My Posts', path: '/user/my-posts' },
    { icon: Package, label: 'Packages', path: '/user/packages' },
    { icon: Gem, label: 'Diamond Wallet', path: '/user/wallet' },
    { icon: CreditCard, label: 'Payments', path: '/user/payments' },
    { icon: FolderOpen, label: 'Projects', path: '/user/projects' },
    { icon: Share2, label: 'Social Media', path: '/user/social-media' },
    { icon: IdCard, label: 'ID Verification', path: '/user/id-verification' },
    { icon: MessageSquare, label: 'Feedback', path: '/user/feedback' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Logo */}
            <Link to="/user/feed" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </div>
              <span className="hidden font-semibold sm:inline-block">User Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 5).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Avatar + Dropdown */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/user/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <nav className="container flex flex-col gap-2 py-4 px-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-6 px-4">
        <Outlet /> {/* هنا هتظهر كل صفحات الـ User */}
      </main>
    </div>
  );
};
