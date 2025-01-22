import React, { useState } from "react";
import { Typography, Row, Col, Select, Input, Button, Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const NovaReanalise: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [samplePercentage, setSamplePercentage] = useState<string>("");
  const [processesSelected, setProcessesSelected] = useState<number>(0);

  const promptsData: { [key: string]: string } = {
    "Prompt 1":
      "Este é o texto do Prompt 1. Aqui você pode adicionar instruções detalhadas para a análise.",
    "Prompt 2": "Texto do Prompt 2 com instruções específicas para este tipo de análise.",
    "Prompt 3": "Prompt 3 contém orientações para um terceiro tipo de análise.",
  };

  const periods = ["Último mês", "Últimos 3 meses", "Último ano"];

  const handlePromptChange = (value: string) => {
    setSelectedPrompt(value);
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
        Nova reanálise
      </Title>
      <Row gutter={24}>
        <Col span={12}>
          <Card>
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
              <div style={{ minHeight: "100px" }}></div>
            </Card>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <span style={{ color: "green" }}>147 processos selecionados (30% da base)</span>{" "}
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
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Prévia do prompt" style={{ height: "100%" }}>
            <TextArea
              value={selectedPrompt ? promptsData[selectedPrompt] : ""}
              style={{ height: "200px" }}
              readOnly
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NovaReanalise;
