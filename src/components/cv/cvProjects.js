import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Select, Input, message } from 'antd';
import useFetchWithToken from '../../services/api'; // Import the useFetchWithToken hook

const { Option } = Select;

const CvProjects = ({ cvId }) => {
  const [projects, setProjects] = useState([]);
  const [cvProjects, setCVProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [points, setPoints] = useState('');
  const [position, setPosition] = useState('');

  const { data: allProjects, loading, error } = useFetchWithToken('projects'); // Fetch all projects using useFetchWithToken hook
  const { data: allCVProjects } = useFetchWithToken(`cvProjects/${cvId}`); // Fetch all CV projects using useFetchWithToken hook
  const { postData } = useFetchWithToken('cvProjects2');

  useEffect(() => {
    if (allProjects) {
      setProjects(allProjects);
    }
  }, [allProjects]);

  useEffect(() => {
    if (allCVProjects) {
      setCVProjects(allCVProjects);
    }
  }, [allCVProjects]);

  const handleAddProject = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
  };

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };
  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const onFinish = async () => {
    try {
      // Send data to the /cvProjects endpoint
      const data = { cvId:cvId, projectId: selectedProject, points: points, position: position };
      await postData(data);
  
      // Display success message and close the modal
      message.success('Project associated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error associating project:', error);
      message.error('Failed to associate project. Please try again.');
    }
  };
  

  const columns = [
    { title: 'ID', dataIndex: ['associatedProjectInfo', 'id'], key: 'id' },
    { title: 'Project Title', dataIndex: ['associatedProjectInfo', 'title'], key: 'title' },
    { title: 'Position', dataIndex: ['cvProjectInfo', 'position'], key: 'position' },
    { title: 'Points', dataIndex: ['cvProjectInfo', 'points'], key: 'points' },
  ];
  

  return (
    <div>
      <Button type="primary" onClick={handleAddProject}>
        Add Project
      </Button>
      <Table dataSource={cvProjects} columns={columns} loading={loading} rowKey="ProjectId" />
      <Modal
        title="Add Project to CV"
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            label="Project"
            name="project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select style={{ width: '100%' }} onChange={handleProjectChange}>
              {projects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Position" name="position" onChange={handlePositionChange} value={position} rules={[{ required: true, message: 'Please enter a Position' }]}>
                  <Input />
                </Form.Item>
          <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: 'Please enter points' }]}
          >
            <Input type="number" max={5} min={1} onChange={handlePointsChange} value={points} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Associate Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CvProjects;
