import React, { useState } from "react";
import { Drawer, Button, Form, Input, Row, Col, InputNumber } from "antd";
import { useChartConfig, useDispatchChartConfig } from "./ChartConfigProvider";
import { produce } from "immer";

function ConfigArea() {
  const [open, setOpen] = useState<boolean>(false);
  const config = useChartConfig();
  const setConfig = useDispatchChartConfig();
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Config
      </Button>
      <Drawer
        title="图表动态设置"
        width={"80%"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Form layout="vertical" initialValues={config}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={"设置图表标题"} name={"title"}>
                <Input
                  type="text"
                  placeholder="请输入图表标题"
                  onChange={(e) => {
                    setConfig(
                      produce((config) => {
                        config.title = e.target.value;
                      })
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={"设置图表高度"} name={"height"}>
                <InputNumber
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="请输入图表高度"
                  onChange={(value) => {
                    if (typeof value === "number") {
                      setConfig(
                        produce((config) => {
                          config.height = value;
                        })
                      );
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}

export default ConfigArea;
