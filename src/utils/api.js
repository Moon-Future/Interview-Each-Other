import http from './http'

const URL = {
  // 用户注册
  register: '/api/user/register',
  login: ''
}

const API = {
  /**
   * 用户注册
   * @param {username, password, rePassword, nickname, emailCode} data
   */
  register(data) {
    return http.post(URL.register, data)
  },

  login() {
    return http.post(URL.login, {
      username: '',
      password: ''
    })
  }
}

export default API
