import React, { useMemo } from "react";
import { Col, Row, Button, Typography, Tooltip } from "antd";
import * as XLSX from "xlsx";
import Table from "../table";
import { Title } from "../typograph";
import { GaugeChart } from "../graphics";
import { ColumnsType } from "antd/es/table";
import { WarningOutlined } from "@ant-design/icons";
import { ExperimentoData, processosAnalisados } from "../../services/api";

const colors = {
  Aprovado: "success",
  Negado: "danger",
};

const ExperimentoTeste: React.FC<ExperimentoData> = (data) => {
  console.log(data, "data");
  const createFilters = (key: keyof processosAnalisados) => {
    const uniqueValues = Array.from(new Set(data.outputs.map((item) => item[key])));
    return uniqueValues.map((value) => ({ text: value as React.ReactNode, value: value ?? "" }));
  };

  const tribunalFilters = useMemo(() => createFilters("tribunal"), [data]);
  const analiseHumanaFilters = useMemo(() => createFilters("analise_humana"), [data]);
  const analiseAutomacaoFilters = useMemo(() => createFilters("analise_automatica"), [data]);
  const justificativaAhFilters = useMemo(() => createFilters("justificativa_ah"), [data]);
  const justificativaAaFilters = useMemo(() => createFilters("justificativa_aa"), [data]);

  const columns: ColumnsType<processosAnalisados> = [
    {
      title: "Processo",
      dataIndex: "numero_processo",
      key: "numero_processo",
      sorter: (a: processosAnalisados, b: processosAnalisados) =>
        a.numero_processo.localeCompare(b.numero_processo),
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Pipefy",
      dataIndex: "id_pipefy",
      key: "id_pipefy",
      sorter: (a: processosAnalisados, b: processosAnalisados) =>
        a.id_pipefy.localeCompare(b.id_pipefy),
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Tribunal",
      dataIndex: "tribunal",
      key: "tribunal",
      sorter: (a: processosAnalisados, b: processosAnalisados) =>
        a.tribunal.localeCompare(b.tribunal),
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
  ];
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.outputs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  const metrics = [
    { label: "Acurácia", value: data.metricas.acuracia },
    { label: "Precisão de negativas", value: data.metricas.precisao_negativas },
    { label: "NBE", value: data.metricas.nbe },
    { label: "Cobertura", value: 0 },
  ];

  return (
    <div>
      <Title level={2}>Resultados</Title>
      <Row gutter={[16, 16]} justify="space-around">
        {metrics.map((metric) => (
          <Col key={metric.label}>
            <GaugeChart value={metric.value * 100} label={metric.label} />
          </Col>
        ))}
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Table columns={columns} data={data.outputs} bordered rowKey="id_pipefy" />
        </Col>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={exportToExcel}>
            Gerar planilha Excel
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ExperimentoTeste;
