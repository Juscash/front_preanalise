import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spin } from "antd";

const PrivateRoute: React.FC = () => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Spin fullscreen tip="Carregando..." size="large" />;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
