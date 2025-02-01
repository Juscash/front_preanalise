import React from "react";
import { Row, Col } from "antd";
import { Input } from "../form";
import { Experimento } from "../../models";

interface ExperimentoFormProps {
  experimentos: Omit<Experimento, "id" | "dataHora">;
  onExperimentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export const ExperimentoForm: React.FC<ExperimentoFormProps> = ({
  experimentos,
  onExperimentoChange,
  loading,
}) => (
  <Row gutter={16}>
    <Col span={8}>
      <Input label="Versão" name="versao" disabled={loading} value={experimentos.versao} />
    </Col>
    <Col span={8}>
      <Input
        label="Descrição do experimento"
        name="descricao"
        required
        disabled={loading}
        value={experimentos.descricao}
        onChange={onExperimentoChange}
      />
    </Col>
  </Row>
);
