import React from "react";
import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";

const { TextArea } = Input;

interface CustomTextAreaProps extends TextAreaProps {
  label: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({ label, ...rest }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8, fontWeight: "bold", color: "#072854" }}>
        {label}
      </div>
      <TextArea
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

export default CustomTextArea;
