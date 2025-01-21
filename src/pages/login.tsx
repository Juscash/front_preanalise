import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Card, message } from "antd";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

import logo from "../assets/img/logo.svg";

const Login: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse.credential);
      navigate("/gerenciador-prompt");
    } catch (error) {
      console.error("Erro no login:", error);
      message.error("Usuário não autorizado");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-content">
          <img src={logo} alt="logo" />
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
