import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../utils/appContext";

// role: 'officer' in our case
const ProtectedRoute = ({ children, role }) => {
    const { user } = useApp();

    // If not logged in or role mismatch, redirect to admin login
    if (!user || user.role !== role) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
