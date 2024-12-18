import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';

import './grade.scss';

const courseTypeMap = {
  'B': '必修',
  'X': '选修',
  'G': '公选',
  'S': '实践',
};

const columns = () => [
  { title: '课程号', dataIndex: 'course_id', ellipsis: true, width: 100 },
  { title: '课程名称', dataIndex: 'course_name', ellipsis: true },
  { title: '专业', dataIndex: 'profession', ellipsis: true },
  { title: '学院', dataIndex: 'college', ellipsis: true },
  {
    title: '类型',
    dataIndex: 'type',
    ellipsis: true,
    render: (_, record) => courseTypeMap[record.type] || '未知类型',
    width: 100,
  },
  { title: '学分', dataIndex: 'credits', ellipsis: true, width: 100 },
  { title: '教师', dataIndex: 'teacher', ellipsis: true },
  { title: '分数', dataIndex: 'grade', ellipsis: true, width: 100 },
];

const CourseGrades = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [inputSearchParams, setInputSearchParams] = useState({
    name: '',
    college: '',
    profession: '',
    type: '',
    teacher: '',
  });

  // Fetch grades from the server
  const fetchGrades = async (currentPage = page, currentPageSize = pageSize, params = inputSearchParams) => {
    setLoading(true);
    try {
      const res = await service.course.grade(
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
  }, []);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchGrades(pagination.current, pagination.pageSize);
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
      />
    </ProCard>
  );
};

export default CourseGrades;
