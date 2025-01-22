import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Spin, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Title } from "../components/typograph";
import { Select, CustomDateRange, TextArea, TagInput } from "../components/form";
import TestPrompt from "../components/results/test_prompt";
import AddProcessosModal from "../components/modal/AddProcessosModal";

import { useAuth } from "../contexts/AuthContext";
import {
  getPrompts,
  getSaidasProcessos,
  getProcessosMotivo,
  testPrompt,
  getIdprocess,
} from "../services/api";
import { Prompt } from "../models";

dayjs.extend(customParseFormat);

const DEFAULT_START_DATE = "2024-09-01";
const DEFAULT_END_DATE = "2024-09-30";

interface FilterProcess {
  motivo: string;
  data_inicio: string;
  data_fim: string;
}

interface ProcessoID {
  numero_processo: string;
  id_pipefy: string;
}

interface ResultData {
  acuracia: number;
  precisao: number;
  nbe: number;
  cobertura: number;
  data: any[];
}

const TestePrompt: React.FC = () => {
  const { user } = useAuth();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptSelected, setPromptSelected] = useState<Prompt | null>(null);
  const [saidasProcessos, setSaidasProcessos] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [listProcessos, setListProcessos] = useState<string>("");
  const [filterProcessModal, setFilterProcessModal] = useState<FilterProcess>({
    motivo: "",
    data_inicio: DEFAULT_START_DATE,
    data_fim: DEFAULT_END_DATE,
  });
  const [filterProcess, setFilterProcess] = useState<FilterProcess>({
    motivo: "",
    data_inicio: DEFAULT_START_DATE,
    data_fim: DEFAULT_END_DATE,
  });
  const [isResultVisible, setIsResultVisible] = useState<boolean>(false);
  const [processos, setProcessos] = useState<ProcessoID[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultData, setResultData] = useState<ResultData>({
    acuracia: 0,
    precisao: 0,
    nbe: 0,
    cobertura: 0,
    data: [],
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const [promptsData, saidasData] = await Promise.all([getPrompts(), getSaidasProcessos()]);
      setPrompts(promptsData);
      setSaidasProcessos(saidasData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      message.error("Erro ao carregar dados iniciais");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleIdProcess = async () => {
    setLoading(true);
    const arrayProcess = listProcessos.replace(/\s+/g, "").trim().split(",");
    const requestData = {
      processos: arrayProcess,
      data_inicio: filterProcessModal.data_inicio,
      data_fim: filterProcessModal.data_fim,
      ...(filterProcessModal.motivo && { motivo: filterProcessModal.motivo }),
    };

    try {
      const data = await getIdprocess(requestData);
      const newData = [...processos, ...data];
      const uniqueData = newData.reduce((accumulator: ProcessoID[], current: ProcessoID) => {
        if (!accumulator.find((item) => item.id_pipefy === current.id_pipefy)) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);

      setProcessos(uniqueData);
      setListProcessos("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (motivo: string, isModal: boolean = false) => {
    const setterFunction = isModal ? setFilterProcessModal : setFilterProcess;
    setterFunction((prevState) => ({ ...prevState, motivo }));
  };

  const fetchProcessosMotivo = async () => {
    setLoading(true);
    try {
      const data = await getProcessosMotivo(filterProcess);
      setProcessos(
        data.map((processo) => ({
          numero_processo: processo.numero_processo,
          id_pipefy: processo.id_pipefy,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!promptSelected) {
      message.error("Selecione um prompt");
      return;
    }

    setIsResultVisible(false);
    setLoading(true);
    try {
      const testData = {
        lista_processos: processos,
        id_prompt: promptSelected?.id?.toString() || "",
        usuario: user?.name,
      };

      const response = await testPrompt(testData);
      setResultData({
        data: response.outputs,
        acuracia: Number(response.metricas.acuracia) * 100,
        cobertura: 0,
        precisao: Number(response.metricas.precisao_negativas) * 100,
        nbe: Number(response.metricas.nbe) * 100,
      });

      setIsResultVisible(true);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      message.error("Erro ao iniciar teste");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null],
    isModal: boolean = false
  ) => {
    if (dates[0] && dates[1]) {
      const newDates = {
        data_inicio: dates[0].format("YYYY-MM-DD"),
        data_fim: dates[1].format("YYYY-MM-DD"),
      };
      const setterFunction = isModal ? setFilterProcessModal : setFilterProcess;
      setterFunction((prevState) => ({ ...prevState, ...newDates }));
    }
  };

  return (
    <>
      <Title level={1}>Teste de prompt</Title>
      <Form form={form} layout="vertical">
        <Spin spinning={isLoading}>
          <div style={{ padding: "0px 20px" }}>
            <Row gutter={16}>
              <Col span={16}>
                <Select
                  label="Selecione um prompt"
                  name="prompts"
                  selects={prompts.map((prompt) => ({
                    value: (prompt.id ?? "").toString(),
                    name: `${prompt.grupo} - ${prompt.descricao} - ${prompt.datahora}`,
                  }))}
                  onChange={(value) => {
                    const selectedPrompt = prompts.find(
                      (prompt) => prompt.id?.toString() === value
                    );
                    setPromptSelected(selectedPrompt || null);
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
                  selects={saidasProcessos.map((saida) => ({
                    value: saida.motivo_perda,
                    name: saida.motivo_perda,
                  }))}
                  onChange={(value) => handleFilterChange(value)}
                />
              </Col>
              <Col span={6}>
                <CustomDateRange
                  label="Selecionar a data o processo"
                  name="dataprocesso"
                  defaultValue={[dayjs(DEFAULT_START_DATE), dayjs(DEFAULT_END_DATE)]}
                  onChange={(dates) =>
                    handleDateChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
                  }
                />
              </Col>
              <Col
                span={3}
                style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
              >
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={fetchProcessosMotivo}
                  loading={loading}
                >
                  Buscar
                </Button>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <TagInput
                  label={`Processos (${processos.length})`}
                  value={processos.map(
                    (processo) => `${processo.numero_processo}-(${processo.id_pipefy})`
                  )}
                  onChange={(newTags: string[]) => {
                    const newProcessos = newTags.map((tag) => {
                      const [numero_processo, id_pipefy] = tag.split("-(");
                      return {
                        numero_processo,
                        id_pipefy: id_pipefy.slice(0, -1),
                      };
                    });
                    setProcessos(newProcessos);
                  }}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "16px" }}>
              <Col span={16} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  danger
                  onClick={() => setProcessos([])}
                  disabled={loading}
                  loading={loading}
                  style={{ marginRight: "16px" }}
                >
                  Limpar processos
                </Button>
                <Button
                  onClick={() => setIsModalVisible(true)}
                  disabled={loading}
                  loading={loading}
                  style={{ marginRight: "16px" }}
                  className="ant-btn-success"
                >
                  Adicionar processos
                </Button>
                <Button
                  type="primary"
                  onClick={handleStartTest}
                  disabled={loading}
                  loading={loading}
                >
                  Iniciar teste
                </Button>
              </Col>
            </Row>
          </div>
        </Spin>
      </Form>
      {isResultVisible && <TestPrompt {...resultData} />}
      <AddProcessosModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleIdProcess}
        loading={loading}
        saidasProcessos={saidasProcessos}
        handleFilterChange={(value) => handleFilterChange(value, true)}
        handleDateChange={(dates) => handleDateChange(dates, true)}
        listProcessos={listProcessos}
        setListProcessos={setListProcessos}
        defaultStartDate={DEFAULT_START_DATE}
        defaultEndDate={DEFAULT_END_DATE}
      />
    </>
  );
};

export default TestePrompt;
