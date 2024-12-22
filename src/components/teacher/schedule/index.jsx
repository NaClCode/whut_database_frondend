import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, List, Card, DatePicker, Select, Switch, message } from 'antd';
import './schedule.scss';
import { service } from '@/service';
import moment from 'moment';
import SelectWithAll from '@/utils/Select';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TeacherSchedule = () => {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isPreferredTimeVisible, setIsPreferredTimeVisible] = useState(false);
  const [form] = Form.useForm();
  const [classrooms, setClassrooms] = useState([]);
  const [courseCount, setCourseCount] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await service.course.classList();
        setCourses(data.data.data);
      } catch (error) {
        message.error('获取课程列表失败，请稍后再试。');
      }
    };

    fetchCourses();
  }, []);

  const fetchClassrooms = async (courseCount) => {
    try {
      const data = await service.course.classroomList(courseCount);
      const res = data.data.data;
      return res;
    } catch (error) {
      message.error('获取教室列表失败，请稍后再试。');
      return [];
    }
  };

  const handleCourseClick = (course) => {
    const fetchSchedule = async () => {
      try {
        const data = await service.course.scheduleList(course.class_id);
        const fetchedSchedule = data.data.data;
        setSchedule(fetchedSchedule);
        setCurrentCourse(course);
        setCourseCount(course.num);
      } catch (error) {
        message.error('获取课程排课计划失败，请稍后再试。');
      }
    };

    fetchSchedule();
  };

  const handleNewSchedule = async () => {
    setIsModalVisible(true);
    setCurrentSchedule(null);
    form.resetFields();
    form.setFieldsValue({ courseName: currentCourse?.name || '' });

    if (courseCount !== null) {
      const classrooms = await fetchClassrooms(courseCount);
      setClassrooms(classrooms);
    }
  };

  const handleViewReport = async (item) => {
    const fetchTeacherSchedule = async () => {
      try {
        const data = await service.course.teacherScheduleList(item.id);
        const res = data.data.data;
        return res;
      } catch (error) {
        message.error("获取课程排课计划失败，请稍后再试。");
        return null;
      }
    };
  
    const reportData = await fetchTeacherSchedule(); // 等待异步函数的结果
    if (!reportData) return; // 如果没有数据，直接返回
  
    // 定义表格数据
    const columns = [
      {
        title: "属性",
        dataIndex: "attribute",
        key: "attribute",
        align: "center",
        width: "50%",
      },
      {
        title: "值",
        dataIndex: "value",
        key: "value",
        align: "center",
        width: "50%",
      },
    ];
  
    const dataSource = [
      {
        key: "1",
        attribute: "教室",
        value: item.classroom || "未指定",
      },
      {
        key: "2",
        attribute: "开始时间",
        value: moment(reportData.start_time).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        key: "3",
        attribute: "结束时间",
        value: moment(reportData.end_time).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        key: "4",
        attribute: "冲突率",
        value: `${(reportData.conflict_rate * 100).toFixed(2)} %`,
      },
      {
        key: "5",
        attribute: "偏好满足率",
        value: `${(reportData.prefer_rate * 100).toFixed(2)} %`,
      },
      {
        key: "6",
        attribute: "冲突学生",
        value: reportData.conflict_student_names || "无",
      },
    ];
  
    Modal.info({
      title: "AI 排课报告",
      width: 800,
      content: (
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            size="middle"
          />
        </div>
      )
    });
  };
  
  
  const handleDeleteSchedule = async (item) => {
    try {
      await service.course.teacherScheduleDelete(item.id);
      message.success('撤销排课成功');
      handleCourseClick(currentCourse); // 重新加载当前课程的排课计划
    } catch (error) {
      message.error('撤销排课失败，请稍后再试。');
    }
  };

  const mapPreferredTimeToBinary = (preferredTime) => {
    const timeSlots = ["8-10", "10-12", "14-16", "16-18", "19-21"];
    const binaryArray = timeSlots.map((slot) =>
        preferredTime.includes(slot) ? 0 : 1
    );
    return binaryArray;
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { timeRange, classroom, preferredTime } = values;
      const [start_date, end_date] = timeRange.map((time) => time.format('YYYY-MM-DD HH:mm:ss'));
      
      const preferredTimeBinary = mapPreferredTimeToBinary(preferredTime || []);

      const data = await service.course.schedule(
        currentCourse.class_id,
        start_date,
        end_date,
        classroom,
        preferredTimeBinary || [],
      );

      message.success('排课成功');
      setIsModalVisible(false);
      handleCourseClick(currentCourse);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: '课程 ID',
      dataIndex: 'class_id',
      key: 'class_id',
      align: 'center',
      width: 80,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 80,
    },
    {
      title: '人数',
      dataIndex: 'num',
      key: 'numStudents',
      align: 'center',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
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
          dataSource={courses.map((course) => ({ ...course, key: course.class_id }))}
          columns={columns}
          pagination={false}
        />
      </div>

      <div className="schedule-container">
        <h3>排课计划</h3>
       
        {currentCourse ? (
          <>
            <Button
              type="primary"
              onClick={handleNewSchedule}
              className="new-schedule-button"
            >
              新建排课
            </Button>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={schedule}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={item.classroom}
                    extra={
                      item.is_teacher ? (
                        <div>
                          <Button type="link" onClick={() => handleViewReport(item)}>
                            查看报告
                          </Button>
                          <Button type="link" onClick={() => handleDeleteSchedule(item)}>
                            删除
                          </Button>
                        </div>
                        
                        
                      ) : null
                    }
                  >
                    <div>
                      {moment(item.start_time).format("YYYY-MM-DD HH:mm:ss")} - {moment(item.end_time).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
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
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="timeRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            name="classroom"
            label="教室"
            rules={[{ required: true, message: '请选择教室' }]}
          >
            <SelectWithAll mode="multiple" placeholder="请选择教室">
              {classrooms.map((room) => (
                <Option key={room.id} value={room.classroom_id}>
                  {room.name}
                </Option>
              ))}
            </SelectWithAll>
          </Form.Item>
          <Form.Item
            label="偏好时间"
          >
            <div className='prefertime'>
              <Switch
                checked={isPreferredTimeVisible}
                onChange={(checked) => setIsPreferredTimeVisible(checked)}
              />
            </div>

            {isPreferredTimeVisible && (
              <Form.Item
                name="preferredTime"
                rules={[{ required: true, message: '请选择偏好时间' }]}
              >
                <SelectWithAll mode="multiple" placeholder="选择一天的时间段">
                  <Option value="8-10">8:00-10:00</Option>
                  <Option value="10-12">10:00-12:00</Option>
                  <Option value="14-16">14:00-16:00</Option>
                  <Option value="16-18">16:00-18:00</Option>
                  <Option value="19-21">19:00-21:00</Option>
                </SelectWithAll>
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherSchedule;
