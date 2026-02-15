import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface OfficerUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

const OFFICER_ROLES = ["officer", "admin", "risk_analyst", "credit_manager"];

export function useOfficerAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<OfficerUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/officer/login");
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(userData) as OfficerUser;
      if (!OFFICER_ROLES.includes(parsed.role)) {
        navigate("/officer/login");
        setIsLoading(false);
        return;
      }

      setUser(parsed);
      setIsAuthenticated(true);
    } catch {
      navigate("/officer/login");
    }

    setIsLoading(false);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officerSession");
    navigate("/officer/login");
  };

  const hasRole = (role: string) => user?.role === role;
  const isAdmin = () => user?.role === "admin";
  const isManager = () => user?.role === "credit_manager" || user?.role === "admin";

  return { user, isAuthenticated, isLoading, logout, hasRole, isAdmin, isManager };
}
