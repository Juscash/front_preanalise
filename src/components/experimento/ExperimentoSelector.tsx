import React from "react";
import { Row, Col } from "antd";
import { Select, Input } from "../form";
import { Experimento } from "../../models";

interface ExperimentoSelectorProps {
  experimentosMotor: Experimento[];
  onExperimentoChange: (experimentoId: number) => void;
  onDescricaoChange?: (descricao: string) => void;
  gravar?: boolean;
  descricao?: string;
}

export const ExperimentoSelector: React.FC<ExperimentoSelectorProps> = ({
  experimentosMotor,
  onExperimentoChange,
  gravar = true,
  onDescricaoChange,
  descricao,
}) => (
  <Row gutter={16}>
    <Col span={gravar ? 16 : 9}>
      <Select
        label={gravar ? "Experimentos gravados" : "Selecione um experimento"}
        name="experimentos"
        selects={experimentosMotor.map((ref) => ({
          value: ref.id?.toString() || "",
          name: `${ref.versao} - ${ref.descricao}`,
        }))}
        onChange={onExperimentoChange}
        disabled={experimentosMotor.length === 0}
        required={!gravar}
      />
    </Col>
    {!gravar && (
      <Col span={7}>
        <Input
          label="Titulo do teste"
          name="descricao"
          value={descricao}
          onChange={(e) => onDescricaoChange && onDescricaoChange(e.target.value)}
          required
        />
      </Col>
    )}
  </Row>
);
