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
      method: 'post',
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
      method: 'post',
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
  list: (page, pagesize) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/plan/list',
      params: {
        page,
        pagesize
      }
    })
  },
  search: (page, pagesize, name, college, profession, credit, is_selected, type) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/plan/search',
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

const courseschedule = {
  detail: (id) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/schedule/detail',
      params: {
        id
      }
    })
  },
  list: (id, page, pagesize) => {
    return axios({
      baseURL,
      method: 'get',
      url: '/course/schedule/list',
      params: {
        id,
        page,
        pagesize
      }
    })
  },
}

export const service = {user, root, 
                        student, teacher,
                        courseplan, courseclasser,
                        courseschedule,}