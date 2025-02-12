import React, { useMemo, useState, useRef } from "react";
import { Col, Row, Button, Typography, Tooltip, Modal, Input, Space } from "antd";
import Table from "../table";
import { GaugeChart } from "../graphics";
import { ColumnsType } from "antd/es/table";
import { WarningOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import ReactMarkdown from "react-markdown";

import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

import * as XLSX from "xlsx";
const { Text } = Typography;

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
type DataIndex = keyof DataType;

interface ProcessoDetalhesProps {
  selectedTest: any;
  processos: DataType[];
  onVoltar: () => void;
}

const colors = {
  Aprovado: "success",
  Negado: "danger",
};

const ProcessoDetalhes: React.FC<ProcessoDetalhesProps> = ({
  selectedTest,
  processos,
  onVoltar,
}) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(processos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  const createFilters = (key: keyof DataType) => {
    const uniqueValues = Array.from(new Set(processos.map((item) => item[key])));
    return uniqueValues.map((value) => ({ text: value as React.ReactNode, value: value }));
  };

  const tribunalFilters = useMemo(() => createFilters("tribunal"), [processos]);
  const analiseHumanaFilters = useMemo(() => createFilters("analise_humana"), [processos]);
  const analiseAutomacaoFilters = useMemo(() => createFilters("analise_automatica"), [processos]);
  const justificativaAhFilters = useMemo(() => createFilters("justificativa_ah"), [processos]);
  const justificativaAaFilters = useMemo(() => createFilters("justificativa_aa"), [processos]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [secondModalContent, setSecondModalContent] = useState<string | null>(null);
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const showDebugModal = (record: any) => {
    setModalContent(record.debugs);
    setIsModalVisible(true);
  };

  const showMarkdownModal = (record: any) => {
    setSecondModalContent(record.debug);
    setIsSecondModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSecondModalClose = () => {
    setIsSecondModalVisible(false);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Procurar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Procurar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtro
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns: ColumnsType<DataType> = [
    {
      title: "Processo",
      dataIndex: "numero_processo",
      key: "numero_processo",

      sorter: (a: DataType, b: DataType) => {
        const processoA = a?.numero_processo || "";
        const processoB = b?.numero_processo || "";
        return processoA.localeCompare(processoB);
      },
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      ...getColumnSearchProps("numero_processo"),
    },
    {
      title: "Pipefy",
      dataIndex: "id_pipefy",
      key: "id_pipefy",
      sorter: (a: DataType, b: DataType) => a.id_pipefy.localeCompare(b.id_pipefy),
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      ...getColumnSearchProps("id_pipefy"),
    },
    {
      title: "Tribunal",
      dataIndex: "tribunal",
      key: "tribunal",
      sorter: (a: DataType, b: DataType) => {
        if (a.tribunal === null && b.tribunal === null) return 0;
        if (a.tribunal === null) return 1;
        if (b.tribunal === null) return -1;
        return a.tribunal.localeCompare(b.tribunal);
      },
      filters: tribunalFilters,
      onFilter: (value, record) => record.tribunal === value,
      ...getColumnSearchProps("tribunal"),
    },
    {
      title: "Análise humana",
      dataIndex: "analise_humana",
      key: "analise_humana",
      filters: analiseHumanaFilters,
      onFilter: (value, record) => record.analise_humana === value,

      render: (text: string) =>
        text && text === "Sem análise" ? (
          <Tooltip title="Não contabilizado para a precisão de negativas!" color="#072854">
            <Typography.Text type="warning">
              {" "}
              <WarningOutlined /> Sem análise humana no Pipefy
            </Typography.Text>
          </Tooltip>
        ) : (
          <Typography.Text
            type={(colors[text as keyof typeof colors] as "success" | "danger") || "warning"}
          >
            {text}
          </Typography.Text>
        ),
    },
    {
      title: "Análise automação",
      dataIndex: "analise_automatica",
      key: "analise_automatica",
      filters: analiseAutomacaoFilters,

      onFilter: (value, record) => record.analise_automatica === value,
      render: (text: string) => (
        <Typography.Text
          type={(colors[text as keyof typeof colors] as "success" | "danger") || "warning"}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Justificativa AH",
      dataIndex: "justificativa_ah",
      key: "justificativa_ah",
      ellipsis: true,
      filters: justificativaAhFilters,
      onFilter: (value, record) => record.justificativa_ah === value,
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Justificativa automação",
      dataIndex: "justificativa_aa",
      key: "justificativa_aa",
      ellipsis: true,
      filters: justificativaAaFilters,
      onFilter: (value, record) => record.justificativa_aa === value,
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Data AH",
      dataIndex: "data_ah",
      key: "data_ah",
      sorter: (a, b) => new Date(a.data_ah).getTime() - new Date(b.data_ah).getTime(),
      render: (text: string) => (
        <Typography.Text>{new Date(text).toLocaleDateString("pt-BR")}</Typography.Text>
      ),
    },
    {
      title: "Ação",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <>
          {record.debug ? (
            <a onClick={() => showMarkdownModal(record)}>Ver Logs </a>
          ) : (
            <a onClick={() => showDebugModal(record)}>Ver Logs</a>
          )}
        </>
      ),
    },
  ];

  const renderDebugContent = (content: any) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <Text strong>{`Iteração ${index}:`}</Text>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      ));
    }
    return (
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify(content, null, 2)}
      </pre>
    );
  };

  return (
    <>
      <Button type="primary" onClick={onVoltar} style={{ marginBottom: 16 }}>
        Voltar
      </Button>
      <Row gutter={[16, 16]} justify="space-around" style={{ marginBottom: 30 }}>
        <Col>
          <GaugeChart value={Number(selectedTest.acuracia) * 100} label="Acurácia" />
        </Col>
        <Col>
          <GaugeChart
            value={Number(selectedTest.precisao_negativas) * 100}
            label="Precisão de negativas"
          />
        </Col>
        <Col>
          <GaugeChart value={Number(selectedTest.nbe) * 100} label="NBE" />
        </Col>
        <Col>
          <GaugeChart value={Number(selectedTest.cobertura) * 100} label="Cobertura" />
        </Col>
      </Row>
      <Table columns={columns} data={processos} bordered rowKey="id_pipefy" />
      <Row style={{ marginTop: 16 }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={exportToExcel}>
            Gerar planilha Excel
          </Button>
        </Col>
      </Row>
      <Modal
        title="Debug Information"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
      >
        {renderDebugContent(modalContent)}
      </Modal>
      <Modal
        title="Ver debugs md"
        open={isSecondModalVisible}
        onCancel={handleSecondModalClose}
        footer={null}
        width={1000}
      >
        {secondModalContent && (
          <div
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              padding: "16px",
              fontFamily: "sans-serif",
              wordBreak: "break-word",
            }}
          >
            <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {" "}
              <ReactMarkdown children={secondModalContent} />
            </Typography.Paragraph>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProcessoDetalhes;
