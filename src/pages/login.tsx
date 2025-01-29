import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message, Spin } from "antd";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/img/logo.svg";

const Login: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      message.error("Falha na autenticação com Google");
      return;
    }
    setLoading(true);

    try {
      await login(credentialResponse.credential);

      navigate("/gerenciador-parametros");
    } catch (error) {
      console.error("Erro no login:", error);
      message.error("Usuário não autorizado");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    message.error("Erro ao fazer login com Google");
  };

  return (
    <Spin spinning={loading}>
      <div className="login-container">
        <Card className="login-card">
          <div className="login-content">
            <img src={logo} alt="Logo" />
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </Card>
      </div>
    </Spin>
  );
};

export default Login;
