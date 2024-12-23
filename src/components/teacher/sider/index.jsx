import React from 'react';
import { Layout, Menu } from 'antd';
import { CalendarOutlined, TableOutlined, BarChartOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  { key: '1', icon: <CalendarOutlined />, label: '实验排课' },
  { key: '2', icon: <TableOutlined />, label: '课表' },
  { key: '3', icon: <BarChartOutlined />, label: '成绩' },
];

const TeacherSider = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <Sider collapsible className="teacher-sider">
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

export default TeacherSider;

