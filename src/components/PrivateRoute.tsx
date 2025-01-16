import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingPage } from "../components/loading";

const PrivateRoute: React.FC = () => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
