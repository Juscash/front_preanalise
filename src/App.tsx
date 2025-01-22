import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import ConfigProvider from "./contexts/AntdContext";
import PrivateRoute from "./components/PrivateRoute";
import SidebarLayout from "./components/sidebar/SidebarLayout";
import Login from "./pages/login";
import TestePrompt from "./pages/teste_prompt";
import HistoricoTeste from "./pages/historico_teste";
import NovaReanalise from "./pages/nova_reanalise";
import GerenciadorPrompt from "./pages/gerenciador_prompt";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const PrivateRoutes = [
  { path: "/teste-prompt", component: TestePrompt },
  { path: "/gerenciador-prompt", component: GerenciadorPrompt },
  { path: "/historico-teste", component: HistoricoTeste },
  { path: "/nova-reanalise", component: NovaReanalise },
];

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                {PrivateRoutes.map(({ path, component: Component }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <SidebarLayout>
                        <Component />
                      </SidebarLayout>
                    }
                  />
                ))}
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
