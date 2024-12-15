import React, { useState } from 'react';
import { Layout, Menu, Button, message, Input } from 'antd';
import { ProCard, ProTable, TableDropdown } from '@ant-design/pro-components';
import {
  BookOutlined,
  ReadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const data = [
  { course_id: 'C001', course_name: '计算机科学导论', major: '计算机科学与技术', department: '计算机学院', credits: 3, description: '本课程介绍计算机科学的基本概念和基础知识。' },
  { course_id: 'C002', course_name: '数据结构', major: '计算机科学与技术', department: '计算机学院', credits: 4, description: '本课程讲解常见数据结构及其应用。' },
  { course_id: 'C003', course_name: '操作系统', major: '计算机科学与技术', department: '计算机学院', credits: 3, description: '本课程介绍操作系统的基础原理和应用。' },
  { course_id: 'C004', course_name: '数据库系统', major: '计算机科学与技术', department: '计算机学院', credits: 3, description: '本课程介绍数据库的基本理论和技术。' },
  { course_id: 'C005', course_name: '软件工程', major: '软件工程', department: '计算机学院', credits: 3, description: '本课程教授软件开发的基本流程与方法。' },
];

const columns = [
  { title: '课程计划号', dataIndex: 'course_id', ellipsis: true, search: true },
  { title: '课程名称', dataIndex: 'course_name', ellipsis: true, search: true },
  { title: '专业', dataIndex: 'major', search: true },
  { title: '学院', dataIndex: 'department', search: true },
  { title: '学分', dataIndex: 'credits', valueType: 'digit' },
  {
    title: '操作',
    valueType: 'option',
    render: (text, row) => [
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
  const [searchParams, setSearchParams] = useState({ course_name: '', major: '' });

  const expandedRowRender = (record) => (
    <div>
      <p>
        <strong>课程简介:</strong> {record.description}
      </p>
    </div>
  );

  const handleSearch = () => {
    setSearchParams(inputSearchParams);
  };

  const handleClearSearch = () => {
    setInputSearchParams({ course_name: '', major: '' });
    setSearchParams({ course_name: '', major: '' });
  };

  const filteredData = data.filter((item) => {
    return (
      (searchParams.course_name ? item.course_name.includes(searchParams.course_name) : true) &&
      (searchParams.major ? item.major.includes(searchParams.major) : true)
    );
  });

  const menuItems = [
    { key: '1', icon: <BookOutlined />, label: '选课' },
    { key: '2', icon: <ReadOutlined />, label: '选课记录' },
    { key: '3', icon: <CheckCircleOutlined />, label: '已选课程' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>

      {/* Content Area */}
      <Layout>
        <Content style={{ margin: '16px' }}>
          <ProCard>
            <ProTable
              columns={columns}
              search={false}
              options={{
                density: false,
                expandable: true,
              }}
              dataSource={filteredData}
              pagination={{ pageSize: 5 }}
              rowKey="course_id"
              headerTitle="课程列表"
              expandable={{
                expandedRowRender,
              }}
              toolBarRender={() => [
                <Input.Search
                  key="course_name_search"
                  placeholder="课程名称"
                  value={inputSearchParams.course_name}
                  onChange={(e) => setInputSearchParams({ ...inputSearchParams, course_name: e.target.value })}
                  onSearch={handleSearch}
                  style={{ width: 200 }}
                />,
                <Input.Search
                  key="major_search"
                  placeholder="专业"
                  value={inputSearchParams.major}
                  onChange={(e) => setInputSearchParams({ ...inputSearchParams, major: e.target.value })}
                  onSearch={handleSearch}
                  style={{ width: 200 }}
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
