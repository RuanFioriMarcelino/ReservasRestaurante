import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../hook/useAuth";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
