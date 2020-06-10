import http from './http'

export const URL = {
  register: '/api/user/register', // 用户注册
  login: '/api/user/login', // 用户登陆
  getJob: '/api/user/getJob', // 获取职位列表
  updateUserInfo: '/api/user/updateUserInfo', // 更新用户信息
  upload: '/api/user/upload' // 图片上传
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
  },

  // 获取职位列表
  getJob() {
    return http.get(URL.getJob)
  },

  /**
   * 更新用户信息
   * @param {Object} data nickname sex job worktime profile info newPass oldPass reNew
   */
  updateUserInfo(data) {
    return http.post(URL.updateUserInfo, data)
  }
}

export default API
