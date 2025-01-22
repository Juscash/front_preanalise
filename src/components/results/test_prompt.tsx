import { Col, Row, Button } from "antd";
import Table from "../table";
import type { TableColumnsType } from "antd";
import * as XLSX from "xlsx";

import { Title } from "../typograph";
import { GaugeChart } from "../graphics";
type Props = {
  acuracia: number;
  precisao: number;
  nbe: number;
  cobertura: number;
  data: DataType[];
};

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

const columns: TableColumnsType<DataType> = [
  {
    title: "Processo",
    dataIndex: "numero_processo",
    key: "numero_processo",
    sorter: (a, b) => a.numero_processo.length - b.numero_processo.length,
  },
  {
    title: "Pipefy",
    dataIndex: "id_pipefy",
    key: "id_pipefy",
    sorter: (a, b) => a.id_pipefy.length - b.id_pipefy.length,
  },
  {
    title: "Tribunal",
    dataIndex: "tribunal",
    key: "tribunal",
    sorter: (a, b) => a.tribunal.length - b.tribunal.length,
  },
  {
    title: "Análise humana",
    dataIndex: "analise_humana",
    key: "analise_humana",
    sorter: (a, b) => a.analise_humana.length - b.analise_humana.length,
  },
  {
    title: "Análise automação",
    dataIndex: "analise_automatica",
    key: "analise_automatica",
  },
  {
    title: "JustifiCativa AH",
    dataIndex: "justificativa_ah",
    key: "justificativa_ah",
  },

  {
    title: "JustifiCativa automação",
    dataIndex: "justificativa_aa",
    key: "justificativa_aa",
  },
  {
    title: "Data AH",
    dataIndex: "data_ah",
    key: "data_ah",
  },
];
const TestPrompt = (result: Props) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(result.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  return (
    <div>
      <Title level={2}>Resultados</Title>
      <Row gutter={[16, 16]} justify="space-around">
        <Col>
          <GaugeChart value={result.acuracia.toFixed(2)} label="Acurácia" />
        </Col>
        <Col>
          <GaugeChart
            value={result.precisao.toFixed(2)}
            label="Precisão de negativas"
          />
        </Col>
        <Col>
          <GaugeChart value={result.nbe.toFixed(2)} label="NBE" />
        </Col>
        <Col>
          <GaugeChart value={result.cobertura.toFixed(2)} label="Cobertura" />
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Table
            columns={columns}
            data={result.data}
            bordered
            rowKey="id_pipefy"
          />
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
