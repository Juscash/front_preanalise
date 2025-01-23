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
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/img/logo.svg";

const { Sider, Content, Header } = Layout;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_BG = "#072854";
const TEXT_COLOR = "white";

const menuItems = [
  {
    key: "/gerenciador-prompt",
    icon: <FileTextOutlined />,
    label: "Gerenciador Prompt",
  },
  {
    key: "/teste-prompt",
    icon: <ExperimentOutlined />,
    label: "Teste de Prompt",
  },
  {
    key: "/historico-teste",
    icon: <HistoryOutlined />,
    label: "Histórico de Teste",
  },
  // { key: "/nova-reanalise", icon: <SyncOutlined />, label: "Nova reanalise" },
];

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirmar Sair",
      content: "Você tem certeza que deseja sair?",
      okText: "Sim",
      cancelText: "Não",
      onOk: logout,
    });
  };

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{ background: SIDEBAR_BG }}
        trigger={null}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={Logo}
            alt="logo"
            style={{ width: collapsed ? "70%" : "80%", margin: "30px 0" }}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: SIDEBAR_BG, color: TEXT_COLOR }}
          items={menuItems.map((item) => ({
            ...item,
            label: (
              <Link to={item.key} style={{ color: TEXT_COLOR }}>
                {item.label}
              </Link>
            ),
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ height: "45px", background: SIDEBAR_BG }}>
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
              style={{ color: TEXT_COLOR, marginLeft: "-50px" }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1
                style={{
                  color: TEXT_COLOR,
                  fontSize: "16px",
                  marginRight: "20px",
                }}
              >
                Olá, {user?.name}!
              </h1>
              <Popover
                content={
                  <Button type="primary" onClick={confirmLogout} icon={<LogoutOutlined />}>
                    Sair
                  </Button>
                }
              >
                <Avatar
                  style={{ backgroundColor: "gray", cursor: "pointer" }}
                  size={28}
                  icon={<UserOutlined />}
                />
              </Popover>
            </div>
          </div>
        </Header>
        <Content style={{ padding: 24, background: "#fff", minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
