import React, { useState, useEffect } from 'react';
import { Layout, Switch, Row, Col, Typography, Card, message, DatePicker, Button, Divider, Spin } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import moment from 'moment';
import './system.scss';

const { Title } = Typography;
const { Content } = Layout;

const AdminSystem = () => {
  const [isCourseSelectionOpen, setIsCourseSelectionOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [courseStartTime, setCourseStartTime] = useState(null);
  const [courseEndTime, setCourseEndTime] = useState(null);
  const [schedulingStartTime, setSchedulingStartTime] = useState(null);
  const [schedulingEndTime, setSchedulingEndTime] = useState(null);
  const [isCourseTimeValid, setIsCourseTimeValid] = useState(true);
  const [isSchedulingTimeValid, setIsSchedulingTimeValid] = useState(true);
  const [backendDelay, setBackendDelay] = useState(null);
  const [backendLogs, setBackendLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseSelectionChange = (checked) => {
    if (!courseStartTime || !courseEndTime) {
      message.error('请先设置选课开始和结束时间');
      return;
    }

    const currentTime = moment();
    const start = moment(courseStartTime);
    const end = moment(courseEndTime);

    if (currentTime.isBetween(start, end, null, '[)')) {
      setIsCourseSelectionOpen(checked);
      message.success(`选课系统已${checked ? '开启' : '关闭'}`);
    } else {
      setIsCourseSelectionOpen(false);
      message.error('当前时间不在选课时间范围内');
    }
  };

  const handleSchedulingChange = (checked) => {
    if (!schedulingStartTime || !schedulingEndTime) {
      message.error('请先设置排课开始和结束时间');
      return;
    }

    const currentTime = moment();
    const start = moment(schedulingStartTime);
    const end = moment(schedulingEndTime);

    if (currentTime.isBetween(start, end, null, '[)')) {
      setIsSchedulingOpen(checked);
      message.success(`排课系统已${checked ? '开启' : '关闭'}`);
    } else {
      setIsSchedulingOpen(false);
      message.error('当前时间不在排课时间范围内');
    }
  };

  const handleCourseStartTimeChange = (time) => setCourseStartTime(time);
  const handleCourseEndTimeChange = (time) => setCourseEndTime(time);
  const handleSchedulingStartTimeChange = (time) => setSchedulingStartTime(time);
  const handleSchedulingEndTimeChange = (time) => setSchedulingEndTime(time);

  const validateCourseTime = () => {
    if (!courseStartTime || !courseEndTime) {
      message.error('请设置完整的选课开始时间和结束时间');
      setIsCourseTimeValid(false);
      return;
    }

    const start = moment(courseStartTime);
    const end = moment(courseEndTime);
    if (start.isBefore(end)) {
      setIsCourseTimeValid(true);
      message.success('选课时间设置有效');
    } else {
      setIsCourseTimeValid(false);
      message.error('选课结束时间必须晚于开始时间');
    }
  };

  const validateSchedulingTime = () => {
    if (!schedulingStartTime || !schedulingEndTime) {
      message.error('请设置完整的排课开始时间和结束时间');
      setIsSchedulingTimeValid(false);
      return;
    }

    const start = moment(schedulingStartTime);
    const end = moment(schedulingEndTime);
    if (start.isBefore(end)) {
      setIsSchedulingTimeValid(true);
      message.success('排课时间设置有效');
    } else {
      setIsSchedulingTimeValid(false);
      message.error('排课结束时间必须晚于开始时间');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);

      setTimeout(() => {
        const delay = Math.floor(Math.random() * 1000) + 500;
        setBackendDelay(delay);

        const newLog = `日志: 后端响应延迟：${delay}ms`;
        setBackendLogs((prevLogs) => [newLog, ...prevLogs]);

        setIsLoading(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    validateCourseTime();
    validateSchedulingTime();
  }, [courseStartTime, courseEndTime, schedulingStartTime, schedulingEndTime]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '40px' }}>
        <Row justify="space-between">
          <Col span={11}>
            <Card title={<Title level={3}><SettingOutlined /> 系统管理</Title>} bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="选课系统" bordered={true}>
                    <div>
                      <Title level={5}>设置选课时间</Title>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="选择开始时间"
                        value={courseStartTime ? moment(courseStartTime) : null}
                        onChange={handleCourseStartTimeChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="选择结束时间"
                        value={courseEndTime ? moment(courseEndTime) : null}
                        onChange={handleCourseEndTimeChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" onClick={validateCourseTime} style={{ width: '100%' }}>
                        校验选课时间
                      </Button>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Switch
                        checked={isCourseSelectionOpen}
                        onChange={handleCourseSelectionChange}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        disabled={!isCourseTimeValid}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card title="排课系统" bordered={true}>
                    <div>
                      <Title level={5}>设置排课时间</Title>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="选择开始时间"
                        value={schedulingStartTime ? moment(schedulingStartTime) : null}
                        onChange={handleSchedulingStartTimeChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="选择结束时间"
                        value={schedulingEndTime ? moment(schedulingEndTime) : null}
                        onChange={handleSchedulingEndTimeChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" onClick={validateSchedulingTime} style={{ width: '100%' }}>
                        校验排课时间
                      </Button>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Switch
                        checked={isSchedulingOpen}
                        onChange={handleSchedulingChange}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        disabled={!isSchedulingTimeValid}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={11}>
            <Card title="后端延迟检测" bordered={true}>
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>后端响应延迟</Title>
                {isLoading ? <Spin size="large" /> : <p>当前延迟：{backendDelay}ms</p>}
              </div>

              <Divider />

              <Title level={5}>后端日志</Title>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {backendLogs.map((log, index) => <p key={index}>{log}</p>)}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminSystem;
