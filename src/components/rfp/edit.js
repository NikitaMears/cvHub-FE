import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EditRFPForm = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      issuedOn: moment(formData.issuedOn) // Convert to moment object for DatePicker
    });
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      // Update the existing RFP data
      // You should implement the update functionality according to your API
      console.log('Updated RFP data:', values);
      closeModal();
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
      // Trigger refetch data after successful update
      refetchData();
    }
  }, [submitted, refetchData]);

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
        <Col span={12}>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a Status' }]}>
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditRFPForm;
