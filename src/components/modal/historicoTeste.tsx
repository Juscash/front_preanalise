import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Modal, Button, Spin, message } from "antd";
import Table from "../table";
import { GaugeChart } from "../graphics";
import * as XLSX from "xlsx";
import { getProcessosTeste } from "../../services/api";
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

interface Metricas {
  acuracia: number;
  precisaoNegativas: number;
  nbe: number;
  cobertura: number;
}

const columns = [
  {
    title: "Processo",
    dataIndex: "numero_processo",
    key: "numero_processo",
    sorter: (a: DataType, b: DataType) => a.numero_processo.localeCompare(b.numero_processo),
  },
  {
    title: "Pipefy",
    dataIndex: "id_pipefy",
    key: "id_pipefy",
    sorter: (a: DataType, b: DataType) => a.id_pipefy.localeCompare(b.id_pipefy),
  },
  {
    title: "Tribunal",
    dataIndex: "tribunal",
    key: "tribunal",
    sorter: (a: DataType, b: DataType) => a.tribunal.localeCompare(b.tribunal),
  },
  {
    title: "Análise humana",
    dataIndex: "analise_humana",
    key: "analise_humana",
    sorter: (a: DataType, b: DataType) => a.analise_humana.localeCompare(b.analise_humana),
  },
  {
    title: "Análise automação",
    dataIndex: "analise_automatica",
    key: "analise_automatica",
  },
  {
    title: "Justificativa AH",
    dataIndex: "justificativa_ah",
    key: "justificativa_ah",
  },
  {
    title: "Justificativa automação",
    dataIndex: "justificativa_aa",
    key: "justificativa_aa",
  },
  {
    title: "Data AH",
    dataIndex: "data_ah",
    key: "data_ah",
    render: (data: string) => <span>{dayjs(data).format("DD/MM/YYYY")}</span>,
  },
];

interface ModalHistoricoTesteProps {
  visible: boolean;
  onClose: () => void;
  id: string | number;
  metricas: Metricas;
}

const ModalHistoricoTeste: React.FC<ModalHistoricoTesteProps> = ({
  visible,
  onClose,
  id,
  metricas,
}) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcessos = useCallback(async () => {
    try {
      const response = await getProcessosTeste(id);
      setData(response);
    } catch (error) {
      message.error("Erro ao buscar os processos do teste");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_teste_prompt.xlsx");
  };

  return (
    <Modal title="Resultados" open={visible} onCancel={onClose} footer={null} width={1200}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify="space-around" style={{ marginTop: 30, marginBottom: 30 }}>
          <Col>
            <GaugeChart value={metricas.acuracia} label="Acurácia" />
          </Col>
          <Col>
            <GaugeChart value={metricas.precisaoNegativas} label="Precisão de negativas" />
          </Col>
          <Col>
            <GaugeChart value={metricas.nbe} label="NBE" />
          </Col>
          <Col>
            <GaugeChart value={metricas.cobertura} label="Cobertura" />
          </Col>
        </Row>
        <Table columns={columns} data={data} bordered rowKey="id_pipefy" />
        <Row style={{ marginTop: 16 }}>
          <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
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
