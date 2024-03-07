"use client";
import React, { useMemo } from "react";
import ChartConfigProvider from "./context/ChartConfigProvider";
import ConfigArea from "./ConfigArea";
import Chart from "./Chart";
import { EasyChartsProps } from ".";
import { ChartDataProvider } from "./context/DataDictProvider";
import PropsProvider from "./context/PropsProvider";
import { ModalLoadingProvider } from "./context/ModalLoadingProvider";
import { SegmentedProvider } from "./context/SegmentedStateProvider";

function EasyCharts<T extends object>(props: EasyChartsProps<T>) {
  return (
    <ChartDataProvider>
      <ChartConfigProvider>
        <PropsProvider initialValues={props}>
          <ModalLoadingProvider>
            <SegmentedProvider>
              <ConfigArea>
                <Chart
                  initDataSource={props.initDataSource}
                  key={"config-chart"}
                />
              </ConfigArea>
            </SegmentedProvider>
          </ModalLoadingProvider>
          <Chart initDataSource={props.initDataSource} key={"preview-chart"} />
        </PropsProvider>
      </ChartConfigProvider>
    </ChartDataProvider>
  );
}

export default EasyCharts;
