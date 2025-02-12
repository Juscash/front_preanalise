import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import ConfigProvider from "./contexts/AntdContext";
import PrivateRoute from "./components/PrivateRoute";
import SidebarLayout from "./components/sidebar/SidebarLayout";
import Login from "./pages/login";
import TesteExperimento from "./pages/teste_experimento";
import HistoricoExperimento from "./pages/historico_experimento";
import Reanalise from "./pages/reanalise";
import GerenciadorParametros from "./pages/gerenciador_experimentos";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const PrivateRoutes = [
  { path: "/teste-experimento", component: TesteExperimento },
  { path: "/gerenciador-experimentos", component: GerenciadorParametros },
  { path: "/historico-experimento", component: HistoricoExperimento },
  { path: "/reanalise", component: Reanalise },
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
