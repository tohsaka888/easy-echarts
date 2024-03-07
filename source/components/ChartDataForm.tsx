import {
  initialChartConfig,
  useChartConfig,
  useDispatchChartConfig,
} from "../context/ChartConfigProvider";
import { useChartData } from "@source/context/DataDictProvider";
import { Form, Input, InputNumber, Radio, Select, message } from "antd";
import { produce } from "immer";
import React, { useMemo } from "react";
import { ChartConfig } from "..";

type Props = {
  isShow: boolean;
};

function ChartDataForm({ isShow }: Props) {
  const setConfig = useDispatchChartConfig();
  const { dataSource, dataDict } = useChartData();

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
  }, [dataSource]);

  const yAxisOptions = useMemo(() => {
    if (dataSource.length) {
      const numberEntries = Object.entries(dataSource[0]).filter(
        ([_, value]) => typeof value === "number"
      );

      return [
        ...numberEntries.flatMap(([key]) => [
          { label: `(sum)${key}`, value: `sum_${key}` },
          { label: `(avg)${key}`, value: `avg_${key}` },
        ]),
        { label: "总数", value: "total" },
      ];
    } else {
      return [];
    }
  }, [dataSource]);

  const defaultConfig: ChartConfig = useMemo(() => {
    if (dataSource.length) {
      const config = {
        ...initialChartConfig,
        xAxisOptions: {
          field: xAxisOptions[0].value,
        },
        yAxisOptions: {
          field: ["total"],
        },
      };
      setConfig(config);
      return config;
    } else {
      return initialChartConfig;
    }
  }, [dataSource]);

  return (
    <Form
      layout="vertical"
      initialValues={defaultConfig}
      style={{
        width: "100%",
        marginTop: "8px",
        display: isShow ? "block" : "none",
      }}
    >
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

      <Form.Item label={"设置图表类型"} name={"type"}>
        <Select
          options={[{ label: "柱状图+折线图", value: "barLine" }]}
          placeholder="请输入图表类型"
          onChange={(e) => {
            setConfig(
              produce((config) => {
                // @ts-ignore
                config.type = e.target.value;
              })
            );
          }}
        />
      </Form.Item>

      <Form.Item label={"自动过滤筛选数据"} name={"autoFilter"}>
        <Radio.Group
          defaultValue={true}
          onChange={(e) => {
            setConfig(
              produce((config) => {
                config.autoFilter = e.target.value;
              })
            );
          }}
        >
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={"设置X轴"} name={["xAxisOptions", "field"]}>
        <Select
          options={xAxisOptions}
          style={{ width: "100%" }}
          placeholder="请选择X轴"
          onChange={(value) => {
            setConfig(
              produce((config) => {
                if (config.xAxisOptions) {
                  config.xAxisOptions.field = value;
                }
              })
            );
          }}
        />
      </Form.Item>

      <Form.Item label={"设置旋转角度"} name={["xAxisOptions", "rotate"]}>
        <InputNumber
          style={{ width: "100%" }}
          type="text"
          min={0}
          max={90}
          placeholder="请输入旋转角度"
          onChange={(value) => {
            if (typeof value === "number") {
              setConfig(
                produce((config) => {
                  if (config.xAxisOptions) {
                    config.xAxisOptions.rotate = value;
                  }
                })
              );
            }
          }}
        />
      </Form.Item>

      <Form.Item label={"设置Y轴"} name={["yAxisOptions", "field"]}>
        <Select
          options={yAxisOptions}
          style={{ width: "100%" }}
          mode="multiple"
          placeholder="请选择Y轴"
          onChange={(value) => {
            if (!value.length) {
              message.warning("至少有一个Y轴存在！");
              return;
            }
            setConfig(
              produce((config) => {
                if (config.yAxisOptions) {
                  config.yAxisOptions.field = value;
                }
              })
            );
          }}
        />
      </Form.Item>
    </Form>
  );
}

export default ChartDataForm;
