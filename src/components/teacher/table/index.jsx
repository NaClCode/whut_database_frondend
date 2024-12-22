import React, { useState, useEffect } from 'react';
import { Calendar, Card, Badge, Layout, Timeline, Typography, Empty, message, Spin } from 'antd';
import { service } from '@/service';
import moment from 'moment';
import './table.scss';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const TeacherTable = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-10');
  const [currentMonth, setCurrentMonth] = useState('');
  const [courseData, setCourseData] = useState({});
  const [monthCourseDate, setMonthCourseDate] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    setSelectedDate(today);
    setCurrentMonth(moment().format('YYYY-MM'));
    fetchCourseData(today);
    fetchMonthCourseData(moment().format('YYYY-MM'));
  }, []);

  const fetchCourseData = async (date) => {
    setLoading(true);
    try {
      const response = await service.course.teacherDayTable(date);
      setCourseData((prevData) => ({
        ...prevData,
        [date]: response.data.data,
      }));
      setError(null);
    } catch (error) {
      const errorMessage = error.message || '获取课程数据失败，请稍后重试';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthCourseData = async (month) => {
    setLoading(true);
    try {
      setMonthCourseDate({});
      const response = await service.course.teacherTable(month);  
      const newMonthCourse = {};
      response.data.data.forEach(item => {
        const dateKey = moment(item.date).format('YYYY-MM-DD');
        
        if (newMonthCourse[dateKey]) {
          newMonthCourse[dateKey].push(item.name);
        } else {
          newMonthCourse[dateKey] = [item.name];
        }
      });
      
      setMonthCourseDate(newMonthCourse);
    } catch (error) {
      const errorMessage = error.message || '获取月份课程数据失败，请稍后重试';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const dateCellRender = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    const courses = monthCourseDate[dateKey] || [];
    
    return (
      <ul className="badge-list">
        {courses.map((item, index) => (
          <li key={index}>
            <Badge color="blue" text={item} />
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    fetchCourseData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (currentMonth) {
      fetchMonthCourseData(currentMonth);
    }
  }, [currentMonth]);


  const handleDateSelect = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    setSelectedDate(dateKey);
  };

  const handlePanelChange = (value, mode) => {
    const month = value.format('YYYY-MM');
    setCurrentMonth(month);
  };

  return (
    <Layout className="layout">
      <Sider className="sider" width={900}>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          onPanelChange={handlePanelChange}
          className="calendar"
        />
      </Sider>

      <Content className="content">
        <Card title={`课程安排 - ${selectedDate}`} bordered={false} className="course-card">
          {loading ? (
            <Spin size="large" tip="加载中..." className="loading-spinner" /> 
          ) : error ? (
            <Empty description={error} />
          ) : (
            courseData[selectedDate]?.length > 0 ? (
              <Timeline>
                {courseData[selectedDate].map((item, index) => (
                  <Timeline.Item key={index} className="timeline-item">
                    <Title level={5}>{item.name}</Title>
                    <Text>
                      {moment(item.start_time).format('HH:mm:ss')}-{moment(item.end_time).format('HH:mm:ss')}
                    </Text>
                    <br />
                    <Text type="secondary" className="location">
                      教室: {item.classroom.name}
                    </Text>
                    <br />
                    <Text type="secondary" className="location">
                      地点: {item.classroom.location}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty description="这一天没有课程安排" />
            )
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default TeacherTable;