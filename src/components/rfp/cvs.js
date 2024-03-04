import React, { useState, useEffect } from 'react';
import { List, Card, Typography } from 'antd';
import { NavLink } from "react-router-dom";

const { Meta } = Card;
const { Text } = Typography;

const CvList = ({rfpId}) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(`http://localhost:3001/rfpsCvs/${rfpId}`);
        const data = await response.json();
        setCvs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
      dataSource={cvs}
      renderItem={cv => (
        <List.Item>
          <Card>
            <Meta
              title={<Text strong>{cv.expertName}</Text>}
              description={
                <div>
                  <Text type="secondary">Serial Number: {cv.serialNumber}</Text>
                  <br />
                  <Text type="secondary">Country: {cv.country}</Text>
                  <br />
                  <Text type="secondary">Research Interest: {cv.researchInterest}</Text>
                  <br />
                  <Text type="secondary">CV: {cv.cv}</Text>
                  <br />
                  <Text type="secondary">Contact Information: {cv.contactInformation}</Text>
                  <br />
                  <Text type="secondary">Price Average: {cv.priceAverage}</Text>
                  <br />
                  <Text type="secondary">Average Score: {cv.averagePoints}</Text>
                  <br />
                  <NavLink to={`/cvDetails/${cv.id}`}>Details</NavLink>
                </div>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default CvList;
