import React from "react";
import { Input, Form } from "antd";
import { TextAreaProps } from "antd/es/input";

const { TextArea } = Input;

const { Item } = Form;

interface CustomTextAreaProps extends TextAreaProps {
  label: string;
  name: string;
  required?: boolean;
  classLabel?: string;
  disabled?: boolean;
  rows?: number;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  required = false,
  name,
  classLabel = "form-label-default",
  disabled = false,
  rows = 4,
  value,
  ...rest
}) => {
  return (
    <Item
      label={label}
      name={name}
      rules={[
        {
          required,
          message: `Por favor digite ${label.toLowerCase()}`,
        },
      ]}
      layout="vertical"
      labelCol={{ className: classLabel }}
      getValueProps={(val) => ({ value: value ?? val })}
    >
      <TextArea
        style={{
          width: "100%",
          backgroundColor: "#D9D9D9",
        }}
        disabled={disabled}
        name={name}
        placeholder={`Digite ${label.toLowerCase()}`}
        {...rest}
        rows={rows}
        value={value}
      />
    </Item>
  );
};

export default CustomTextArea;
