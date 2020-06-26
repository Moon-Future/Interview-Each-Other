<template>
  <div class="header-container">
    <header class="header-wrapper" :class="{ transparent: transparent }">
      <div class="page-width hedaer-menu">
        <router-link class="header-logo" to="/">Interview</router-link>
        <ul class="menu-wrapper">
          <li v-if="!loginStatus">
            <span class="menu-item-login" @click="login">登陆</span>
            <span @click="register">注册</span>
          </li>
          <template v-else>
            <li class="user-wrapper">
              <el-dropdown trigger="click">
                <div class="avatar">
                  <span>{{ userInfo.nickname }}</span>
                  <img :src="userInfo.avatar || avatar" alt="" />
                </div>
                <el-dropdown-menu slot="dropdown" class="user-menu">
                  <template v-for="(item, i) in dropdownList">
                    <el-dropdown-item v-if="(item.root && userInfo.root) || !item.root" :key="i" @click.native="goPage(item.path)">
                      <Iconfont :icon="item.icon" fontSize="20" margin="0 10px 0 0"></Iconfont>
                      {{ item.name }}
                    </el-dropdown-item>
                  </template>
                  <el-dropdown-item @click.native="logout">
                    <Iconfont icon="icon-logout" fontSize="20" margin="0 10px 0 0"></Iconfont>
                    退出登陆
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li>
              <div>在线人数：{{ onlineCounter }}</div>
            </li>
            <li>
              <router-link :to="`/room/${userInfo.id}`">房间</router-link>
            </li>
            <li>
              <el-popover placement="bottom" trigger="click">
                <div class="callrecord-container">
                  <div class="callrecord-wrapper">
                    <h3 class="descr">【Leo】邀请您进入房间 58585888 进行面试通话</h3>
                    <div class="callrecord-btn">
                      <el-button type="success" size="mini">接受</el-button>
                      <el-button type="danger" size="mini">拒绝</el-button>
                    </div>
                  </div>
                </div>
                <el-badge :value="2" slot="reference" class="badge-wrapper">
                  语音记录
                </el-badge>
              </el-popover>
              <!-- <div class="badge-wrapper">
                <span class="badge-text">语音记录</span>
                <span class="badge-num">2</span>
              </div> -->
            </li>
          </template>
        </ul>
      </div>
      <div v-if="formStatus">
        <Login></Login>
      </div>
    </header>
    <div class="header-height"></div>
  </div>
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
    },
    // 是否透明
    transparent: {
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
      show: false,
      dropdownList: [
        {
          icon: 'icon-setting',
          path: '/admin/words',
          name: '后台管理',
          root: true
        },
        {
          icon: 'icon-userinfo',
          path: '/userinfo/profile',
          name: '个人中心',
          root: false
        },
        {
          icon: 'icon-wirte',
          path: '/write',
          name: '发表主题',
          root: false
        }
      ],
      avatar: require('@/assets/avatar.jpg')
    }
  },
  computed: {
    ...mapGetters(['loginStatus', 'userInfo', 'onlineCounter', 'token'])
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
      this.$socket.emit('logout', this.token)
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
.header-wrapper {
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
  &.transparent {
    background-color: transparent;
    color: $color-white;
    .user-wrapper .avatar {
      color: $color-white;
      outline: none;
    }
  }
  @media screen and (max-width: 768px) {
    background-color: $color-white;
  }
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
    color: $color-base;
    font-weight: bold;
    margin-left: 10px;
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
      color: $color-black;
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
    display: flex;
  }
}
.github {
  font-weight: bold;
}
.header-height {
  height: 80px;
}
.badge-wrapper {
  position: relative;
  padding-right: 10px;
  cursor: pointer;
}
/deep/ .el-badge__content.is-fixed {
  top: 15px;
}
.callrecord-container {
  max-height: 500px;
  overflow: auto;
}
.callrecord-wrapper {
  border-bottom: 1px solid;
  padding: 10px;
  &:last-child {
    border: none;
  }
  .descr {
    margin-bottom: 10px;
  }
  .callrecord-btn {
    text-align: right;
  }
}
</style>
