<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  created() {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    if (token) {
      this.setUserInfo({ userInfo: JSON.parse(userInfo), status: true, token })
      this.$socket.emit('login', token)
    }
  },
  methods: {
    // 通话请求
    chatRequest() {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 0
      })
    },
    acceptCall() {
      console.log('acceptCall')
    },
    refuseCall() {
      console.log('refuseCall')
    },
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    })
  },
  sockets: {
    connect() {
      console.log('socket connect')
    },
    disconnect() {
      console.log('socket disconnected') // 监听socket断开
    },
    // 通话请求
    callRequest(data) {
      console.log('callRequest', data)
      const { sourceUser } = data
      const createElement = this.$createElement
      const self = this
      this.$notify({
        duration: 0,
        message: createElement('div', {}, [
          createElement('h3', {}, `【${sourceUser.nickname}】邀请您进入房间 ${sourceUser.id} 进行面试通话`),
          createElement('div', { style: { textAlign: 'right' } }, [
            createElement(
              'el-button',
              {
                attrs: {
                  type: 'success',
                  size: 'mini'
                },
                on: {
                  click: self.acceptCall
                }
              },
              '接受'
            ),
            createElement(
              'el-button',
              {
                attrs: {
                  type: 'danger',
                  size: 'mini'
                },
                on: {
                  click: self.refuseCall
                }
              },
              '拒绝'
            )
          ])
        ])
      })
    },
    // 通话请求响应
    callResponse(data) {
      console.log('callRequest', data)
    }
  }
}
</script>

<style lang="scss">
@import './scss/reset.scss';
@import './scss/common.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  color: $color-black;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    // color: #2c3e50;
    color: $color-black;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
