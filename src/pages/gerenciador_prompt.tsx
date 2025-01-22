import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Form, Spin } from "antd";
import dayjs from "dayjs";
import { Title } from "../components/typograph";
import { Select, Input, TextArea } from "../components/form";
import { getPrompts, createPrompt } from "../services/api";
import { Prompt } from "../models";

interface NewPrompt {
  nome: string;
  descricao: string;
  prompt: string;
}

const GerenciadorPrompt: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState<NewPrompt>({
    nome: "",
    descricao: "",
    prompt: "",
  });

  const fetchPrompts = useCallback(async () => {
    try {
      const fetchedPrompts = await getPrompts();
      setPrompts(fetchedPrompts);
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      message.error("Erro ao buscar prompts");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY - HH:mm");

  const handleSavePrompt = async () => {
    const { nome, descricao, prompt } = newPrompt;
    if (!nome || !descricao || !prompt) {
      return message.error("Por favor, preencha todos os campos obrigatórios");
    }
    setLoading(true);
    try {
      await createPrompt({ grupo: nome, descricao, prompt });
      message.success("Prompt gravado com sucesso");
      setNewPrompt({ nome: "", descricao: "", prompt: "" });
      fetchPrompts();
    } catch (error) {
      console.error("Erro ao gravar prompt:", error);
      message.error("Erro ao gravar prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPrompt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    const selectedPrompt = prompts.find((p) => `${p.id}` === value);
    if (selectedPrompt) {
      setNewPrompt((prev) => ({ ...prev, prompt: selectedPrompt.prompt }));
    }
  };

  return (
    <>
      <Title level={1}>Gerenciador de prompts</Title>
      <Spin spinning={fetching}>
        <div style={{ padding: "0px 20px" }}>
          <Form form={form} layout="vertical" onFinish={handleSavePrompt}>
            <Row gutter={16}>
              <Col span={16}>
                <Select
                  label="Prompts gravados"
                  name="prompts"
                  selects={prompts.map((p) => ({
                    value: `${p.id}`,
                    name: `${p.grupo} - ${p.descricao} - ${formatDate(p.datahora)}`,
                  }))}
                  onChange={handleSelectChange}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Input
                  label="Nome do prompt"
                  name="nome"
                  required
                  value={newPrompt.nome}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
              <Col span={8}>
                <Input
                  label="Descrição do prompt"
                  name="descricao"
                  required
                  value={newPrompt.descricao}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <TextArea
                  label="Prompt"
                  name="prompt"
                  rows={6}
                  value={newPrompt.prompt}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "16px" }}>
              <Col span={16} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                  Gravar Prompt
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default GerenciadorPrompt;
