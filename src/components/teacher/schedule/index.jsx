import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, List, Card, DatePicker, Select } from 'antd';
import './schedule.scss'; 

const { RangePicker } = DatePicker;
const { Option } = Select;

const TeacherSchedule = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: '数学', teacher: '张老师' },
    { id: 2, name: '英语', teacher: '李老师' },
    { id: 3, name: '科学', teacher: '王老师' },
  ]);

  const [schedule, setSchedule] = useState([
    { id: 1, courseName: '数学', time: '周一 9:00 AM' },
    { id: 2, courseName: '英语', time: '周二 10:00 AM' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [form] = Form.useForm();

  const handleNewSchedule = () => {
    setIsModalVisible(true);
    setCurrentSchedule(null);
    form.resetFields();
    form.setFieldValue('courseName', currentCourse?.name || '');
  };

  const handleViewReport = (item) => {
    Modal.info({
      title: '排课报告',
      content: (
        <div>
          <p>课程: {item.courseName}</p>
          <p>时间: {item.time}</p>
        </div>
      ),
    });
  };

  const handleCourseClick = (course) => {
    const filteredSchedule = schedule.filter((item) => item.courseName === course.name);
    setCurrentCourse({ ...course, schedule: filteredSchedule });
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (currentSchedule) {
          setSchedule((prev) =>
            prev.map((item) => (item.id === currentSchedule.id ? { ...item, ...values } : item))
          );
        } else {
          setSchedule((prev) => [...prev, { id: Date.now(), ...values }]);
        }
        setIsModalVisible(false);
      })
      .catch((info) => console.log('校验失败:', info));
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: '课程',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Button type="link" onClick={() => handleCourseClick(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="app-container">
      <div className="courses-container">
        <h3>课程列表</h3>
        <Table
          dataSource={courses.map((course) => ({ ...course, key: course.id }))}
          columns={columns}
          pagination={false}
        />
      </div>

      <div className="schedule-container">
        <h3>排课计划</h3>
        {currentCourse ? (
          <>
            <h4>当前课程: {currentCourse.name}</h4>
            <Button type="primary" onClick={handleNewSchedule} className="new-schedule-button">
              新建排课
            </Button>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={currentCourse.schedule}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={item.courseName}
                    extra={
                      <Button type="link" onClick={() => handleViewReport(item)}>
                        查看报告
                      </Button>
                    }
                  >
                    时间: {item.time}
                  </Card>
                </List.Item>
              )}
            />
          </>
        ) : (
          <p>请选择一个课程以查看详细排课计划</p>
        )}
      </div>

      <Modal
        title={currentSchedule ? '编辑排课' : '新建排课'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="courseName"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input disabled={!!currentCourse} />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            name="classroom"
            label="教室"
            rules={[{ required: true, message: '请选择教室' }]}
          >
            <Select mode="multiple" placeholder="请选择教室">
              <Option value="A101">A101</Option>
              <Option value="B202">B202</Option>
              <Option value="C303">C303</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="courseCount"
            label="课程数量"
            rules={[{ required: true, message: '请输入课程数量' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherSchedule;
