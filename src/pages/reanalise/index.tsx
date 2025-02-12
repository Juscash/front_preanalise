import React, { useState, useEffect, useCallback } from "react";

import { Title } from "../../components/typograph";
import { Row, Col, Button, message, Form, Spin } from "antd";
import { MotorSelector } from "../../components/motor/MotorSelector";
import { ExperimentoSelector } from "../../components/experimento/ExperimentoSelector";
import { ParametrosTabs } from "../gerenciador_experimentos/ParametrosTabs";
import { useMotores } from "../../hooks/useMotores";
import { Motores } from "../../models";
import { useExperimentos } from "../../hooks/useExperimentos";
import { CustomDateRange, Number, TagInput } from "../../components/form";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { processosReanalise, reanalise } from "../../services/api";

const DEFAULT_START_DATE = "2024-09-01";
const DEFAULT_END_DATE = "2024-09-30";
interface ProcessoID {
  numero_processo: string;
  id_pipefy: string;
}

const NovaReanalise: React.FC = () => {
  const [form] = Form.useForm();
  const { motores, fetchMotores, loading: motorLoading } = useMotores();
  const [descricao, setDescricao] = useState<string>("");
  const [processos, setProcessos] = useState<ProcessoID[]>([]);

  const [filterProcess, setFilterProcess] = useState<{
    data_inicio: string;
    data_fim: string;
    amostra?: number;
  }>({
    data_inicio: DEFAULT_START_DATE,
    data_fim: DEFAULT_END_DATE,
    amostra: 100,
  });

  const [motorSelected, setMotorSelected] = useState<Motores | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    experimentos,
    setExperimentos,
    experimentosMotor,
    fetchExperimentosMotor,
    loading: experimentoLoading,
  } = useExperimentos();

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
  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    if (dates[0] && dates[1]) {
      const newDates = {
        data_inicio: dates[0].format("YYYY-MM-DD"),
        data_fim: dates[1].format("YYYY-MM-DD"),
      };

      setFilterProcess({ ...filterProcess, ...newDates });
    }
  };
  const handleDescricaoChange = useCallback((descricao: string) => {
    setDescricao(descricao);
  }, []);
  const handleParametroChange = useCallback(
    (nome: string, valor: string) => {
      setExperimentos((prev) => ({
        ...prev,
        parametros: prev.parametros.map((p) => (p.nome === nome ? { ...p, valor } : p)),
      }));
    },
    [setExperimentos]
  );

  useEffect(() => {
    fetchMotores();
  }, [fetchMotores]);

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

  const getProcessos = async () => {
    setLoading(true);
    try {
      const response = await processosReanalise({
        data_fim: filterProcess.data_fim,
        data_inicio: filterProcess.data_inicio,
        porcentagem: (filterProcess.amostra || 100) / 100,
      });
      setProcessos(
        response.map((processo) => ({
          numero_processo: processo.numero_processo,
          id_pipefy: processo.id_pipefy,
        }))
      );
    } catch (error) {
      message.error("Erro ao buscar processos");
    } finally {
      setLoading(false);
    }
  };
  const startTeste = async () => {
    setLoading(true);
    if (processos.length === 0 || !experimentos.id) {
      message.error("Selecione um motor e um experimento para iniciar o teste");
      setLoading(false);
      return;
    }
    try {
      const data = await reanalise({
        processos,
        id_experimento: experimentos.id,
      });

      console.log(data, "res");
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Title level={1}>Reanalise</Title>
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
            gravar={true}
            descricao={descricao}
          />
          <ParametrosTabs
            view={experimentos.id ? true : false}
            gravar={false}
            parametros={experimentos.parametros}
            onParametroChange={handleParametroChange}
          />
          <Row gutter={16}>
            <Col span={5}>
              <Number
                label="% da amostras"
                name="amostra"
                required
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                value={filterProcess.amostra}
                parser={(value) => value?.replace("%", "") as unknown as number}
                onChange={(value) =>
                  setFilterProcess({
                    ...filterProcess,
                    amostra: value !== null ? parseInt(value as string, 10) : undefined,
                  })
                }
              />
            </Col>
            <Col span={7}>
              <CustomDateRange
                label="Selecionar o periodo"
                name="dataprocesso"
                defaultValue={[dayjs(DEFAULT_START_DATE), dayjs(DEFAULT_END_DATE)]}
                onChange={(dates) =>
                  handleDateChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
                }
              />
            </Col>
            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={loading}
                onClick={getProcessos}
              >
                Buscar processos
              </Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <TagInput
                label={`${processos.length} processos selecionados${
                  filterProcess.amostra ? ` - (${filterProcess.amostra}%) da base` : ""
                }`}
                value={processos.map(
                  (processo) => `${processo.numero_processo}-(${processo.id_pipefy})`
                )}
                onChange={changeTagInput}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Iniciar Reanalise
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default NovaReanalise;
