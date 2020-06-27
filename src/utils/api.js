import http from './http'

export const URL = {
  // 用户
  register: '/api/user/register', // 用户注册
  login: '/api/user/login', // 用户登陆
  getJob: '/api/user/getJob', // 获取职位列表
  updateUserInfo: '/api/user/updateUserInfo', // 更新用户信息
  upload: '/api/user/upload', // 图片上传
  // 主题
  wirte: '/api/topic/write', // 发表主题
  getTopic: '/api/topic/getTopic', // 获取主题列表
  getTopicContent: '/api/topic/getContent', // 获取主题内容
  writeReply: '/api/topic/writeReply', // 评论
  getReply: '/api/topic/getReply', // 获取评论列表

  // 房间
  entryInfo: '/api/room/message', // 进入，离开页面信息测试
  getUserSig: '/api/room/getUserSig' // 生成用户凭证
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
  },

  /**
   * 发表主题
   */
  write(data) {
    return http.post(URL.wirte, data)
  },

  /**
   * 获取主题列表
   */
  getTopic() {
    return http.get(URL.getTopic)
  },

  /**
   * 获取主题内容
   */
  getTopicContent(topicId) {
    return http.get(URL.getTopicContent, { params: { topic: topicId } })
  },

  /**
   * 评论
   */
  writeReply(topicId, content) {
    return http.post(URL.writeReply, { topic: topicId, content })
  },

  /**
   * 获取评论列表
   */
  getReply(topicId) {
    return http.get(URL.getReply, { params: { topic: topicId } })
  },

  entryInfo(message) {
    return http.post(URL.entryInfo, { message })
  },

  // 获取语音连接用户凭证
  getUserSig(userId) {
    return http.get(URL.getUserSig, { params: { userId } })
  }
}

export default API
