import { useState } from "react";
import { Typography, Row, Col, Table, Modal } from "antd";
import GaugeChart from "../components/grafico";

const { Title } = Typography;

const columns = [
  { title: "Exp erimento", dataIndex: "experimento", key: "experimento" },
  { title: "Dia", dataIndex: "dia", key: "dia" },
  { title: "Usuário", dataIndex: "usuario", key: "usuario" },
  {
    title: "Tamanho da amostra",
    dataIndex: "tamanhoAmostra",
    key: "tamanhoAmostra",
  },
  { title: "Acurácia", dataIndex: "acuracia", key: "acuracia" },
  {
    title: "Precisão de negativas",
    dataIndex: "precisaoNegativas",
    key: "precisaoNegativas",
  },
  { title: "Status", dataIndex: "status", key: "status" },
];

const data = [
  {
    key: "1",
    experimento: "Teste 3",
    dia: "10/02/2025",
    usuario: "Mariana",
    tamanhoAmostra: "50%",
    acuracia: "60%",
    precisaoNegativas: "50%",
    status: <span style={{ color: "green" }}>Em andamento</span>,
    nbe: "15%",
    cobertura: "40%",
  },
  {
    key: "2",
    experimento: "Teste 2",
    dia: "08/02/2025",
    usuario: "Douglas",
    tamanhoAmostra: "75%",
    acuracia: "72%",
    precisaoNegativas: "65%",
    status: <span>Finalizado</span>,
    nbe: "18%",
    cobertura: "55%",
  },
  {
    key: "3",
    experimento: "Teste 1",
    dia: "05/02/2025",
    usuario: "Renato",
    tamanhoAmostra: "100%",
    acuracia: "80%",
    precisaoNegativas: "75%",
    status: <span>Finalizado</span>,
    nbe: "22%",
    cobertura: "70%",
  },
  {
    key: "4",
    experimento: "Teste 4",
    dia: "15/02/2025",
    usuario: "Camila",
    tamanhoAmostra: "25%",
    acuracia: "55%",
    precisaoNegativas: "45%",
    status: <span style={{ color: "orange" }}>Pausado</span>,
    nbe: "12%",
    cobertura: "35%",
  },
  {
    key: "5",
    experimento: "Teste 5",
    dia: "20/02/2025",
    usuario: "Rafael",
    tamanhoAmostra: "80%",
    acuracia: "78%",
    precisaoNegativas: "70%",
    status: "Finalizado",
    nbe: "20%",
    cobertura: "65%",
  },
  {
    key: "6",
    experimento: "Teste 6",
    dia: "25/02/2025",
    usuario: "Fernanda",
    tamanhoAmostra: "60%",
    acuracia: "68%",
    precisaoNegativas: "60%",
    status: <span style={{ color: "green" }}>Em andamento</span>,
    nbe: "17%",
    cobertura: "50%",
  },
  {
    key: "7",
    experimento: "Teste 7",
    dia: "01/03/2025",
    usuario: "Gustavo",
    tamanhoAmostra: "90%",
    acuracia: "85%",
    precisaoNegativas: "80%",
    status: "Finalizado",
    nbe: "25%",
    cobertura: "75%",
  },
];

interface DataRecord {
  key: string;
  experimento: string;
  dia: string;
  usuario: string;
  tamanhoAmostra: string;
  acuracia: string;
  precisaoNegativas: string;
  status: JSX.Element;
  nbe: string;
  cobertura: string;
}

const HistoricoTeste = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataRecord | null>(null);

  const handleRowClick = (record: any) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const DetailModal = ({
    visible,
    onClose,
    data,
  }: {
    visible: boolean;
    onClose: () => void;
    data: any;
  }) => (
    <Modal
      title="Resultados"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Row gutter={[16, 16]} justify="space-around">
        <Col>
          <GaugeChart value={parseFloat(data?.acuracia)} label="Acurácia" />
        </Col>
        <Col>
          <GaugeChart
            value={parseFloat(data?.precisaoNegativas)}
            label="Precisão de negativas"
          />
        </Col>
        <Col>
          <GaugeChart value={parseFloat(data?.nbe)} label="NBE" />
        </Col>
        <Col>
          <GaugeChart value={parseFloat(data?.cobertura)} label="Cobertura" />
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
        dataSource={[
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
          // ... adicione mais linhas conforme necessário
        ]}
        pagination={false}
        scroll={{ x: true }}
      />
    </Modal>
  );

  return (
    <div>
      <Title
        level={1}
        style={{
          color: "#0a3672",
          marginTop: "0px",
          marginBottom: "24px",
          borderBottom: "1px solid #0a3672",
          paddingBottom: "12px",
        }}
      >
        Histórico de teste de prompt
      </Title>
      <Row style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            style={{
              backgroundColor: "white",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            rowClassName="custom-row"
            bordered
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </Col>
      </Row>
      <DetailModal
        visible={isModalVisible}
        onClose={handleModalClose}
        data={selectedRow}
      />
    </div>
  );
};

export default HistoricoTeste;
