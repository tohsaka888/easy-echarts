import { useChartConfig } from "../context/ChartConfigProvider";
import React, { useMemo } from "react";

function useAutoGroupBy<T extends object>(
  data: T[],
  groupBy: keyof T,
  orderBy: (keyof T)[]
) {
  const { autoFilter, yAxisOptions, order, ...config } = useChartConfig();
  return useMemo(() => {
    const groupedData: any[] = [];
    if (!data.length) {
      return [];
    }

    data.forEach((item) => {
      // if group data already exist key
      let existedItem = groupedData.find(
        (groupItem) => groupItem[groupBy] === item[groupBy]
      );
      if (existedItem) {
        // push order by value
        existedItem.total++;
        Object.keys(item).forEach((key) => {
          if (typeof item[key] === "number") {
            existedItem[`sum_${key}`] += item[key];
            existedItem[`avg_${key}`] = +(
              existedItem[`sum_${key}`] / existedItem.total
            ).toFixed(0);
          }
        });
      } else {
        // catch all number key
        const additionalData = Object.entries(item).reduce(
          (acc, [key, value]) => {
            if (typeof value === "number") {
              acc[`sum_${key}`] = value;
              acc[`avg_${key}`] = value;
            }
            return acc;
          },
          {}
        );
        groupedData.push({
          ...item,
          total: 1,
          ...additionalData,
        });
      }
    });
    const resultData = autoFilter
      ? groupedData.filter((item) => yAxisOptions.field.some((y) => item[y]))
      : groupedData;
    return resultData.sort((item1, item2) => {
      for (const dimension of orderBy || []) {
        if (item1[dimension] < item2[dimension]) return order;
        if (item1[dimension] > item2[dimension]) return -order;
      }
      return 0;
    });
  }, [data, groupBy, orderBy, autoFilter, order, config]);
}

export default useAutoGroupBy;
