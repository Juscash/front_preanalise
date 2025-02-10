import React from "react";
import { Input, Form } from "antd";
import { InputProps } from "antd/es/input";

const { Item } = Form;
interface CustomInputProps extends InputProps {
  label: string;
  name: string;
  required?: boolean;
  classLabel?: string;
  disabled?: boolean;
  value?: string | number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  name,
  classLabel = "form-label-default",
  disabled = false,
  value,
  ...rest
}) => {
  return (
    <Item
      label={label}
      getValueProps={(val) => ({ value: value ?? val })}
      name={name}
      rules={[
        {
          required,
          message: `Por favor digite ${label.toLowerCase()}`,
        },
      ]}
      layout="vertical"
      labelCol={{ className: classLabel }}
    >
      <Input
        style={{
          width: "100%",
          backgroundColor: "#D9D9D9",
        }}
        disabled={disabled}
        name={name}
        placeholder={`Digite ${label.toLowerCase()}`}
        value={value}
        {...rest}
      />
    </Item>
  );
};

export default CustomInput;
