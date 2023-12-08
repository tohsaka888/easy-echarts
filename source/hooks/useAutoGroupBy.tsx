import React, { useMemo } from "react";

function useAutoGroupBy<T extends object>(
  data: T[],
  groupBy: keyof T,
  orderBy: (keyof T)[]
) {
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
        Object.keys(item).forEach((key) => {
          if (typeof item[key] === "number") {
            existedItem.total++;
            existedItem[`sum_${key}`] += item[key];
            existedItem[`avg_${key}`] = +(
              existedItem[`sum_${key}`] / existedItem.total
            ).toFixed(2);
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
    return groupedData;
  }, [data, groupBy, orderBy]);
}

export default useAutoGroupBy;
