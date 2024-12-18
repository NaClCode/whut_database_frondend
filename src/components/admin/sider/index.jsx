import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, DesktopOutlined, SolutionOutlined} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  { key: '1', icon: <UserOutlined />, label: '人员管理' },
  { key: '2', icon: <DesktopOutlined />, label: '系统管理' },
  { key: '3', icon: <SolutionOutlined />, label: '课程管理' },
];

const AdminSider = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <Sider collapsible className="admin-sider">
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={menuItems}
        onSelect={({ key }) => setSelectedMenu(key)}
        selectedKeys={[selectedMenu]}
      />
    </Sider>
  );
};

export default AdminSider;
