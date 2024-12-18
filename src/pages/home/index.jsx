import React from 'react';
import './home.scss';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="container">
        <div className="left-section">
          <h1>教务系统</h1>
          <button className="login-button" onClick={() => navigate('/login')}>登录</button>
          <button className="register-button" onClick={() => navigate('/register')}>注册</button>
        </div>
        <div className="right-section">
          <img src="/home.png" alt="Home" />
        </div>
      </div>
    </div>
  );
}

export default Home;
