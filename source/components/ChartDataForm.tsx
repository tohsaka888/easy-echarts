import {
  initialChartConfig,
  useChartConfig,
  useDispatchChartConfig,
} from "../context/ChartConfigProvider";
import { useChartData } from "@source/context/DataDictProvider";
import { Form, Input, InputNumber, Radio, Select, message } from "antd";
import { produce } from "immer";
import React, { useEffect, useMemo } from "react";
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
        .map(([key]) => {
          const label = dataDict.find((item) => item.field === key);
          return {
            label: label ? label.displayName : key,
            value: key,
          };
        });
    } else {
      return [];
    }
  }, [dataSource]);
  const [form] = Form.useForm();
  const yAxises = Form.useWatch(["yAxisOptions", "field"], form) || [];

  const yAxisOptions = useMemo(() => {
    if (dataSource.length) {
      const numberEntries = Object.entries(dataSource[0]).filter(
        ([_, value]) => typeof value === "number"
      );

      return [
        ...numberEntries.flatMap(([key]) => {
          const label = dataDict.find((item) => item.field === key);
          const sumData = {
            label: label
              ? "(sum)" +
                dataDict.find((item) => item.field === key)?.displayName
              : `(sum)${key}`,
            value: `sum_${key}`,
          };
          const avgData = {
            label: label
              ? "(avg)" +
                dataDict.find((item) => item.field === key)?.displayName
              : `(avg)${key}`,
            value: `avg_${key}`,
          };
          return !key.includes("_rate") ? [sumData, avgData] : [avgData];
        }),
        { label: "总数", value: "total" },
      ].map((yAxis) => {
        const disabled = yAxises.some(
          (item: string) =>
            yAxis.value.replace("sum_", "").replace("avg_", "") ===
              item.replace("sum_", "").replace("avg_", "") &&
            yAxis.value !== item
        );
        return { ...yAxis, disabled };
      });
    } else {
      return [];
    }
  }, [dataSource, yAxises]);

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
      return config;
    } else {
      return initialChartConfig;
    }
  }, [dataSource]);

  useEffect(() => {
    form.setFieldsValue(defaultConfig);
    setConfig(defaultConfig);
  }, [defaultConfig]);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={defaultConfig}
      style={{
        width: "100%",
        marginTop: "8px",
        display: isShow ? "block" : "none",
      }}
    >
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

      <Form.Item
        label={"自动过滤筛选数据"}
        name={"autoFilter"}
        tooltip={"如果Y轴数据全为0，自动从图表中过滤"}
      >
        <Radio.Group
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

      <Form.Item
        label={"设置Y轴"}
        name={["yAxisOptions", "field"]}
        tooltip={
          "同一字段自动计算的sum和avg不能共存，总数字段为当前维度下数据的数量"
        }
      >
        <Select
          options={yAxisOptions}
          maxCount={5}
          style={{ width: "100%" }}
          mode="multiple"
          placeholder="请选择Y轴"
          onChange={(value: string[]) => {
            if (!value.length) {
              message.warning("至少有一个Y轴存在！");
              return;
            }
            if (value.length > 5) {
              message.warning("最多只能有5个Y轴！");
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
      <Form.Item label={"排序维度"} name={"orderBy"}>
        <Select
          options={yAxises.map((yAxis: string) => ({
            label:
              dataDict.find(
                (item) =>
                  item.field === yAxis.replace("sum_", "").replace("avg_", "")
              )?.displayName || yAxis,
            value: yAxis,
          }))}
          style={{ width: "100%" }}
          mode="multiple"
          placeholder="排序顺序"
          onChange={(value) => {
            setConfig(
              produce((config) => {
                config.orderBy = value;
              })
            );
          }}
        />
      </Form.Item>
      <Form.Item label="排序顺序" name={"order"}>
        <Radio.Group
          onChange={(e) => {
            setConfig(
              produce((config) => {
                config.order = e.target.value;
              })
            );
          }}
        >
          <Radio value={1}>降序</Radio>
          <Radio value={-1}>升序</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}

export default ChartDataForm;
