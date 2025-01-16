import React from "react";
import { Select, Form } from "antd";
import { SelectProps } from "antd/es/select";

const { Item } = Form;
interface CustomSelectProps extends SelectProps {
  label: string;
  name: string;
  required?: boolean;
  selects?: { value: string; name: string }[];
  classLabel?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  required = false,
  name,
  selects = [],
  classLabel = "form-label-default",
  ...rest
}) => {
  return (
    <Item
      label={label}
      name={name}
      rules={[
        {
          required,
          message: `Por favor selecione ${label.toLowerCase()}`,
        },
      ]}
      layout="vertical"
      labelCol={{ className: classLabel }}
    >
      <Select placeholder={label} {...rest}>
        {selects.map((s) => (
          <Select.Option key={s.value} value={s.value}>
            {s.name}
          </Select.Option>
        ))}
      </Select>
    </Item>
  );
};

export default CustomSelect;
