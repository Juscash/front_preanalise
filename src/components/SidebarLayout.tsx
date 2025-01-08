import React, { useState } from "react";
import { Layout, Menu, Button, Divider, Modal } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  FileTextOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { CSSProperties } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/img/logo.svg";
const { Sider, Content } = Layout;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarStyle: CSSProperties = {
    background: "#072854",
  };

  const menuStyle: CSSProperties = {
    background: "#072854",
    color: "white",
  };

  const menuItemStyle: any = {
    color: "white",
    "&:hover": {
      color: "white",
    },
  };
  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirmar Sair",
      content: "Você tem certeza que deseja sair?",
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        logout();
      },
      onCancel() {
        // Ação ao cancelar se necessário
      },
    });
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={sidebarStyle}
        trigger={null}
      >
        <div style={{ padding: "10px", textAlign: "center" }}>
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{ color: "white" }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>
        <img
          src={Logo}
          alt="logo"
          style={{ width: "100%", padding: "10px", marginBottom: "30px" }}
        />

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={menuStyle}
        >
          <Menu.Item
            key="/teste-prompt"
            icon={<FileTextOutlined style={menuItemStyle} />}
            style={menuItemStyle}
          >
            <Link to="/teste-prompt" style={menuItemStyle}>
              Teste Prompt
            </Link>
          </Menu.Item>
          <Menu.Item
            key="/historico-teste"
            icon={<HistoryOutlined style={menuItemStyle} />}
            style={menuItemStyle}
          >
            <Link to="/historico-teste" style={menuItemStyle}>
              Histórico de Teste
            </Link>
          </Menu.Item>
          <Menu.Item
            key="/nova-reanalise"
            icon={<HistoryOutlined style={menuItemStyle} />}
            style={menuItemStyle}
          >
            <Link to="/nova-reanalise" style={menuItemStyle}>
              Nova reanalise
            </Link>
          </Menu.Item>
          <Menu.Item
            key="/sair"
            icon={<LogoutOutlined style={menuItemStyle} />}
            style={menuItemStyle}
          >
            <Button
              type="text"
              style={{ color: "white", textAlign: "start", display: "flex" }}
              onClick={confirmLogout}
            >
              Sair
            </Button>
          </Menu.Item>
        </Menu>
        {!collapsed && (
          <div style={{ marginTop: "60px", width: "100%" }}>
            <Divider style={{ background: "white" }} />
            <div
              style={{
                color: "white",
                textAlign: "start",
                marginLeft: "10px",
                marginBottom: "10px",
              }}
            >
              Olá, {user?.name}!
            </div>
          </div>
        )}
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
