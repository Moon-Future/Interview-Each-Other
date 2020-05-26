<template>
  <header class="header-container">
    <div class="page-width hedaer-menu">
      <router-link class="header-logo" to="/">Interview</router-link>
      <ul class="menu-wrapper">
        <li v-if="!loginStatus">
          <span class="menu-item-login" @click="login">登陆</span>
          <span @click="register">注册</span>
        </li>
        <li v-else class="user-wrapper">
          <el-dropdown trigger="click">
            <div class="avatar">
              <span>{{ userInfo.name }}</span>
              <img :src="userInfo.avatar || avatar" alt="" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-menu">
              <template v-for="(item, i) in dropdownList">
                <el-dropdown-item
                  v-if="(item.root && userInfo.root) || !item.root"
                  :key="i"
                  @click.native="goPage(item.path)"
                >
                  <Iconfont :icon="item.icon"></Iconfont>{{ item.name }}
                </el-dropdown-item>
              </template>
              <el-dropdown-item @click.native="logout">
                <Iconfont icon="icon-logout"></Iconfont>登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <div v-if="formStatus">
      <Login></Login>
    </div>
  </header>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import Login from '@/components/Login.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Header',
  props: {
    formStatus: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Iconfont,
    Login
  },
  data() {
    return {
      dropdownList: [
        {
          icon: 'icon-setting',
          path: '/admin/words',
          name: '后台管理',
          root: true
        },
        {
          icon: 'icon-user',
          path: '/user/words',
          name: '我的主页',
          root: false
        }
      ],
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['loginStatus', 'userInfo'])
  },
  methods: {
    login() {
      this.setLoginVisiable(true)
      this.setLoginFlag(true)
    },
    register() {
      this.setLoginVisiable(true)
      this.setLoginFlag(false)
    },
    logout() {
      localStorage.removeItem('token')
      this.setUserInfo({ userInfo: {}, status: false })
      if (this.$route.path !== '/') {
        this.$router.push({ path: '/' })
      }
    },
    goPage(path) {
      if (this.$route.path === path) {
        return
      }
      this.$router.push({ path })
    },
    ...mapMutations({
      setUserInfo: 'SET_USERINFO',
      setLoginVisiable: 'SET_LOGINVISIABLE',
      setLoginFlag: 'SET_LOGINFLAG'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: $color-white;
  z-index: 99;
  border-bottom: 1px solid rgba(0, 0, 0, 0.22);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.22);
  height: 50px;
  box-sizing: border-box;
}
.hedaer-menu {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  user-select: none;
  .header-logo {
    cursor: pointer;
    font-family: rubik, arial;
    color: $color-green;
    font-weight: bold;
  }
}
.menu-wrapper {
  display: flex;
  justify-content: flex-end;
  li {
    margin: 0 10px;
    span {
      cursor: pointer;
    }
    .menu-item-login::after {
      content: '';
      margin-right: 10px;
    }
    &.user-wrapper .avatar {
      cursor: pointer;
      display: flex;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: auto 0 auto 5px;
      }
    }
  }
}
.user-menu {
  li {
    color: $color-gray;
  }
}
.github {
  font-weight: bold;
}
</style>
