import { service } from '@/service';
import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Card, Modal, DatePicker, message, Spin } from 'antd';
import moment from 'moment';
import './system.scss';

const { Title } = Typography;
const { Content } = Layout;

const TimeCard = ({ title, startTime, endTime, onSetTime }) => {
  return (
    <Card bordered={true} className="card">
      <Title level={5} className="card-title">{title}</Title>
      <div style={{ marginBottom: 16 }}>
        <p>开始时间：{startTime ? moment(startTime).format('YYYY-MM-DD HH:mm') : '未设置'}</p>
        <p>结束时间：{endTime ? moment(endTime).format('YYYY-MM-DD HH:mm') : '未设置'}</p>
      </div>
      <Button type="primary" onClick={onSetTime}>
        设置
      </Button>
    </Card>
  );
};

const AdminSystem = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentStartTime, setCurrentStartTime] = useState(null);
  const [currentEndTime, setCurrentEndTime] = useState(null);
  const [times, setTimes] = useState({
    course: { startTime: null, endTime: null },
    schedule: { startTime: null, endTime: null },
    grade: { startTime: null, endTime: null },
  });

  const [backendDelay, setBackendDelay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimes = async () => {
    try {
      setIsLoading(true);
      const [courseResponse, scheduleResponse, gradeResponse] = await Promise.all([
        service.admin.selectTimeGet(),
        service.admin.scheduleTimeGet(),
        service.admin.gradeTimeGet(),
      ]);

      setTimes({
        course: {
          startTime: courseResponse.data.data.start_time,
          endTime: courseResponse.data.data.end_time,
        },
        schedule: {
          startTime: scheduleResponse.data.data.start_time,
          endTime: scheduleResponse.data.data.end_time,
        },
        grade: {
          startTime: gradeResponse.data.data.start_time,
          endTime: gradeResponse.data.data.end_time,
        },
      });
    } catch (error) {
      console.error('获取时间数据失败:', error);
      message.error('获取时间数据失败，请稍后重试！');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackendDelay = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      const response = await service.root();
      const endTime = Date.now();
  
      const apiDelay = response?.data?.delay || 0;
      const calculatedDelay = endTime - startTime;
  
      setBackendDelay(apiDelay + calculatedDelay);
    } catch (error) {
      console.error('获取延迟数据失败:', error);
      message.error('获取延迟数据失败，请稍后重试！');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendDelay();
    fetchTimes();
    const interval = setInterval(() => {
      fetchBackendDelay();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSetTime = (key) => {
    setCurrentTitle(key);
    setCurrentStartTime(times[key].startTime ? moment(times[key].startTime) : null);
    setCurrentEndTime(times[key].endTime ? moment(times[key].endTime) : null);
    setModalVisible(true);
  };

  const handleSaveTime = async () => {
    if (!currentStartTime || !currentEndTime) {
      message.error('请设置开始时间和结束时间');
      return;
    }
    if (currentStartTime.isAfter(currentEndTime)) {
      message.error('开始时间不能晚于结束时间');
      return;
    }

    try {
      if (currentTitle === 'course') {
        await service.admin.selectTimePut(currentStartTime.format('YYYY-MM-DD HH:mm:ss'), currentEndTime.format('YYYY-MM-DD HH:mm:ss')); // 使用 .format() 将 moment 转为字符串
      } else if (currentTitle === 'schedule') {
        await service.admin.scheduleTimePut(currentStartTime.format('YYYY-MM-DD HH:mm:ss'), currentEndTime.format('YYYY-MM-DD HH:mm:ss'));
      } else if (currentTitle === 'grade') {
        await service.admin.gradeTimePut(currentStartTime.format('YYYY-MM-DD HH:mm:ss'), currentEndTime.format('YYYY-MM-DD HH:mm:ss'));
      }

      setTimes((prev) => ({
        ...prev,
        [currentTitle]: { startTime: currentStartTime, endTime: currentEndTime },
      }));
      setModalVisible(false);
      fetchTimes();
      message.success('时间设置成功！');
    } catch (error) {
      console.error('时间设置失败:', error);
      message.error('时间设置失败，请稍后重试！');
    }
  };

  return (
    <Layout className="layout-container">
      <Content className="content-container">
        <div className="card-container">
          <TimeCard
            title="选课时间"
            startTime={times.course.startTime}
            endTime={times.course.endTime}
            onSetTime={() => handleSetTime('course')}
          />
          <TimeCard
            title="排课时间"
            startTime={times.schedule.startTime}
            endTime={times.schedule.endTime}
            onSetTime={() => handleSetTime('schedule')}
          />
          <TimeCard
            title="成绩时间"
            startTime={times.grade.startTime}
            endTime={times.grade.endTime}
            onSetTime={() => handleSetTime('grade')}
          />
        </div>

        <Card title={<Title level={5}>系统延迟检测</Title>} bordered={true} className="system-delay-card">
          <div>
            <Title level={5}>当前系统延迟</Title>
            {isLoading ? (
              <Spin size="large" />
            ) : (
              <p className={`delay-status ${backendDelay <= 1000 ? 'green-status' : 'red-status'}`}>
                {backendDelay} ms
              </p>
            )}
          </div>
        </Card>

        <Modal
          title={`设置${currentTitle === 'course' ? '选课' : currentTitle === 'schedule' ? '排课' : '成绩'}时间`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSaveTime}
        >
          <div>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择开始时间"
              value={currentStartTime}
              onChange={(value) => setCurrentStartTime(value)}
              className="time-picker"
            />
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择结束时间"
              value={currentEndTime}
              onChange={(value) => setCurrentEndTime(value)}
              className="time-picker"
            />
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminSystem;
