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
    }
    console.log('socket', this.$socket)
    this.$socket.emit('chat', '66666')
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    })
  },
  sockets: {
    connect() {
      console.log('app connect', arguments)
    },
    chatserver() {
      console.log('chat', arguments)
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
