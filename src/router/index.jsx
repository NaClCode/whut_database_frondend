import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Register from '@/pages/register';
import Feedback from '@/pages/feedback';
import Course from '@/pages/course';
import User from '@/pages/user';

const Router = () => {
  const userType = localStorage.getItem('userType'); // Retrieve the user type from localStorage

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />
      {userType === 'students' && <Route path="/course" element={<Course />} />}
      <Route path="/user" element={<User />} />
      {userType !== 'students' && <Route path="/course" element={<Navigate to="/" replace />} />}
    </Routes>
  );
};

export default Router;
