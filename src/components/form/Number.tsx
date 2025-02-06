import React from "react";
import { InputNumber, Form } from "antd";
import { InputNumberProps } from "antd";

const { Item } = Form;
interface CustomInputProps extends InputNumberProps {
  label: string;
  name: string;
  required?: boolean;
  classLabel?: string;
  disabled?: boolean;
  value?: number;
}

const CustomInputNumber: React.FC<CustomInputProps> = ({
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
      <InputNumber
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

export default CustomInputNumber;
