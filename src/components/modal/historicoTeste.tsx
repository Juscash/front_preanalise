import { Row, Col, Modal, Button, Spin, message } from "antd";
import Table from "../table";
import { GaugeChart } from "../graphics";
import * as XLSX from "xlsx";
import { getProcessosTeste } from "../../services/api";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

interface DataType {
  id_teste: React.Key;
  numero_processo: string;
  id_pipefy: string;
  tribunal: string;
  analise_humana: string;
  analise_automatica: string;
  justificativa_ah: string;
  justificativa_aa: string;
  data_ah: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Processo",
    dataIndex: "numero_processo",
    key: "numero_processo",
    sorter: (a, b) => a.numero_processo.length - b.numero_processo.length,
  },
  {
    title: "Pipefy",
    dataIndex: "id_pipefy",
    key: "id_pipefy",
    sorter: (a, b) => a.id_pipefy.length - b.id_pipefy.length,
  },
  {
    title: "Tribunal",
    dataIndex: "tribunal",
    key: "tribunal",
    sorter: (a, b) => a.tribunal.length - b.tribunal.length,
  },
  {
    title: "Análise humana",
    dataIndex: "analise_humana",
    key: "analise_humana",
    sorter: (a, b) => a.analise_humana.length - b.analise_humana.length,
  },
  {
    title: "Análise automação",
    dataIndex: "analise_automatica",
    key: "analise_automatica",
  },
  {
    title: "JustifiCativa AH",
    dataIndex: "justificativa_ah",
    key: "justificativa_ah",
  },

  {
    title: "JustifiCativa automação",
    dataIndex: "justificativa_aa",
    key: "justificativa_aa",
  },
  {
    title: "Data AH",
    dataIndex: "data_ah",
    key: "data_ah",
    render: (data: string) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {dayjs(data).format("DD/MM/YYYY")}
      </div>
    ),
  },
];

const ModalHistoricoTeste = ({
  visible,
  onClose,
  id,
  metricas,
}: {
  visible: boolean;
  onClose: () => void;
  id: string | number;
  metricas: {
    acuracia: number;
    precisaoNegativas: number;
    nbe: number;
    cobertura: number;
  };
}) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getProcessos = async () => {
    const response = await getProcessosTeste(id);
    setData(response);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProcessos();
      } catch (error) {
        message.error("Erro ao buscar os processos do teste");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };
  return (
    <Modal
      title="Resultados"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      <Spin spinning={loading}>
        <Row
          gutter={[16, 16]}
          justify="space-around"
          style={{ marginTop: "30px", marginBottom: "30px" }}
        >
          <Col>
            <GaugeChart value={metricas.acuracia.toFixed(2)} label="Acurácia" />
          </Col>
          <Col>
            <GaugeChart
              value={metricas.precisaoNegativas.toFixed(2)}
              label="Precisão de negativas"
            />
          </Col>
          <Col>
            <GaugeChart value={metricas.nbe.toFixed(2)} label="NBE" />
          </Col>
          <Col>
            <GaugeChart
              value={metricas.cobertura.toFixed(2)}
              label="Cobertura"
            />
          </Col>
        </Row>
        <Table columns={columns} data={data} bordered rowKey="id_pipefy" />
        <Row style={{ marginTop: "16px" }}>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button type="primary" onClick={exportToExcel}>
              Gerar planilha Excel
            </Button>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default ModalHistoricoTeste;
