import React, { useState, useEffect } from "react";
import { Row, Tag, Col, Card, Upload, message, Descriptions, Button } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios"; 
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ToTopOutlined } from "@ant-design/icons";

function CvDetail() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/cvs/${id}`) 
      .then((response) => response.json())
      .then((data) => {
        setCvData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching CV details:", error);
        setLoading(false);
      });
  }, [id]); //

  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };
  // const renderFilePreview = () => {
  //   if (cvData && cvData.cv && cvData.cv !== "N/A") {
  //     return (
  //       <Button type="link" href={`http://localhost:3001/${cvData.cv}`} target="_blank">
  //         View CV
  //       </Button>
  //     );
  //   } else {
  //     return <p>No CV available</p>;
  //   }
  // };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    axios.post(`http://localhost:3001/uploadCV/${id}`, formData)
      .then(response => {
        message.success("File uploaded successfully!");
        setFileList([]);

        // You may want to update state or take other actions upon successful upload
      })
      .catch(error => {
        message.success("File uploaded successfully!");
        setFileList([]);


        console.error("Error uploading file:", error);
      });
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
        {/* Profile Information, Details, and CV Preview & Upload */}
        <Row gutter={[24, 0]}>
  {/* Profile Information */}
  <Col span={24} md={12} className="mb-24">
    <div style={{ height: "100%" }}>
  
<Card
  bordered={false}
  title={<h6 className="font-semibold m-0">Profile Information</h6>}
  className="header-solid h-full card-profile-information"
  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
>
  {/* User Icon */}
  <div style={{ textAlign: 'center', marginBottom: 16 }}>
    <Avatar size={250} color={'blue'} icon={<UserOutlined /> } style={{ backgroundColor: '#1890ff' }}/>
  </div>

  {/* Profile Information */}
  <Descriptions style={{marginTop:'60px'}}>
    <Descriptions.Item label="Full Name" span={3}>
      {cvData && cvData.expertName}
    </Descriptions.Item>
    <Descriptions.Item label="Contact Information" span={3}>
      {cvData && cvData.contactInformation}
    </Descriptions.Item>
    <Descriptions.Item label="Location" span={3}>
      {cvData && cvData.country}
    </Descriptions.Item>
  </Descriptions>

  {/* Tags */}
  <div>
    <Tag color="#52c41a">Available</Tag>
    <Tag color="#1890ff">{cvData && cvData.researchInterest}</Tag>
    <Tag color="#faad14">{cvData && cvData.priceAverage}</Tag>
  </div>
</Card>

  
    </div>
  </Col>

<Col span={24} md={12} className="mb-24">
  <Card bordered={false} className="header-solid h-full">
    {cvData && cvData.cv && (
      <>
        <h4>CV Preview:</h4>
        {cvData.cv.endsWith('.pdf') ? (
          // If PDF file, render the iframe for preview
          <iframe title="No CV" src={`http://localhost:3001/${cvData.cv}`} style={{ width: "100%", height: "400px" }}></iframe>
        ) : cvData.cv.endsWith('.docx') ? (
          // If DOCX file, render using Google Docs viewer for preview
          <div style={{ width: "100%", height: "400px" }}>
            <iframe title="CV Preview" src={`https://docs.google.com/viewer?url=http://localhost:3001/${cvData.cv}&embedded=true`} style={{ width: "100%", height: "100%" }}></iframe>
          </div>
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
              title={<h6 className="font-semibold m-0">Summary</h6>}
              className="header-solid h-full"
              bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
            >
              <p className="text-dark">
                {cvData && cvData.cvSummary}
              </p>
            </Card>
          </Col>
        </Row>
      </>
      
      
      )}
    </>
  );
}

export default CvDetail;
