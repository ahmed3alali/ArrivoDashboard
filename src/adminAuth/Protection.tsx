import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export function Protection({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in, render the children component (the protected page)
  return children;
}
