import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Register from '@/pages/register'
import Feedback from '@/pages/feedback';
import CourseList from '@/pages/courseList';
import CourseSchedule from '@/pages/courseschedule';
import User from '@/pages/user';
const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/feedback' element={<Feedback/>}/>
      <Route path='/courseList' element={<CourseList/>}/>
      <Route path='/courseSchedule' element={<CourseSchedule/>}/>
      <Route path='/user' element={<User/>}/>
    </Routes>
  )
}

export default Router;