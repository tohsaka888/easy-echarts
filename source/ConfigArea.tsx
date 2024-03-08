import React, { useRef, useState } from "react";
import {
  Button,
  Divider,
  Modal,
  Flex,
  Segmented,
  Spin,
  message,
  Input,
} from "antd";
import {
  AppstoreOutlined,
  CompassOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import DataSourceForm from "./components/DataSourceForm";
import ChartDataForm from "./components/ChartDataForm";
import ChartStyleForm from "./components/ChartStyleForm";
import { useModalLoading } from "./context/ModalLoadingProvider";
import { useCurrent, useSetCurrent } from "./context/SegmentedStateProvider";
import { useChartData } from "./context/DataDictProvider";
import {
  useChartConfig,
  useSetPreviewChartConfig,
} from "./context/ChartConfigProvider";

function ConfigArea({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const current = useCurrent();
  const setCurrent = useSetCurrent();
  const loading = useModalLoading();
  const { dataSource } = useChartData();
  const setPreviewChartConfig = useSetPreviewChartConfig();
  const chartConfig = useChartConfig();
  const [title, setTitle] = useState<string>("双击此处更改图表标题");
  const [inputMode, setInputMode] = useState<boolean>(false);
  const inputRef = useRef<any>(null!);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Flex style={{ flex: 1, marginRight: "16px" }}>
          {inputMode ? (
            <Input
              value={title}
              ref={inputRef}
              style={{ flex: 1 }}
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={() => {
                setInputMode(false);
              }}
              onBlur={() => {
                setInputMode(false);
              }}
            />
          ) : (
            <div
              style={{
                fontSize: "16px",
                // fontWeight: "bold",
                cursor: "pointer",
              }}
              onDoubleClick={() => {
                setInputMode(true);
                inputRef.current?.focus();
              }}
            >
              {title || "双击此处更改图表标题"}
            </div>
          )}
        </Flex>
        <Flex>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => setOpen(true)}
          />
        </Flex>
      </Flex>
      <Modal
        title="图表动态设置"
        width={"80%"}
        open={open}
        onCancel={() => {
          Modal.info({
            title: "是否保存设置？",
            centered: true,
            onOk() {
              setPreviewChartConfig(chartConfig);
              setOpen(false);
              message.success("保存成功！");
            },
            onCancel() {
              setOpen(false);
            },
            cancelText: "不保存",
            okText: "保存",
            okCancel: true,
          });
        }}
        footer={null}
        maskClosable={false}
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
