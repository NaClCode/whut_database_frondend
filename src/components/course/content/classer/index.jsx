import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Tag, Divider, Space, Button, message, Table, Spin, Pagination, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { service } from '@/service';
import './classer.scss';

const { Text } = Typography;

const columns = [
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
  {
    title: '教室',
    dataIndex: 'classroom',
    key: 'classroom',
  },
  {
    title: '类型',
    dataIndex: 'classtype',
    key: 'classtype',
  },
];

const CourseContentClasser = ({ setMode, classplanid }) => {
  const [courseOverview, setCourseOverview] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null); 
  const [detailLoading, setDetailLoading] = useState(false);
  const pageSize = 10;

  const fetchCourseData = async (page = 1) => {
    setLoading(true);
    try {
      const { data: planData } = await service.courseplan.detail(classplanid);
      const { data: classerData } = await service.courseclasser.list(classplanid, page, pageSize);

      setCourseOverview({
        name: planData.data.name || '未命名课程',
        description: planData.data.introduction || '暂无简介',
        major: planData.data.profession || '未提供',
        college: planData.data.college || '未提供',
        credits: planData.data.credit || 0,
        type: planData.data.type || '未知',
      });

      setCourses(
        classerData.data.data.map((item) => ({
          id: item.id,
          teacher: item.teacher || '未知教师',
          currentStudents: item.num || 0,
          maxStudents: item.max_num || 0,
          is_enrolled: item.is_enrolled,
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

  const fetchCourseDetail = async (id) => {
    setDetailLoading(true);
    try {
      const { data } = await service.courseclasser.detail(id);
      setCourseDetail(data.data); 
    } catch (error) {
      message.error('加载课程详情失败，请重试！');
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData(currentPage);
  }, [classplanid, currentPage]);

  const updateCourseStatus = async (index, isEnrolling) => {
    const course = courses[index];
    try {
      if (isEnrolling) {
        await service.course.enroll(course.id);
      } else {
        await service.course.drop(course.id);
      }
  
      fetchCourseData(currentPage);
  
      const actionMessage = isEnrolling ? '选课成功' : '退课成功';
      message.success(actionMessage);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '未知错误';
      const actionMessage = isEnrolling ? `选课失败: ${errorMessage}` : `退课失败: ${errorMessage}`;
  
      message.error(actionMessage);
      console.error('操作失败:', errorMessage);
    }
  };
  

  const handlePageChange = (page) => setCurrentPage(page);

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    await fetchCourseDetail(course.id);
  };

  const handleModalClose = () => {
    setSelectedCourse(null);
    setCourseDetail(null);
  };

  const renderCourseCard = (course, index) => (
    <Col span={6} key={index}>
      <Card
        hoverable
        title={
          <div className="course-card-title">
            <span>课程ID：{course.id}</span>
            <Tag color={course.is_enrolled ? 'green' : 'red'}>
              {course.is_enrolled ? '已选' : '未选'}
            </Tag>
          </div>
        }
        bordered
        className="class-card"
      >
        <Space direction="vertical" size="middle">
          <Text>
            <strong>教师：</strong> {course.teacher}
          </Text>
          <Text>
            <strong>人数：</strong>
            {`${course.maxStudents} / `}
            <Tag color={course.currentStudents === course.maxStudents ? 'red' : 'blue'}>
              {course.currentStudents}
            </Tag>
          </Text>
          <Space>
            <Button
              type="primary"
              onClick={() => updateCourseStatus(index, true)}
              disabled={course.is_enrolled || course.currentStudents >= course.maxStudents}
            >
              {course.is_enrolled ? '已选' : '选课'}
            </Button>
            <Button
              danger
              onClick={() => updateCourseStatus(index, false)}
              disabled={!course.is_enrolled}
            >
              退课
            </Button>
            <Button type="default" onClick={() => handleCourseClick(course)}>
              详情
            </Button>
          </Space>
        </Space>
      </Card>
    </Col>
  );

  return loading ? (
    <Spin tip="加载中..." />
  ) : (
    <div className="course-content-classer">
      <Button type="link" icon={<LeftOutlined />} onClick={() => setMode('plan')} className="back-button">
        返回
      </Button>

      <Card className="course-card">
        <h2>{courseOverview.name}</h2>
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

      <Row gutter={[16, 16]} className="class-list">
        {courses.map(renderCourseCard)}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />

      <Modal 
        title="课程详情" 
        open={!!selectedCourse} 
        onCancel={handleModalClose} 
        footer={null} 
        width={600}
        className="course-detail-modal"
      >
        {detailLoading ? (
          <Spin tip="加载详情中..." />
        ) : (
          courseDetail && (
            <div className="course-detail-content"> 
              <p>
                <strong>课程ID：</strong> {courseDetail.class_id}
              </p>
              <p>
                <strong>教师：</strong> {courseDetail.teacher_name || '未提供'}
              </p>
              <p>
                <strong>当前人数：</strong> {courseDetail.class_num} / {courseDetail.max_num}
              </p>
              <div>
                <strong>课程安排：</strong>
                <Table 
                  className="course-schedule-table"
                  dataSource={courseDetail.schedules.map((item, idx) => ({ 
                    ...item, 
                    key: idx 
                  }))} 
                  columns={columns} 
                  pagination={false} 
                  bordered 
                  size="middle" 
                />
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default CourseContentClasser;
