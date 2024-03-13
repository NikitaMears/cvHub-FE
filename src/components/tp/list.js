import React, { useState, useEffect } from "react";
import { Table, Card, Upload, message, Input, Row, Col, Button, Modal, Checkbox, Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined, EditOutlined, DeleteOutlined ,DownOutlined} from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import moment from "moment";
import CreateTp from "./create"; // Import the CreateTp form
import EditTp from "./edit";
import axios from 'axios';
import { Tooltip } from 'antd';


const { Search } = Input;
function highlightMatchedText(text, query) {
  if (!text || !query || query.trim() === '') return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const maxLength = 20; // Adjust the number of characters to display before and after the highlighted text
  const startIndex = Math.max(0, index - maxLength);
  const endIndex = Math.min(text.length, index + query.length + maxLength);

  const prefix = startIndex > 0 ? '...' : '';
  const suffix = endIndex < text.length ? '...' : '';

  const highlightedText = text.substring(startIndex, endIndex)
    .replace(new RegExp(query, 'gi'), (match) => `<span style="background-color: yellow">${match}</span>`);

  return (
    <span dangerouslySetInnerHTML={{ __html: prefix + highlightedText + suffix }} />
  );
}

function TpList() {
  const [uploading, setUploading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tpsData, setTPData] = useState([]);
  const { data: fetchedData } = useFetchWithToken("tps");
  const { postFormData, refetchData } = useFetchWithToken("tps");
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
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

  const ColumnSelector = ({ columns, selectedColumns, onChange }) => {
    const handleChange = (checkedValues) => {
      onChange(checkedValues);
    };
  
    return (
      <Checkbox.Group options={columns} defaultValue={selectedColumns} onChange={handleChange} />
    );
  };
  
  const DynamicTable = ({ columns: initialColumns, data }) => {
    const defaultDisplayedColumns = initialColumns.map(column => column.key).slice(0, 7); // Select first two columns by default
    const [displayedColumns, setDisplayedColumns] = useState(defaultDisplayedColumns);
  
    const handleColumnChange = (selectedColumns) => {
      setDisplayedColumns(selectedColumns);
    };
  
    const filteredColumns = initialColumns.filter(column => displayedColumns.includes(column.key));
  
    return (
      <>
        <Dropdown
          overlay={
            <ColumnSelector
              columns={initialColumns.map((column) => ({
                label: column.title,
                value: column.key,
              }))}
              selectedColumns={defaultDisplayedColumns}
              onChange={handleColumnChange}
            />
          }
          trigger={["click"]}
        >
          <Button>
            Select Columns <DownOutlined />
          </Button>
        </Dropdown>
        <Table columns={filteredColumns} dataSource={data} />
      </>
    );
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
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tps");
      setTPData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleSearch = async () => {
    console.log("se", searchQuery)
    try {
      const response = await axios.post(`http://localhost:3001/tps/search`, {
        query: searchQuery
      });
      console.log('Search Results:', response.data);
setTPData(response.data)      // Handle search results here
    } catch (error) {
      console.error('Error:', error);
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
      ...getColumnSearchProps("title"),

      width: "20%",
      ellipsis: true, // Enable text ellipsis
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    ...(searchQuery ? [] : [
      {
        title: "Sector",
        dataIndex: "sector",
        key: "sector",
        ...getColumnSearchProps("sector"),

      },
    ]),
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      ...getColumnSearchProps("client"),

      ellipsis: true, // Enable text ellipsis
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    // Display country column only when data is not from search
    ...(searchQuery ? [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        render: (text) => highlightMatchedText(text, searchQuery),
      },
    ] : []),
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
            <Col span={12}>
            <Button type="primary" onClick={() => setShowCreateModal(true)}>Add New TP</Button>

              </Col>
              <Col span={12}>
                <Search
                  placeholder="Search"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </Col>
</Row>
      <Row gutter={[24, 0]}>
        
        <Col xs={24} xl={24}>
          {/* <Button type="primary" onClick={() => setShowCreateModal(true)}>Add New TP</Button> */}
          <Card>
            <div className="table-responsive">
              {/* <Table
                columns={columns}
                dataSource={tpsData}
                pagination={{ pageSize: 5 }}
                className="ant-border-space"
              /> */}
                            <DynamicTable columns={columns} data={tpsData} pagination={{ pageSize: 5 }} className="ant-border-space" />

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
