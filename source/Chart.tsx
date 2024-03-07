import React, { startTransition, useEffect, useRef } from "react";
import { useChartConfig } from "./context/ChartConfigProvider";
import * as echarts from "echarts";
import useAutoGroupBy from "./hooks/useAutoGroupBy";
import { useChartData } from "./context/DataDictProvider";
import { Empty, Flex } from "antd";

type ChartProps<T> = {
  initDataSource?: T[];
} & React.HTMLAttributes<HTMLDivElement>;

function Chart<T extends object>({ initDataSource, ...props }: ChartProps<T>) {
  const chartRef = useRef<HTMLDivElement>(null!);
  const { dataDict, dataSource } = useChartData();
  const config = useChartConfig();
  const groupedData = useAutoGroupBy(
    dataSource || [],
    config.xAxisOptions.field as keyof T,
    []
  );

  console.log(groupedData.map((data) => data[config.xAxisOptions.field]));
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
        },
        grid: {
          bottom: 8,
          left: 16,
          right: 16,
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
          { type: "value", name: "百分比" },
        ],
        series: config.yAxisOptions.field.map((item) => ({
          name: item,
          type: "bar",
          stack: config.isStack,
          label: {
            show: config.showLabel,
            position: config.labelPosition,
          },
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
      {dataSource.length > 0 ? (
        <div
          ref={chartRef}
          style={{
            height: "100%",
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
