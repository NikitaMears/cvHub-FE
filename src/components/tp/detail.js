import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag } from "antd";
import { useParams } from "react-router-dom";
import { ToTopOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

function TpDetail() {
  const [fileList, setFileList] = useState([]);
  const { id } = useParams();
  console.log("khkjh", id)
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const { data: tpData, loading, error, postFormData } = useFetchWithToken(`tps/${id}`);
  const [previewUrl, setPreviewUrl] = useState('');

  const beforeUpload = (file) => {
    setFileList([file]);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadTP/${id}`);
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("File upload failed!");
      setFileList([]);
    }
  };

  useEffect(() => {
    if (tpData && tpData.title) {
      // Ensure tpData is not null or undefined before accessing its properties
      if (tpData.file) {
        setPreviewUrl(`http://localhost:3001/${tpData.file}`);
      }
    }
  }, [tpData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {/* Profile Information */}
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">TP Information</h6>}
            className="header-solid h-full"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
  <Descriptions style={{ marginTop: '60px' }}>
  <Descriptions.Item label="Title" span={3}>
    {tpData && tpData.title}
  </Descriptions.Item>
  <Descriptions.Item label="RFP Id" span={3}>
    {tpData && tpData.rfpId}
  </Descriptions.Item>
  <Descriptions.Item label="Client" span={3}>
    {tpData && tpData.client}
  </Descriptions.Item>
  <Descriptions.Item label="Year" span={3}>
    {tpData && tpData.year}
  </Descriptions.Item>
  <Descriptions.Item label="Members" span={3}>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Expert Name</th>
          <th>Country</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tpData && tpData.members && tpData.members.map(member => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.expertName}</td>
            <td>{member.country}</td>
            <td>
              <a href={`/cvDetails/${member.id}`}>Details</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Descriptions.Item>
</Descriptions>

          </Card>
        </Col>
        <Col span={24} md={12} className="mb-24">
          <Card bordered={false} className="header-solid h-full">
            <h4>TP Preview:</h4>
            <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs2}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: true,
                  retainURLParams: false
                }
              }}
              style={{ height: 500 }}
            />
            <div className="mt-4">
              <Upload
                beforeUpload={beforeUpload}
                fileList={fileList}
                maxCount={1}
                accept=".docx,.pdf"
              >
                <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} >
                  Upload File
                </Button>
              </Upload>
              <Button onClick={handleUpload} hidden={!fileList.length}>Submit</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default TpDetail;
