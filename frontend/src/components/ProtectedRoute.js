// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();

  // If no user or user role doesn't match, redirect to login
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute;
