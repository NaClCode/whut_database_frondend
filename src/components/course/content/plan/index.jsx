import React, { useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';
import { FormOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './plan.scss';

const courseTypeMap = {
  'B': '必修',
  'X': '选修',
  'G': '公选',
  'S': '实践',
};

const columns = (setMode, setPlanID) => [
  { title: '课程号', dataIndex: 'id', ellipsis: true, width: 100 },
  { title: '课程名称', dataIndex: 'name', ellipsis: true },
  { title: '专业', dataIndex: 'profession', ellipsis: true },
  { title: '学院', dataIndex: 'college', ellipsis: true },
  { title: '简介', dataIndex: 'introduction', ellipsis: true },
  {
    title: '类型',
    dataIndex: 'type',
    ellipsis: true,
    render: (_, record) => courseTypeMap[record.type] || '未知类型',
    width: 100,
  },
  { title: '学分', dataIndex: 'credit', ellipsis: true, width: 100 },
  {
    title: '选课状态',
    dataIndex: 'is_selected',
    key: 'is_selected',
    render: (isSelected) => (
      isSelected === 1 ? (
        <div style={{ color: 'green', fontSize: '12px' }}>
          <CheckCircleOutlined style={{ color: 'green', fontSize: '16px' }} />
          &nbsp; 已选
        </div>
      ) : (
        <div style={{ color: 'red', fontSize: '12px' }}>
          <CloseCircleOutlined style={{ color: 'red', fontSize: '16px' }} />
          &nbsp; 未选
        </div>
      )
    ),
    width: 100,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (_, row) => [
      <Button
        key="select"
        icon={<FormOutlined />}
        onClick={() => {setMode('classer'); setPlanID(row.id)}}
        type="link"
      >
        选课
      </Button>,
    ],
  },
];

const CourseContentPlan = ({setMode, setPlanID, page, setPage}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [inputSearchParams, setInputSearchParams] = useState({ name: '', college: '', profession: '', credit: '', is_selected: '', type: '' });

  const fetchCourses = async (currentPage = page, currentPageSize = pageSize, params = inputSearchParams) => {
    setLoading(true);
    try {
      const searchCredit = params.credit === "" ? -1 : params.credit;
      const searchIsSelected = params.is_selected === "" ?-1 : params.is_selected;
      const res = await service.courseplan.list(
        currentPage, 
        currentPageSize, 
        params.name,
        params.college,
        params.profession,
        searchCredit,
        searchIsSelected,
        params.type
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
    fetchCourses();
  }, [page, pageSize]);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setPage(1);
    fetchCourses(1, pageSize);
  };

  const handleClearSearch = () => {
    setInputSearchParams({ name: '', college: '', credit: '', is_selected: '', type: '', profession: ''});
    setPage(1);
    fetchCourses(1, pageSize);
  };

  return (
    <ProCard>
      <ProTable
        columns={columns(setMode, setPlanID)}
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
            key="credit"
            placeholder="学分"
            value={inputSearchParams.credit}
            onChange={(e) => setInputSearchParams({ ...inputSearchParams, credit: e.target.value })}
            className='search-input'
          />,
          <Select
            className="filter-select"
            key="type"
            placeholder="课程类型"
            value={inputSearchParams.type}
            onChange={(value) =>
              setInputSearchParams({ ...inputSearchParams, type: value })
            }
          >
            <Option value="">全部</Option>
            <Option value="B">必修</Option>
            <Option value="X">选修</Option>
            <Option value="G">公选</Option>
            <Option value="S">实践</Option>
          </Select>,
          <Select
            className="filter-select"
            key="is_selected"
            placeholder="选课状态"
            value={inputSearchParams.is_selected}
            onChange={(value) =>
              setInputSearchParams({ ...inputSearchParams, is_selected: value })
            }
          >
            <Option value="">全部</Option>
            <Option value="1">已选</Option>
            <Option value="0">未选</Option>
          </Select>,
          <Button className="search-button" onClick={handleSearch} type="default" icon={<SearchOutlined/>}/>,
          <Button className="clear-button" onClick={handleClearSearch} type="default" icon={<CloseCircleOutlined/>}/>
        ]}
      />
    </ProCard>
  );
};

export default CourseContentPlan;
