import React, { useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './history.scss';

const CourseHistoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({ class_id: '', action_type: '' });

  const fetchCourses = async (currentPage = page, currentPageSize = pageSize, params = searchParams) => {
    setLoading(true);
    try {
      const class_id = params.class_id === "" ? -1 : params.class_id;
      const res = await service.course.history(
        currentPage,
        currentPageSize,
        class_id,
        params.action_type,
      );
      setData(res.data.data.data);
      setTotal(res.total);
      setPage(currentPage);
      setPageSize(currentPageSize);
    } catch (err) {
      message.error(`加载失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTableChange = (pagination) => {
    fetchCourses(pagination.current, pagination.pageSize);
  };

  const handleSearch = () => {
    setPage(1);
    fetchCourses(1, pageSize);
  };

  const handleClearSearch = () => {
    setSearchParams({ class_id: '', action_type: '' });
    setPage(1);
    fetchCourses(1, pageSize, { class_id: '', action_type: '' });
  };

  return (
    <ProCard>
      <ProTable
        headerTitle="选课历史记录"
        search={false}
        columns={[
          {
            title: '课程ID',
            dataIndex: 'class_id',
            key: 'class_id',
            search: false,
          },
          {
            title: '动作类型',
            dataIndex: 'action_type',
            key: 'action_type',
            valueType: 'select',
            valueEnum: {
              'Enroll': '选课',
              'Drop': '退课',
            },
          },
          {
            title: '用户名称',
            dataIndex: 'student_id',
            key: 'student_id',
          },
          {
            title: '选课时间',
            dataIndex: 'action_date',
            key: 'action_date',
            sorter: true,
          },
        ]}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
        toolBarRender={() => [
          <Input
            key="class_id"
            placeholder="课程ID"
            value={searchParams.class_id}
            onChange={(e) => setSearchParams({ ...searchParams, class_id: e.target.value })}
            className="search-input"
          />, 
          <Select
            key="action_type"
            placeholder="动作类型"
            value={searchParams.action_type}
            onChange={(value) => setSearchParams({ ...searchParams, action_type: value })}
            className="filter-select"
          >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="1">选课</Select.Option>
            <Select.Option value="2">退课</Select.Option>
          </Select>,
          <Button key="search" onClick={handleSearch} type="default" icon={<SearchOutlined />}>搜索</Button>,
          <Button key="clear" onClick={handleClearSearch} type="default" icon={<CloseCircleOutlined />}>清空</Button>,
        ]}
      />
    </ProCard>
  );
};

export default CourseHistoryTable;
