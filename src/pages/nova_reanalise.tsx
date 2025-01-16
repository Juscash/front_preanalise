import React, { useState, useEffect } from "react";
import { Row, Col, Button, message } from "antd";
import { Select, CustomDateRange, TextArea, Input } from "../components/form";
import { Prompt } from "../models";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";
import { Title } from "../components/typograph";
import {
  getPrompts,
  getSaidasProcessos,
  getProcessosMotivo,
} from "../services/api";

const NovaReanalise: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptSelected, setPromptSelected] = useState<Prompt | null>(null);

  const fetchPrompts = async () => {
    try {
      const prompts = await getPrompts();
      setPrompts(prompts);
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      message.error("Erro ao buscar prompts");
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [samplePercentage, setSamplePercentage] = useState<string>("");
  const [processesSelected, setProcessesSelected] = useState<number>(0);

  // Objeto com os prompts e seus respectivos textos
  const promptsData: { [key: string]: string } = {
    "Prompt 1":
      "Este é o texto do Prompt 1. Aqui você pode adicionar instruções detalhadas para a análise.",
    "Prompt 2":
      "Texto do Prompt 2 com instruções específicas para este tipo de análise.",
    "Prompt 3": "Prompt 3 contém orientações para um terceiro tipo de análise.",
  };

  const periods = ["Último mês", "Últimos 3 meses", "Último ano"];

  const handlePromptChange = (value: string) => {
    setSelectedPrompt(value);
  };

  return (
    <>
      <Title level={1}>Nova reanálise</Title>
      <Row gutter={24}>
        <Col span={16}>
          <Row gutter={16}>
            <Col span={16}>
              <Select
                label="Selecione um prompt"
                name="prompts"
                selects={prompts.map((p) => ({
                  value: `${p.id}`,
                  name: `${p.grupo} - ${p.descricao} - ${p.datahora}`,
                }))}
                onChange={(value) => {
                  let select = prompts.find((p) => `${p.id}` == value);
                  setPromptSelected(select || null);
                }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={9}>
              <CustomDateRange
                label="Selecione o periodo"
                name="dataprocesso"
                defaultValue={[
                  dayjs("01/09/2024", dateFormat),
                  dayjs("30/09/2024", dateFormat),
                ]}
              />
            </Col>
            <Col span={7}>
              <Input label="Porcentagem da amostra" name="amostra" />
            </Col>
          </Row>
          <Row style={{ marginTop: "16px" }}>
            <Col
              span={16}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button type="primary">Ver processos</Button>
            </Col>
          </Row>
          {/*    <Card>
            <Select
              style={{ width: "100%", marginBottom: "16px" }}
              placeholder="Selecionar Prompt"
              onChange={handlePromptChange}
            >
              {Object.keys(promptsData).map((prompt, index) => (
                <Option key={index} value={prompt}>
                  {prompt}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: "100%", marginBottom: "16px" }}
              placeholder="Selecionar período"
              onChange={(value) => setSelectedPeriod(value)}
            >
              {periods.map((period, index) => (
                <Option key={index} value={period}>
                  {period}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Porcentagem da amostra"
              style={{ marginBottom: "16px" }}
              value={samplePercentage}
              onChange={(e) => setSamplePercentage(e.target.value)}
            />
            <Button
              type="primary"
              style={{
                backgroundColor: "#0a3672",
                borderColor: "#0a3672",
                marginBottom: "16px",
              }}
            >
              Ver processos
            </Button>
            <Card
              style={{ backgroundColor: "#f0f2f5", marginBottom: "16px" }}
              bodyStyle={{ padding: "10px" }}
            >
              <div style={{ minHeight: "100px" }}>
                {/* Aqui você pode adicionar a lista de processos se necessário 
              </div>
            </Card>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <span style={{ color: "green" }}>
                147 processos selecionados (30% da base)
              </span>{" "}
              <ReloadOutlined style={{ color: "green" }} />
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#0a3672",
                    borderColor: "#0a3672",
                    width: "100%",
                  }}
                >
                  Rodar reanálise
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  style={{
                    borderColor: "#0a3672",
                    color: "#0a3672",
                    width: "100%",
                  }}
                >
                  Ver reanálise
                </Button>
              </Col>
            </Row>
          </Card> */}
        </Col>
        <Col span={8}>
          {/*   <Card title="Prévia do prompt" style={{ height: "100%" }}>
            <TextArea
              value={selectedPrompt ? promptsData[selectedPrompt] : ""}
              style={{ height: "200px" }}
              readOnly
            />
          </Card> */}
        </Col>
      </Row>
    </>
  );
};

export default NovaReanalise;
