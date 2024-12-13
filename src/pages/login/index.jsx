import React, { useState } from 'react';
import './login.scss';
import { Button, Input, notification, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { service } from '@/service';

const { Option } = Select;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();

  const handleResend = () => {
    service.user.resendEmail(email, password, userType).then(res => {
      notificationApi.success({
        message: '邮件已发送',
        description: '请检查邮箱并点击邮件内的激活链接，如未收到请检查垃圾箱',
      });
    }).catch(err => {
      notificationApi.error({
        message: '发送失败',
        description: `${err}`,
      });
    });
  };

  const handleLogin = () => {

      service.user.auth(email, password, userType).then(res => {
        const { token, username, email, userID, avatar, admin } = res.data;
        if (token === null) {
          notificationApi.warning({
            message: "账号未激活",
            description: "请先点击邮箱内激活链接后再登录，可点击下方按钮重新发送激活邮件。",
            btn: <Button type="primary" onClick={handleResend}>重发邮件</Button>,
          });
          return;
        }
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('userID', userID);
        localStorage.setItem('avatar', `${window.baseURL}avatar/${avatar}`);
        localStorage.setItem('admin', admin);
        window.location.href = '/';
      }).catch(err => {
        if (err.response?.status === 401) {
          notificationApi.error({
            message: '登录失败',
            description: '用户名或密码错误',
          });
          setUsernameStatus('error');
          setPasswordStatus('error');
          return;
        }
        notificationApi.error({
          message: '登录失败',
          description: `${er}`,
        });
      });

  };

  const resetStatus = () => {
    setUsernameStatus('');
    setPasswordStatus('');
    setUserType('student');
  };

  return (
    <div className='login'>
      {contextHolder}
      <div className='login-box'>
        <h1 className='title'><LoginOutlined />&nbsp;登录</h1>
        <p className='description'>登录以使用完整功能</p>
        <hr className='divide' />


        <div className='input-area'>
              <Select
                value={userType}
                onChange={(value) => {
                  setUserType(value);
                  resetStatus(); 
                }}
                className='select-field'
                size="large"
              >
                <Option value="teacher">教师登录</Option>
                <Option value="student">学生登录</Option>
              </Select>

              <Input
                size='large'
                prefix={<div className='input-label'>邮箱</div>}
                className='input-field'
                value={email}
                onChange={(e) => { setEmail(e.target.value); resetStatus(); }}
                status={usernameStatus}
                onKeyDown={(e) => { if (e.key === 'Enter') window.document.getElementById('password').focus(); }}
              />
              <Input.Password
                id='password'
                size='large'
                prefix={<div className='input-label'>密码</div>}
                className='input-field'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                value={password}
                onChange={(e) => { setPassword(e.target.value); resetStatus(); }}
                status={passwordStatus}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              />
          
          <Button type='primary' className='botton' onClick={handleLogin}>登录</Button>
          <Button className='botton' onClick={() => navigate("/register")}>注册</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
