import http from './http'

const URL = {
  register: '/api/user/register', // 用户注册
  login: '/api/user/login' // 用户登陆
}

const API = {
  /**
   * 用户注册
   * @param {Object} data {username, password, rePassword, nickname, emailCode} 用户名 密码 重复密码 昵称 邮箱验证码
   */
  register(data) {
    return http.post(URL.register, data)
  },

  /**
   * 用户登陆
   * @param {String} username 用户名
   * @param {String} password 密码
   */
  login(username, password) {
    return http.post(URL.login, { username, password })
  }
}

export default API
