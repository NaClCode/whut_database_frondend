import React, { useState, useEffect } from 'react';
import { message, Drawer, Button, InputNumber, Form } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { service } from '@/service';


const courseTypeMap = {
  B: '必修',
  X: '选修',
  G: '公选',
  S: '实践',
};

const courseColumns = (handleCourseClick) => [
  { title: '课程号', dataIndex: 'course_id', ellipsis: true, width: 120 },
  { title: '课程名称', dataIndex: 'course_name', ellipsis: true },
  { title: '类型', dataIndex: 'type', render: (type) => courseTypeMap[type] || '未知类型', width: 100 },
  { title: '学分', dataIndex: 'credits', ellipsis: true, width: 80 },
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

const studentColumns = () => [
  { title: '学号', dataIndex: 'student_id', ellipsis: true, width: 120 },
  { title: '学生姓名', dataIndex: 'student_name', ellipsis: true },
  { title: '成绩', dataIndex: 'grade', render: (_, record) => record.grade || '未填写', ellipsis: true, width: 100 },
];

const CourseGrades = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [form] = Form.useForm();

  const mockCourses = [
    { course_id: '101', course_name: '高等数学', type: 'B', credits: 4 },
    { course_id: '102', course_name: '大学物理', type: 'X', credits: 3 },
    { course_id: '103', course_name: '计算机基础', type: 'G', credits: 2 },
  ];
  
  const mockStudents = [
    { student_id: '2023001', student_name: '张三', grade: null },
    { student_id: '2023002', student_name: '李四', grade: 85 },
    { student_id: '2023003', student_name: '王五', grade: null },
  ];
  
  // Fetch teacher's courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // 使用模拟数据代替真实请求
      setTimeout(() => {
        setCourses(mockCourses);
        setLoading(false);
      }, 500); // 模拟网络延迟
    } catch (err) {
      message.error(`加载课程失败: ${err}`);
      setLoading(false);
    }
  };
  
  // Fetch students in the selected course
  const fetchStudents = async (courseId) => {
    setLoading(true);
    try {
      // 使用模拟数据代替真实请求
      setTimeout(() => {
        setStudents(mockStudents);
        setLoading(false);
      }, 500); // 模拟网络延迟
    } catch (err) {
      message.error(`加载学生列表失败: ${err}`);
      setLoading(false);
    }
  };
  

  const handleCourseClick = (course) => {
    setCurrentCourse(course);
    fetchStudents(course.course_id);
  };

  const handleScoreSubmit = async (values) => {
    try {
      await service.course.submitGrade(currentCourse.course_id, values); // API 提交成绩
      message.success('成绩提交成功');
      fetchStudents(currentCourse.course_id); // 刷新学生列表
      form.resetFields();
    } catch (err) {
      message.error(`成绩提交失败: ${err}`);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* 左侧教师课程表 */}
      <ProCard colSpan="50%" title="课程列表" style={{ width: '50%' }}>
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
  
  
      {/* 成绩输入框在右侧 */}
      {currentCourse && (
        <ProCard
          title={`填写课程 "${currentCourse?.course_name}" 的成绩`}
          style={{ width: '50%', padding: '10px' }}
        >
          <Form form={form} onFinish={handleScoreSubmit} layout="vertical">
            {students.map((student) => (
              <Form.Item
                key={student.student_id}
                label={`${student.student_name} (${student.student_id})`}
                name={`grade_${student.student_id}`}
                rules={[{ required: true, message: '请输入成绩' }]}
              >
                <InputNumber min={0} max={100} placeholder="请输入分数" />
              </Form.Item>
            ))}
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <Button
                onClick={() => form.resetFields()}
                style={{ marginRight: 8 }}
              >
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form>
        </ProCard>
      )}
    </div>
  );
  
          }  

export default CourseGrades;
