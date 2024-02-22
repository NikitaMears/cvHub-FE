// UserForm.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import Password from 'antd/lib/input/Password';

const { Option } = Select;

const UserForm = ({ formData, setFormData, closeModal }) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    // Fetch roles from localhost:3001/roles
    fetch('http://localhost:3001/roles',
    { method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },})
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []);
  // const onFinish = (values) => {
  //   // Handle form submission (add/edit logic)
  //   console.log('Received values:', values);
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     throw new Error('Token not found');
  //   }
  //   // Make a POST request to submit the form data
  //   fetch('http://localhost:3001/users', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(values),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Success:', data);
  //       // Close the modal or handle success as needed
  //       setFormData({});
  //       closeModal(); // Close the modal after saving
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //       // Handle error as needed
  //     });
  // };


  const onFinish = (values) => {
    // Handle form submission (add/edit logic)
    console.log('Received values:', values);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    let url = 'http://localhost:3001/users';
    let method = 'POST'; // Default to POST method for new user creation
  
    // Check if formData contains an ID (indicating editing an existing user)
    if (formData && formData.id) {
      url += `/${formData.id}`; // Append the ID to the URL
      method = 'PUT'; // Change method to PUT for updating existing user
    }
  
    // Make a POST or PUT request to submit the form data
    fetch(url, {
      method: method, // Use the determined method
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Close the modal or handle success as needed
        setFormData({});
        closeModal(); // Close the modal after saving
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error as needed
      });
  };
  
  useEffect(() => {
    // Set form data when formData changes
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter a First Name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter a Last Name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an Email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Please enter a Phone Number' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a Password' }]}>
        <Password />
      </Form.Item>
      <Form.Item label="Role" name="RoleId" rules={[{ required: true, message: 'Please select a Role' }]}>
        <Select>
          {roles.map(role => (
            <Option key={role.id} value={role.id}>{role.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a Status' }]}>
        <Select>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
