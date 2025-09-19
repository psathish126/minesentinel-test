import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  FileUp,
  Globe,
  Home,
  Map,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Predictions", url: "/predictions", icon: TrendingUp },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Upload Data", url: "/upload", icon: FileUp },
  { title: "Results & Insights", url: "/results", icon: BarChart3 },
  { title: "AI Assistant", url: "/assistant", icon: Bot },
  { title: "Geospatial View", url: "/geospatial", icon: Globe },
  { title: "Sensor Monitoring", url: "/sensors", icon: Activity },
  { title: "Reports", url: "/reports", icon: FileUp },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "User Management", url: "/users", icon: Users },
];

const quickActions = [
  { title: "Emergency Alert", icon: Shield, color: "status-critical" },
  { title: "System Health", icon: Zap, color: "status-safe" },
  { title: "Live Chat", icon: MessageSquare, color: "primary" },
];

export function MineSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary border-r-2 border-primary font-semibold glow-warning" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-warning rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Mine Sentinel</h1>
              <p className="text-xs text-muted-foreground">AI Safety System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-warning rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action) => (
                  <SidebarMenuItem key={action.title}>
                    <SidebarMenuButton 
                      className={`hover:bg-${action.color}/20 hover:text-${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm">{action.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}