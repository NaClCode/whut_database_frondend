import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Register from '@/pages/register';
import Feedback from '@/pages/feedback';
import Course from '@/pages/course';
import User from '@/pages/user';
import Admin from '@/pages/admin';
import Teacher from '../pages/teacher';

const Router = () => {
  const userType = localStorage.getItem('userType'); 

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />
      {userType === 'student' && <Route path="/course" element={<Course />} />}
      {userType !== 'student' && <Route path="/course" element={<Navigate to="/" replace />} />}
      <Route path="/user" element={<User />} />
      {userType === 'teacher' && <Route path="/teacher" element={<Teacher />} />}
      {userType !== 'teacher' && <Route path="/teacher" element={<Navigate to="/" replace />} />}
      {userType === 'admin' && <Route path="/admin" element={<Admin />} />}
      {userType !== 'admin' && <Route path="/admin" element={<Navigate to="/" replace />} />}
    </Routes>
  );
};

export default Router;
