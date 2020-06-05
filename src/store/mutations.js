import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, { userInfo, status, token }) {
    state.userInfo = userInfo
    state.loginStatus = status
    if (status) {
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  [types.SET_LOGINVISIABLE](state, flag) {
    state.loginVisiable = flag
  },
  [types.SET_LOGINFLAG](state, flag) {
    state.loginFlag = flag
  }
}

export default mutations
