import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../services/api";

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  authenticated: boolean;
  user: User | null;
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await api.get<User>("auth/verify_token");
      setUser(data);
      setAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (googleToken: string): Promise<void> => {
    try {
      const { data } = await api.post<{ token: string; user: User }>(
        "auth/google",
        { token: googleToken },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setAuthenticated(true);
      setUser(data.user);
    } catch (error) {
      console.error("Erro na autenticação:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    api.defaults.headers.common["Authorization"] = "";
    setAuthenticated(false);
    setUser(null);
  }, []);

  const contextValue = {
    authenticated,
    user,
    login,
    logout,
    verifyToken,
    loading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
