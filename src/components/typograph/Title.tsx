import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

type CustomTitleProps = {
  level: 1 | 2 | 3 | 4 | 5 | undefined;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const CustomTitle = ({ level, children, style }: CustomTitleProps) => (
  <Title
    level={level}
    style={{
      ...style,
      color: "#0a3672",
      marginTop: "0px",
      marginBottom: "24px",
      borderBottom: "1px solid #0a3672",
      paddingBottom: "12px",
    }}
  >
    {children}
  </Title>
);

export default CustomTitle;
