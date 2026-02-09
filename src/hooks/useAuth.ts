import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthCheck() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/applicant/login");
        }
    }, [navigate]);

    return {
        isAuthenticated: !!localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") || "null"),
        logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/applicant/login");
        },
    };
}
