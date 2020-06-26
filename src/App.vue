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
  data() {
    return {
      notifications: {}
    }
  },
  created() {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    if (token) {
      this.setUserInfo({ userInfo: JSON.parse(userInfo), status: true, token })
      this.$socket.emit('login', token)
    }
  },
  methods: {
    acceptCall(sourceUserId) {
      let notify = this.notifications[sourceUserId]
      delete this.notifications[sourceUserId]
      notify.close()
      this.$socket.emit('acceptCall', sourceUserId)
      this.$router.push({
        path: `/room/${sourceUserId}`
      })
    },
    refuseCall(sourceUserId) {
      if (this.notifications[sourceUserId]) {
        this.$socket.emit('refuseCall', sourceUserId)
      }
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
      const { sourceUser } = data
      const createElement = this.$createElement
      let notify = this.$notify({
        duration: 0,
        message: createElement('div', {}, [
          createElement('h3', { style: { paddingBottom: '10px' } }, `【${sourceUser.nickname}】邀请您进入房间 ${sourceUser.id} 进行面试通话`),
          createElement('div', { style: { textAlign: 'right' } }, [
            createElement(
              'el-button',
              {
                attrs: {
                  type: 'success',
                  size: 'mini'
                },
                on: {
                  click: () => {
                    this.acceptCall(sourceUser.id)
                  }
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
                  click: () => {
                    notify.close()
                  }
                }
              },
              '拒绝'
            )
          ])
        ]),
        onClose: () => {
          this.refuseCall(sourceUser.id)
        }
      })
      this.notifications[sourceUser.id] = notify
    },
    // 通话请求挂断
    breakCall(data) {
      const { sourceUser } = data
      this.notifications[sourceUser.id].close()
      delete this.notifications[sourceUser.id]
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
