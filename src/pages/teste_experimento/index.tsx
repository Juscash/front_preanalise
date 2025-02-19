import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Form, Spin, notification, Typography, Space } from "antd";
import { Title } from "../../components/typograph";

import { useMotores } from "../../hooks/useMotores";
import { useExperimentos } from "../../hooks/useExperimentos";
import { Motores } from "../../models";
import {
  getProcessosMotivo,
  getSaidasProcessos,
  getIdprocess,
  testeExperimento,
  ExperimentoData,
} from "../../services/api";
import { SearchOutlined } from "@ant-design/icons";
import { MotorSelector } from "../../components/motor/MotorSelector";
import { ExperimentoSelector } from "../../components/experimento/ExperimentoSelector";
import { ParametrosTabs } from "../gerenciador_experimentos/ParametrosTabs";
import ExperimentoTeste from "../../components/experimento/ExperimentoTeste";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Select, CustomDateRange, TagInput } from "../../components/form";
import AddProcessosModal from "../../components/modal/AddProcessosModal";
interface FilterProcess {
  motivo: string;
  data_inicio: string;
  data_fim: string;
}
interface ProcessoID {
  numero_processo: string;
  id_pipefy: string;
}

dayjs.extend(customParseFormat);

const DEFAULT_START_DATE = "2024-09-01";
const DEFAULT_END_DATE = "2024-09-30";

const testarExperimentos: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [listProcessos, setListProcessos] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [isResultVisible, setIsResultVisible] = useState<boolean>(false);
  const [processos, setProcessos] = useState<ProcessoID[]>([]);
  const [resultData, setResultData] = useState<ExperimentoData>();
  const [filterProcessModal, setFilterProcessModal] = useState<FilterProcess>({
    motivo: "",
    data_inicio: DEFAULT_START_DATE,
    data_fim: DEFAULT_END_DATE,
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filterProcess, setFilterProcess] = useState<FilterProcess>({
    motivo: "",
    data_inicio: DEFAULT_START_DATE,
    data_fim: DEFAULT_END_DATE,
  });
  const [saidasProcessos, setSaidasProcessos] = useState<any[]>([]);
  const { motores, fetchMotores, loading: motorLoading } = useMotores();
  const {
    experimentos,
    setExperimentos,
    experimentosMotor,
    fetchExperimentosMotor,
    loading: experimentoLoading,
  } = useExperimentos();
  const [motorSelected, setMotorSelected] = useState<Motores | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMotores();
    fetchInitialData();
  }, [fetchMotores]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [saidasData] = await Promise.all([getSaidasProcessos()]);

      setSaidasProcessos(saidasData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      message.error("Erro ao carregar dados iniciais");
    } finally {
      setLoading(false);
    }
  }, []);
  const handleMotorChange = useCallback(
    (motorId: number) => {
      const motor = motores.find((m) => m.id == motorId);
      if (motor) {
        setMotorSelected(motor);
        fetchExperimentosMotor(motor.id);
        setExperimentos((prev) => ({
          ...prev,
          id_motor: motor.id,
          parametros: motor.parametros.map((p) => ({ nome: p.nome, valor: "" })),
        }));
      }
    },
    [motores, fetchExperimentosMotor, setExperimentos]
  );
  const handleExperimentoChange = useCallback(
    (experimentoId: number) => {
      const experimento = experimentosMotor.find((e) => e.id == experimentoId);
      if (experimento) {
        setExperimentos({
          id: experimento.id,
          id_motor: experimento.id_motor,
          versao: experimentos.versao,
          descricao: experimento.descricao,
          parametros: experimento.parametros,
        });
      }
    },
    [experimentosMotor, experimentos.versao, setExperimentos]
  );

  const handleParametroChange = useCallback(
    (nome: string, valor: string) => {
      setExperimentos((prev) => ({
        ...prev,
        parametros: prev.parametros.map((p) => (p.nome === nome ? { ...p, valor } : p)),
      }));
    },
    [setExperimentos]
  );

  const handleDescricaoChange = useCallback((descricao: string) => {
    setDescricao(descricao);
  }, []);

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

  const handleFilterChange = (motivo: string, isModal: boolean = false) => {
    const setterFunction = isModal ? setFilterProcessModal : setFilterProcess;
    setterFunction((prevState) => ({ ...prevState, motivo }));
  };

  const fetchProcessosMotivo = async () => {
    if (!filterProcess.motivo) {
      message.error("Selecione um motivo para buscar os processos");
      return;
    }
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

  const handleIdProcess = async () => {
    setLoading(true);
    const arrayProcess = listProcessos.includes(",")
      ? listProcessos
          .replace(/\s+/g, "")
          .split(",")
          .map((p) => p.trim().replace(/[-.]/g, ""))
          .filter((p) => p !== "")
      : listProcessos
          .split("\n")
          .map((p) => p.trim().replace(/[-.]/g, ""))
          .filter((p) => p !== "");

    console.log(arrayProcess);
    const requestData = {
      lista_processos: arrayProcess,
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

      const processosNaoRetornados = arrayProcess.filter(
        (processo) => !uniqueData.some((unique) => unique.numero_processo === processo)
      );

      if (processosNaoRetornados.length > 0) {
        openNotification(processosNaoRetornados);
      }
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

  const changeTagInput = (newTags: string[]) => {
    const newProcessos = newTags.map((tag) => {
      const [numero_processo, id_pipefy] = tag.split("-(");
      return {
        numero_processo,
        id_pipefy: id_pipefy.slice(0, -1),
      };
    });
    setProcessos(newProcessos);
  };

  const startTeste = async () => {
    setLoading(true);
    if (processos.length === 0 || !experimentos.id) {
      message.error("Selecione um motor e um experimento para iniciar o teste");
      setLoading(false);
      return;
    }
    try {
      const data = await testeExperimento({
        processos,
        id_experimento: experimentos.id,
        descricao: descricao,
      });
      setIsResultVisible(true);

      setResultData(data);
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
    }
  };
  interface ProcessListWithCopyProps {
    processos: string[];
  }
  const ProcessListWithCopy: React.FC<ProcessListWithCopyProps> = ({ processos }) => {
    const handleCopy = () => {
      navigator.clipboard
        .writeText(processos.join(", "))
        .then(() => alert("Processos copiados!"))
        .catch(() => alert("Erro ao copiar."));
    };

    return (
      <div
        style={{
          maxHeight: "600px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "10px",
          }}
        >
          {processos.map((processo, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <Typography.Text>{processo}</Typography.Text>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px" }}>
          <Space>
            <Button type="primary" onClick={handleCopy}>
              Copiar Processos
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  const openNotification = (processos: string[]) => {
    notification.open({
      message: `Processos não encontrados - ${processos.length}`,
      description: <ProcessListWithCopy processos={processos} />,
      duration: 15,
      type: "error",
    });
  };

  return (
    <>
      {contextHolder}
      <Title level={1}>Teste de experimento</Title>
      <Spin spinning={motorLoading || experimentoLoading}>
        <Form form={form} layout="vertical" onFinish={startTeste}>
          <MotorSelector
            motores={motores}
            onMotorChange={handleMotorChange}
            motorSelected={motorSelected}
          />
          <ExperimentoSelector
            experimentosMotor={experimentosMotor}
            onExperimentoChange={handleExperimentoChange}
            onDescricaoChange={handleDescricaoChange}
            gravar={false}
            descricao={descricao}
          />
          <ParametrosTabs
            view={experimentos.id ? true : false}
            gravar={false}
            parametros={experimentos.parametros}
            onParametroChange={handleParametroChange}
          />
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
                allowClear
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
            <Col span={3} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
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
                onChange={changeTagInput}
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
              <Button type="primary" disabled={loading} loading={loading} htmlType="submit">
                Iniciar teste
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
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
      {isResultVisible && resultData?.outputs && <ExperimentoTeste {...resultData} />}
    </>
  );
};

export default testarExperimentos;
