import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Clock,
  CreditCard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'loan' | 'document' | 'system';
  read: boolean;
  createdAt: string;
}

interface ApplicantLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/applicant", icon: LayoutDashboard },
  { name: "Apply for Loan", href: "/applicant/apply", icon: FileText },
  { name: "Track Application", href: "/applicant/track", icon: Clock },
  { name: "My Loans", href: "/applicant/loans", icon: CreditCard },
  { name: "Documents", href: "/applicant/documents", icon: FileText },
];

export function ApplicantLayout({ children }: ApplicantLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (userId: string) => {
    try {
      const response = await api.get(`/notifications/user/${userId}`);
      setNotifications(response.data);
      const unread = response.data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchNotifications(parsedUser.id);

      // Simple polling for notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications(parsedUser.id);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await api.patch(`/notifications/user/${user.id}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/applicant/login");
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh-light dark:gradient-mesh-dark">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-card-strong border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/applicant" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-white">SB</span>
                </div>
                <span className="text-lg font-semibold text-foreground hidden sm:block">
                  Smart BankFlow
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Help Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/applicant/how-to-apply")}>
                    <FileText className="mr-2 h-4 w-4" />
                    How to Apply
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/applicant/faqs")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/applicant/support")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Support Center
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-accent"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n._id}
                          className="p-4 flex flex-col items-start gap-1 cursor-pointer relative"
                          onClick={() => !n.read && markAsRead(n._id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-sm">{n.title}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          {!n.read && (
                            <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full" />
                          )}
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="p-2 justify-center text-accent text-xs font-medium cursor-pointer"
                    onClick={() => navigate("/applicant/activity")}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.username || user?.fullName || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2 border-b border-border mb-1">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-foreground">
                        {(user?.username || user?.fullName || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{user?.username || user?.fullName || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/applicant/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/applicant/activity")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Activity Log
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/applicant/documents")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <nav className="px-4 py-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Smart BankFlow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
