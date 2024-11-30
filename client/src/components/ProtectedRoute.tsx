import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../atoms/auth"; // Шлях до useAuth (адаптуйте до вашого проєкту)

type ProtectedRouteProps = {
    role: "Admin" | "Player";
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const hasAccess = (role === "Admin" && user.isAdmin) || (role === "Player" && !user.isAdmin);

    if (!hasAccess) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
