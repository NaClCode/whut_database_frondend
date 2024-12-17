import React, { useState } from 'react';
import { Layout } from 'antd';
import CourseSider from '@/components/sider';
import CourseContent from '@/components/course/content';
import CourseTable from '@/components/course/table';
import CourseHistoryTable from '@/components/course/history';
import './course.scss';

const { Content } = Layout;

const CourseList = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <CourseContent/>;
      case '2':
        return <CourseHistoryTable/>;
      case '3':
        return <CourseTable/>;
      default:
        return <div>暂无内容</div>;
    }
  };

  return (
    <Layout className="course-layout">
      <CourseSider selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <Layout>
        <Content className="course-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseList;
