import React from "react";
import "@/style/global.css";
import EasyCharts from "@source/EasyCharts";
import dataSource from "../public/project_data_month_project_202310.json";

function App() {
  return (
    <EasyCharts
      dataSource={dataSource}
      dict={[]}
      autoFilter={true}
      type="barLine"
      xAxisOptions={{ field: "project_name", rotate: 30 }}
      yAxisOptions={{ field: ["bug_all", "bug_resolved"] }}
      title="Test"
      height={500}
    />
  );
}

export default App;
