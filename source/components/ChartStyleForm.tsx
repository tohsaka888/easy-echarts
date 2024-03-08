import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  initialChartConfig,
  useDispatchChartConfig,
} from "@source/context/ChartConfigProvider";
import { Button, Col, Flex, Form, Radio, Row } from "antd";
import { produce } from "immer";
import React from "react";

function ChartStyleForm() {
  const setConfig = useDispatchChartConfig();
  return (
    <Form
      layout="vertical"
      style={{ marginTop: "8px" }}
      initialValues={initialChartConfig}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="是否显示数值" name={"showLabel"}>
            <Radio.Group
              onChange={(e) => {
                setConfig(
                  produce((config) => {
                    config.showLabel = e.target.value;
                  })
                );
              }}
            >
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="是否自动堆叠" name={"isStack"}>
            <Radio.Group
              onChange={(e) => {
                setConfig(
                  produce((config) => {
                    config.isStack = e.target.value;
                  })
                );
              }}
            >
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="标签位置" name={"labelPosition"}>
            <Radio.Group
              onChange={(e) => {
                setConfig(
                  produce((config) => {
                    config.labelPosition = e.target.value;
                  })
                );
              }}
            >
              <Radio value={"top"}>顶部</Radio>
              <Radio value={"inside"}>内部</Radio>
              <Radio value={"bottom"}>底部</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="标签字体大小" name={"labelAlign"}>
            <Flex align="center">
              <Button
                style={{ marginRight: "16px" }}
                icon={<MinusCircleOutlined />}
                onClick={() => {
                  setConfig(
                    produce((config) => {
                      if (config.labelFontSize) {
                        config.labelFontSize--;
                      }
                    })
                  );
                }}
              />
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setConfig(
                    produce((config) => {
                      if (config.labelFontSize < 16) {
                        config.labelFontSize++;
                      }
                    })
                  );
                }}
              />
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default ChartStyleForm;
