import {
  LayoutDashboard,
  FolderTree,
  MessageSquare,
  Diamond,
  Heart,
  PackageOpen,
  CreditCard,
  FileText,
  Briefcase,
  Share2,
  IdCard,
  MessageCircle,
  Box,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Categories', url: '/categories', icon: FolderTree },
  { title: 'Posts', url: '/posts', icon: FileText },
  { title: 'Comments', url: '/comments', icon: MessageSquare },
  { title: 'Likes', url: '/likes', icon: Heart },
  { title: 'Materials', url: '/materials', icon: Box },
  { title: 'Packages', url: '/packages', icon: PackageOpen },
  { title: 'Diamond System', url: '/diamonds', icon: Diamond },
  { title: 'Payments', url: '/payments', icon: CreditCard },
  { title: 'Projects', url: '/projects', icon: Briefcase },
  { title: 'Social Media', url: '/social-media', icon: Share2 },
  { title: 'ID Verification', url: '/id-verification', icon: IdCard },
  { title: 'Feedback', url: '/feedback', icon: MessageCircle },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground font-semibold text-base px-4 py-3">
            {open ? 'Admin Panel' : 'AP'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
