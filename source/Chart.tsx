import React, { useEffect, useRef } from "react";
import { useChartConfig } from "./ChartConfigProvider";
import * as echarts from "echarts";

type Props = {
  dataSource: any[];
};

function Chart({ dataSource }: { dataSource: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null!);
  const config = useChartConfig();
  console.log(config);

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
          left: 8,
          right: 8,
          top: 60,
          containLabel: true,
        },
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
            data: dataSource.map((data) => data[config.xAxisOptions.field]),
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
          data: dataSource.map((data) => data[item]),
        })),
      });
    }
  }, [config]);

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
