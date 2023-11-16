export type BasicChartConfig = {
  title: string;
  height: number;
};

export type BarLineChartConfig = {
  type: "barLine";
  xAxisOptions: {
    field: string;
    rotate?: number;
  };
  yAxisOptions: {
    field: string[];
  };
} & BasicChartConfig;

export type EasyChartsProps = {
  dataSource: ({ color?: string; type: "bar" | "line" | "pie" } & any)[];
  dict: { field: string; displayName: string }[];
  type: "barLine" | "pie";
} & BarLineChartConfig;

export { default as EasyCharts } from "@source/EasyCharts";
