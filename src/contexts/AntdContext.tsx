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
          colorSuccess: "#52c41a",
          colorError: "#ff4d4f",
          colorWarning: "#faad14",
        },
        components: {
          Table: {
            headerBg: "#f0f2f5",
            headerColor: "#0a3672",
            rowHoverBg: "#e6f7ff",
            borderColor: "#d9d9d9",
          },
          Button: {
            colorPrimaryHover: "#1890ff",
            colorSuccessBg: "#52c41a",
            colorSuccessHover: "#73d13d",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdContext;
