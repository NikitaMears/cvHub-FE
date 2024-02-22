import React from 'react';
import { Checkbox, Row, Col } from 'antd';

const PermissionSelection = ({ permissions, selectedPermissions, onChange }) => {
  const handleChange = (checkedValues) => {
    const updatedPermissions = permissions.filter(permission =>
      checkedValues.includes(permission.id)
    );
    onChange(updatedPermissions);
  };

  // Extract the IDs of the selected permissions
  const selectedPermissionIds = selectedPermissions.map(permission => permission.permission_id);

  return (
    <Checkbox.Group onChange={handleChange} value={selectedPermissionIds}>
      <Row gutter={16}>
        {permissions.map((permission) => (
          <Col span={8} key={permission.id}>
            <Checkbox
              value={permission.id}
              checked={selectedPermissionIds.includes(permission.id)}
            >
              {permission.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
};

export default PermissionSelection;
