import React from "react";
import { Col, Row, Button } from "antd";
import * as XLSX from "xlsx";
import Table from "../table";
import { Title } from "../typograph";
import { GaugeChart } from "../graphics";

interface Props {
  acuracia: number;
  precisao: number;
  nbe: number;
  cobertura: number;
  data: DataType[];
}

interface DataType {
  id_teste: React.Key;
  numero_processo: string;
  id_pipefy: string;
  tribunal: string;
  analise_humana: string;
  analise_automatica: string;
  justificativa_ah: string;
  justificativa_aa: string;
  data_ah: string;
}

const columns = [
  {
    title: "Processo",
    dataIndex: "numero_processo",
    key: "numero_processo",
    sorter: (a: DataType, b: DataType) => a.numero_processo.localeCompare(b.numero_processo),
  },
  {
    title: "Pipefy",
    dataIndex: "id_pipefy",
    key: "id_pipefy",
    sorter: (a: DataType, b: DataType) => a.id_pipefy.localeCompare(b.id_pipefy),
  },
  {
    title: "Tribunal",
    dataIndex: "tribunal",
    key: "tribunal",
    sorter: (a: DataType, b: DataType) => a.tribunal.localeCompare(b.tribunal),
  },
  {
    title: "Análise humana",
    dataIndex: "analise_humana",
    key: "analise_humana",
    sorter: (a: DataType, b: DataType) => a.analise_humana.localeCompare(b.analise_humana),
  },
  {
    title: "Análise automação",
    dataIndex: "analise_automatica",
    key: "analise_automatica",
  },
  {
    title: "Justificativa AH",
    dataIndex: "justificativa_ah",
    key: "justificativa_ah",
  },
  {
    title: "Justificativa automação",
    dataIndex: "justificativa_aa",
    key: "justificativa_aa",
  },
  {
    title: "Data AH",
    dataIndex: "data_ah",
    key: "data_ah",
  },
];

const TestPrompt: React.FC<Props> = ({ acuracia, precisao, nbe, cobertura, data }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  const metrics = [
    { label: "Acurácia", value: acuracia },
    { label: "Precisão de negativas", value: precisao },
    { label: "NBE", value: nbe },
    { label: "Cobertura", value: cobertura },
  ];

  return (
    <div>
      <Title level={2}>Resultados</Title>
      <Row gutter={[16, 16]} justify="space-around">
        {metrics.map((metric) => (
          <Col key={metric.label}>
            <GaugeChart value={metric.value} label={metric.label} />
          </Col>
        ))}
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Table columns={columns} data={data} bordered rowKey="id_pipefy" />
        </Col>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={exportToExcel}>
            Gerar planilha Excel
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default TestPrompt;
