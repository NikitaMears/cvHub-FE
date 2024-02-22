import { useState, useEffect } from "react";
import {
  Row,
  Tag,
  Col,
  Card,
  Upload,
  message,
  Descriptions,
} from "antd";
import { useParams } from "react-router-dom";

import profilavatar from "../../assets/images/face-1.jpg";

function CvDetail() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // Get the ID parameter from the URL

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/cvs/${id}`) // Fetch data for the dynamic ID
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
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(false);
      return;
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row gutter={[24, 0]}>
          <Col span={24} md={12} className="mb-24">
            <div style={{ height: "100%" }}>
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">Profile Information</h6>}
                className="header-solid h-full card-profile-information"
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <Descriptions >
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
              </Card>
            </div>
          </Col>
          <Col span={24} md={12} className="mb-24">
            <Card
              bordered={false}
              className="header-solid h-full"
              title={<h6 className="font-semibold m-0">Details</h6>}
            >
              <ul className="list settings-list">
                <li>
                  <h6 className="list-header text-sm text-muted">Status</h6>
                </li>
                <li>
                  <Tag color="#4caf50" key="Available" style={{ color: '#ffffff' }}>
                    Available
                  </Tag>
                </li>
                <li>
                  <h6 className="list-header text-sm text-muted m-0">
                    Interests
                  </h6>
                </li>
                <li>
                  <Tag color="#4caf50" key="Available" style={{ color: '#ffffff' }}>
                    {cvData && cvData.researchInterest}
                  </Tag>
                </li>
                <li>
                  <h6 className="list-header text-sm text-muted m-0">
                    Price Average
                  </h6>
                </li>
                <li>
                  <Tag color="#4caf50" key="Available" style={{ color: '#ffffff' }}>
                    {cvData && cvData.priceAverage}
                  </Tag>
                </li>
              </ul>
            </Card>
          </Col>
             {/* Summary */}
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
      )}
    </>
  );
}

export default CvDetail;


  