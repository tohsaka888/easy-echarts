import { createContextState } from "foxact/context-state";

const [SegmentedProvider, useCurrent, useSetCurrent] =
  createContextState<"DataSource" | "DataType" | "ChartStyle">("DataSource");

export { SegmentedProvider, useCurrent, useSetCurrent };
