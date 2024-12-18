import React, { useState } from 'react';
import { Calendar, Card, Badge, Layout, Timeline, Typography, Empty } from 'antd';
import './table.scss';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const data = {
  '2024-06-10': [
    { time: '08:00 - 09:30', name: '数据结构', location: '教学楼A201' },
    { time: '10:00 - 11:30', name: '操作系统', location: '实验楼B302' },
  ],
  '2024-06-11': [
    { time: '13:30 - 15:00', name: '数据库系统', location: '图书馆C101' },
    { time: '15:30 - 17:00', name: '软件工程', location: '教学楼A303' },
  ],
  '2024-06-12': [
    { time: '08:00 - 09:30', name: '人工智能', location: '实验楼B201' },
    { time: '10:00 - 11:30', name: '计算机网络', location: '教学楼A102' },
  ],
  '2024-06-13': [
    { time: '13:30 - 15:00', name: '大数据分析', location: '实验楼B101' },
  ],
  '2024-06-14': [
    { time: '15:30 - 17:00', name: '区块链技术', location: '图书馆C202' },
  ],
};

const CourseSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-10');

  const dateCellRender = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    const courses = data[dateKey] || [];
    return (
      <ul className="badge-list">
        {courses.map((item, index) => (
          <li key={index}>
            <Badge color="blue" text={item.name} />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    setSelectedDate(dateKey);
  };

  return (
    <Layout className="layout">
      <Sider className="sider" width={900}>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          className="calendar"
        />
      </Sider>

      <Content className="content">
        <Card title={`课程安排 - ${selectedDate}`} bordered={false} className="course-card">
          {data[selectedDate]?.length > 0 ? (
            <Timeline>
              {data[selectedDate].map((item, index) => (
                <Timeline.Item key={index} className="timeline-item">
                  <Title level={5}>{item.time}</Title>
                  <Text>{item.name}</Text>
                  <br />
                  <Text type="secondary" className="location">
                    地点: {item.location}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty description="这一天没有课程安排" />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default CourseSchedule;
