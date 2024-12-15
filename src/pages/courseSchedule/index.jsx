import React, { useState } from 'react';
import { Calendar, Card, Badge, Layout, List, Typography, Empty } from 'antd';

const { Sider, Content } = Layout;
const { Title } = Typography;

// 课程数据
const data = {
  '2024-06-10': [{ time: '08:00 - 09:30', name: '数据结构' }, { time: '10:00 - 11:30', name: '操作系统' }],
  '2024-06-11': [{ time: '13:30 - 15:00', name: '数据库系统' }, { time: '15:30 - 17:00', name: '软件工程' }],
  '2024-06-12': [{ time: '08:00 - 09:30', name: '人工智能' }, { time: '10:00 - 11:30', name: '计算机网络' }],
  '2024-06-13': [{ time: '13:30 - 15:00', name: '大数据分析' }],
  '2024-06-14': [{ time: '15:30 - 17:00', name: '区块链技术' }],
};

const CourseSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-10'); // 默认选中日期

  // 渲染日历单元格的内容
  const dateCellRender = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    const courses = data[dateKey] || [];
    return (
      <ul style={{ padding: 0, margin: 0 }}>
        {courses.map((item, index) => (
          <li key={index} style={{ listStyle: 'none', marginBottom: 4 }}>
            <Badge color="blue" text={item.name} />
          </li>
        ))}
      </ul>
    );
  };

  // 选择日期
  const handleDateSelect = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    setSelectedDate(dateKey);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 左侧：日历 */}
      <Sider width={500} style={{ background: '#fff', padding: '20px' }}>
        <Card title="课程日历" bordered={false}>
          <Calendar
            dateCellRender={dateCellRender} // 渲染单元格内容
            onSelect={handleDateSelect} // 点击日期触发
          />
        </Card>
      </Sider>

      {/* 右侧：课程安排 */}
      <Content style={{ padding: '20px', background: '#f0f2f5' }}>
        <Card title={`课程安排 - ${selectedDate}`} bordered={false}>
          {data[selectedDate]?.length > 0 ? (
            <List
              dataSource={data[selectedDate]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Title level={5}>{item.time}</Title>}
                    description={<span>{item.name}</span>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="这一天没有课程安排" />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default CourseSchedule;
