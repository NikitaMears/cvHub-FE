import React, { useState } from "react";
import { Table, Card, Upload, message, Button, Input, Row, Col, Tag , Modal} from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import RFPForm from "./create";
import EditRFPForm from "./edit";

const { Search } = Input;

function RFPList() {
  const [RFPModalVisible, setRFPModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({});
  const { data: rfpData, postFormData, refetchData } = useFetchWithToken("rfps");
  const [uploading, setUploading] = useState(false);
  const handleAddRFP = () => {
    setFormData({});
    setRFPModalVisible(true);
  };

  const handleEditRFP = (record) => {
    setFormData(record);
    setRFPModalVisible(true);
  };

  const handleDeleteRFP = (userId) => {
    // Implement deletion logic
  };
  const handleEdit = () => {
    setEditMode(true);
    setFormData(rfpData); // Set the formData with the selected RFP data
  };

  const closeModal = () => {
    setEditMode(false);
    setFormData(null);
  };

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Use the postFormData function to upload the file
      await postFormData(formData, 'uploadRFP');

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      // Handle upload error
      console.log(error);
      message.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Search
          placeholder={`Search ${dataIndex}`}
          allowClear
          size="small"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />

        <Button onClick={() => confirm()} size="small" style={{ width: 90 }}>
          Search
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  });
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ...getColumnSearchProps("title")
    },
    {
      title: "RFP No",
      dataIndex: "rfpNo",
      key: "rfpNo",
      ...getColumnSearchProps("rfpNo")
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      ...getColumnSearchProps("client")
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      ...getColumnSearchProps("country")
    },
    {
      title: "Issued On",
      dataIndex: "issuedOn",
      key: "issuedOn",
      ...getColumnSearchProps("issuedOn")
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleEdit()}>Edit</Button>
      )
    },
        {
      title: "More",
      key: "more",
      dataIndex: "id",
      render: (text, record) => <NavLink to={`/rfpDetails/${record.id}`}>Details</NavLink>
    }
  ];
  
  // const columns = [
  //   {
  //     title: "Title",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "20%",
  //     ...getColumnSearchProps("title")
  //   },
  //   {
  //     title: "RFP No",
  //     dataIndex: "rfpNo",
  //     key: "rfpNo",
  //     ...getColumnSearchProps("rfpNo")
  //   },
  //   {
  //     title: "Client",
  //     dataIndex: "client",
  //     key: "client",
  //     ...getColumnSearchProps("client")
  //   },
  //   {
  //     title: "Country",
  //     dataIndex: "country",
  //     key: "country",
  //     ...getColumnSearchProps("country")
  //   },
  //   {
  //     title: "Issued On",
  //     dataIndex: "issuedOn",
  //     key: "issuedOn",
  //     ...getColumnSearchProps("issuedOn")
  //   },
  //   {
  //     title: "More",
  //     key: "more",
  //     dataIndex: "id",
  //     render: (text, record) => <NavLink to={`/rfpDetails/${record.id}`}>Details</NavLink>
  //   }
  // ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
      <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRFP}>
              Add RFP
            </Button>
          </Col>
        <Col xs={24} xl={24}>
          <Card>
            <div className="table-responsive">
              <Table columns={columns} dataSource={rfpData} pagination={{ pageSize: 5 }} className="ant-border-space" />
            </div>
          </Card>
          <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
              <Upload
                name="file"
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  const isExcel = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                  if (!isExcel) {
                    message.error("You can only upload Excel files!");
                  }
                  return true;
                }}
              >
                <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} loading={uploading}>
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </Card>
          <Modal
  title={formData.id ? 'Edit RFP' : 'Add RFP'}
  visible={RFPModalVisible}
  onCancel={() => setRFPModalVisible(false)}
  footer={null}
>
  {/* Make sure refetchData is passed as a prop */}
  <RFPForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
  {editMode && (
        <EditRFPForm
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          refetchData={() => {
            // Implement a function to refetch the RFP list data
            console.log('Refetching RFP data...');
          }}
        />
      )}
</Modal>

        </Col>
      </Row>
    </div>
  );
}

export default RFPList;
