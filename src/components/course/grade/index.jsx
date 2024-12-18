import React, { useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './grade.scss';

const courseTypeMap = {
  'B': '必修',
  'X': '选修',
  'G': '公选',
  'S': '实践',
};

const columns = () => [
  { title: '课程号', dataIndex: 'id', ellipsis: true, width: 100 },
  { title: '课程名称', dataIndex: 'name', ellipsis: true },
  { title: '专业', dataIndex: 'profession', ellipsis: true },
  { title: '学院', dataIndex: 'college', ellipsis: true },
  {
    title: '类型',
    dataIndex: 'type',
    ellipsis: true,
    render: (_, record) => courseTypeMap[record.type] || '未知类型',
    width: 100,
  },
  { title: '学分', dataIndex: 'credit', ellipsis: true, width: 100 },
  { title: '教师', dataIndex: 'teacher', ellipsis: true },
  { title: '分数', dataIndex: 'score', ellipsis: true, width: 100 },
];

const CourseGrades = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [inputSearchParams, setInputSearchParams] = useState({ name: '', college: '', profession: '', type: '', teacher: '' });

  const fetchGrades = async (currentPage = page, currentPageSize = pageSize, params = inputSearchParams) => {
    setLoading(true);
    try {
      const res = await service.coursegrades.search(
        currentPage,
        currentPageSize,
        params.name,
        params.college,
        params.profession,
        params.type,
        params.teacher
      );
      const responseData = res.data.data;
      setData(responseData.data);
      setPage(responseData.page);
      setPageSize(responseData.page_size);
      setTotal(responseData.total_records);
    } catch (err) {
      message.error(`加载失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [page, pageSize]);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setPage(1);
    fetchGrades(1, pageSize);
  };

  const handleClearSearch = () => {
    setInputSearchParams({ name: '', college: '', profession: '', type: '', teacher: '' });
    setPage(1);
    fetchGrades(1, pageSize);
  };

  return (
    <ProCard>
      <ProTable
        columns={columns()}
        dataSource={data}
        loading={loading}
        rowKey="id"
        search={false}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        options={{ density: false }}
        className="protable"
        onChange={handleTableChange}
        toolBarRender={() => [
          <Input
            key="name"
            placeholder="课程名称"
            value={inputSearchParams.name}
            onChange={(e) => setInputSearchParams({ ...inputSearchParams, name: e.target.value })}
            className='search-input'
          />,          
          <Input
            key="profession"
            placeholder="专业"
            value={inputSearchParams.profession}
            onChange={(e) => setInputSearchParams({ ...inputSearchParams, profession: e.target.value })}
            className='search-input'
          />,
          <Input
            key="college"
            placeholder="学院"
            value={inputSearchParams.college}
            onChange={(e) => setInputSearchParams({ ...inputSearchParams, college: e.target.value })}
            className='search-input'
          />,
          <Input
            key="teacher"
            placeholder="教师"
            value={inputSearchParams.teacher}
            onChange={(e) => setInputSearchParams({ ...inputSearchParams, teacher: e.target.value })}
            className='search-input'
          />,
          <Select
            className="filter-select"
            key="type"
            placeholder="课程类型"
            value={inputSearchParams.type}
            onChange={(value) => setInputSearchParams({ ...inputSearchParams, type: value })}
          >
            <Option value="">全部</Option>
            <Option value="B">必修</Option>
            <Option value="X">选修</Option>
            <Option value="G">公选</Option>
            <Option value="S">实践</Option>
          </Select>,
          <Button className="search-button" onClick={handleSearch} type="default" icon={<SearchOutlined />} />,
          <Button className="clear-button" onClick={handleClearSearch} type="default" icon={<CloseCircleOutlined />} />,
        ]}
      />
    </ProCard>
  );
};

export default CourseGrades;
