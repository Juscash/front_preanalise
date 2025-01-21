import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Modal, Popover } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  FileTextOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ExperimentOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CSSProperties } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/img/logo.svg";

const { Sider, Content, Header } = Layout;

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

  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirmar Sair",
      content: "Você tem certeza que deseja sair?",
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        logout();
      },
    });
  };

  const content = () => (
    <Button type="primary" onClick={confirmLogout} icon={<LogoutOutlined />}>
      Sair
    </Button>
  );

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/gerenciador-prompt",
      icon: <FileTextOutlined />,
      label: (
        <Link to="/gerenciador-prompt" style={menuStyle}>
          Gerenciador Prompt
        </Link>
      ),
    },
    {
      key: "/teste-prompt",
      icon: <ExperimentOutlined />,
      label: (
        <Link to="/teste-prompt" style={menuStyle}>
          Teste de Prompt
        </Link>
      ),
    },
    {
      key: "/historico-teste",
      icon: <HistoryOutlined />,
      label: (
        <Link to="/historico-teste" style={menuStyle}>
          Histórico de Teste
        </Link>
      ),
    },
    {
      key: "/nova-reanalise",
      icon: <SyncOutlined />,
      label: (
        <Link to="/nova-reanalise" style={menuStyle}>
          Nova reanalise
        </Link>
      ),
    },
    {
      key: "/sair",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="text"
          style={{ color: "white", textAlign: "start", display: "flex" }}
          onClick={confirmLogout}
        >
          Sair
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={sidebarStyle}
        trigger={null}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={Logo}
            alt="logo"
            style={{
              width: collapsed ? "70%" : "80%",
              marginBottom: "30px",
              marginTop: "30px",
            }}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: "#072854", color: "white" }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ height: "45px", ...sidebarStyle }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              type="text"
              onClick={toggleCollapsed}
              style={{ color: "white", marginLeft: "-50px" }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1
                style={{
                  color: "white",
                  fontSize: "16px",
                  marginRight: "20px",
                }}
              >
                Olá, {user?.name}!
              </h1>
              <Popover content={content}>
                <Avatar
                  style={{ backgroundColor: "gray", cursor: "pointer" }}
                  size={28}
                  icon={<UserOutlined />}
                />
              </Popover>
            </div>
          </div>
        </Header>
        <Content
          style={{
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
