import { Row, Col, Modal, Button } from "antd";
import Table from "../table";
import { GaugeChart } from "../graphics";
import * as XLSX from "xlsx";

const data = [
  {
    key: "1",
    processo: "10238293520241010041",
    tribunal: "TJSP",
    analiseHumana: "Aprovado",
    dataAH: "20/03/24",
    justificativaAH: "",
    analiseAutomacao: "Aprovado",
    justificativaAutomacao: "",
  },
  {
    key: "2",
    processo: "10238293520241010041",
    tribunal: "TJSP",
    analiseHumana: "Negado",
    dataAH: "22/03/24",
    justificativaAH: "Sem sentença",
    analiseAutomacao: "Negado",
    justificativaAutomacao: "",
  },
  {
    key: "3",
    processo: "10238293520241010041",
    tribunal: "TJSP",
    analiseHumana: "Negado",
    dataAH: "22/03/24",
    justificativaAH: "RPV em iminência de pagamento",
    analiseAutomacao: "Aprovado",
    justificativaAutomacao: "",
  },
  {
    key: "4",
    processo: "10238293520241010041",
    tribunal: "TJSP",
    analiseHumana: "Negado",
    dataAH: "22/03/24",
    justificativaAH: "RPV em iminência de pagamento",
    analiseAutomacao: "Aprovado",
    justificativaAutomacao: "",
  },
  {
    key: "5",
    processo: "10238293520241010041",
    tribunal: "TJSP",
    analiseHumana: "Negado",
    dataAH: "22/03/24",
    justificativaAH: "RPV em iminência de pagamento",
    analiseAutomacao: "Aprovado",
    justificativaAutomacao: "",
  },
];
const ModalHistoricoTeste = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };
  return (
    <Modal
      title="Resultados"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Row
        gutter={[16, 16]}
        justify="space-around"
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <Col>
          <GaugeChart value={60} label="Acurácia" />
        </Col>
        <Col>
          <GaugeChart value={71} label="Precisão de negativas" />
        </Col>
        <Col>
          <GaugeChart value={50} label="NBE" />
        </Col>
        <Col>
          <GaugeChart value={45} label="Cobertura" />
        </Col>
      </Row>
      <Table
        columns={[
          { title: "Processo", dataIndex: "processo", key: "processo" },
          { title: "Tribunal", dataIndex: "tribunal", key: "tribunal" },
          {
            title: "Análise humana",
            dataIndex: "analiseHumana",
            key: "analiseHumana",
          },
          { title: "Data AH", dataIndex: "dataAH", key: "dataAH" },
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
        ]}
        data={data}
      />
      <Row style={{ marginTop: "16px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={exportToExcel}>
            Gerar planilha Excel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalHistoricoTeste;
