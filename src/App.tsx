import React from "react";
import "@/style/global.css";
import EasyCharts from "@source/EasyCharts";
import dataSource from "../public/project_data_month_project_202310.json";

function App() {
  return (
    <div
      style={{
        height: "500px",
        margin: "50px 64px",
        width: "50%",
        border: "1px solid #eee",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <EasyCharts<any>
        onDataSourceChange={async () => {
          return {
            dataDict: [
              {
                field: "bug_all",
                displayName: "Bug总数",
              },
              {
                field: "bug_resolved",
                displayName: "解决Bug总数",
              },
              {
                field: "bug_resolved_rate",
                displayName: "Bug修复率",
              },
              {
                field: "project_name",
                displayName: "项目名",
              },
            ],
            dataSource: dataSource,
          };
        }}
      />
    </div>
  );
}

export default App;
