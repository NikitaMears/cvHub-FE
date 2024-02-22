import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const PermissionForm = ({ formData, setFormData }) => {
    const [form] = Form.useForm();
  
    useEffect(() => {
      form.setFieldsValue(formData);
    }, [formData, form]);
  
    const handleSavePermission = () => {
      // Implement save/update logic and update permissionData state
      // Example: savePermission(formData).then(() => setPermissionModalVisible(false));
    };
  
    return (
      <Form form={form} onFinish={handleSavePermission} layout="vertical">
        <Form.Item name="name" label="Permission Name" rules={[{ required: true, message: 'Please enter permission name' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  };

  export default PermissionForm;