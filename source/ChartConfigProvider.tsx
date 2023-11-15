import React, { useState } from "react";
import { BarLineChartConfig, BasicChartConfig } from ".";

type ContextProps = BasicChartConfig & BarLineChartConfig;

const ConfigContext = React.createContext<ContextProps>(null!);
const DispatchConfigContext = React.createContext<
  React.Dispatch<React.SetStateAction<ContextProps>>
>(null!);

function ChartConfigProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: ContextProps;
}) {
  const [chartConfig, setChartConfig] = useState<ContextProps>(initialValues);
  return (
    <ConfigContext.Provider value={chartConfig}>
      <DispatchConfigContext.Provider value={setChartConfig}>
        {children}
      </DispatchConfigContext.Provider>
    </ConfigContext.Provider>
  );
}

export function useChartConfig() {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useChartConfig must be used within a ChartConfigProvider");
  }
  return context;
}

export function useDispatchChartConfig() {
  const context = React.useContext(DispatchConfigContext);
  if (context === undefined) {
    throw new Error(
      "useDispatchConfig must be used within a ChartConfigProvider"
    );
  }
  return context;
}

export default ChartConfigProvider;
