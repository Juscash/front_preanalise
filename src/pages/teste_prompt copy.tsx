import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Button, message, Table } from "antd";
import { Select, Input, TextArea } from "../components/form";
import {
  getPrompts,
  Prompt,
  createPrompt,
  getSaidasProcessos,
  getProcessosMotivo,
  testPrompt,
} from "../services/api";
import { Pie, Gauge } from "@ant-design/plots";
import * as XLSX from "xlsx";
import GaugeChart from "../components/grafico";
const { Title } = Typography;

const TestePrompt = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{
    tableData: any[];
    acuracia?: number;
    precisao?: number;
    nbe?: number;
    cobertura?: number;
  } | null>(null);

  const [processos, setProcessos] = useState<string>("");
  const [saidasProcessos, setSaidasProcessos] = useState<any[]>([]);
  const [newPrompt, setNewPrompt] = useState({
    nome: "",
    descricao: "",
    prompt: "",
  });

  const handleNovoTeste = async () => {
    try {
      const result = await testPrompt(newPrompt.prompt, processos);
      setResultData(result);
      setShowResult(true);
    } catch (error) {
      console.error("Erro ao realizar o teste:", error);
      message.error("Erro ao realizar o teste");
    }
  };

  const exportToExcel = () => {
    if (!resultData) {
      return message.error("Nenhum resultado para exportar");
    }
    const ws = XLSX.utils.json_to_sheet(resultData.tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  const columns = [
    { title: "Processo", dataIndex: "processo", key: "processo" },
    { title: "Tribunal", dataIndex: "tribunal", key: "tribunal" },
    {
      title: "Análise humana",
      dataIndex: "analiseHumana",
      key: "analiseHumana",
    },
    { title: "Data AH", dataIndex: "dataAH", key: "dataAH" },
    {
      title: "Justificativa AH",
      dataIndex: "justificativaAH",
      key: "justificativaAH",
    },
    {
      title: "Análise automação",
      dataIndex: "analiseAutomacao",
      key: "analiseAutomacao",
    },
    {
      title: "Justificativa automação",
      dataIndex: "justificativaAutomacao",
      key: "justificativaAutomacao",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [promptsData, saidasData] = await Promise.all([
        getPrompts(),
        getSaidasProcessos(),
      ]);
      setPrompts(promptsData.map((p, index) => ({ id: index, ...p })));
      setSaidasProcessos(saidasData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      message.error("Erro ao carregar dados");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewPrompt({ ...newPrompt, [e.target.name]: e.target.value });
  };

  const handleSavePrompt = async () => {
    const { nome, descricao, prompt } = newPrompt;
    if (!nome || !descricao || !prompt) {
      return message.error("Por favor, preencha todos os campos obrigatórios");
    }

    try {
      await createPrompt({ grupo: nome, descricao, prompt });
      message.success("Prompt gravado com sucesso");
      setNewPrompt({ nome: "", descricao: "", prompt: "" });
      fetchData();
    } catch (error) {
      console.error("Erro ao gravar prompt:", error);
      message.error("Erro ao gravar prompt");
    }
  };

  const fetchProcessosMotivo = async (motivo: string) => {
    try {
      const data = await getProcessosMotivo(motivo);
      setProcessos(data.map((item) => item.numero_processo).join(","));
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    }
  };

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
        Teste de prompt
      </Title>

      <Row gutter={16}>
        <Col span={24}>
          <Select
            label="Prompts gravados"
            options={prompts.map((p) => ({
              value: `${p.id}`,
              label: `${p.grupo} - ${p.descricao} - ${p.datahora}`,
            }))}
            onChange={(value) =>
              setNewPrompt({
                ...newPrompt,
                prompt: prompts.find((p) => `${p.id}` === value)?.prompt || "",
              })
            }
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Input
            label="Nome do prompt"
            name="nome"
            onChange={handleInputChange}
            value={newPrompt.nome}
            required
          />
        </Col>
        <Col span={12}>
          <Input
            label="Descrição do prompt"
            name="descricao"
            onChange={handleInputChange}
            value={newPrompt.descricao}
            required
          />
        </Col>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <TextArea
            name="prompt"
            label="Texto do prompt"
            value={newPrompt.prompt}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={handleSavePrompt}
            style={{ backgroundColor: "#0a3672", borderColor: "#0a3672" }}
          >
            Gravar Prompt
          </Button>
        </Col>
      </Row>

      <Title
        level={2}
        style={{
          color: "#0a3672",
          marginTop: "20px",
          marginBottom: "24px",
          paddingBottom: "12px",
        }}
      >
        Testar prompt
      </Title>

      <Row gutter={16}>
        <Col span={24}>
          <Select
            label="Selecionar saída do processo"
            options={saidasProcessos.map((p) => ({
              value: `${p.motivo_perda}`,
              label: `${p.motivo_perda}`,
            }))}
            onChange={fetchProcessosMotivo}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <TextArea
            name="processos"
            label={`Processos (${
              processos.split(",").filter((p) => p.trim() !== "").length
            })`}
            value={processos}
            onChange={(e) => setProcessos(e.target.value)}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#0a3672", borderColor: "#0a3672" }}
            onClick={handleNovoTeste}
          >
            Novo teste
          </Button>
        </Col>
      </Row>

      {showResult && (
        <>
          <Title
            level={2}
            style={{
              color: "#0a3672",
              marginTop: "20px",
              marginBottom: "24px",
              paddingBottom: "12px",
            }}
          >
            Resultado
          </Title>

          <Row gutter={[16, 16]} justify="space-around">
            <Col>
              <GaugeChart value={resultData?.acuracia} label="Acurácia" />
            </Col>
            <Col>
              <GaugeChart
                value={resultData?.precisao}
                label="Precisão de negativas"
              />
            </Col>
            <Col>
              <GaugeChart value={resultData?.nbe} label="NBE" />
            </Col>
            <Col>
              <GaugeChart value={resultData?.cobertura} label="Cobertura" />
            </Col>
          </Row>

          <Row style={{ marginTop: "30px" }}>
            <Col span={24}>
              <Table
                dataSource={resultData?.tableData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
              <Row justify="end" style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  onClick={exportToExcel}
                  style={{
                    backgroundColor: "#0a3672",
                    borderColor: "#0a3672",
                    marginRight: "16px",
                  }}
                >
                  Exportar para Excel
                </Button>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default TestePrompt;
