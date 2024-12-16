import React from 'react';
import { Layout, Menu } from 'antd';
import { BookOutlined, ReadOutlined, CheckCircleOutlined, TableOutlined, TrophyOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  { key: '1', icon: <BookOutlined />, label: '选课' },
  { key: '2', icon: <ReadOutlined />, label: '选课记录' },
  { key: '3', icon: <TableOutlined />, label: '课表' },
  { key: '4', icon: <TrophyOutlined />, label: '成绩' },
];

const CourseSider = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <Sider collapsible className="course-sider">
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

export default CourseSider;
