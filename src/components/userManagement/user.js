// User.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from './userForm';

const User = () => {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await fetch('http://localhost:3001/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddUser = () => {
    setFormData({});
    setUserModalVisible(true);
  };

  const handleEditUser = (record) => {
    setFormData(record);
    setUserModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setUserModalVisible(false);
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'firstName' },

    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },

    { 
      title: 'Role', 
      dataIndex: ['Role', 'name'], // Update dataIndex to point to the nested property
      key: 'role' 
    },    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              Add User
            </Button>
          </Col>
          <Col span={24}>
            <Table dataSource={userData} columns={userColumns}   pagination={{ pageSize: 5 }}
 />
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit User' : 'Add User'}
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        <UserForm formData={formData} setFormData={setFormData} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default User;
