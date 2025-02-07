import React, { useMemo, useCallback } from "react";
import { Row, Col, Tabs, Form } from "antd";
import { TextArea } from "../../components/form";
import type { TabsProps } from "antd";

interface ParametrosTabsProps {
  parametros: { nome: string; valor: string }[];
  onParametroChange: (nome: string, valor: string) => void;
  gravar?: boolean;
  view?: boolean;
}

export const ParametrosTabs: React.FC<ParametrosTabsProps> = React.memo(
  ({ parametros, onParametroChange, gravar = true, view = false }) => {
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
            <Form.Item
              name={p.nome}
              rules={[{ required: gravar, message: `Por favor, preencha o parâmetro ${p.nome}` }]}
              getValueProps={(val) => ({ value: p.valor ?? val })}
            >
              <TextArea
                readOnly={!gravar}
                label={p.nome}
                name={p.nome}
                rows={6}
                value={p.valor}
                onChange={handleChange(p.nome)}
                required={gravar}
              />
            </Form.Item>
          ),
        })),
      [parametros, handleChange]
    );

    return !gravar && view ? (
      <Row gutter={16}>
        <Col span={16}>
          <Tabs type="card" items={items} />
        </Col>
      </Row>
    ) : gravar ? (
      <Row gutter={16}>
        <Col span={16}>
          <Tabs type="card" items={items} />
        </Col>
      </Row>
    ) : (
      ""
    );
  }
);
