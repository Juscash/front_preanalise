import { Title } from "../components/typograph";
import { useState, useEffect } from "react";
import { Row, Col, Button, message } from "antd";
import { Select, CustomDateRange, TextArea } from "../components/form";
import { SearchOutlined } from "@ant-design/icons";
import TestPrompt from "../components/results/test_prompt";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";

import {
  getPrompts,
  getSaidasProcessos,
  getProcessosMotivo,
} from "../services/api";
import { Prompt } from "../models";

type FilterProcess = {
  motivo: string;
  data: string;
};
const TestePrompt = () => {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptSelected, setPromptSelected] = useState<Prompt | null>(null);
  const [saidasProcessos, setSaidasProcessos] = useState<any[]>([]);
  const [filterProcess, setFilterProcess] = useState<FilterProcess>({
    motivo: "",
    data: "",
  });
  const [viewResult, setViewResult] = useState(false);
  const [processos, setProcessos] = useState<string>("");
  const [resultData, setResultData] = useState<{
    acuracia?: number;
    precisao?: number;
    nbe?: number;
    cobertura?: number;
    data: any[];
  }>({
    acuracia: 60,
    precisao: 50,
    nbe: 15,
    cobertura: 40,
    data: [
      {
        key: "1",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Aprovado",
        dataAH: "20/03/24",
        justificativaAH: "",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "2",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "Sem sentença",
        analiseAutomacao: "Negado",
        justificativaAutomacao: "",
      },
      {
        key: "3",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "4",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "5",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "6",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "7",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "8",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "9",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "10",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        key: "11",
        processo: "10238293520241010041",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
    ],
  });

  const fetchPrompts = async () => {
    try {
      const prompts = await getPrompts();
      setPrompts(prompts);
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      message.error("Erro ao buscar prompts");
    }
  };

  const fetchSaidasProcessos = async () => {
    try {
      const saidas = await getSaidasProcessos();
      setSaidasProcessos(saidas);
    } catch (error) {
      console.error("Erro ao buscar saídas de processos:", error);
      message.error("Erro ao buscar saídas de processos");
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchSaidasProcessos();
  }, []);

  const changeFilterProcess = (motivo: string) => {
    setFilterProcess({ ...filterProcess, motivo });
  };

  const fetchProcessosMotivo = async () => {
    setLoading(true);
    try {
      const data = await getProcessosMotivo(filterProcess.motivo);
      console.log("aq");
      setProcessos(data.map((item) => item.numero_processo).join(","));
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    setLoading(true);
    try {
      // const data = await startTestPrompt();
      setViewResult(true);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      message.error("Erro ao iniciar teste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={1}>Teste de prompt</Title>
      <div style={{ padding: "0px 20px" }}>
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
          <Col span={16}>
            <TextArea
              label="Prompt selecionado"
              name="prompt_selected"
              rows={6}
              value={promptSelected?.prompt}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={7}>
            <Select
              label="Selecionar saída de processo"
              name="saida"
              selects={saidasProcessos.map((p) => ({
                value: `${p.motivo_perda}`,
                name: `${p.motivo_perda}`,
              }))}
              onChange={changeFilterProcess}
            />
          </Col>
          <Col span={6}>
            <CustomDateRange
              label="Selecionar a data o processo"
              name="dataprocesso"
              defaultValue={[
                dayjs("01/09/2024", dateFormat),
                dayjs("30/09/2024", dateFormat),
              ]}
            />
          </Col>
          <Col
            span={3}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Button
              type="primary"
              icon={<SearchOutlined />}
              iconPosition={"end"}
              onClick={fetchProcessosMotivo}
              loading={loading}
            >
              Buscar
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
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
          <Col
            span={16}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="primary"
              onClick={startTest}
              disabled={loading}
              loading={loading}
            >
              Iniciar teste
            </Button>
          </Col>
        </Row>
      </div>
      {viewResult && (
        <TestPrompt
          acuracia={resultData.acuracia || 0}
          precisao={resultData.precisao || 0}
          nbe={resultData.nbe || 0}
          cobertura={resultData.cobertura || 0}
          data={resultData.data}
        />
      )}
    </>
  );
};

export default TestePrompt;
