import React from "react";
import { Input } from "antd";
import { InputProps } from "antd/es/input";

interface CustomInputProps extends InputProps {
  label: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, ...rest }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8, fontWeight: "bold", color: "#072854" }}>
        {label}
      </div>
      <Input
        style={{
          width: "100%",
          backgroundColor: "#D9D9D9",
        }}
        placeholder={`Digite ${label.toLowerCase()}`}
        {...rest}
      />
    </div>
  );
};

export default CustomInput;
