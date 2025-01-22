import { useState, useEffect } from "react";
import { Row, Col, Tag, Spin } from "antd";
import Table from "../components/table";
import { Title } from "../components/typograph";
import Modal from "../components/modal/historicoTeste";
import { getListarTestes } from "../services/api";
import dayjs from "dayjs";

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
  acuracia: string;
  data_aa: string;
  usuario: string;
  id_teste: string;
  nbe: string;
  nome_prompt: string;
  precisao_negativas: string;
  status: string;
  tamanho_amostra: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Em andamento":
      return <Tag color="processing">{status}</Tag>;
    case "Finalizado":
      return <Tag color="success">{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const HistoricoTeste = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [id_teste, setIdTeste] = useState<string | null>(null);
  const [data, setData] = useState<DataRecord[]>([]);
  const [metricas, setMetricas] = useState({
    acuracia: 0,
    precisaoNegativas: 0,
    nbe: 0,
    cobertura: 0,
  });

  const fetchTestes = async () => {
    const response = await getListarTestes();
    setLoading(false);
    setData(response);
  };

  useEffect(() => {
    fetchTestes();
  }, []);

  const handleRowClick = (record: any) => {
    console.log(record);
    setIdTeste(record.id_teste);
    setMetricas({
      acuracia: Number(record.acuracia) * 100,
      precisaoNegativas: Number(record.precisao_negativas) * 100,
      nbe: Number(record.nbe) * 100,
      cobertura: 0,
    });

    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: "Experimento",
      dataIndex: "nome_prompt",
      key: "nome_prompt",
      sorter: (a: any, b: any) => a.nome_prompt.length - b.nome_prompt.length,
      render: (nome: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>{nome}</div>
      ),
    },
    {
      title: "Dia do teste",
      dataIndex: "data_aa",
      key: "data_aa",
      render: (data: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {dayjs(data).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Amostra",
      dataIndex: "tamanho_amostra",
      key: "tamanho_amostra",
      render: (tamanho: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {tamanho}
        </div>
      ),
    },
    {
      title: "Acurácia",
      dataIndex: "acuracia",
      key: "acuracia",

      render: (acuracia: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {(Number(acuracia) * 100).toFixed(2)}%
        </div>
      ),
    },

    {
      title: "Precisão de negativas",
      dataIndex: "precisao_negativas",
      key: "precisao_negativas",

      render: (precisao: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {(Number(precisao) * 100).toFixed(2)}%
        </div>
      ),
    },
    {
      title: "NBE",
      dataIndex: "nbe",
      key: "nbe",
      render: (nbe: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {(Number(nbe) * 100).toFixed(2)}%
        </div>
      ),
    },
    {
      title: "Usuário",
      dataIndex: "usuario",
      key: "usuario",
      render: (usuario: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {usuario}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {statusColor(status)}
        </div>
      ),
    },
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
      <Spin spinning={loading}>
        <div>
          <Row style={{ marginTop: "30px" }}>
            <Col span={24}>
              <Table columns={columns} data={data} bordered rowKey="id_teste" />
            </Col>
          </Row>
        </div>
      </Spin>
      <Modal
        key={id_teste}
        visible={isModalVisible}
        onClose={handleModalClose}
        id={id_teste ?? 0}
        metricas={metricas}
      />
    </>
  );
};

export default HistoricoTeste;
