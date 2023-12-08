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
        const calcedExistedItem = Object.entries(existedItem).reduce(
          (acc, [key, value]) => {
            if (typeof value === "number") {
              acc[`sum_${key}`] += value;
              acc["total"] += 1;
              acc[`avg_${key}`] = +(acc[`sum_${key}`] / acc["total"]).toFixed(
                2
              );
            }
            return acc;
          },
          {}
        );
        existedItem = {
          ...existedItem,
          ...calcedExistedItem,
        };
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
