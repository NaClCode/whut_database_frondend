import React, { useState } from "react";
import { Table, Modal, Button, Space, Tag, message, Card, Row, Col } from "antd";
import "antd/dist/reset.css"; // 导入 Ant Design 样式

const CourseContentClasser = () => {
  // 模拟课程数据
  const [courses, setCourses] = useState([
    {
      key: "1",
      courseId: "CS101",
      name: "计算机科学导论",
      major: "计算机科学",
      college: "计算机学院",
      description: "本课程介绍计算机科学的基础知识。",
      type: "必修",
      credits: 3,
      maxStudents: 50,
      currentStudents: 45,
      teacher: "张老师",
      status: "未选",
    },
    {
      key: "2",
      courseId: "MA102",
      name: "高等数学",
      major: "数学",
      college: "数学学院",
      description: "高等数学是数学专业的基础课程。",
      type: "必修",
      credits: 4,
      maxStudents: 60,
      currentStudents: 60,
      teacher: "李老师",
      status: "已选",
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 选课、退课操作
  const handleEnroll = (course) => {
    if (course.currentStudents >= course.maxStudents) {
      message.error("选课失败，人数已满");
      return;
    }
    setCourses(
      courses.map((item) =>
        item.key === course.key
          ? { ...item, status: "已选", currentStudents: item.currentStudents + 1 }
          : item
      )
    );
    message.success("选课成功");
  };

  const handleDrop = (course) => {
    if (course.status !== "已选") {
      message.error("您未选此课程，无法退课");
      return;
    }
    setCourses(
      courses.map((item) =>
        item.key === course.key
          ? { ...item, status: "未选", currentStudents: item.currentStudents - 1 }
          : item
      )
    );
    message.success("退课成功");
  };

  const showDetails = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const closeModal = () => setIsModalVisible(false);

  return (
    <div style={{ padding: "20px" }}>
      <h2>课程计划展示</h2>
      {/* 使用卡片显示所有课程 */}
      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col span={8} key={course.key}>
            <Card
              title={`${course.name} (${course.courseId})`}
              bordered={true}
              extra={
                <Tag color={course.status === "已选" ? "green" : "red"}>
                  {course.status}
                </Tag>
              }
            >
              <p>
                <strong>学院：</strong> {course.college}
              </p>
              <p>
                <strong>类型：</strong> {course.type}
              </p>
              <p>
                <strong>学分：</strong> {course.credits}
              </p>
              <p>
                <strong>人数：</strong> {course.currentStudents}/
                {course.maxStudents}
              </p>
              <Space>
                <Button type="link" onClick={() => showDetails(course)}>
                  详情
                </Button>
                {course.status === "未选" ? (
                  <Button
                    type="primary"
                    onClick={() => handleEnroll(course)}
                  >
                    选课
                  </Button>
                ) : (
                  <Button
                    type="danger"
                    onClick={() => handleDrop(course)}
                  >
                    退课
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 详情 Modal */}
      <Modal
        title="课程详情"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            关闭
          </Button>,
        ]}
      >
        {selectedCourse && (
          <div>
            <p>
              <strong>课程号：</strong> {selectedCourse.courseId}
            </p>
            <p>
              <strong>课程名称：</strong> {selectedCourse.name}
            </p>
            <p>
              <strong>专业：</strong> {selectedCourse.major}
            </p>
            <p>
              <strong>学院：</strong> {selectedCourse.college}
            </p>
            <p>
              <strong>简介：</strong> {selectedCourse.description}
            </p>
            <p>
              <strong>类型：</strong> {selectedCourse.type}
            </p>
            <p>
              <strong>学分：</strong> {selectedCourse.credits}
            </p>
            <p>
              <strong>教师：</strong> {selectedCourse.teacher}
            </p>
            <p>
              <strong>当前人数：</strong> {selectedCourse.currentStudents}/
              {selectedCourse.maxStudents}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseContentClasser;
