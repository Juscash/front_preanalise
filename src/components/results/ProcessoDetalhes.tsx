import React, { useMemo, useState } from "react";
import { Col, Row, Button, Typography, Tooltip, Modal } from "antd";
import Table from "../table";
import { GaugeChart } from "../graphics";
import { ColumnsType } from "antd/es/table";
import { WarningOutlined } from "@ant-design/icons";

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
  const [modalContent, setModalContent] = useState<any>(null);

  const showDebugModal = (record: any) => {
    setModalContent(record.debugs);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

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
    },
    {
      title: "Pipefy",
      dataIndex: "id_pipefy",
      key: "id_pipefy",
      sorter: (a: DataType, b: DataType) => a.id_pipefy.localeCompare(b.id_pipefy),
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
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
      render: (_: any, record: any) => <a onClick={() => showDebugModal(record)}>Ver debug</a>,
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
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
      >
        {renderDebugContent(modalContent)}
      </Modal>
    </>
  );
};

export default ProcessoDetalhes;
