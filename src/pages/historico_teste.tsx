import { Typography, Row, Col, Table } from "antd";
const { Title } = Typography;

const columns = [
  { title: "Experimento", dataIndex: "experimento", key: "experimento" },
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
    acuracia: "50%",
    precisaoNegativas: "50%",
    status: <span style={{ color: "green" }}>Em andamento</span>,
  },
  {
    key: "2",
    experimento: "Teste 2",
    dia: "08/02/2025",
    usuario: "Douglas",
    tamanhoAmostra: "50%",
    acuracia: "50%",
    precisaoNegativas: "50%",
    status: "Finalizado",
  },
  {
    key: "3",
    experimento: "Teste 1",
    dia: "05/02/2025",
    usuario: "Renato",
    tamanhoAmostra: "50%",
    acuracia: "50%",
    precisaoNegativas: "50%",
    status: "Finalizado",
  },
];

const HistoricoTeste: React.FC = () => {
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
          />
        </Col>
      </Row>
    </div>
  );
};

export default HistoricoTeste;
