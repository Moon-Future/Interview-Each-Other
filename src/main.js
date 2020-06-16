import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.use(ElementUI)
Vue.config.productionTip = false

const options = { path: 'socket.io' }
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'ws://localhost:1756'
  })
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
