import { useState, useEffect } from "react";
import { Title } from "../components/typograph";
import { Row, Col, Button, message, Form } from "antd";
import { Select, Input, TextArea } from "../components/form";
import { getPrompts, createPrompt } from "../services/api";
import { Prompt } from "../models";

const GerenciadorPrompt = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({
    nome: "",
    descricao: "",
    prompt: "",
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

  const SavePrompt = async () => {
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

  useEffect(() => {
    fetchPrompts();
  }, []);

  const change = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewPrompt({ ...newPrompt, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Title level={1}>Gerenciador de prompts</Title>
      <div style={{ padding: "0px 20px" }}>
        <Form form={form} layout="vertical" onFinish={SavePrompt}>
          <Row gutter={16}>
            <Col span={16}>
              <Select
                label="Prompts gravados"
                name="prompts"
                selects={prompts.map((p) => ({
                  value: `${p.id}`,
                  name: `${p.grupo} - ${p.descricao} - ${p.datahora}`,
                }))}
                onChange={(value) =>
                  setNewPrompt({
                    ...newPrompt,
                    prompt:
                      prompts.find((p) => `${p.id}` == value)?.prompt || "",
                  })
                }
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
                onChange={(e) => change(e)}
                disabled={loading}
              />
            </Col>
            <Col span={8}>
              <Input
                label="Descrição do prompt"
                name="descricao"
                required
                value={newPrompt.descricao}
                onChange={(e) => change(e)}
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
                onChange={(e) => change(e)}
                disabled={loading}
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
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Gravar Prompt
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default GerenciadorPrompt;
