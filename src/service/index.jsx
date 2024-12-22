import axios from "axios";
const { baseURL } = window;

const root = () => {
  return axios({
    baseURL,
    method: 'get',
    url: '/'
  })
};

const teacher = {
  updateInfo: (username, password, sex, introduction, profession, college, idcard) => {
    return axios({
      baseURL,
      method: 'put',
      url: '/teacher/updateInfo',
      data: {
        username,
        password,
        sex,
        introduction,
        profession,
        college,
        idcard
      }
    })
  },
  getInfo: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/teacher/getInfo',
    })
  },
  listInfo: (id) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/teacher/listInfo',
      params: {
        id
      }
    })
  }
}

const student = {
  getInfo: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/student/getInfo'
    })
  },
  updateInfo: (username, password, sex, classer, profession, college, idcard) => {
    return axios({
      baseURL,
      method: 'put',
      url: '/student/updateInfo',
      data: {
        username,
        password,
        sex,
        classer,
        profession,
        college,
        idcard
      }
    })
  }
}

const user = {
  auth: (email, password, type) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/user/auth',
      data: {
        email,
        password,
        type
      }
    })
  },
  check: () => {
    return axios({
      baseURL,
      method: 'post',
      url: '/user/check'
    })
  },
  register: (email, username, password, type) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/user/register',
      data: {
        username,
        email,
        password,
        type
      }
    })
  },
  resendEmail: (email, password, type) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/user/resendEmail',
      data: {
        email,
        password,
        type
      }
    })
  },
  feedback: (title, content) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/user/feedback',
      data: {
        title,
        content
      }
    })
  },
}

const courseplan = {
  detail: (id) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/plan/detail',
      params: {
        id
      }
    })
  },
  list: (page, pagesize, name, college, profession, credit, is_selected, type) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/plan/list',
      params: {
        name, 
        college, 
        profession, 
        credit,
        is_selected, 
        type,
        page, 
        pagesize
      }
    })
  }
}

const courseclasser = {
  detail: (id) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/classer/detail',
      params: {
        id
      }
    })
  },
  list: (id, page, pagesize) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/classer/list',
      params: {
        id,
        page,
        pagesize
      }
    })
  },
}



const course = {
  enroll: (classid) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/course/select/enroll',
      data: {
        classid
      }
    })
  },
  drop: (classid) => {
    return axios({
      baseURL,
      method: 'delete',
      url: '/course/select/drop',
      data: {
        classid
      }
    })
  },
  list: (page, pagesize, class_id, action_type) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/select/list',
      params: {
        page,
        pagesize,
        class_id,
        action_type
      }
    })
  },
  history: (page, pagesize, class_id, action_type) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/select/history',
      params: {
        page,
        pagesize,
        class_id,
        action_type
      }
    })
  },
  studentTable: (time) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/table/student/table',
      params: {
        time
      }
    })
  },
  studentDayTable: (time) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/table/student/dayTable',
      params: {
        time
      }
    })
  },
  teacherTable: (time) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/table/teacher/table',
      params: {
        time
      }
    })
  },
  teacherDayTable: (time) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/table/teacher/dayTable',
      params: {
        time
      }
    })
  },
  studentGrade: (page, pagesize) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/grade/student',
      params: {
        page,
        pagesize
      }
    })
  },
  classList: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/schedule/classList'
    })
  },
  scheduleList: (class_id) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/schedule/scheduleList',
      params: {
        class_id
      }
    })
  },
  classroomList: (class_num) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/schedule/classroomList',
      params: {
        class_num
      }
    })
  },
  schedule: (course_id, start_date, end_date, classroom, prefer) => {
    return axios({
      baseURL,
      method: 'post',
      url: '/course/schedule/schedule',
      data: {
        course_id,
        start_date,
        end_date,
        classroom,
        prefer
      }
    })
  }
}

const admin = {
  gradeTimeGet: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/admin/time/grade'
    })
  },
  gradeTimePut: (start_time, end_time) => {
    return axios({
      baseURL,
      method: 'put',
      url: '/admin/time/grade',
      data: {
        start_time,
        end_time
      }
    })
  },
  scheduleTimeGet: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/admin/time/schedule'
    })
  },
  scheduleTimePut: (start_time, end_time) => {
    return axios({
      baseURL,
      method: 'put',
      url: '/admin/time/schedule',
      data: {
        start_time,
        end_time
      }
    })
  },
  selectTimeGet: () => {
    return axios({
      baseURL,
      method: 'get',
      url: '/admin/time/select'
    })
  },
  selectTimePut: (start_time, end_time) => {
    return axios({
      baseURL,
      method: 'put',
      url: '/admin/time/select',
      data: {
        start_time,
        end_time
      }
    })
  }
}

export const service = {user, root, 
                        student, teacher,
                        courseplan, courseclasser,
                       course, admin}