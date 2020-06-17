import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, { userInfo, status, token }) {
    state.userInfo = userInfo
    if (status !== undefined) {
      state.loginStatus = status
      if (status) {
        localStorage.setItem('token', token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        state.token = token
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        state.token = ''
      }
    }
  },
  [types.SET_LOGINVISIABLE](state, flag) {
    state.loginVisiable = flag
  },
  [types.SET_LOGINFLAG](state, flag) {
    state.loginFlag = flag
  },
  ['SOCKET_onlineCounter'](state, counter) {
    state.onlineCounter = counter
  }
}

export default mutations
