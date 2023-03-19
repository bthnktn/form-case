import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Descriptions, Layout, Button } from "antd";

interface DataType {
  key: string;
  formName: string;
  description: string;
  createdAt: string;
  fields: { name: string; surname: string; age: number };
}

const FormDetail: React.FC = () => {
  const router = useRouter();
  const [formItems, setFormItems] = useState<DataType>();
  const { formName } = router.query;
  const { Content } = Layout;

  useEffect(() => {
    const local = localStorage.getItem("items");
    if (local) {
      const parsedLocalData: DataType[] = JSON.parse(local);
      setFormItems(
        parsedLocalData.find((item) => item.formName.toLowerCase() === formName)
      );
    }
  }, [formName]);

  const routeHome = () => {
    router.push("/");
  };

  return formItems ? (
    <div
      style={{
        margin: 20,
        backgroundColor: "aliceblue",
        padding: 30,
        borderRadius: 8,
      }}
    >
      <Button type="primary" onClick={routeHome} style={{ marginBottom: 20 }}>
        Back
      </Button>

      <Descriptions title="Form Info">
        <Descriptions.Item label="Form Name">
          {formItems.formName}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {formItems.description}
        </Descriptions.Item>
        <Descriptions.Item label="CreatedAt">
          {new Date(formItems.createdAt).toLocaleString("en-US")}
        </Descriptions.Item>
        <Descriptions.Item label="Name">
          {formItems.fields.name}
        </Descriptions.Item>
        <Descriptions.Item label="Surname">
          {formItems.fields.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Age">
          {formItems.fields.age}
        </Descriptions.Item>
      </Descriptions>
    </div>
  ) : (
    <></>
  );
};

export default FormDetail;
