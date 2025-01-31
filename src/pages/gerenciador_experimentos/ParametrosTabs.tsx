import React, { useMemo, useCallback } from "react";
import { Row, Col, Tabs } from "antd";
import { TextArea } from "../../components/form";
import type { TabsProps } from "antd";

interface ParametrosTabsProps {
  parametros: { nome: string; valor: string }[];
  onParametroChange: (nome: string, valor: string) => void;
}

export const ParametrosTabs: React.FC<ParametrosTabsProps> = React.memo(
  ({ parametros, onParametroChange }) => {
    const handleChange = useCallback(
      (nome: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onParametroChange(nome, e.target.value);
      },
      [onParametroChange]
    );

    const items: TabsProps["items"] = useMemo(
      () =>
        parametros.map((p) => ({
          label: p.nome,
          key: p.nome,
          children: (
            <TextArea
              label={p.nome}
              name={p.nome}
              rows={6}
              value={p.valor}
              onChange={handleChange(p.nome)}
              required
            />
          ),
        })),
      [parametros, handleChange]
    );

    return (
      <Row gutter={16}>
        <Col span={16}>
          <Tabs type="card" items={items} />
        </Col>
      </Row>
    );
  }
);
