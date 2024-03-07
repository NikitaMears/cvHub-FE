import React, { useState, useEffect } from "react";
import { Table, Card, Upload, message, Input, Row, Col, Button, Modal } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import moment from "moment";
import CreateTp from "./create"; // Import the CreateTp form
import EditTp from "./edit";

const { Search } = Input;

function TpList() {
  const [uploading, setUploading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const { data: tpsData, postFormData, refetchData } = useFetchWithToken("tps");
  const [editMode, setEditMode] = useState(false);

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await postFormData(formData, "upload");
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (record) => {
    console.log("e", record)

    setEditData(record);
    setEditMode(true)
    setShowCreateModal(true);
  };

  const handleDelete = (record) => {
    // Logic to delete the TP record
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Delete
          </Button>
          <NavLink to={`/tpDetails/${record.id}`}>Details</NavLink>
        </>
      ),
    },
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs={24} xl={24}>
          <Button type="primary" onClick={() => setShowCreateModal(true)}>Add New TP</Button>
          <Card>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={tpsData}
                pagination={{ pageSize: 5 }}
                className="ant-border-space"
              />
            </div>
          </Card>
          <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
              <Upload
                name="file"
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  // Validation logic for file type if needed
                  return true;
                }}
              >
                <Button
                  type="dashed"
                  className="ant-full-box"
                  icon={<ToTopOutlined />}
                  loading={uploading}
                >
                  Click to Upload
                </Button>
              </Upload>
            </div>
            <Modal
              title={editMode ? "Edit TP" : "Create New TP"}
              visible={showCreateModal}
                      width={800} // Adjust the width here as needed

              onCancel={() => {
                setShowCreateModal(false);
                setEditData(null);
              }}
              footer={null}
            >

{editMode ? (
              <EditTp
                formData={editData}
                setFormData={editData}
                closeModal={() => setShowCreateModal(false)}
                refetchData={refetchData}
                        width={800} // Adjust the width here as needed

              />
              ):<CreateTp
              formData={editData}
              setFormData={setEditData}
              closeModal={() => setShowCreateModal(false)}
              refetchData={refetchData}
            />}


            </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TpList;
