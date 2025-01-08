import React from "react";
import { Select } from "antd";
import { SelectProps } from "antd/es/select";

interface CustomSelectProps extends SelectProps {
  label: string;
  options: { value: string; label: string }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  ...rest
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8, fontWeight: "bold", color: "#072854" }}>
        {label}
      </div>
      <Select
        style={{
          width: "100%",
        }}
        placeholder={`Selecione ${label.toLowerCase()}`}
        options={options}
        {...rest}
      />
    </div>
  );
};

export default CustomSelect;
