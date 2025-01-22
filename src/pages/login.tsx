import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message } from "antd";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/img/logo.svg";

const Login: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      message.error("Falha na autenticação com Google");
      return;
    }

    try {
      await login(credentialResponse.credential);
      navigate("/gerenciador-prompt");
    } catch (error) {
      console.error("Erro no login:", error);
      message.error("Usuário não autorizado");
    }
  };

  const handleGoogleError = () => {
    message.error("Erro ao fazer login com Google");
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-content">
          <img src={logo} alt="Logo" />
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </Card>
    </div>
  );
};

export default Login;
