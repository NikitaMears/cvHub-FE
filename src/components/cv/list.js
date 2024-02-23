import { useState, useEffect } from "react";
import axios from "axios";

import {
  Row,
  Col,
  Card,
  Tag,
  Table,
  Upload,
  message,
  Button,
  Avatar,
  Typography,
  Input,
  Space
} from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined } from "@ant-design/icons";
import face2 from "../../assets/images/face-2.jpg";

const { Title } = Typography;
const { Search } = Input; // Import the Search component

function CvList() {
  const [cvData, setCvData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/cvs")
      .then(response => response.json())
      .then(data => setCvData(data))
      .catch(error => console.error("Error fetching CVs:", error));
  }, []);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          method: 'POST',
        },
      });

      // Handle successful upload
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      // Handle upload error
      message.success(`${file.name} uploaded successfully`);
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Search
          placeholder={`Search ${dataIndex}`}
          allowClear
          enterButton="Search"
          size="small"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
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
      render: (text, record) => (
        <NavLink to={`/cvDetails/${record.id}`}>Details</NavLink>
      )
    }
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={cvData}
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
        // Allow only Excel files
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
