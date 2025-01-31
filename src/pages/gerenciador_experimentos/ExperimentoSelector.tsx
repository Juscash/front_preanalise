import React from "react";
import { Row, Col } from "antd";
import { Select } from "../../components/form";
import { Experimento } from "../../models";

interface ExperimentoSelectorProps {
  experimentosMotor: Experimento[];
  onExperimentoChange: (experimentoId: string) => void;
}

export const ExperimentoSelector: React.FC<ExperimentoSelectorProps> = ({
  experimentosMotor,
  onExperimentoChange,
}) => (
  <Row gutter={16}>
    <Col span={16}>
      <Select
        label="Experimentos gravados"
        name="experimentos"
        selects={experimentosMotor.map((ref) => ({
          value: ref.id,
          name: `${ref.versao} - ${ref.descricao}`,
        }))}
        onChange={onExperimentoChange}
      />
    </Col>
  </Row>
);
