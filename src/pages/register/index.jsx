import React, { useState } from 'react';
import './register.scss';
import { Button, Input, message, notification,Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { service } from '@/service';

const { Option } = Select;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [confirmStatus, setConfirmStatus] = useState('');
  const [userType, setUserType] = useState('student');

  const navigate = useNavigate();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const resetStatus = () => {
    setEmailStatus('');
    setUsernameStatus('');
    setPasswordStatus('');
    setConfirmStatus('');

  }

  const handleResend = () => {
    service.user.resendEmail(email, password).then(res => {
      notificationApi.success({
        message: '邮件已发送',
        description: '请检查邮箱并点击邮件内的激活链接，如未收到请检查垃圾箱'
      });
    }).catch(err => {
      notificationApi.error({
        message: '发送失败',
        description: `${err}`
      });
    });
  }

  const handleRegister = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailStatus('error');
      notificationApi.error({
        message: '邮箱错误',
        description: '请输入正确的邮箱地址'
      });
      return;
    }
    if (email.length > 30) {
      setEmailStatus('error');
      notificationApi.error({
        message: '邮箱错误',
        description: '邮箱长度应小于 30 个字符'
      });
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setUsernameStatus('error');
      notificationApi.error({
        message: '用户名错误',
        description: '用户名长度应在 4~20 个字符之间'
      });
      return;
    }
    if (password.length < 6 || password.length > 20) {
      setPasswordStatus('error');
      setConfirmStatus('error');
      notificationApi.error({
        message: '密码错误',
        description: '密码长度应在 6~20 个字符之间'
      });
      return;
    }
    if (password !== confirm) {
      setPasswordStatus('error');
      setConfirmStatus('error');
      notificationApi.error({
        message: '密码错误',
        description: '两次输入的密码不一致'
      });
      return;
    }
    service.user.register(email, username, password, userType).then(() => {
      messageApi.success('注册成功，即将跳转到登录页面');
      setTimeout(() => {
        handleResend(email, password);
        navigate('/login');
        
      }, 1500);
    }).catch(err => {
      notificationApi.error({
        message: '注册失败',
        description: `${err}`
      });
    });
  }

  return (
    <div className='register'>
      {notificationContextHolder}
      {messageContextHolder}
      <div className='login-box'>
        <h1 className='title'><FormOutlined />&nbsp;注册</h1>
        <p className='description'>在此注册新账号</p>
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
              <Option value="teacher">教师</Option>
              <Option value="student">学生</Option>
          </Select>

          <Input
            size='large'
            prefix={<div className='input-label'>邮箱</div>}
            className='input-field'
            value={email}
            onChange={(e) => { setEmail(e.target.value); resetStatus(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') window.document.getElementById('username').focus(); }}
            status={emailStatus}
          />
          <Input
            id='username'
            size='large'
            prefix={<div className='input-label'>昵称</div>}
            className='input-field'
            value={username}
            onChange={(e) => { setUsername(e.target.value); resetStatus(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') window.document.getElementById('password').focus(); }}
            status={usernameStatus}
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
            onKeyDown={(e) => { if (e.key === 'Enter') window.document.getElementById('confirm').focus(); }}
          />
          <Input.Password
            id='confirm'
            size='large'
            prefix={<div className='input-label'>确认</div>}
            className='input-field'
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); resetStatus(); }}
            status={confirmStatus}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRegister(); }}
          />
          <Button type='primary' className='login-botton' onClick={handleRegister}>注册</Button>
          <Button className='register-botton' onClick={() => navigate("/login")}>登录</Button>
        </div>
      </div>
    </div>
  );
}

export default Register;