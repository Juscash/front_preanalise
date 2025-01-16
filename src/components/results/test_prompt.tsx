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
  key: React.Key;
  processo: string;
  tribunal: string;
  analiseHumana: string;
  dataAH: string;
  justificativaAH: string;
  analiseAutomacao: string;
  justificativaAutomacao: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Processo",
    dataIndex: "processo",
    key: "processo",
    sorter: (a, b) => a.processo.length - b.processo.length,
  },
  {
    title: "Tribunal",
    dataIndex: "tribunal",
    key: "tribunal",
    sorter: (a, b) => a.tribunal.length - b.tribunal.length,
  },
  {
    title: "Análise humana",
    dataIndex: "analiseHumana",
    key: "analiseHumana",
    sorter: (a, b) => a.analiseHumana.length - b.analiseHumana.length,
  },
  {
    title: "Data AH",
    dataIndex: "dataAH",
    key: "dataAH",
  },
  {
    title: "JustifiCativa AH",
    dataIndex: "justificativaAH",
    key: "justificativaAH",
  },
  {
    title: "Análise automação",
    dataIndex: "analiseAutomacao",
    key: "analiseAutomacao",
  },
  {
    title: "JustifiCativa automação",
    dataIndex: "justificativaAutomacao",
    key: "justificativaAutomacao",
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
          <GaugeChart value={result.acuracia} label="Acurácia" />
        </Col>
        <Col>
          <GaugeChart value={result.precisao} label="Precisão de negativas" />
        </Col>
        <Col>
          <GaugeChart value={result.nbe} label="NBE" />
        </Col>
        <Col>
          <GaugeChart value={result.cobertura} label="Cobertura" />
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Table columns={columns} data={result.data} bordered />
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
