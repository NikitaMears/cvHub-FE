import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RoleForm from './roleForm';

const Role = () => {
  const [roleData, setRoleData] = useState([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const roleColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {permissions.map(permission => (
            <div key={permission.permission_id}>{permission.permission_name}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  

  useEffect(() => {
    fetchRoles();
  }, []);
  // const handleCloseModal = () => {
  //   setVisible(false);
  // };
  // const fetchRoles = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('Token not found');
  //     }
  //     setLoading(true);
  //     const response = await fetch('http://localhost:3001/roles', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       const formattedData = data.map(role => ({
  //         ...role,
  //         permissions: role.Permissions.map(permission => permission.name),
  //       }));
  //       setRoleData(formattedData);
  //     } else {
  //       throw new Error(data.message || 'Failed to fetch roles');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching roles:', error);
  //     message.error(error.message || 'Failed to fetch roles');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      setLoading(true);
      const response = await fetch('http://localhost:3001/roles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        const formattedData = data.map(role => ({
          id: role.id,
          name: role.name,
          permissions: role.Permissions.map(permission => ({
            permission_id: permission.id, // Include permission id
            permission_name: permission.name, // Include permission name
          })),
        }));
        setRoleData(formattedData);
      } else {
        throw new Error(data.message || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error(error.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleAddRole = () => {
    setFormData({});
    setRoleModalVisible(true);
  };

  const handleEditRole = (record) => {
    setFormData(record);
    setRoleModalVisible(true);
  };

  const handleDeleteRole = async (roleId) => {
    // Implement deletion logic if needed
    // You can make a DELETE request to the API to delete the role
    // Remember to handle loading and error states accordingly
  };

  return (
    <div>
      <Card title="Role Management">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
              Add Role
            </Button>
          </Col>
          <Col span={24}>
            <Table
              dataSource={roleData}
              columns={roleColumns}
              pagination={{ pageSize: 5 }}

              loading={loading}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit Role' : 'Add Role'}
        visible={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
      >
        <RoleForm formData={formData} setFormData={setFormData} onClose={()=> setRoleModalVisible(false)}/>
      </Modal>
    </div>
  );
};

export default Role;
