import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Tag, Divider, Space, Button, message, Spin, Pagination } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { service } from '@/service';
import './classer.scss';

const { Title, Text } = Typography;

const CourseContentClasser = ({ setMode, classplanid }) => {
  const [courseOverview, setCourseOverview] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // 加载课程详情和班级列表
  const fetchCourseData = async (page = 1) => {
    setLoading(true);
    try {
      const { data: planData } = await service.courseplan.detail(classplanid);
      const { data: classerData } = await service.courseclasser.list(classplanid, page, pageSize);

      // 设置课程概述
      setCourseOverview({
        name: planData.data.name || '未命名课程',
        description: planData.data.introduction || '暂无简介',
        major: planData.data.profession || '未提供',
        college: planData.data.college || '未提供',
        credits: planData.data.credit || 0,
        type: planData.data.type || '未知',
      });

      // 设置课程列表和总数据量
      setCourses(
        classerData.data.data.map((item) => ({
          id: item.id,
          teacher: item.teacher || '未知教师',
          currentStudents: item.num || 0,
          maxStudents: item.max_num || 0,
          time: '未提供',
          isEnrolled: false,
        }))
      );

      setTotalItems(classerData.data.total);
    } catch (error) {
      message.error('加载课程信息失败，请重试！');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData(currentPage);
  }, [classplanid, currentPage]);

  // 更新选课状态
  const updateCourseStatus = (index, isEnrolling) => {
    setCourses((prevCourses) =>
      prevCourses.map((course, i) =>
        i === index
          ? {
              ...course,
              isEnrolled: isEnrolling,
              currentStudents: course.currentStudents + (isEnrolling ? 1 : -1),
            }
          : course
      )
    );

    const actionMessage = isEnrolling ? '选课成功' : '退课成功';
    message.success(`${actionMessage}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 渲染单个班级卡片
  const renderCourseCard = (course, index) => {
    const { teacher, time, maxStudents, currentStudents, isEnrolled } = course;
    return (
      <Col span={8} key={index}>
        <Card hoverable title={`教师：${teacher}`} bordered className="class-card">
          <Space direction="vertical" size="middle">
            <Text>
              <strong>上课安排：</strong> {time}
            </Text>
            <Text>
              <strong>最大人数：</strong> {maxStudents}
            </Text>
            <Text>
              <strong>当前人数：</strong>
              <Tag color={currentStudents >= maxStudents ? 'red' : 'green'}>
                {currentStudents}
              </Tag>
            </Text>
            <Space>
              <Button
                type="primary"
                onClick={() => updateCourseStatus(index, true)}
                disabled={isEnrolled || currentStudents >= maxStudents}
              >
                {isEnrolled ? '已选课' : '选课'}
              </Button>
              <Button
                danger
                onClick={() => updateCourseStatus(index, false)}
                disabled={!isEnrolled}
              >
                退课
              </Button>
            </Space>
          </Space>
        </Card>
      </Col>
    );
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  return (
    <div className="course-content-classer">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => setMode('plan')}
        className="back-button"
      >
        返回
      </Button>

      {/* 课程概述 */}
      <Card bordered={false} className="course-card">
        <Title level={4} className="course-title">
          {courseOverview.name}
        </Title>
        <Divider />
        <Row className="course-details">
          <Col className="detail-item">
            <Text strong>专业：</Text> {courseOverview.major}
          </Col>
          <Col className="detail-item">
            <Text strong>学院：</Text> {courseOverview.college}
          </Col>
          <Col className="detail-item">
            <Text strong>类型：</Text> {courseOverview.type}
          </Col>
          <Col className="detail-item">
            <Text strong>学分：</Text> {courseOverview.credits}
          </Col>
          <Col className="detail-item">
            <Text strong>简介：</Text> {courseOverview.description}
          </Col>
        </Row>
      </Card>

      {/* 班级列表 */}
      <Row gutter={[16, 16]} className="class-list">
        {courses.map(renderCourseCard)}
      </Row>

      {/* 分页 */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />
    </div>
  );
};

export default CourseContentClasser;
