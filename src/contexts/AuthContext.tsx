import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

interface AuthContextData {
  authenticated: boolean;
  user: { name: string; email: string } | null;
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const verifyToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return false;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("auth/verify_token");
      setUser(response.data);
      setAuthenticated(true);
      setLoading(false);

      return true;
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (googleToken: string) => {
    try {
      const response = await api.post(
        "auth/google",
        { token: googleToken },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Erro na autenticação:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.defaults.headers.common["Authorization"] = "";
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, user, login, logout, verifyToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
