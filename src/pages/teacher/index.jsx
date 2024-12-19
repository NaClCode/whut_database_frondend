import React, { useState } from 'react';
import { Layout } from 'antd';
import TeacherSider from '@/components/teacher/sider';
import './teacher.scss';

const { Content } = Layout;

const Teacher = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <div>1</div>
      case '2':
        return <div>2</div>
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