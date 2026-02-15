import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  Fingerprint,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function OfficerLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Check if user has officer-level role
      const officerRoles = ["officer", "admin", "risk_analyst", "credit_manager"];
      if (!officerRoles.includes(user.role)) {
        setError("Access denied. This portal is restricted to authorized banking personnel only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("officerSession", JSON.stringify({
        loginTime: new Date().toISOString(),
        role: user.role,
        sessionId: crypto.randomUUID(),
      }));

      toast({
        title: "Authentication Successful",
        description: `Welcome back, ${user.username}. Session initiated.`,
      });

      navigate("/officer");
    } catch (err: any) {
      const message = err.response?.data?.message || "Authentication failed. Please verify your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = (role: string) => {
    const demoUsers: Record<string, { username: string; email: string; role: string }> = {
      officer: { username: "Sarah Johnson", email: "sarah.johnson@smartbankflow.com", role: "officer" },
      risk_analyst: { username: "Priya Mehta", email: "priya.mehta@smartbankflow.com", role: "risk_analyst" },
      credit_manager: { username: "Arun Kumar", email: "arun.kumar@smartbankflow.com", role: "credit_manager" },
      admin: { username: "Meena Patel", email: "meena.patel@smartbankflow.com", role: "admin" },
    };

    const user = demoUsers[role];
    const token = "demo-officer-token-" + role;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ id: role, ...user }));
    localStorage.setItem("officerSession", JSON.stringify({
      loginTime: new Date().toISOString(),
      role: user.role,
      sessionId: crypto.randomUUID(),
    }));

    toast({
      title: "Demo Access Granted",
      description: `Logged in as ${user.username} (${role.replace("_", " ")})`,
    });

    navigate("/officer");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxMCAwIDE4IDggMTggMThzLTggMTgtMTggMTgtMTgtOC0xOC0xOCA4LTE4IDE4LTE4eiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <span className="text-lg font-bold">SB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Smart BankFlow</h1>
                <p className="text-sm text-white/60">Internal Operations Portal</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold leading-tight mb-4">
                Secure Officer<br />Access Portal
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Enterprise-grade loan origination and decisioning platform for authorized banking personnel.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Shield, label: "256-bit AES Encryption" },
                { icon: Fingerprint, label: "Multi-Factor Authentication" },
                { icon: KeyRound, label: "Role-Based Access Control" },
                { icon: Building2, label: "RBI Compliance Certified" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/40">
            <p>© 2024 Smart BankFlow Technologies Pvt. Ltd.</p>
            <p className="mt-1">Authorized access only. All activities are logged and monitored.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">SB</span>
            </div>
            <span className="text-lg font-semibold">Smart BankFlow</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Officer Sign In</h2>
            <p className="text-muted-foreground mt-1">
              Enter your credentials to access the operations dashboard
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Authentication Error</p>
                <p className="text-sm text-destructive/80 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Employee Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@smartbankflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button type="button" className="text-xs text-accent hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Keep me signed in on this device
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 gradient-primary" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Sign In to Portal
                </div>
              )}
            </Button>
          </form>

          {/* Demo Access */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "officer", label: "Loan Officer", color: "border-status-processing/30 hover:bg-status-processing/5" },
                { role: "risk_analyst", label: "Risk Analyst", color: "border-risk-medium/30 hover:bg-risk-medium/5" },
                { role: "credit_manager", label: "Credit Manager", color: "border-accent/30 hover:bg-accent/5" },
                { role: "admin", label: "Admin", color: "border-primary/30 hover:bg-primary/5" },
              ].map((item) => (
                <Button
                  key={item.role}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`text-xs ${item.color}`}
                  onClick={() => handleDemoLogin(item.role)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This system is for authorized use only. Unauthorized access attempts are logged and may be subject to legal action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
