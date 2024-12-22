import React, { useState, useEffect } from 'react';
import { message, Button, InputNumber, Form } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';
import './grade.scss';

const courseTypeMap = {
  B: '必修',
  X: '选修',
  G: '公选',
  S: '实践',
};

const courseColumns = (handleCourseClick) => [
  { title: '课程号', dataIndex: 'class_id', ellipsis: true, width: 50 },
  { title: '课程名称', dataIndex: 'name', ellipsis: true },
  { title: '类型', dataIndex: 'type', render: (type) => courseTypeMap[type] || '未知类型', width: 100 },
  { title: '学分', dataIndex: 'credit', ellipsis: true, width: 80 },
  {
    title: '操作',
    dataIndex: 'action',
    render: (_, record) => (
      <Button type="link" onClick={() => handleCourseClick(record)}>
        查看学生
      </Button>
    ),
    width: 100,
  },
];


const CourseGrades = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await service.course.classList();
        setCourses(data.data.data);
        setLoading(false);
      } catch (error) {
        message.error('获取课程列表失败，请稍后再试。');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchStudents = async (courseId) => {
    setLoading(true);
    try {
      console.log(courseId);
      const data = await service.course.gradeTeacher(courseId);
      setStudents(data.data.data);
      setLoading(false);
    } catch (err) {
      message.error('加载学生列表失败，请稍后再试。');
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setCurrentCourse(course);
    fetchStudents(course.class_id);
  };

  const handleScoreSubmit = async (values) => {
    try {
      const courseId = currentCourse.class_id;

      await service.course.updateTeacher(courseId, Object.keys(values), Object.values(values));
  
      message.success('成绩提交成功');
      fetchStudents(courseId); 
      form.resetFields();
    } catch (err) {
      message.error('成绩提交失败，请稍后再试。');
    }
  };

  return (
    <div className="course-grades">
      <ProCard colSpan="50%" title="课程列表" className="left-section">
        <ProTable
          columns={courseColumns(handleCourseClick)}
          dataSource={courses}
          loading={loading}
          rowKey="course_id" 
          search={false}
          pagination={{
            pageSize: 10,
          }}
        />
      </ProCard>
  
      {currentCourse ? (
        <ProCard
          title={`填写课程 "${currentCourse?.name}" 的成绩`}
          className="right-section"
        >
          <Form form={form} onFinish={handleScoreSubmit} layout="vertical">
            {students.map((student) => (
              <Form.Item
                key={student.id}
                label={`${student.name} (学号${student.id})`}
                name={student.id}
                rules={[{ required: true, message: '请输入成绩' }]}
              >
                <>
                 {student.grade ?  (student.grade) : (<InputNumber min={0} max={100} placeholder="" />)}
                </>
                
              </Form.Item>
            ))}
            {students.some(student => !student.grade) && (
              <Form.Item>
                <Button type="primary" htmlType="submit" className='reset-btn'>
                  提交
                </Button>
              </Form.Item>
            )}
          </Form>
        </ProCard>
      ) : (
        <ProCard
          title="请选择一个课程"
          className="right-section info-text"
        >
          <p>请从左侧列表中选择一个课程来填写成绩。</p>
        </ProCard>
      )}
    </div>
  );
};

export default CourseGrades;
