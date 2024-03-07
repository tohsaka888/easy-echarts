import React from "react";
import { EasyChartsProps } from "..";

export const PropsContext = React.createContext<EasyChartsProps>(null!); // 创建一个 Context 对象

type Props = {
  children: React.ReactNode;
  initialValues: EasyChartsProps;
};

function PropsProvider({ children, initialValues }: Props) {
  return (
    <PropsContext.Provider value={initialValues}>
      {children}
    </PropsContext.Provider>
  );
}

export default PropsProvider;
