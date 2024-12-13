import React, { useState } from 'react';
import './feedback.scss';
import { Button, Input, notification, Rate } from 'antd';
import { ExceptionOutlined } from '@ant-design/icons';
import { service } from '@/service';

const Feedback = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [Rating, setRating] = useState(0);
  const [fileList, setFileList] = useState([]);
  const handleSubmit = () => {
    if (!title || !content) {
      notificationApi.error({
        message: '提交失败',
        description: '标题和内容不能为空',
      });
      return;
    }
    service.user.feedback(title, content).then(res => {
      notificationApi.success({
        message: '提交成功',
        description: '感谢您的反馈，我们会尽快处理',
      });
      setTitle('');
      setContent('');
    }).catch(err => {
      notificationApi.error({
        message: '提交失败',
        description: `${err}`,
      });
    });
  }
 
  return (
    <div className='feedback'>
      {notificationContextHolder}
      <div className='feedback-box'>
        <h1 className='title'><ExceptionOutlined />&nbsp;反馈</h1>
        <p className='description'>对于此应用，请填写您的反馈</p>
        <hr className='divide' />
        <div style={{display: 'flex', flexDirection: "column", gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: "column", gap: '20px'}}>
              <div>评分：<Rate onChange={setRating} value={Rating} /></div>
          </div>
          <div className='input-area'>
            <Input
              size='large'
              prefix={<div className='input-label'>应用评价</div>}
              className='input-field'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input.TextArea
              size='large'
              rows={4}
              placeholder='在此输入详情'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          
            <Button type='primary' className='botton' onClick={handleSubmit}>提交</Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Feedback;