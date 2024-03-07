import { createContextState } from "foxact/context-state";
import { ChartData } from "..";

const [ChartDataProvider, useChartData, useSetChartData] =
  createContextState<ChartData>({ dataSource: [], dataDict: [] });

export { ChartDataProvider, useChartData, useSetChartData };
