import React, { useState } from 'react';
import { Layout } from 'antd';
import TeacherSider from '@/components/teacher/sider';
import './teacher.scss';
import TeacherGrades from '@/components/teacher/grade';
import TeacherTable from '@/components/teacher/table';
import TeacherSchedule from '@/components/teacher/schedule';
const { Content } = Layout;

const Teacher = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <TeacherSchedule/>
      case '2':
        return <TeacherTable/>
      case '3':
        return <TeacherGrades/>
    }
  };

  return (
    <Layout className="teacher-layout">
      <TeacherSider selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <Layout>
        <Content className="teacher-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Teacher;