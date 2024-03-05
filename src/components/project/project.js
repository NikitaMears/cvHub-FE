import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProjectForm from './projectForm'; // Import the ProjectForm component
import useFetchWithToken from '../../services/api';

const Project = () => {
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
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Points', dataIndex: 'points', key: 'points' },
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
      >
        {/* Make sure refetchData is passed as a prop */}
        <ProjectForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
      </Modal>
    </div>
  );
};

export default Project;
