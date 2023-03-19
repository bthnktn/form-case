import React, { useEffect, useMemo, useState } from "react";
import { Input, Table, Button, Modal, Form, InputNumber } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import Link from "next/link";

interface DataType {
  key: string;
  formName: string;
  description: string;
  createdAt: string;
  fields: { name: string; surname: string; age: number };
}

const columns: ColumnsType<DataType> = [
  {
    title: "Form Name",
    dataIndex: "formName",
    key: "formName",
    render: (formName) => <Link href={`forms/${formName}`}>{formName}</Link>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => {
      const date = new Date(value);
      return date.toLocaleString("en-US");
    },
  },
];

const FormTable: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<DataType[]>([]);

  useEffect(() => {
    const local = localStorage.getItem("items");
    const items = local ? JSON.parse(local) : [];
    if (items) {
      setItems(items);
    }
  }, []);

  useEffect(() => {
    if (items.length) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items]);

  const [searchText, setSearchText] = useState("");
  const filteredRows = useMemo(
    () =>
      items.filter((row) =>
        row.formName.toLowerCase().includes(searchText.toLowerCase())
      ),
    [items, searchText]
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = (values: any) => {
    const { formName, description, ...fields } = values;
    console.log("values", values);
    const local = localStorage.getItem("items");
    const items = local ? JSON.parse(local) : [];
    items.push({
      formName,
      description,
      createdAt: new Date(),
      fields,
    });
    setItems(items);
    localStorage.setItem("items", JSON.stringify(items));
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 40,
          backgroundColor: "aliceblue",
          padding: 30,
          borderRadius: 8,
        }}
      >
        <Button type="primary" onClick={showModal}>
          Add
        </Button>

        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          placeholder="Search..."
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredRows.map((item, index) => ({
          ...item,
          key: index.toString(),
        }))}
        pagination={false}
      />
      <Modal
        title="Add Form"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="formName"
            label="Form Name"
            rules={[
              {
                required: true,
                message: "Please input form name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="surname"
            label="Surname"
            rules={[
              {
                required: true,
                message: "Please input your surname!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormTable;
