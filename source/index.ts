export type BasicChartConfig = {
  title: string;
  autoFilter: boolean;
  showLabel: boolean;
  labelFontSize: number;
  labelPosition: "top" | "inside" | "bottom";
  orderBy: string[];
  order: 1 | -1;
};

export type BarLineChartConfig = {
  type: "barLine";
  isStack: boolean;
  xAxisOptions: {
    field: string;
    rotate?: number;
  };
  yAxisOptions: {
    field: string[];
  };
} & BasicChartConfig;

export type DataSourceQuery = {
  dataSourceType: "new" | "history";
  startTime: string;
  dueTime: string;
  dimension: "Person" | "Project";
};

export type DataSourceDict = {
  field: string;
  displayName: string;
};

export type EasyChartsProps<T = any> = {
  initDataSource?: T[];
  initDict?: { field: string; displayName: string }[];
  onDataSourceChange(query: DataSourceQuery): Promise<{
    dataSource: T[];
    dataDict: DataSourceDict[];
  }>;
};

export type ChartData<T = any> = {
  dataSource: T[];
  dataDict: DataSourceDict[];
};

export type ChartConfig = BasicChartConfig & BarLineChartConfig;

export { default as EasyCharts } from "@source/EasyCharts";
