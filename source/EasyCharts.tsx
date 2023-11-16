"use client";
import React from "react";
import ChartConfigProvider from "./ChartConfigProvider";
import ConfigArea from "./ConfigArea";
import Chart from "./Chart";
import { EasyChartsProps } from ".";

function EasyCharts(config: EasyChartsProps) {
  return (
    <ChartConfigProvider initialValues={config}>
      <ConfigArea dataSource={config.dataSource} />
      <Chart dataSource={config.dataSource} />
    </ChartConfigProvider>
  );
}

export default EasyCharts;
