import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { NavLink } from "react-router-dom";

const { Text } = Typography;

const CvList = ({rfpId}) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(`http://localhost:3001/rfpsCvs/${rfpId}`);
        const data = await response.json();
        setCvs(data);
        setLoading(false);
        setPagination(prevState => ({ ...prevState, total: data.length }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [rfpId]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'Expert Name',
      dataIndex: 'expertName',
      key: 'expertName',
    },
   
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Research Interest',
      dataIndex: 'researchInterest',
      key: 'researchInterest',
    },
 

    {
      title: 'Price Average',
      dataIndex: 'priceAverage',
      key: 'priceAverage',
    },
    {
      title: 'Average Score',
      dataIndex: 'averagePoints',
      key: 'averagePoints',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <NavLink to={`/cvDetails/${record.id}`}>Details</NavLink>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cvs}
      rowKey="id"
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default CvList;
