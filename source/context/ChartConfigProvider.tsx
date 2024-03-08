import { ChartConfig } from "..";
import { createContextState } from "foxact/context-state";

export const initialChartConfig: ChartConfig = {
  type: "barLine",
  title: "基础图表",
  showLabel: true,
  labelPosition: "inside",
  order: 1,
  orderBy: [],
  isStack: false,
  labelFontSize: 12,
  autoFilter: true,
  xAxisOptions: {
    field: "",
  },
  yAxisOptions: {
    field: [],
  },
};

const [ChartConfigProvider, useChartConfig, useDispatchChartConfig] =
  createContextState<ChartConfig>(initialChartConfig);

const [
  PreviewChartConfigProvider,
  usePreviewChartConfig,
  useSetPreviewChartConfig,
] = createContextState<ChartConfig>(initialChartConfig);

export {
  ChartConfigProvider,
  useChartConfig,
  useDispatchChartConfig,
  PreviewChartConfigProvider,
  usePreviewChartConfig,
  useSetPreviewChartConfig,
};
