import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { ReactNode } from "react";

const AntdContext = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: "#0a3672",
        },
        components: {
          Table: {
            headerBg: "#c5c3c3",
            headerColor: "#0a3672",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdContext;
