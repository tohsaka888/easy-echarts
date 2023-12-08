import React, { useMemo, useState } from "react";
import {
  Drawer,
  Button,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Divider,
  Select,
} from "antd";
import { useChartConfig, useDispatchChartConfig } from "./ChartConfigProvider";
import { produce } from "immer";

function ConfigArea({ dataSource }: { dataSource: any[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const config = useChartConfig();
  const setConfig = useDispatchChartConfig();

  const xAxisOptions = useMemo(() => {
    if (dataSource.length) {
      return Object.entries(dataSource[0])
        .filter(([key, value]) => typeof value === "string")
        .map(([key]) => ({
          label: key,
          value: key,
        }));
    } else {
      return [];
    }
  }, [config]);

  const yAxisOptions = useMemo(() => {
    if (dataSource.length) {
      const numberEntries = Object.entries(dataSource[0]).filter(
        ([_, value]) => typeof value === "number"
      );

      return numberEntries.flatMap(([key]) => [
        { label: `(自动计算总和)${key}`, value: `sum_${key}` },
        { label: `(自动计算平均)${key}`, value: `avg_${key}` },
      ]);
    } else {
      return [];
    }
  }, [config, dataSource]);

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
          <Divider style={{ margin: "0px" }}>基本设置</Divider>
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
          <Divider style={{ margin: "0px" }}>X轴设置</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={"设置X轴"} name={["xAxisOptions", "field"]}>
                <Select
                  options={xAxisOptions}
                  style={{ width: "100%" }}
                  placeholder="请选择X轴"
                  onChange={(value) => {
                    setConfig(
                      produce((config) => {
                        config.xAxisOptions.field = value;
                      })
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={"设置旋转角度"}
                name={["xAxisOptions", "rotate"]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  type="text"
                  min={0}
                  max={90}
                  placeholder="请输入图表高度"
                  onChange={(value) => {
                    if (typeof value === "number") {
                      setConfig(
                        produce((config) => {
                          config.xAxisOptions.rotate = value;
                        })
                      );
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={"设置Y轴"} name={["yAxisOptions", "field"]}>
                <Select
                  options={yAxisOptions}
                  style={{ width: "100%" }}
                  mode="multiple"
                  placeholder="请选择Y轴"
                  onChange={(value) => {
                    setConfig(
                      produce((config) => {
                        config.yAxisOptions.field = value;
                      })
                    );
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
