import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import useFetchWithToken from '../../services/api';

const ProjectForm = ({ formData, setFormData, closeModal }) => {
  const [form] = Form.useForm();
  const { postData, putData } = useFetchWithToken('projects');
  const [submitted, setSubmitted] = useState(false); // State to trigger refetch

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      if (formData.id) {
        await putData(values, formData.id);
      } else {
        await postData(values);
      }
      setFormData({});
      closeModal();
      setSubmitted(true); // Trigger refetch after successful form submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false); // Reset submitted state
      // Refetch data here
      // You may fetch data again using the same method you use in the Project component
    }
  }, [submitted]);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a Description' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Points" name="points" rules={[{ required: true, message: 'Please enter Points' }]}>
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

export default ProjectForm;
