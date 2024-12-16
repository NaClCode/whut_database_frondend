import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Input } from 'antd';
import { ProCard, ProTable, TableDropdown } from '@ant-design/pro-components';
import { BookOutlined, ReadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { service } from '@/service';
import './courseList.scss';

const { Sider, Content } = Layout;

const columns = [
  { title: '课程计划号', dataIndex: 'id', ellipsis: true },
  { title: '课程名称', dataIndex: 'name', ellipsis: true },
  { title: '专业', dataIndex: 'profession', ellipsis: true },
  { title: '类型', dataIndex: 'type', ellipsis: true },
  { title: '简介', dataIndex: 'introduction', ellipsis: true },
  {
    title: '操作',
    valueType: 'option',
    render: (_, row) => [
      <TableDropdown
        key="more"
        onSelect={(key) => message.info(key)}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

const CourseList = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [inputSearchParams, setInputSearchParams] = useState({ course_name: '', major: '' });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCourses = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await service.courseplan.list(currentPage, currentPageSize);
      const responseData = res.data.data;
      setData(responseData.data);
      setTotalPages(responseData.total_pages);
      setLoading(false);
    } catch (err) {
      message.error(`加载失败: ${err}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, pageSize]);

  const handleSearch = () => {
    setSearchParams(inputSearchParams);
    fetchCourses(1, pageSize);
  };

  const handleClearSearch = () => {
    setInputSearchParams({ course_name: '', major: '' });
    setSearchParams({ course_name: '', major: '' });
    fetchCourses(1, pageSize);
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchCourses(pagination.current, pagination.pageSize);
  };

  const menuItems = [
    { key: '1', icon: <BookOutlined />, label: '选课' },
    { key: '2', icon: <ReadOutlined />, label: '选课记录' },
    { key: '3', icon: <CheckCircleOutlined />, label: '已选课程' },
  ];

  return (
    <Layout className="course-layout">
      <Sider collapsible className="course-sider">
        <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>
      <Layout>
        <Content className="course-content">
          <ProCard>
            <ProTable
              columns={columns}
              dataSource={data}
              loading={loading}
              rowKey="id"
              headerTitle="课程列表"
              search={false}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: totalPages * pageSize, 

              }}
              className="protable"
              options={{
                density: false,
                expandable: true,
              }}
              onChange={handleTableChange}
              toolBarRender={() => [
                <Input.Search
                  key="course_name_search"
                  placeholder="课程名称"
                  value={inputSearchParams.course_name}
                  onChange={(e) => setInputSearchParams({ ...inputSearchParams, course_name: e.target.value })}
                  onSearch={handleSearch}
                />,
                <Input.Search
                  key="major_search"
                  placeholder="专业"
                  value={inputSearchParams.major}
                  onChange={(e) => setInputSearchParams({ ...inputSearchParams, major: e.target.value })}
                  onSearch={handleSearch}
                />,
                <Button key="clear" onClick={handleClearSearch} type="default">
                  清除搜索
                </Button>,
              ]}
            />
          </ProCard>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseList;
