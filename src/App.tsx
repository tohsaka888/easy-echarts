import React from "react";
import "@/style/global.css";
import EasyCharts from "@source/EasyCharts";
import dataSource from "../public/project_data_month_project_202310.json";

function App() {
  return (
    <EasyCharts<any>
      onDataSourceChange={async () => {
        return {
          dataDict: [],
          dataSource: dataSource,
        };
      }}
    />
  );
}

export default App;
