import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminSider from '@/components/admin/sider';
import AdminSystem from '@/components/admin/system';

import './admin.scss';

const { Content } = Layout;

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <AdminSystem/>
    }
  };

  return (
    <Layout className="admin-layout">
      <AdminSider selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <Layout>
        <Content className="admin-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;