import React, { useState } from 'react';
import { Layout } from 'antd';
import CourseSider from '@/components/sider';
import CourseContent from '@/components/courseContent';
import './courseList.scss';

const { Content } = Layout;

const CourseList = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  return (
    <Layout className="course-layout">
      <CourseSider selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <Layout>
        <Content className="course-content">
          <CourseContent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseList;
