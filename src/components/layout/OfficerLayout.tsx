import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileStack,
  ShieldAlert,
  AlertTriangle,
  BarChart3,
  Settings,
  Users,
  Bell,
  Search,
  ChevronLeft,
  LogOut,
  User,
  ChevronDown,
  Workflow,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useOfficerAuth } from "@/hooks/useOfficerAuth";

interface OfficerLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/officer", icon: LayoutDashboard },
  { name: "Applications", href: "/officer/applications", icon: FileStack },
  { name: "Risk Assessment", href: "/officer/risk", icon: ShieldAlert },
  { name: "Fraud Monitoring", href: "/officer/fraud", icon: AlertTriangle },
  { name: "Workflow", href: "/officer/workflow", icon: Workflow },
  { name: "Reports", href: "/officer/reports", icon: BarChart3 },
];

const adminNavigation = [
  { name: "User Management", href: "/officer/users", icon: Users },
  { name: "Settings", href: "/officer/settings", icon: Settings },
];

const roleLabels: Record<string, string> = {
  officer: "Loan Officer",
  risk_analyst: "Risk Analyst",
  credit_manager: "Credit Manager",
  admin: "Administrator",
};

export function OfficerLayout({ children }: OfficerLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoading, logout, isAdmin } = useOfficerAuth();

  const isActive = (href: string) => {
    if (href === "/officer") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
            <span className="text-lg font-bold text-white">SB</span>
          </div>
          <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.username || user.email?.split("@")[0] || "Officer";
  const roleLabel = roleLabels[user.role] || "Officer";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
                <span className="text-sm font-bold text-white">SB</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-sidebar-foreground">
                  Smart BankFlow
                </h1>
                <p className="text-xs text-sidebar-foreground/60">Officer Portal</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-white">SB</span>
            </div>
          )}
        </div>

        {/* User Info (collapsed: avatar only) */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{displayName}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                  <p className="text-[10px] text-sidebar-foreground/50">{roleLabel}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                Main Menu
              </p>
            )}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Admin section - visible to all but settings restricted */}
          <div className="pt-6 space-y-1">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                Administration
              </p>
            )}
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-6">
          {/* Search */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications, applicants..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Session indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-risk-low/10 text-risk-low text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-risk-low pulse-live" />
              Secure Session
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                5
              </Badge>
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{roleLabel}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Security Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
