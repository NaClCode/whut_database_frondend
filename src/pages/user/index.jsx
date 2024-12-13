import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, List, notification, Input, Button, Upload, message } from 'antd';
import { MailOutlined, LockOutlined, CrownOutlined, UploadOutlined, EditOutlined, CheckOutlined, CloseOutlined, PayCircleOutlined } from '@ant-design/icons';
import './user.scss';
import {service} from '@/service'

const { Title, Text } = Typography;

const User = () => {
  const [avatar, setAvatar] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [confirmStatus, setConfirmStatus] = useState("");
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [messageApi, msgContextHolder] = message.useMessage();
  const [userLevel, setUserLevel] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    service.user.info().then(res => {
      const { userID, email, username } = res.data.data;
      setUserID(userID);
      setEmail(email);
      setUsername(username);
    }).catch(err => {
      notificationApi.error({
        message: '获取用户信息失败',
        description: `${err}`
      });
    });
    // eslint-disable-next-line
  }, []);


  const handleUpdate = () => {
    if (username.length < 4 || username.length > 20) {
      setUsernameStatus('error');
      notificationApi.error({
        message: '用户名错误',
        description: '用户名长度应在 4~20 个字符之间'
      });
      return;
    }
    if (isUpdatePassword) {
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
    }
    service.user.updateInfo(username, password).then(res => {

      
      messageApi.success('更新成功');
    }).catch(err => {
      notificationApi.error({
        message: '更新失败',
        description: `${err}`
      });
    });
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleEditingEmail = () => {
    if(isEditingEmail){
      handleUpdate();
    }
    setIsEditingEmail(!isEditingEmail);
  };

  const toggleEditingPassword = () => {
    if(isEditingPassword){
      handleUpdate();
    }
    setIsEditingPassword(!isEditingPassword);
  };

  const togglePay = () => {
    ///支付函数
  }

  const onAvatarChange = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        service.user.info().then(res => {
          localStorage.setItem('avatar', `${window.baseURL}avatar/${res.data.data.avatar}`);
          window.location.reload();
        }).catch(err => {
          notificationApi.error({
            message: '获取用户信息失败',
            description: `${err}`
          });
        })
      }
      reader.readAsDataURL(info.file.originFileObj);
    }
  }

  return (
    <div className='user'>
      <Card className="user-profile-card">
        <div className="avatar-container">
          
          <Title level={1}>{username}</Title>
        </div>
        <Card.Meta
          description={
            <List>
              <List.Item>
                <div className="list-item">
                  
                  <Text strong className="list-label"> <MailOutlined /> &nbsp; 邮箱: </Text>
                  {isEditingEmail ? (
                    <>
                      
                      <Input value={email} onChange={handleEmailChange} className="input-field" />
                      <div className='button-group'>
                        <Button icon={<CheckOutlined />} onClick={toggleEditingEmail} type="primary" className="icon-button" />
                        <Button icon={<CloseOutlined />} onClick={toggleEditingEmail} className="icon-button" />
                      </div>
                      
                    </>
                  ) : (
                    <>
                      <Text className="text-field">{email}</Text>
                      <Button icon={<EditOutlined />} onClick={toggleEditingEmail} className="edit-button">编辑</Button>
                    </>
                  )}
                </div>
              </List.Item>
              <List.Item>
                <div className="list-item">
                  
                  <Text strong className="list-label"><LockOutlined /> &nbsp; 密码: </Text>
                  {isEditingPassword ? (
                    <>
                      <Input.Password value={password} onChange={handlePasswordChange} className="input-field" />
                      <div className='button-group'>
                        <Button icon={<CheckOutlined />} onClick={toggleEditingPassword} type="primary" className="icon-button" />
                        <Button icon={<CloseOutlined />} onClick={toggleEditingPassword} className="icon-button" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Text className="text-field">*********</Text>
                      <Button icon={<EditOutlined />} onClick={toggleEditingPassword} className="edit-button">编辑</Button>
                    </>
                  )}
                </div>
              </List.Item>
              <List.Item>
                <div className="list-item">
                  <Text strong className="list-label"> <CrownOutlined/> &nbsp; 会员: </Text>
                  <Text className="text-field"></Text>
                  <Button icon={<PayCircleOutlined />} onClick={togglePay} className="edit-button" >充值</Button>
                </div>
              </List.Item>
              <List.Item>
                <div className="list-item">
                  
                  <Text strong className="list-label"><UploadOutlined /> &nbsp;  头像: </Text>
                  <Text className="text-field"></Text>
                  
                  <Upload
                    className='upload'
                    action={`${window.baseURL}user/uploadAvatar`}
                    headers={{ Authorization: localStorage.getItem('token') }}
                    onChange={onAvatarChange}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} className="upload-button">上传</Button>
                  </Upload>
                </div>
              </List.Item>
            </List>
          }
        />
      </Card>
    </div>
  );
};


export default User;
