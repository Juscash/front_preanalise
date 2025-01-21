import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import Table from "../components/table";
import { Title } from "../components/typograph";
import Modal from "../components/modal/historicoTeste";
import { getListarTestes } from "../services/api";

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

  const fetchTestes = async () => {
    const response = await getListarTestes();
  };

  useEffect(() => {
    fetchTestes();
  }, []);

  const handleRowClick = (record: any) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };
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
    {
      title: "Ação",
      dataIndex: "action",
      key: "action",
      render: (a: any, b: any) => (
        <a onClick={() => handleRowClick(b)}>Ver processos</a>
      ),
    },
  ];

  return (
    <>
      <Title level={1}>Histórico de teste de prompt</Title>
      <div>
        <Row style={{ marginTop: "30px" }}>
          <Col span={24}>
            <Table columns={columns} data={data} bordered />
          </Col>
        </Row>
      </div>
      <Modal visible={isModalVisible} onClose={handleModalClose} />
    </>
  );
};

export default HistoricoTeste;
