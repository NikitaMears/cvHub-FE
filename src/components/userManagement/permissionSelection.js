import React from 'react';
import { Checkbox, Row, Col } from 'antd';

const PermissionSelection = ({ permissions, selectedPermissions, onChange }) => {
  const handleChange = (checkedValues) => {
    // Filter out the selected permissions based on the checkedValues
    const updatedPermissions = permissions.filter(permission =>
      checkedValues.includes(permission.id)
    );
    onChange(updatedPermissions);
  };

  const selectedPermissionIds = selectedPermissions.map(permission => permission.id);

  return (
    <Checkbox.Group onChange={handleChange} value={selectedPermissionIds}>
      <Row gutter={16}>
        {permissions.map((permission) => (
          <Col span={8} key={permission.id}>
            <Checkbox value={permission.id}>
              {permission.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
};

export default PermissionSelection;
