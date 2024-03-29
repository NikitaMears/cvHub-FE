import React, { useState, useEffect } from "react";
import { Row, Col, Card, Upload, message, Descriptions, Button, Tag, Table } from "antd";
import { useParams } from "react-router-dom";
import { Avatar } from 'antd';
import { UserOutlined, ToTopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { NavLink } from "react-router-dom";

function FirmExperienceDetail() {
  const [fileList, setFileList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const { id } = useParams(); 
  const { data: firmData, loading, postFormData } = useFetchWithToken(`projects/${id}`); // Fetch firm details using useFetchWithToken hook

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projectCvs/${id}`);
        if(response.status == 200 ){
            const data = await response.json();
            console.log(data)
            setTeamMembers(data);
        }
     
      } catch (error) {
        setTeamMembers([]);
      }
    };

    fetchTeamMembers();
  }, [id]);
  const docs2 = [
    { uri: "https://docs.google.com/document/d/1tl99rMUJauJCwGzkQvjIiKnLDgp7XSUl/export?format=docx", fileType:"docx", fileName:"demo.docx" },
  //  { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const dataSource = teamMembers.map((member) => ({
    position: member.cvProjectInfo.position,
    expertName: member.associatedCv.expertName,
    country: member.associatedCv.country,
    contactInformation: member.associatedCv.contactInformation,
    // Add more fields as needed
  }));
  
  console.log("ds", dataSource)
  const columns = [
  
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
    {
      title: 'Location',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Contact Information',
      dataIndex: 'contactInformation',
      key: 'contactInformation',
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'More',
        key: 'more',
        dataIndex: 'id',
        render: (text, record) => (
          <NavLink to={`/cvpDetails/${record.id}`} style={{ color: 'green' }}>
            <InfoCircleOutlined /> &nbsp;Details
          </NavLink>
        ),
      }
    // Add more columns as needed
  ];


  const beforeUpload = (file) => {
    setFileList([file]);
    return false; // Returning false prevents default upload behavior
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      await postFormData(formData, `uploadFirmExperience/${id}`); // Upload firm experience using postFormData function from useFetchWithToken hook
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
                  title={<h6 className="font-semibold m-0">Firm Information</h6>}
                  className="header-solid h-full card-profile-information"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  {/* Firm Icon */}
                 
                  {/* Firm Information */}
                  <Descriptions style={{ marginTop: '60px' }}>
                    <Descriptions.Item label="Title" span={3}>
                      {firmData && firmData.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Client" span={3}>
                      {firmData && firmData.client}
                    </Descriptions.Item>

                    <Descriptions.Item label="Worth" span={3}>
                      {firmData && firmData.worth}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration" span={3}>
                      {firmData && firmData.duration}
                    </Descriptions.Item>
                    <Descriptions.Item label="Project Type" span={3}>
                      {firmData && firmData.projectType}
                    </Descriptions.Item>
                    {/* Add more firm details here */}
                  </Descriptions>
                </Card>
              </div>
            </Col>
            {/* Upload Firm Experience */}
            <Col span={24} md={12} className="mb-24">
              <Card bordered={false} className="header-solid h-full">
                {firmData && firmData.file && (
                  <>
                    <h4>Firm Experience Preview:</h4>
                    {firmData.file.endsWith('.pdf') ? (
                      // If PDF file, render the iframe for preview
                      <iframe title="Firm Experience" src={`http://localhost:3001/${firmData.file}`} style={{ width: "100%", height: "400px" }}></iframe>
                    ) : firmData.file.endsWith('.docx') || firmData.file ? (
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
                title={<h6 className="font-semibold m-0">Summary</h6>}
                className="header-solid h-full"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <p className="text-dark">
                  {firmData && firmData.summary}
                </p>
              </Card>
            </Col>
          </Row>
          {/* Associated Projects */}
          <Row gutter={[24, 0]}>
            <Col span={24} md={24} className="mb-24">
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">Associated Team Members</h6>}
                className="header-solid h-full"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.id} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default FirmExperienceDetail;
