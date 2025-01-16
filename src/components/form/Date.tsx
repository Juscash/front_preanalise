import React from "react";
import { DatePicker, Form } from "antd";
import { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;
const { Item } = Form;

interface CustomDateRangeProps extends RangePickerProps {
  label: string;
  name: string;
  required?: boolean;
  classLabel?: string;
  disabled?: boolean;
}

const CustomDateRange: React.FC<CustomDateRangeProps> = ({
  label,
  required = false,
  name,
  classLabel = "form-label-default",
  disabled = false,
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
      <RangePicker
        style={{
          width: "100%",
          backgroundColor: "#D9D9D9",
        }}
        disabled={disabled}
        format="DD/MM/YYYY"
        placeholder={["Data inicial", "Data final"]}
        {...rest}
      />
    </Item>
  );
};

export default CustomDateRange;
