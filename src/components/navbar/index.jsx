import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, Popover, Space, message } from 'antd';
import './navbar.scss';
import { UserOutlined, LoginOutlined, LogoutOutlined, ControlOutlined, FormOutlined } from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();

  const onLogout = () => {
    navigate('/login');
    messageApi.success('退出成功，即将跳转到登录页面');
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userID");
    localStorage.removeItem("userType");
    window.location.reload();
  };

  const userPopoverContent = (
    <div className="navbar-user-popover">
      {localStorage.getItem('token') === null ? (
        <Space size="small" direction="vertical">
          <Button type="link" className="item clickable" onClick={() => navigate('/login')}>
            <LoginOutlined />&nbsp;登录
          </Button>
          <Button type="link" className="item clickable" onClick={() => navigate('/register')}>
            <FormOutlined />&nbsp;注册
          </Button>
        </Space>
      ) : (
        <Space size="small" direction="vertical">
          <div className="item">{`${localStorage.getItem('username')} #${localStorage.getItem('userID')}`}</div>
          <div className="divide"></div>
          <Button type="link" className="item clickable" onClick={() => navigate('/user')}>
            <UserOutlined />&nbsp;个人信息
          </Button>
          {localStorage.getItem('admin') === '1' ? (
            <div className="item clickable" onClick={() => navigate('/admin/user')}>
              <ControlOutlined />&nbsp;管理面板
            </div>
          ) : null}
          <Button type="link" className="item clickable" onClick={onLogout}>
            <LogoutOutlined />&nbsp;退出登录
          </Button>
        </Space>
      )}
    </div>
  );

  const colorExtraStyle = {
    color: 'white',
  };

  const navExtraStyle = {
    backgroundColor: '#007bff',
    borderBottom: '#007bff 1px solid',
  };

  const userType = localStorage.getItem('userType');

  return (
    <div className="navbar" style={navExtraStyle}>
      {messageContextHolder}
      <div className="left">
        <img className="icon" src="/logo.png" alt="" />
        <Link to="/" style={colorExtraStyle} className="title small-hide">
          <span className="title-span">教务管理平台</span>
        </Link>
      </div>
      <div className="right">
        <div className="nav-link">
          <Link style={colorExtraStyle} className="link" to="/">
            首页
          </Link>
          {userType === 'student' && (
            <Link style={colorExtraStyle} className="link" to="/course">
              课程
            </Link>
          )}
          {userType === 'teacher' && (
            <Link style={colorExtraStyle} className="link" to="/teacher">
              教师
            </Link>
          )}
            {/* <Link style={colorExtraStyle} className="link" to="/admin">
              管理
            </Link> */}
          <Link style={colorExtraStyle} className="link small-hide" to="/feedback">
            反馈
          </Link>
        </div>
        <Popover content={userPopoverContent}>
          <Avatar size={40}>
            <UserOutlined />
          </Avatar>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
