import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Upload } from 'antd';
import useFetchWithToken from '../../services/api';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const RFPForm = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const { data: roles, loading: rolesLoading, error: rolesError } = useFetchWithToken('roles');
  const { postData, putData, postFormData } = useFetchWithToken('rfps');
  const [submitted, setSubmitted] = useState(false); // State to trigger refetch

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      // Append the file to the form values
      const formDataWithFile = { ...values, file: values.file?.file || formData.file };
  
      if (formData.id) {
        await putData(formDataWithFile, formData.id);
      } else {
        // Use the postFormData function to upload the form data including the file
        await postFormData(formDataWithFile, 'uploadCompleteRFP');
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
       // Refetch data after form submission
    }
  }, [submitted]);

  if (rolesError) {
    return <div>Error: {rolesError}</div>;
  }

  if (rolesLoading) {
    return <div>Loading roles...</div>;
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="RFP Number" name="rfpNo" rules={[{ required: true, message: 'Please enter an RFP Number' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Please enter a Client' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please enter a Country' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Issued On" name="issuedOn" rules={[{ required: true, message: 'Please enter an Issued On date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Objectives" name="objectives" rules={[{ required: true, message: 'Please enter Objectives' }]}>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Specific Objectives" name="specificObjectives" rules={[{ required: true, message: 'Please enter Specific Objectives' }]}>
            <Input.TextArea />
          </Form.Item>
        </Col>
<Col>
    <Form.Item
      label="File"
      name="file"
      rules={[{ required: true, message: 'Please upload a file' }]}
    >
      <Upload beforeUpload={() => false} name="file">
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  </Col>

        {/* <Col span={12}>
          <Form.Item label="File" name="file" rules={[{ required: true, message: 'Please enter a File' }]}>
            <Input type="file" />
          </Form.Item>
        </Col> */}
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RFPForm;
