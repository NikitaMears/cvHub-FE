import React, { useState } from "react";
import { Table, Card, Upload, message, Button, Input, Row, Col, Tag } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined } from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
// import postFormData from "../../services/api"

const { Search } = Input;

function CvList() {
  const { data: cvData,postFormData } = useFetchWithToken("cvs");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Use the postFormData function to upload the file
      await postFormData(formData, 'upload');

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
      setUploading(false)
    } catch (error) {
      // Handle upload error
      console.log(error)
      message.success(`${file.name} uploaded successfully`);
      setUploading(false)

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
      title: "CV Holder Name",
      dataIndex: "expertName",
      key: "expertName",
      width: "20%",
      ...getColumnSearchProps("expertName")
    },
    {
      title: "Location",
      dataIndex: "country",
      key: "country",
      ...getColumnSearchProps("country")
    },
    {
      title: "Research Interest",
      dataIndex: "researchInterest",
      key: "researchInterest",
      ...getColumnSearchProps("researchInterest")
    },
    {
      title: "Average Daily Rate",
      dataIndex: "priceAverage",
      key: "priceAverage",
      ...getColumnSearchProps("priceAverage")
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <Tag color="#4caf50" key="Available">
          Available
        </Tag>
      )
    },
    {
      title: "More",
      key: "more",
      dataIndex: "id",
      render: (text, record) => <NavLink to={`/cvDetails/${record.id}`}>Details</NavLink>
    }
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card>
            <div className="table-responsive">
              <Table columns={columns} dataSource={cvData} pagination={{ pageSize: 5 }} className="ant-border-space" />
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
                  return isExcel;
                }}
              >
                <Button type="dashed" className="ant-full-box" icon={<ToTopOutlined />} loading={uploading}>
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CvList;
