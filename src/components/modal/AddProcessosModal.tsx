import React from "react";
import { Modal, Row, Col } from "antd";
import { Select, CustomDateRange, TextArea } from "../form";
import dayjs from "dayjs";

interface AddProcessosModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
  loading: boolean;
  saidasProcessos: any[];
  handleFilterChange: (value: string) => void;
  handleDateChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
  listProcessos: string;
  setListProcessos: (value: string) => void;
  defaultStartDate: string;
  defaultEndDate: string;
}

const AddProcessosModal: React.FC<AddProcessosModalProps> = ({
  isVisible,
  onCancel,
  onOk,
  loading,
  saidasProcessos,
  handleFilterChange,
  handleDateChange,
  listProcessos,
  setListProcessos,
  defaultStartDate,
  defaultEndDate,
}) => {
  const countProcessos = (text: string): number => {
    if (text.includes(",")) {
      return text.split(",").filter((processo) => processo.trim() !== "").length;
    } else {
      return text.split("\n").filter((processo) => processo.trim() !== "").length;
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onCancel}
      width={700}
      okText="Adicionar processos"
      onOk={onOk}
      confirmLoading={loading}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Select
            label="Selecionar saída de processo"
            allowClear
            name="saida"
            selects={saidasProcessos.map((saida) => ({
              value: saida.motivo_perda,
              name: saida.motivo_perda,
            }))}
            onChange={(value) => handleFilterChange(value)}
          />
        </Col>
        <Col span={9}>
          <CustomDateRange
            label="Selecionar a data o processo"
            name="dataprocesso"
            defaultValue={[dayjs(defaultStartDate), dayjs(defaultEndDate)]}
            onChange={(dates) =>
              handleDateChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <TextArea
            label={`Lista de Processos (${countProcessos(listProcessos)})`}
            value={listProcessos}
            name="novosProcessos"
            onChange={(event) => setListProcessos(event.target.value)}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default AddProcessosModal;
