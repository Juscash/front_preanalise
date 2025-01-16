// src/Login.tsx

import React from "react";
import { Button, Card, Typography, message } from "antd";

import logo from "../assets/img/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../contexts/AuthContext";

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse.credential);
      navigate("/teste-prompt");
    } catch (error) {
      console.error("Erro no login:", error);
      message.error("Usuário não autorizado");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-content">
          <img src={logo} alt="logo" className="logo-login" />

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => message.error("Erro ao fazer login com Google")}
          />
        </div>
      </Card>
    </div>
  );
};

export default Login;
