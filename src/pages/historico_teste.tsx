import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Tag, Spin, message } from "antd";
import dayjs from "dayjs";
import Table from "../components/table";
import { Title } from "../components/typograph";
import Modal from "../components/modal/historicoTeste";
import { getListarTestes } from "../services/api";

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

interface Metricas {
  acuracia: number;
  precisaoNegativas: number;
  nbe: number;
  cobertura: number;
}

const statusColor = {
  "Em andamento": "processing",
  Finalizado: "success",
} as const;

const HistoricoTeste: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idTeste, setIdTeste] = useState<string | null>(null);
  const [data, setData] = useState<DataRecord[]>([]);
  const [metricas, setMetricas] = useState<Metricas>({
    acuracia: 0,
    precisaoNegativas: 0,
    nbe: 0,
    cobertura: 0,
  });

  const fetchTestes = useCallback(async () => {
    try {
      const response = await getListarTestes();
      setData(response);
    } catch (error) {
      console.error("Erro ao buscar testes:", error);
      message.error("Falha ao carregar os testes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestes();
  }, [fetchTestes]);

  const handleRowClick = (record: DataRecord) => {
    setIdTeste(record.id_teste);
    setMetricas({
      acuracia: Number(record.acuracia) * 100,
      precisaoNegativas: Number(record.precisao_negativas) * 100,
      nbe: Number(record.nbe) * 100,
      cobertura: 0,
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Experimento",
      dataIndex: "nome_prompt",
      key: "nome_prompt",
      sorter: (a: DataRecord, b: DataRecord) => a.nome_prompt.localeCompare(b.nome_prompt),
      render: (nome: string) => <div className="text-center">{nome}</div>,
    },
    {
      title: "Dia do teste",
      dataIndex: "data_aa",
      key: "data_aa",
      render: (data: string) => (
        <div className="text-center">{dayjs(data).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: "Amostra",
      dataIndex: "tamanho_amostra",
      key: "tamanho_amostra",
      render: (tamanho: string) => <div className="text-center">{tamanho}</div>,
    },
    {
      title: "Acurácia",
      dataIndex: "acuracia",
      key: "acuracia",
      render: (acuracia: string) => (
        <div className="text-center">{(Number(acuracia) * 100).toFixed(2)}%</div>
      ),
    },
    {
      title: "Precisão de negativas",
      dataIndex: "precisao_negativas",
      key: "precisao_negativas",
      render: (precisao: string) => (
        <div className="text-center">{(Number(precisao) * 100).toFixed(2)}%</div>
      ),
    },
    {
      title: "NBE",
      dataIndex: "nbe",
      key: "nbe",
      render: (nbe: string) => <div className="text-center">{(Number(nbe) * 100).toFixed(2)}%</div>,
    },
    {
      title: "Usuário",
      dataIndex: "usuario",
      key: "usuario",
      render: (usuario: string) => <div className="text-center">{usuario}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div className="text-center">
          <Tag color={statusColor[status as keyof typeof statusColor] || "default"}>{status}</Tag>
        </div>
      ),
    },
    {
      title: "Ação",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: DataRecord) => (
        <a onClick={() => handleRowClick(record)}>Ver processos</a>
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
        key={idTeste}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        id={idTeste ?? "0"}
        metricas={metricas}
      />
    </>
  );
};

export default HistoricoTeste;
