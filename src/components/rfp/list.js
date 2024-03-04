import React, { useState, useEffect } from "react";
import { Table, Card, Upload, message, Input, Row, Col, Modal, Button } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import RFPForm from "./create";
import EditRFPForm from "./edit";
import moment from 'moment';

const { Search } = Input;

function RFPList() {
  const [RFPModalVisible, setRFPModalVisible] = useState(false);
  const [RFPEModalVisible, setRFPEModalVisible] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: rfpData, postFormData, refetchData } = useFetchWithToken("rfps");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup function
      // Cancel any subscriptions or clear async tasks here
    };
  }, []);

  const handleAddRFP = () => {
    setFormData({});
    setRFPModalVisible(true);
  };

  const handleEditRFP = (record) => {
    setFormData(record);
    setRFPModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log("Edit button clicked", record);
    setEditMode(true);
    const formattedIssuedOn = moment(record.issuedOn).format('YYYY-MM-DD');
    console.log("fgf", formattedIssuedOn)
    setFormData({ ...record, issuedOn: formattedIssuedOn});
    setRFPEModalVisible(true);
  };
  
console.log(RFPEModalVisible)

console.log(editMode)
  const closeModal = () => {
    setEditMode(false);
    setFormData(null);
    setRFPModalVisible(false);
    setRFPEModalVisible(false);

  };

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await postFormData(formData, 'uploadRFP');
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
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
        <Button onClick={() => confirm()} size="small" style={{ width: 90 }}>Search</Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>Reset</Button>
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
    // {
    //   title: "Issued On",
    //   dataIndex: "issuedOn",
    //   key: "issuedOn",
    //   ...getColumnSearchProps("issuedOn")
    // },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
      )
    },
    {
      title: "More",
      key: "more",
      dataIndex: "id",
      render: (text, record) => <NavLink to={`/rfpDetails/${record.id}`}>Details</NavLink>
    }
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
       
        <Col xs={24} xl={24}>
          <Card>
          <Col span={12}>
          <NavLink to="#" onClick={handleAddRFP} className="ant-btn ant-btn-primary" role="button">
           Add RFP
          </NavLink>
        </Col>
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
            title={'Add RFP'}
            visible={RFPModalVisible}
            onCancel={closeModal}
            footer={null}
          >
            <RFPForm formData={formData} setFormData={setFormData} closeModal={closeModal} refetchData={refetchData} />
        
          </Modal>
          <Modal
            title={'Edit RFP'}
            visible={RFPEModalVisible}
            onCancel={closeModal}
            footer={null}
          >
            {editMode && (
              <EditRFPForm
                formData={formData}
                setFormData={setFormData}
                visible = {RFPEModalVisible}
                closeModal={closeModal}
                refetchData={() => {
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
