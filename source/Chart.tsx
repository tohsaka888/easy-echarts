import React, { startTransition, useEffect, useRef } from "react";
import {
  useChartConfig,
  usePreviewChartConfig,
} from "./context/ChartConfigProvider";
import * as echarts from "echarts";
import useAutoGroupBy from "./hooks/useAutoGroupBy";
import { useChartData } from "./context/DataDictProvider";
import { Empty, Flex } from "antd";

type ChartProps<T> = {
  initDataSource?: T[];
  mode: "preview" | "config";
} & React.HTMLAttributes<HTMLDivElement>;

function Chart<T extends object>({
  initDataSource,
  mode,
  ...props
}: ChartProps<T>) {
  const chartRef = useRef<HTMLDivElement>(null!);
  const { dataDict, dataSource } = useChartData();
  const config = mode === "config" ? useChartConfig() : usePreviewChartConfig();
  const groupedData = useAutoGroupBy(
    dataSource || [],
    config.xAxisOptions.field as keyof T,
    config.orderBy as (keyof T)[]
  );

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const resize = (event) => {
        startTransition(() => {
          // @ts-ignore
          chart.resize(options);
        });
      };
      const options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          formatter(params) {
            const list = params
              .map((param) => {
                const name = param.seriesName;
                const value = param.value;
                const color = param.color;
                const displayName = dataDict.find(
                  (dict) =>
                    dict.field === name.replace("sum_", "").replace("avg_", "")
                )?.displayName;
                return (
                  `<span style="color: ${color}">` +
                  (displayName || name) +
                  ":" +
                  value +
                  "</span>"
                );
              })
              .join("<br />");
            return `<div>${list}</div>`;
          },
        },
        grid: {
          bottom: 8,
          left: 16,
          right: 24,
          top: 60,
          containLabel: true,
        },
        brush: {
          toolbox: ["rect", "lineX", "lineY", "clear"],
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
            dataZoom: { show: true },
          },
        },
        legend: {
          type: "scroll",
          top: "top",
          left: "left",
          width: "50%",
          formatter(name) {
            const displayName = dataDict.find(
              (dict) =>
                dict.field === name.replace("sum_", "").replace("avg_", "")
            )?.displayName;
            return displayName || name;
          },
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              rotate: config.xAxisOptions.rotate,
            },
            data: groupedData.map((data) => data[config.xAxisOptions.field]),
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          { type: "value", name: "数值" },
          {
            type: "value",
            name: "百分比",
            min: 0,
            max: 1,
            alignTicks: true,
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (params.value * 100).toFixed(0) + "%";
                },
              },
            },
            axisLabel: {
              formatter: function (value) {
                return (value * 100).toFixed(0) + "%";
              },
            },
          },
        ],
        series: config.yAxisOptions.field.map((item) => ({
          name: item,
          type: !item.includes("_rate") ? "bar" : "line",
          stack: !item.includes("_rate") ? config.isStack : undefined,
          label: {
            show: config.showLabel,
            position: config.labelPosition,
            fontSize: config.labelFontSize,
            formatter: function (params) {
              return item.includes("_rate")
                ? (params.value * 100).toFixed(0) + "%"
                : params.value;
            },
          },
          yAxisIndex: !item.includes("_rate") ? 0 : 1,
          data: groupedData.map((data) => data[item]),
        })),
      };
      // @ts-ignore
      chart.setOption(options);
      window.addEventListener("resize", resize);
      // 组件卸载时销毁图表
      return () => {
        chart.dispose();
        window.removeEventListener("resize", resize);
      };
    }
  }, [config, groupedData]);

  return (
    <>
      {dataSource.length > 0 &&
      config.xAxisOptions.field &&
      config.yAxisOptions.field ? (
        <div
          ref={chartRef}
          style={{
            height: "calc(100% - 38px)",
            // border: "1px solid",
            borderRadius: "8px",
            width: "100%",
            flex: 1,
            padding: "8px",
            paddingBottom: "0px",
          }}
          {...props}
        />
      ) : (
        <Flex
          style={{ width: "100%", height: "100%" }}
          flex={1}
          align="center"
          justify="center"
        >
          <Empty description="暂无数据，请先筛选数据" />
        </Flex>
      )}
    </>
  );
}

export default Chart;
