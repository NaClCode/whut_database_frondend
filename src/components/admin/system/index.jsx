import { service } from '@/service'; // 引入服务接口
import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Card, Modal, DatePicker, message, Spin } from 'antd';
import moment from 'moment';
import './system.scss';

const { Title } = Typography;
const { Content } = Layout;

// 时间卡片组件
const TimeCard = ({ title, startTime, endTime, onSetTime }) => {
  return (
    <Card bordered={true} style={{ flex: 1, margin: '0 8px' }}>
      <Title level={5}>{title}</Title>
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

  // 延迟检测的状态
  const [backendDelay, setBackendDelay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 从后端获取系统延迟
  const fetchBackendDelay = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now(); // 记录请求开始时间
      const response = await service.root(); // 调用后端 API 获取延迟数据
      const endTime = Date.now(); // 记录请求结束时间
  
      const apiDelay = response?.data?.delay || 0; // 假设后端返回的延迟值在 `data.delay` 中
      const calculatedDelay = endTime - startTime; // 计算前后端通信的延迟时间
  
      setBackendDelay(apiDelay + calculatedDelay); // 将两者加起来作为最终延迟（可根据实际需求调整）
    } catch (error) {
      console.error('获取延迟数据失败:', error);
      message.error('获取延迟数据失败，请稍后重试！');
    } finally {
      setIsLoading(false);
    }
  };

  // 使用 useEffect 周期性获取延迟数据
  useEffect(() => {
    fetchBackendDelay(); // 页面加载时先请求一次
    const interval = setInterval(() => {
      fetchBackendDelay(); // 每隔 5 秒请求一次延迟数据
    }, 5000);
    return () => clearInterval(interval); // 清除定时器
  }, []);

  // 设置时间的逻辑
  const handleSetTime = (key) => {
    setCurrentTitle(key);
    setCurrentStartTime(times[key].startTime);
    setCurrentEndTime(times[key].endTime);
    setModalVisible(true);
  };

  const handleSaveTime = () => {
    if (!currentStartTime || !currentEndTime) {
      message.error('请设置开始时间和结束时间');
      return;
    }
    if (moment(currentStartTime).isAfter(moment(currentEndTime))) {
      message.error('开始时间不能晚于结束时间');
      return;
    }
    setTimes((prev) => ({
      ...prev,
      [currentTitle]: { startTime: currentStartTime, endTime: currentEndTime },
    }));
    setModalVisible(false);
    message.success('时间设置成功！');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '40px' }}>
        {/* 左中右三个卡片 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
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

        {/* 系统延迟检测 */}
        <Card title={<Title level={5}>系统延迟检测</Title>} bordered={true} style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={5}>当前系统延迟</Title>
            {isLoading ? (
              <Spin size="large" />
            ) : (
              <p
                style={{
                  fontSize: '18px',
                  color: backendDelay <= 1000 ? 'green' : 'red', // 根据延迟值设置颜色
                  fontWeight: 'bold',
                }}
              >
                {backendDelay} ms
              </p>
            )}
          </div>
        </Card>

        <Modal
          title={`设置${currentTitle === 'course' ? '选课' : currentTitle === 'schedule' ? '排课' : '成绩'}时间`}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSaveTime}
        >
          <div style={{ marginBottom: 16 }}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择开始时间"
              value={currentStartTime ? moment(currentStartTime) : null}
              onChange={(value) => setCurrentStartTime(value)}
              style={{ width: '100%', marginBottom: 16 }}
            />
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择结束时间"
              value={currentEndTime ? moment(currentEndTime) : null}
              onChange={(value) => setCurrentEndTime(value)}
              style={{ width: '100%' }}
            />
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminSystem;
