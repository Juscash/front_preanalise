import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Form, Spin } from "antd";
import { Title } from "../../components/typograph";
import { MotorSelector } from "../../components/motor/MotorSelector";
import { ExperimentoSelector } from "../../components/experimento/ExperimentoSelector";
import { ExperimentoForm } from "../../components/experimento/ExperimentoForm";
import { ParametrosTabs } from "./ParametrosTabs";
import { useMotores } from "../../hooks/useMotores";
import { useExperimentos } from "../../hooks/useExperimentos";
import { Motores } from "../../models";
import { createExperimento } from "../../services/api";

const GerenciadorExperimentos: React.FC = () => {
  const [form] = Form.useForm();
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
  }, [fetchMotores]);

  const resetForm = useCallback(() => {
    form.resetFields();
    setMotorSelected(null);
    setExperimentos({
      id_motor: 0,
      versao: 0,
      descricao: "",
      parametros: [],
    });
  }, [form, setExperimentos]);

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
          id_motor: experimento.id_motor,
          versao: experimentos.versao,
          descricao: experimento.descricao,
          parametros: experimento.parametros,
        });
      }
    },
    [experimentosMotor, experimentos.versao, setExperimentos]
  );

  const handleExperimentoFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setExperimentos((prev) => ({ ...prev, [name]: value }));
    },
    [setExperimentos]
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

  const saveExperimento = async () => {
    if (!experimentos.parametros.every((p) => p.valor)) {
      message.error(`Preencha o parametro ${experimentos.parametros.find((p) => !p.valor)?.nome}`);
      return;
    }
    setLoading(true);
    try {
      await createExperimento(experimentos);
      message.success("Experimento criado com sucesso");
      await fetchMotores();
      resetForm();
    } catch (error) {
      console.error("Erro ao criar experimento:", error);
      message.error("Erro ao criar experimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={1}>Gerenciador de experimentos</Title>
      <Spin spinning={motorLoading || experimentoLoading}>
        <Form form={form} layout="vertical" onFinish={saveExperimento}>
          <MotorSelector
            motores={motores}
            onMotorChange={handleMotorChange}
            motorSelected={motorSelected}
          />
          <ExperimentoSelector
            experimentosMotor={experimentosMotor}
            onExperimentoChange={handleExperimentoChange}
          />
          <ExperimentoForm
            experimentos={experimentos}
            onExperimentoChange={handleExperimentoFormChange}
            loading={loading}
          />
          <ParametrosTabs
            parametros={experimentos.parametros}
            onParametroChange={handleParametroChange}
          />
          <Row style={{ marginTop: "16px" }}>
            <Col span={16} style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                Gravar experimento
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default GerenciadorExperimentos;
