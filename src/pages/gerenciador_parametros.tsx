import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Form, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { Title } from "../components/typograph";
import { Select, Input, TextArea } from "../components/form";
import { getParametros, createParametros, getMotores, getMotorParametros } from "../services/api";
import { Parametros, Motores, motorParametros } from "../models";
const { Item } = Form;
type NewParametros = Pick<Parametros, "nome" | "tipo_parametro" | "valor">;

const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY - HH:mm");

const GerenciadorParametros: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tiposParametros, setTiposParametros] = useState<string[]>([]);
  const [motores, setMotores] = useState<Motores[]>([]);
  const [motoresParametros, setMotoresParametros] = useState<motorParametros[]>([]);

  const [fetching, setFetching] = useState(true);
  const [parametros, setParametros] = useState<Parametros[]>([]);
  const [newParametro, setNewparametro] = useState<NewParametros>({
    nome: "",
    tipo_parametro: "",
    valor: "",
  });

  const fetchMotores = useCallback(async () => {
    try {
      const fetchedMotores = await getMotores();

      setMotores(fetchedMotores);
    } catch (error) {
      console.error("Erro ao buscar motores:", error);
      message.error("Erro ao buscar motores");
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchMotorParametros = useCallback(async (tipo_parametro: string) => {
    try {
      const fetchedParametros = await getMotorParametros(tipo_parametro);
      setMotoresParametros(fetchedParametros);
    } catch (error) {
      console.error("Erro ao buscar parametros:", error);
      message.error("Erro ao buscar parametros");
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchParametros = useCallback(async (tipo_parametro: string) => {
    try {
      const fetchedPrompts = await getParametros(tipo_parametro);
      setParametros(fetchedPrompts);
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      message.error("Erro ao buscar prompts");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchMotores();
  }, [fetchMotores]);

  const handleSavePrompt = async () => {
    const { nome, tipo_parametro, valor } = newParametro;
    if (!nome || !tipo_parametro || !valor) {
      return message.error("Por favor, preencha todos os campos obrigatórios");
    }
    setLoading(true);
    try {
      await createParametros({ nome, tipo_parametro, valor });
      message.success("Parâmetro gravado com sucesso");
      setNewparametro({ ...newParametro, nome: "", valor: "" });
      fetchParametros(tipo_parametro);
    } catch (error) {
      console.error("Erro ao gravar parâmetro:", error);
      message.error("Erro ao gravar parâmetro");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewparametro((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    const selectedParametro = parametros.find((p) => `${p.id}` === value);
    if (selectedParametro) {
      setNewparametro((prev) => ({ ...prev, valor: selectedParametro.valor }));
    }
  };

  const handleSelectMotorChange = (value: string) => {
    const motor = motores.find((m) => m.id === value);
    if (motor) {
      setTiposParametros(motor.parametros.map((p) => p.tipo_parametro));
    }
  };
  const handleTipoParametroChange = (value: string) => {
    setFetching(true);
    setNewparametro((prev) => ({ ...prev, tipo_parametro: value }));
    fetchParametros(value);
    fetchMotorParametros(value);
  };

  return (
    <>
      <Title level={1}>Gerenciador de parâmetros</Title>
      <Spin spinning={fetching}>
        <div style={{ padding: "0px 20px" }}>
          <Form form={form} layout="vertical" onFinish={handleSavePrompt}>
            <Row gutter={24}>
              <Col span={7}>
                <Select
                  required
                  label="Selecione o motor"
                  name="motor"
                  selects={motores.map((item) => ({ value: item.id, name: item.nome }))}
                  onChange={handleSelectMotorChange}
                />
              </Col>
              <Col span={7}>
                <Select
                  required
                  disabled={tiposParametros.length === 0}
                  label="Selecione o tipo de parâmetro"
                  name="tipo_parametro"
                  selects={tiposParametros.map((item) => ({ value: item, name: item }))}
                  onChange={handleTipoParametroChange}
                />
              </Col>
              <Col span={9}>
                <Item
                  label={`Motores com parâmetros do tipo ${newParametro.tipo_parametro}`}
                  name="teste"
                  layout="vertical"
                  labelCol={{ className: "form-label-default" }}
                >
                  {motoresParametros.map((item) => (
                    <Tag key={item.id}>{item.nome}</Tag>
                  ))}
                </Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Input
                  label="Nome do parâmetro"
                  name="nome"
                  required
                  value={newParametro.nome}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col span={8}>
                <Select
                  label="Parametros gravados"
                  name="parametros"
                  disabled={loading || parametros.length === 0 || !parametros}
                  selects={parametros.map((p: Parametros, index) => ({
                    key: index,
                    value: `${p.id}`,
                    name: `${p.nome} - ${formatDate(p.datahora)}`,
                  }))}
                  onChange={handleSelectChange}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <TextArea
                  label="Valor do parâmetro"
                  name="valor"
                  rows={6}
                  value={newParametro.valor}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "16px" }}>
              <Col span={16} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                  Gravar Parâmetro
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default GerenciadorParametros;
