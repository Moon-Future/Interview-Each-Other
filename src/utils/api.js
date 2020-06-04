import http from './http'

const URL = {
  login: ''
}

const API = {
  login() {
    return http.post(URL.login, {
      username: '',
      password: ''
    })
  }
}

export default API
