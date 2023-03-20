import React, { useEffect, useMemo, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  Input,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Descriptions,
} from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import Link from "next/link";
import { getPicData } from "@/services/api";
import { picData, StateType } from "../store/index";
import { PictureData } from "@/interfaces";

const useAppSelector: TypedUseSelectorHook<{ pictures: StateType }> =
  useSelector;

interface DataType {
  key: string;
  formName: string;
  description: string;
  createdAt: string;
  fields: { name: string; surname: string; age: number };
}

enum ModalType {
  add = "add",
  picture = "picture",
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
  const dispatch = useDispatch();
  const pictureData = useAppSelector((state) => state.pictures.pictureData);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
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

  useEffect(() => {
    if (showDataModal) {
      getPicData().then((res) => {
        dispatch(picData(res));
      });
    }
  }, [showDataModal, dispatch]);

  const [searchText, setSearchText] = useState("");
  const filteredRows = useMemo(
    () =>
      items.filter((row) =>
        row.formName.toLowerCase().includes(searchText.toLowerCase())
      ),
    [items, searchText]
  );

  const showModal = (modalType: ModalType) => {
    if (modalType === "add") setIsModalOpen(true);
    else setShowDataModal(true);
  };
  const handleCancel = (modalType: ModalType) => {
    if (modalType === "add") setIsModalOpen(false);
    else setShowDataModal(false);
  };
  const handleSubmit = (values: any) => {
    const { formName, description, ...fields } = values;
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
        <Button type="primary" onClick={() => showModal(ModalType.add)}>
          Add
        </Button>
        <Button type="primary" onClick={() => showModal(ModalType.picture)}>
          Random Picture
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
        title="Picture"
        open={showDataModal}
        onCancel={() => handleCancel(ModalType.picture)}
        footer={null}
      >
        <Descriptions>
          <Descriptions.Item label="Author">
            {pictureData?.author}
          </Descriptions.Item>
          <Descriptions.Item label="ID">{pictureData?.id}</Descriptions.Item>
          <Descriptions.Item label="URL">{pictureData?.url}</Descriptions.Item>
          <Descriptions.Item label="DownloadURL">
            {pictureData?.download_url}
          </Descriptions.Item>
          <Descriptions.Item label="Width">
            {pictureData?.width}
          </Descriptions.Item>
          <Descriptions.Item label="Height">
            {pictureData?.height}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        title="Add Form"
        open={isModalOpen}
        onCancel={() => handleCancel(ModalType.add)}
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
