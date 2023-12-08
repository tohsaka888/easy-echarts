import React, { useEffect, useRef } from "react";
import { useChartConfig } from "./ChartConfigProvider";
import * as echarts from "echarts";
import useAutoGroupBy from "./hooks/useAutoGroupBy";

function Chart<T extends object>({ dataSource }: { dataSource: T[] }) {
  const chartRef = useRef<HTMLDivElement>(null!);
  const config = useChartConfig();
  const groupedData = useAutoGroupBy(
    dataSource,
    config.xAxisOptions.field as keyof T,
    []
  );
  console.log(groupedData);
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      // @ts-ignore
      chart.setOption({
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
        yAxis: config.yAxisOptions.field.map((item) => ({
          type: "value",
          name: item,
        })),
        series: config.yAxisOptions.field.map((item) => ({
          name: item,
          type: "bar",
          data: groupedData.map((data) => data[item]),
        })),
      });
    }
  }, [config, groupedData]);

  return (
    <div
      ref={chartRef}
      style={{ height: config.height, border: "1px solid" }}
      // enforce rerender
      key={JSON.stringify(config)}
    />
  );
}

export default Chart;
