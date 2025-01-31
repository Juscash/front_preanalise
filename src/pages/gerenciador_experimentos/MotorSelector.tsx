import React from "react";
import { Row, Col } from "antd";
import { Select, Input } from "../../components/form";
import { Motores } from "../../models";

interface MotorSelectorProps {
  motores: Motores[];
  onMotorChange: (motorId: string) => void;
  motorSelected: Motores | null;
}

export const MotorSelector: React.FC<MotorSelectorProps> = ({
  motores,
  onMotorChange,
  motorSelected,
}) => (
  <Row gutter={16}>
    <Col span={8}>
      <Select
        required
        label="Motor"
        name="motor"
        selects={motores.map((item) => ({ value: item.id, name: item.nome }))}
        onChange={onMotorChange}
      />
    </Col>
    <Col span={8}>
      <Input label="Descrição do motor" name="descricao" value={motorSelected?.descricao || ""} />
    </Col>
  </Row>
);
