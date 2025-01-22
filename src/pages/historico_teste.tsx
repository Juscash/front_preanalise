import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Tag, Spin, message } from "antd";
import dayjs from "dayjs";
import Table from "../components/table";
import { Title } from "../components/typograph";
import { getListarTestes, getProcessosTeste } from "../services/api";
import { ColumnsType } from "antd/es/table";
import ProcessoDetalhes from "../components/results/ProcessoDetalhes";

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataRecord[]>([]);
  const [selectedTest, setSelectedTest] = useState<DataRecord | null>(null);
  const [processos, setProcessos] = useState<any[]>([]);
  const [processosLoading, setProcessosLoading] = useState(false);

  const createFilters = (data: DataRecord[], key: keyof DataRecord) => {
    const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
    return uniqueValues.map((value) => ({ text: value, value: value }));
  };

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

  const handleRowClick = async (record: DataRecord) => {
    setSelectedTest(record);
    setProcessosLoading(true);
    try {
      const response = await getProcessosTeste(record.id_teste);
      setProcessos(response);
    } catch (error) {
      console.error("Erro ao buscar processos do teste:", error);
      message.error("Falha ao carregar os processos do teste");
    } finally {
      setProcessosLoading(false);
    }
  };

  const handleVoltar = () => {
    setSelectedTest(null);
    setProcessos([]);
  };

  const columns: ColumnsType<DataRecord> = useMemo(
    () => [
      {
        title: "Experimento",
        dataIndex: "nome_prompt",
        key: "nome_prompt",
        sorter: (a, b) => a.nome_prompt.localeCompare(b.nome_prompt),
        filters: createFilters(data, "nome_prompt"),
        onFilter: (value, record) => record.nome_prompt === value,
        render: (nome: string) => <div className="text-center">{nome}</div>,
      },
      {
        title: "Dia do teste",
        dataIndex: "data_aa",
        key: "data_aa",
        sorter: (a, b) => dayjs(a.data_aa).unix() - dayjs(b.data_aa).unix(),
        filters: createFilters(data, "data_aa"),
        onFilter: (value, record) => record.data_aa === value,
        render: (data: string) => (
          <div className="text-center">{dayjs(data).format("DD/MM/YYYY")}</div>
        ),
      },
      {
        title: "Amostra",
        dataIndex: "tamanho_amostra",
        key: "tamanho_amostra",
        sorter: (a, b) => Number(a.tamanho_amostra) - Number(b.tamanho_amostra),
        filters: createFilters(data, "tamanho_amostra"),
        onFilter: (value, record) => record.tamanho_amostra === value,
        render: (tamanho: string) => <div className="text-center">{tamanho}</div>,
      },
      {
        title: "Acurácia",
        dataIndex: "acuracia",
        key: "acuracia",
        sorter: (a, b) => Number(a.acuracia) - Number(b.acuracia),
        filters: createFilters(data, "acuracia"),
        onFilter: (value, record) => record.acuracia === value,
        render: (acuracia: string) => (
          <div className="text-center">{(Number(acuracia) * 100).toFixed(2)}%</div>
        ),
      },
      {
        title: "Precisão de negativas",
        dataIndex: "precisao_negativas",
        key: "precisao_negativas",
        sorter: (a, b) => Number(a.precisao_negativas) - Number(b.precisao_negativas),
        filters: createFilters(data, "precisao_negativas"),
        onFilter: (value, record) => record.precisao_negativas === value,
        render: (precisao: string) => (
          <div className="text-center">{(Number(precisao) * 100).toFixed(2)}%</div>
        ),
      },
      {
        title: "NBE",
        dataIndex: "nbe",
        key: "nbe",
        sorter: (a, b) => Number(a.nbe) - Number(b.nbe),
        filters: createFilters(data, "nbe"),
        onFilter: (value, record) => record.nbe === value,
        render: (nbe: string) => (
          <div className="text-center">{(Number(nbe) * 100).toFixed(2)}%</div>
        ),
      },
      {
        title: "Usuário",
        dataIndex: "usuario",
        key: "usuario",
        sorter: (a, b) => a.usuario.localeCompare(b.usuario),
        filters: createFilters(data, "usuario"),
        onFilter: (value, record) => record.usuario === value,
        render: (usuario: string) => <div className="text-center">{usuario}</div>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: createFilters(data, "status"),
        onFilter: (value, record) => record.status === value,
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
    ],
    [data]
  );

  return (
    <>
      <Title level={1}>Histórico de teste de prompt</Title>
      <Spin spinning={loading || processosLoading}>
        <div>
          {!selectedTest ? (
            <Row style={{ marginTop: "30px" }}>
              <Col span={24}>
                <Table columns={columns} data={data} bordered rowKey="id_teste" />
              </Col>
            </Row>
          ) : (
            <>
              <ProcessoDetalhes
                selectedTest={selectedTest}
                processos={processos}
                onVoltar={handleVoltar}
              />
            </>
          )}
        </div>
      </Spin>
    </>
  );
};

export default HistoricoTeste;
