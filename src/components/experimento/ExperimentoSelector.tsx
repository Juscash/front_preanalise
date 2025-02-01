import React from "react";
import { Row, Col } from "antd";
import { Select } from "../form";
import { Experimento } from "../../models";

interface ExperimentoSelectorProps {
  experimentosMotor: Experimento[];
  onExperimentoChange: (experimentoId: string) => void;
  gravar?: boolean;
}

export const ExperimentoSelector: React.FC<ExperimentoSelectorProps> = ({
  experimentosMotor,
  onExperimentoChange,
  gravar = true,
}) => (
  <Row gutter={16}>
    <Col span={16}>
      <Select
        label={gravar ? "Experimentos gravados" : "Selecione um experimento"}
        name="experimentos"
        selects={experimentosMotor.map((ref) => ({
          value: ref.id || "",
          name: `${ref.versao} - ${ref.descricao}`,
        }))}
        onChange={onExperimentoChange}
        disabled={experimentosMotor.length === 0}
        required={!gravar}
      />
    </Col>
  </Row>
);
