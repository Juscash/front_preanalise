import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ConfigProvider from "./contexts/AntdContext";

import Login from "./pages/login";
import TestePrompt from "./pages/teste_prompt";
import HistoricoTeste from "./pages/historico_teste";
import SidebarLayout from "./components/sidebar/SidebarLayout";
import NovaReanalise from "./pages/nova_reanalise";
import GerenciadorPrompt from "./pages/gerenciador_prompt";

function App() {
  return (
    <GoogleOAuthProvider clientId="733436954468-ps2a91fg2l8j7o5nan7kgs1oej0vm9g8.apps.googleusercontent.com">
      <ConfigProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route
                  path="/teste-prompt"
                  element={
                    <SidebarLayout>
                      <TestePrompt />
                    </SidebarLayout>
                  }
                />
                <Route
                  path="/gerenciador-prompt"
                  element={
                    <SidebarLayout>
                      <GerenciadorPrompt />
                    </SidebarLayout>
                  }
                />
                <Route
                  path="/historico-teste"
                  element={
                    <SidebarLayout>
                      <HistoricoTeste />
                    </SidebarLayout>
                  }
                />
                <Route
                  path="/nova-reanalise"
                  element={
                    <SidebarLayout>
                      <NovaReanalise />
                    </SidebarLayout>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
