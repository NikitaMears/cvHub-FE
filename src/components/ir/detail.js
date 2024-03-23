import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag, Table } from "antd";
import { useParams } from "react-router-dom";
import { Avatar } from 'antd';
import { UserOutlined, ToTopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { NavLink } from "react-router-dom";

function IRDetail() {
  const [fileList, setFileList] = useState([]);
  const { id } = useParams(); 
  const { data: irData, loading, postFormData } = useFetchWithToken(`irs/${id}`); // Fetch firm details using useFetchWithToken hook
console.log("ird", irData)

  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];

  



  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadIr/${id}`); // Upload firm experience using postFormData function from useFetchWithToken hook
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error("Failed to upload file");
      setFileList([]);
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Firm Information */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={12} className="mb-24">
              <div style={{ height: "100%" }}>
                <Card
                  bordered={false}
                  title={<h6 className="font-semibold m-0">IR Details</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  {/* Firm Icon */}
                 
                  {/* Firm Information */}
                  <Descriptions style={{ marginTop: '60px' }}>
                    <Descriptions.Item label="Title" span={3}>
                      {irData && irData.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="RFP No" span={3}>
                      {irData && irData.rfpNo}
                    </Descriptions.Item>

               
      {/* {irData.rfpId !== 'N/A' && irData.rfpId !== null && (
        <Descriptions.Item label="RFP" span={3}>
          <NavLink to={`/rfpDetails/${irData.rfpId}`}>Go to RFP</NavLink>
        </Descriptions.Item>
      )} */}

                   
                    {/* Add more firm details here */}
                  </Descriptions>
                </Card>
              </div>
            </Col>
            {/* Upload Firm Experience */}
            <Col span={24} md={12} className="mb-24">
              <Card bordered={false} className="header-solid h-full">
                {irData && irData.file && (
                  <>
                    <h4>IR Preview:</h4>
                    {irData.file.endsWith('.pdf') ? (
                      // If PDF file, render the iframe for preview
                      <iframe title="Firm Experience" src={`http://localhost:3001/${irData.file}`} style={{ width: "100%", height: "400px" }}></iframe>
                    ) : irData.file.endsWith('.docx') || irData.file ? (
                      // If DOCX file, render using Google Docs viewer for preview
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
                    ) : (
                      // If other file formats, display a message or handle accordingly
                      <p>Unsupported file format</p>
                    )}
                  </>
                )}
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
          {/* Summary */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={24} className="mb-24">
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">Content</h6>}
                className="header-solid h-full"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <p className="text-dark">
                  {irData && irData.content}
                </p>
              </Card>
            </Col>
          </Row>
          {/* Associated Projects */}
         
        </>
      )}
    </>
  );
}

export default IRDetail;
