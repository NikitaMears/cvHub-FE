import React, { useState, useEffect } from "react";
import { Table, Card, Upload, message, Input, Row, Col,Dropdown, Modal, Button, Checkbox } from "antd";
import { NavLink } from "react-router-dom";
import { ToTopOutlined, SearchOutlined ,DownOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import useFetchWithToken from "../../services/api";
import RFPForm from "./create";
import EditRFPForm from "./edit";
import moment from 'moment';
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




function RFPList() {
  const [RFPModalVisible, setRFPModalVisible] = useState(false);
  const [RFPEModalVisible, setRFPEModalVisible] = useState(false);
  // const [rfpData, setRFPData] = useState(false);


  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const {  postFormData, refetchData } = useFetchWithToken("rfps");
  const [rfpData, setRFPData] = useState([]);
  const { data: fetchedData } = useFetchWithToken("rfps");
  
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

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
  

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/rfps");
      setRFPData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    console.log("se", searchQuery)
    try {
      const response = await axios.post(`http://localhost:3001/rfps/search`, {
        query: searchQuery
      });
      console.log('Search Results:', response.data);
setRFPData(response.data)      // Handle search results here
    } catch (error) {
      console.error('Error:', error);
    }
  };
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
  // const columns = [
  //   {
  //     title: "Title",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "20%",
  //   },
  //   {
  //     title: "RFP No",
  //     dataIndex: "rfpNo",
  //     key: "rfpNo",
  //   },
  //   // Display client column only when data is not from search
  //   ...(searchQuery ? [] : [
  //     {
  //       title: "Client",
  //       dataIndex: "client",
  //       key: "client",
  //     },
  //   ]),
  //   // Display country column only when data is not from search
  //   ...(searchQuery ? [] : [
  //     {
  //       title: "Country",
  //       dataIndex: "country",
  //       key: "country",
  //     },
  //   ]),
  //   ...(searchQuery ? [
  //     {
  //       title: 'Content',
  //       dataIndex: 'content',
  //       key: 'content',
  //       render: (text) => highlightMatchedText(text, searchQuery),
  //     },
  //   ] : []),
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (text, record) => (
  //       <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
  //     )
  //   },
  //   {
  //     title: 'More',
  //     key: 'more',
  //     dataIndex: 'id',
  //     render: (text, record) => (
  //       <NavLink to={`/rfpDetails/${record.id}`} style={{ color: 'green' }}>
  //         <InfoCircleOutlined /> &nbsp;Details
  //       </NavLink>
  //     ),
  //   }
  // ];


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ...getColumnSearchProps("title"),
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "RFP No",
      dataIndex: "rfpNo",
      key: "rfpNo",
      ...getColumnSearchProps("rfpNo"),
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },

    // Display client column only when data is not from search
    ...(searchQuery ? [] : [
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        ...getColumnSearchProps("client"),
        render: (text) => (
          <Tooltip title={text}>
            {text}
          </Tooltip>
        ),
      },
    ]),
    ...(searchQuery ? [] : [
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        ...getColumnSearchProps("country"),
      },
    ]),
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      ...getColumnSearchProps("sector"),
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
      )
    },
    {
      title: 'More',
      key: 'more',
      dataIndex: 'id',
      render: (text, record) => (
        <NavLink to={`/rfpDetails/${record.id}`} style={{ color: 'green' }}>
          <InfoCircleOutlined /> &nbsp;Details
        </NavLink>
      ),
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
  //   // {
  //   //   title: "Issued On",
  //   //   dataIndex: "issuedOn",
  //   //   key: "issuedOn",
  //   //   ...getColumnSearchProps("issuedOn")
  //   // },
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (text, record) => (
  //       <Button type="link"             icon={<EditOutlined />}
  //       onClick={() => handleEdit(record)}>Edit</Button>
  //     )
  //   },
  //   {
  //     title: 'More',
  //     key: 'more',
  //     dataIndex: 'id',
  //     render: (text, record) => (
  //       <NavLink to={`/rfpDetails/${record.id}`} style={{ color: 'green' }}>
  //         <InfoCircleOutlined /> &nbsp;Details
  //       </NavLink>
  //     ),
  //   }
  // ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>

      <Col span={12}>
                <NavLink to="#" onClick={handleAddRFP} className="ant-btn ant-btn-primary" role="button">
                 Add RFP
                </NavLink>
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
       
        <Col xs={24} xl={24}>
          <Card>
          
            <div className="table-responsive">
              <DynamicTable columns={columns} data={rfpData} pagination={{ pageSize: 5 }} className="ant-border-space" />
            </div>
          </Card>
          <Card bordered={false}>
            <div className="uploadfile pb-15 shadow-none">
              <Upload
                name="file"
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  const isExcel = file.type === "application/docx" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                  if (1 > 2) {
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
