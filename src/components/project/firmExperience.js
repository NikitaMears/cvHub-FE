import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ProjectForm from './projectForm'; // Import the ProjectForm component
import useFetchWithToken from '../../services/api';
import { NavLink } from "react-router-dom";

const FirmExperience = () => {
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: projectData, loading, error, refetchData } = useFetchWithToken('projects');

  const handleAddProject = () => {
    setFormData({});
    setProjectModalVisible(true);
  };

  const handleEditProject = (record) => {
    setFormData(record);
    setProjectModalVisible(true);
  };

  const handleDeleteProject = (projectId) => {
    // Implement deletion logic
  };

  const closeModal = () => {
    setProjectModalVisible(false);
  };

  const projectColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Worth', dataIndex: 'worth', key: 'worth' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditProject(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProject(record.id)}
            style={{ marginRight: 8 }}

          >
            Delete
          </Button>
          <Button
            type="link"
          >
 <NavLink to={`/firmExperienceDetails/${record.id}`} style={{ color: 'green' }}>
          <InfoCircleOutlined /> &nbsp;Details
        </NavLink>          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProject}>
              Add Firm Experience
            </Button>
          </Col>
          <Col span={24}>
            {error && <div>Error: {error}</div>}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table dataSource={projectData} columns={projectColumns} pagination={{ pageSize: 5 }} />
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title={formData.id ? 'Edit Firm Experience' : 'Add Firm Experience'}
        visible={projectModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        footer={null}
        width={800} // Adjust the width here as needed

      >
        {/* Make sure refetchData is passed as a prop */}
        <ProjectForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
      </Modal>
    </div>
  );
};

export default FirmExperience;
