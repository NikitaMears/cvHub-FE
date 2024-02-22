import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import PermissionSelection from './permissionSelection';

const RoleForm = ({ formData, setFormData, onClose }) => {
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    form.setFieldsValue(formData);
    console.log("aksdksamd", formData)
    setSelectedPermissions(formData.permissions || []);
  }, [formData, form]);

  useEffect(() => {
    // Fetch permissions from the API
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await fetch('http://localhost:3001/permissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPermissions(data);
      } else {
        throw new Error(data.message || 'Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error(error.message || 'Failed to fetch permissions');
    }
  };

  
  const handleSaveRole = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      let url = 'http://localhost:3001/roles';
      let method = 'POST';
      if (formData.id) {
        url = `http://localhost:3001/roles/${formData.id}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Role saved successfully');
        setFormData({});
        onClose(); // Close the modal
      } else {
        throw new Error(data.message || 'Failed to save role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      message.error(error.message || 'Failed to save role');
    }
  };

  return (
    <Form form={form} onFinish={handleSaveRole} layout="vertical">
      <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Please enter role name' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="permissions" label="Permissions">
        <PermissionSelection permissions={permissions} selectedPermissions={selectedPermissions} onChange={setSelectedPermissions} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
