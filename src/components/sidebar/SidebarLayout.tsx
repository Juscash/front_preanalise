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
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/img/logo.svg";
const { Sider, Content, Header } = Layout;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const itensMenu = [
  {
    key: "/gerenciador-prompt",
    icon: <FileTextOutlined />,
    text: "Gerenciador Prompt",
  },
  {
    key: "/teste-prompt",
    icon: <FileTextOutlined />,
    text: "Teste de Prompt",
  },

  {
    key: "/historico-teste",
    icon: <HistoryOutlined />,
    text: "Histórico de Teste",
  },
  {
    key: "/nova-reanalise",
    icon: <HistoryOutlined />,
    text: "Nova reanalise",
  },
];

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
          style={menuStyle}
        >
          {itensMenu.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} style={menuItemStyle}>
              <Link to={item.key} style={menuItemStyle}>
                {item.text}
              </Link>
            </Menu.Item>
          ))}
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
      </Sider>
      <Layout>
        <Header style={{ height: "40px", ...sidebarStyle }}>
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
            <h1
              style={{
                color: "white",
                fontSize: "18px",
              }}
            >
              Olá, {user?.name}!
            </h1>
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
