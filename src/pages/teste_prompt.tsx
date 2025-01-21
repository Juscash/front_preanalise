import { Title } from "../components/typograph";
import { useState, useEffect } from "react";
import { Row, Col, Button, message, Spin, Modal } from "antd";
import {
  Select,
  CustomDateRange,
  TextArea,
  TagInput,
} from "../components/form";
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
  testPrompt,
  getIdprocess,
} from "../services/api";
import { Prompt } from "../models";

type FilterProcess = {
  motivo: string;
  data_inicio: string;
  data_fim: string;
};

type prrocessoID = {
  numero_processo: string;
  id_pipefy: string;
};
const TestePrompt = () => {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptSelected, setPromptSelected] = useState<Prompt | null>(null);
  const [saidasProcessos, setSaidasProcessos] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [listProcessos, setListProcessos] = useState<string>("");

  const [filterProcessModal, setFilterProcessModal] = useState<FilterProcess>({
    motivo: "",
    data_inicio: "2024-09-01",
    data_fim: "2024-09-30",
  });

  const [filterProcess, setFilterProcess] = useState<FilterProcess>({
    motivo: "",
    data_inicio: "2024-09-01",
    data_fim: "2024-09-30",
  });
  const [viewResult, setViewResult] = useState(false);
  const [processos, setProcessos] = useState<prrocessoID[]>([]);
  const [load, setLoad] = useState(true);
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

  const idProcess = async () => {
    setLoading(true);
    const arrayProcess = listProcessos.replace(/\s+/g, "").trim().split(",");
    const send: {
      processos: string[];
      motivo?: string;
      data_inicio: string;
      data_fim: string;
    } = {
      processos: arrayProcess,
      data_inicio: filterProcessModal.data_inicio,
      data_fim: filterProcessModal.data_fim,
    };
    if (filterProcessModal.motivo && filterProcessModal.motivo !== "") {
      send.motivo = filterProcessModal.motivo;
    }

    try {
      const data = await getIdprocess(send);

      const newData = [...processos, ...data];

      const uniqueData = newData.reduce(
        (acc: prrocessoID[], curr: prrocessoID) => {
          const existingItem = acc.find(
            (item) => item.id_pipefy === curr.id_pipefy
          );
          if (!existingItem) {
            acc.push(curr);
          }
          return acc;
        },
        []
      );

      setProcessos(uniqueData);
      setListProcessos("");
      setVisible(false);
    } catch (error) {
      console.error("Erro ao buscar processos por motivo:", error);
      message.error("Erro ao buscar processos por motivo");
    } finally {
      setLoading(false);
      console.log(arrayProcess);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsData, saidasData] = await Promise.all([
          getPrompts(),
          getSaidasProcessos(),
        ]);

        setPrompts(promptsData);
        setSaidasProcessos(saidasData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        message.error("Erro ao carregar dados iniciais");
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, []);

  const changeFilterProcess = (motivo: string) => {
    setFilterProcess({ ...filterProcess, motivo });
  };
  const changeFilterProcessModal = (motivo: string) => {
    setFilterProcessModal({ ...filterProcessModal, motivo });
  };
  const fetchProcessosMotivo = async () => {
    setLoading(true);

    try {
      const data = await getProcessosMotivo({
        motivo: filterProcess.motivo,
        data_inicio: filterProcess.data_inicio,
        data_fim: filterProcess.data_fim,
      });

      setProcessos(
        data.map((p) => {
          return { numero_processo: p.numero_processo, id_pipefy: p.id_pipefy };
        })
      );
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
      const data = {
        lista_processos: processos,
        id_prompt: `${promptSelected?.id}` || "0",
      };
      const response = await testPrompt(data);
      console.log(response, "res");

      setViewResult(true);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      message.error("Erro ao iniciar teste");
    } finally {
      setLoading(false);
      setViewResult(true);
    }
  };

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ) => {
    if (dates[0] && dates[1]) {
      setFilterProcess((prev) => ({
        ...prev,
        data_inicio: dates[0] ? dates[0].format("YYYY-MM-DD") : "",
        data_fim: dates[1] ? dates[1].format("YYYY-MM-DD") : "",
      }));
    }
  };

  const handleDateChangeModal = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ) => {
    if (dates[0] && dates[1]) {
      setFilterProcessModal((prev) => ({
        ...prev,
        data_inicio: dates[0] ? dates[0].format("YYYY-MM-DD") : "",
        data_fim: dates[1] ? dates[1].format("YYYY-MM-DD") : "",
      }));
    }
  };

  return (
    <>
      <Title level={1}>Teste de prompt</Title>
      <Spin spinning={load}>
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
                onChange={(dates, dateStrings) =>
                  handleDateChange(
                    dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                  )
                }
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
              <TagInput
                label={`Processos (${processos.length})`}
                value={processos.map(
                  (p) => `${p.numero_processo}-(${p.id_pipefy})`
                )}
                onChange={(newTags: any) => {
                  const newProcessos = newTags.map((tag: any) => {
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
            <Col
              span={16}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                color="danger"
                variant="solid"
                onClick={() => setProcessos([])}
                disabled={loading}
                loading={loading}
                style={{ marginRight: "16px" }}
              >
                Limpar processos
              </Button>

              <Button
                onClick={() => setVisible(true)}
                disabled={loading}
                loading={loading}
                style={{ marginRight: "16px" }}
                className="ant-btn-success"
              >
                Adicionar processos
              </Button>
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
      </Spin>
      {viewResult && (
        <TestPrompt
          acuracia={resultData.acuracia || 0}
          precisao={resultData.precisao || 0}
          nbe={resultData.nbe || 0}
          cobertura={resultData.cobertura || 0}
          data={resultData.data}
        />
      )}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        width={700}
        okText="Adicionar processos"
        onOk={idProcess}
        confirmLoading={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Select
              label="Selecionar saída de processo"
              name="saida"
              selects={saidasProcessos.map((p) => ({
                value: `${p.motivo_perda}`,
                name: `${p.motivo_perda}`,
              }))}
              onChange={changeFilterProcessModal}
            />
          </Col>
          <Col span={9}>
            <CustomDateRange
              label="Selecionar a data o processo"
              name="dataprocesso"
              defaultValue={[
                dayjs("01/09/2024", dateFormat),
                dayjs("30/09/2024", dateFormat),
              ]}
              onChange={(dates, dateStrings) =>
                handleDateChangeModal(
                  dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                )
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <TextArea
              label={`Lista de Processos (${
                listProcessos.split(",").filter((p) => p.trim() !== "").length
              })`}
              value={listProcessos}
              name="novosProcessos"
              onChange={(e) => setListProcessos(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TestePrompt;
