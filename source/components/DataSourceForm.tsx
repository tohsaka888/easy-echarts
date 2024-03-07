import { useSetChartData } from "@source/context/DataDictProvider";
import { Button, DatePicker, Form, Select, message } from "antd";
import React, { useContext } from "react";
import { EasyChartsProps } from "..";
import { PropsContext } from "@source/context/PropsProvider";
import { BookOutlined } from "@ant-design/icons";
import { useSetModalLoading } from "@source/context/ModalLoadingProvider";
import { useSetCurrent } from "@source/context/SegmentedStateProvider";

type Props = {
  isShow: boolean;
};

function DataSourceForm({ isShow }: Props) {
  const setChartData = useSetChartData();
  const { onDataSourceChange } = useContext<EasyChartsProps>(PropsContext);
  const [form] = Form.useForm();
  const setLoading = useSetModalLoading();
  const setCurrent = useSetCurrent();

  return (
    <Form
      style={{ marginTop: "8px", display: isShow ? "block" : "none" }}
      form={form}
      layout="vertical"
      initialValues={{
        dataSourceType: "new",
        dimension: "Person",
      }}
    >
      <Form.Item
        label="数据源"
        name={"dataSourceType"}
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "截止至今的数据", value: "new" },
            { label: "历史月度数据", value: "history" },
          ]}
        />
      </Form.Item>

      <Form.Item label="维度" rules={[{ required: true }]} name="dimension">
        <Select
          options={[
            { label: "人员", value: "Person" },
            { label: "项目", value: "Project" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="开始时间"
        name="startTime"
        help="你需要分析的数据的开始时间，开始时间和结束时间都不填默认取当年的所有数据"
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="结束时间"
        name="dueTime"
        help="你需要分析的数据的结束时间，开始时间和结束时间都不填默认取当年的所有数据"
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Button
        type="primary"
        icon={<BookOutlined />}
        style={{ marginTop: "16px" }}
        onClick={async () => {
          try {
            await form.validateFields();
            const values = form.getFieldsValue();
            const chartData = await onDataSourceChange(values);

            setLoading(true);

            try {
              await setChartData(chartData);
              setCurrent("DataType");
            } catch (error: any) {
              message.error(error.title + error.message);
            }
            setLoading(false);
          } catch (e) {
            message.error("请填写完整信息");
          }
        }}
      >
        分析数据
      </Button>
    </Form>
  );
}

export default DataSourceForm;
