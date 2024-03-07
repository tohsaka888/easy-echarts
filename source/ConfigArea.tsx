import React, { useState } from "react";
import { Button, Divider, Modal, Flex, Segmented, Spin } from "antd";
import {
  AppstoreOutlined,
  CompassOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import DataSourceForm from "./components/DataSourceForm";
import ChartDataForm from "./components/ChartDataForm";
import ChartStyleForm from "./components/ChartStyleForm";
import { useModalLoading } from "./context/ModalLoadingProvider";
import { useCurrent, useSetCurrent } from "./context/SegmentedStateProvider";
import { useChartData } from "./context/DataDictProvider";

function ConfigArea({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const current = useCurrent();
  const setCurrent = useSetCurrent();
  const loading = useModalLoading();
  const { dataSource } = useChartData();

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Config
      </Button>
      <Modal
        title="图表动态设置"
        width={"80%"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Divider />
        <Spin
          spinning={loading}
          size="large"
          tip={
            <div
              style={{ marginTop: "16px", fontWeight: 900, fontSize: "16px" }}
            >
              实时数据分析需要处理大量数据，可能需要花费一段时间，请稍等~
            </div>
          }
        >
          <Flex>
            <Flex
              flex={2}
              style={{
                marginRight: "16px",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              {children}
            </Flex>
            <div
              style={{
                flex: 1,
                maxHeight: "500px",
                height: "500px",
                overflowY: "auto",
                padding: "0px 12px",
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  zIndex: 999,
                  background: "#fff",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Segmented
                  value={current}
                  disabled={loading || !dataSource.length}
                  onChange={(value) => {
                    // @ts-ignore
                    setCurrent(value);
                  }}
                  options={[
                    {
                      label: "数据源",
                      value: "DataSource",
                      icon: <DatabaseOutlined />,
                    },
                    {
                      label: "类型与数据",
                      value: "DataType",
                      icon: <AppstoreOutlined />,
                    },
                    {
                      label: "图表样式",
                      value: "ChartStyle",
                      icon: <CompassOutlined />,
                    },
                  ]}
                />
              </div>
              <DataSourceForm isShow={current === "DataSource"} />
              <ChartDataForm isShow={current === "DataType"} />
              {current === "ChartStyle" && <ChartStyleForm />}
            </div>
          </Flex>
        </Spin>
      </Modal>
    </>
  );
}

export default ConfigArea;
