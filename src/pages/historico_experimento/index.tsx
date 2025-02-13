import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Typography, Spin, message, Badge } from "antd";
import dayjs from "dayjs";
import Table from "../../components/table";
import { Title } from "../../components/typograph";
import { getListarTestes, getProcessosTeste, TestesData } from "../../services/api";
import { ColumnsType } from "antd/es/table";
import ProcessoDetalhes from "../../components/results/ProcessoDetalhes";
import Chat from "../../components/chat";

interface Message {
  id: number;
  id_teste: number;
  comentario: string;
  usuario: string;
  dataHora: string;
}
const HistoricoExperimento: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TestesData[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestesData | null>(null);
  const [processos, setProcessos] = useState<any[]>([]);
  const [processosLoading, setProcessosLoading] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selected, setSelectedChat] = useState<number>(0);
  const [refresh, setRefresh] = useState(false);

  const createFilters = (data: TestesData[], key: keyof TestesData) => {
    const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
    return uniqueValues
      .filter((value) => typeof value !== "object")
      .map((value) => ({ text: String(value), value: value }));
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
  }, [refresh]);

  useEffect(() => {
    fetchTestes();
  }, [fetchTestes]);

  const handleRowClick = async (record: TestesData) => {
    setSelectedTest(record);
    setProcessosLoading(true);
    try {
      const response = await getProcessosTeste(record.id_teste);
      response.sort((a: { analise_humana: string }, b: { analise_humana: string }) => {
        const aAnalise = a.analise_humana === "Sem análise";
        const bAnalise = b.analise_humana === "Sem análise";

        if (aAnalise === bAnalise) return 0;

        if (aAnalise) return -1;

        return 1;
      });
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

  const selectedChat = useCallback((record: TestesData) => {
    setSelectedChat(record.id_teste);
    setChatVisible(true);
    setChatMessages(record.historico_observacoes);
  }, []);

  const columns: ColumnsType<TestesData> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id_teste",
        width: 20,
        key: "id_teste",
        sorter: (a, b) => a.id_teste - b.id_teste,
        filters: createFilters(data, "id_teste"),
        onFilter: (value, record) => record.id_teste === value,
        render: (id: number) => <Typography.Text>{id}</Typography.Text>,
      },
      {
        title: "Titulo teste",
        dataIndex: "descricao_teste",
        key: "descricao_teste",

        sorter: (a, b) => {
          if (a.descricao_teste === null && b.descricao_teste === null) return 0;
          if (a.descricao_teste === null) return 1;
          if (b.descricao_teste === null) return -1;
          return a.descricao_teste.localeCompare(b.descricao_teste);
        },
        filters: createFilters(data, "descricao_teste"),
        onFilter: (value, record) => record.descricao_teste === value,
        render: (_nome: string, ref) => <Typography.Text>{ref.descricao_teste}</Typography.Text>,
      },
      {
        title: "Experimento",
        dataIndex: "descricao",
        key: "versao",
        sorter: (a, b) => a.descricao.localeCompare(b.descricao),
        filters: createFilters(data, "descricao"),
        onFilter: (value, record) => record.descricao == value,
        render: (_nome: string, ref) => (
          <Typography.Text>{`${ref.versao} - ${ref.descricao}`}</Typography.Text>
        ),
      },
      {
        title: "Data teste",
        dataIndex: "data_aa",
        width: 115,
        key: "data_aa",
        filters: createFilters(data, "data_aa"),
        onFilter: (value, record) => record.data_aa === value,
        render: (data: string) => (
          <div className="text-center">{dayjs(data).format("DD/MM/YYYY")}</div>
        ),
      },
      {
        title: "Amostra",
        width: 100,
        dataIndex: "tamanho_amostra",
        key: "tamanho_amostra",
        sorter: (a, b) => Number(a.tamanho_amostra) - Number(b.tamanho_amostra),
        onFilter: (value, record) => record.tamanho_amostra === value,
        render: (tamanho: string) => (
          <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
            {tamanho}
          </Typography.Text>
        ),
      },
      {
        title: "Acurácia",
        dataIndex: "acuracia",
        width: 100,
        key: "acuracia",
        sorter: (a, b) => Number(a.acuracia) - Number(b.acuracia),
        filters: createFilters(data, "acuracia"),
        onFilter: (value, record) => record.acuracia === value,
        render: (acuracia: string) => (
          <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
            {(Number(acuracia) * 100).toFixed(2)}%
          </Typography.Text>
        ),
      },
      {
        title: "Prec. Negativas",
        width: 150,
        dataIndex: "precisao_negativas",
        key: "precisao_negativas",
        sorter: (a, b) => Number(a.precisao_negativas) - Number(b.precisao_negativas),

        render: (precisao: string) => (
          <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
            {(Number(precisao) * 100).toFixed(2)}%
          </Typography.Text>
        ),
      },

      {
        title: "Cobertura",
        dataIndex: "cobertura",
        key: "cobertura",
        width: 100,
        sorter: (a, b) => Number(a.cobertura) - Number(b.cobertura),
        filters: createFilters(data, "cobertura"),
        onFilter: (value, record) => record.cobertura === value,
        render: (cobertura: string) => (
          <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
            {(Number(cobertura) * 100).toFixed(2)}%
          </Typography.Text>
        ),
      },
      {
        title: "Usuário",
        dataIndex: "usuario",
        key: "usuario",
        filters: createFilters(data, "usuario"),
        onFilter: (value, record) => record.usuario === value,
        render: (usuario: string) => <div className="text-center">{usuario}</div>,
      },

      {
        title: "Ação",
        dataIndex: "action",
        key: "action",
        fixed: "right",
        render: (_: any, record: TestesData) => (
          <>
            <a onClick={() => handleRowClick(record)}>Processos</a>
            <br />
            <Badge count={record.historico_observacoes.length}>
              <a onClick={() => selectedChat(record)}>Observações</a>
            </Badge>
          </>
        ),
      },
    ],
    [data]
  );

  const refreshAction = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <Title level={1}>Histórico de experimento</Title>
      <Spin spinning={loading || processosLoading}>
        <div>
          {!selectedTest ? (
            <Row style={{ marginTop: "30px" }}>
              <Col span={24}>
                <Table columns={columns} data={data} bordered rowKey="id_teste" xScroll="scroll" />
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
        <Chat
          key={selected}
          visible={chatVisible}
          setVisible={setChatVisible}
          initialMessages={chatMessages}
          refresh={refreshAction}
          id_teste={selected}
        />
      </Spin>
    </>
  );
};

export default HistoricoExperimento;
