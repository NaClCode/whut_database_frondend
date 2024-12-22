import React from 'react';
import Layout, { Content, Header } from 'antd/es/layout/layout';
import Navbar from './components/navbar';
import { useLocation } from 'react-router-dom';
import Router from './router';
import { checkToken } from './utils/checkToken';
import Draggable from 'react-draggable'
import './App.scss'
const App = () => {
  const { pathname } = useLocation();

  const needAuth = [];
  if (checkToken() === false) { 
    for (let path of needAuth) {
      if (pathname.startsWith(path)) {
        window.location.href = '/login';
      }
    }
  }

  const headerStyle = {
    padding: "0",
    backgroundColor: "rgba(255, 255, 255, 0)",
    zIndex: "1000"
  }

  if (pathname === "/") {
    headerStyle.position = "fixed";
  }

  const handleButtonClick = () => {
    window.location.href = AIURL;
  }

  return (
    <Layout>
      <Header style={headerStyle}>
        <Navbar />
      </Header>
      <Layout>
        <Content style={{ minHeight: "92vh" }}>
          <Router />
        </Content>
        <Draggable bounds="parent" defaultPosition={{x: 1350, y:500}}>
          <button
              className="float-button"
              type="primary"
              shape="circle"
              onClick={handleButtonClick}
            />
        </Draggable>
      </Layout>
    </Layout>
  );
}

export default App;
