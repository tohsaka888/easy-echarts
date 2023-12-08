"use client";
import React, { useMemo } from "react";
import ChartConfigProvider from "./ChartConfigProvider";
import ConfigArea from "./ConfigArea";
import Chart from "./Chart";
import { EasyChartsProps } from ".";

function EasyCharts(initialConfig: EasyChartsProps) {
  const config: EasyChartsProps = useMemo(() => {
    return {
      ...initialConfig,
      yAxisOptions: {
        field: initialConfig.yAxisOptions.field.map((field) => {
          if (field.includes("sum_") || field.includes("average_")) {
            return field;
          } else {
            return "sum_" + field;
          }
        }),
      },
    };
  }, [initialConfig]);
  return (
    <ChartConfigProvider initialValues={config}>
      <ConfigArea dataSource={config.dataSource} />
      <Chart dataSource={config.dataSource} />
    </ChartConfigProvider>
  );
}

export default EasyCharts;
