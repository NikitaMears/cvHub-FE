import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Upload, Checkbox } from 'antd';
import useFetchWithToken from '../../services/api';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateTp = ({ formData, setFormData, closeModal, refetchData }) => {
  const [form] = Form.useForm();
  const { data: rfps, loading: rfpsLoading, error: rfpsError } = useFetchWithToken('rfps');
  const [cvs, setCvs] = useState([]);
  const { postData, putData, postFormData } = useFetchWithToken('tps');
  const [submitted, setSubmitted] = useState(false); // State to trigger refetch

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = async (values) => {
    try {
      const formDataWithFile = { ...values, file: values.file?.file || formData.file };

   
        await postFormData(formDataWithFile, 'uploadTP');
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
    }
  }, [submitted]);

  const handleRfpChange = async (value) => {
    const response = await fetch(`http://localhost:3001/rfpsCvs/${value}`);
    const data = await response.json();
    setCvs(data);
    const selectedRfp = rfps.find(rfp => rfp.id === value);
    if (selectedRfp) {
      form.setFieldsValue({
        client: selectedRfp.client,
        year: selectedRfp.issuedOn ? new Date(selectedRfp.issuedOn).getFullYear() : null,
      });
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="RFP" name="rfpId" rules={[{ required: true, message: 'Please select an RFP' }]}>
            <Select placeholder="Select RFP" loading={rfpsLoading} disabled={rfpsError} onChange={handleRfpChange}>
              {rfps &&
                rfps.map(rfp => (
                  <Option key={rfp.id} value={rfp.id}>
                    {rfp.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a Title' }]}>
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
          <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Please enter a Year' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
      <Col span={12}>
          <Form.Item label="TIN" name="tin" rules={[{ required: true, message: 'Please enter a TIN No' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="File" name="file" rules={[{ required: true, message: 'Please upload a file' }]}>
            <Upload beforeUpload={() => false} name="file">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Members" name="members">
            <Checkbox.Group>
              {cvs.map(cv => (
                <Checkbox key={cv.id} value={cv.id}>
                  {cv.expertName}
                </Checkbox>
              ))}
            </Checkbox.Group>
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

export default CreateTp;