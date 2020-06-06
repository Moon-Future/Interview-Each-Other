<template>
  <div class="userinfo-container page-width">
    <Header ref="header" formStatus :transparent="transparent" />
    <div class="userinfo-base">
      <div class="base-left">
        <img class="avatar" :src="userInfo.avatar" alt="" />
        <Iconfont
          class="avatar-editor"
          icon="icon-editor"
          fontSize="40"
        ></Iconfont>
      </div>
      <div class="base-right">
        <p>
          <span class="username">{{ userInfo.nickname }}</span>
          <span class="job">前端</span>
        </p>
        <p>4年工作经验</p>
        <p class="descr">
          可能你还没有注意到，Vue 在更新 DOM
          时是异步执行的。只要侦听到数据变化，Vue
          将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个
          watcher
          被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和
          DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue
          刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的
          Promise.then、MutationObserver 和
          setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
        </p>
      </div>
    </div>
    <div class="userinfo-detail">
      <div class="left-menu">
        <ul>
          <router-link
            tag="li"
            :to="item.url"
            :class="{ 'active-menu': index === activeIndex }"
            v-for="(item, index) in menuList"
            :key="index"
            @click.native="changeMenu(index)"
          >
            <Iconfont
              :icon="`${item.icon}${index === activeIndex ? '-active' : ''}`"
              margin="0 10px 0 0"
            />{{ item.text }}
          </router-link>
        </ul>
      </div>
      <div class="right-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Iconfont from '@/components/Iconfont.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'UserInfo',
  components: {
    Header,
    Iconfont
  },
  data() {
    return {
      menuList: [
        { text: '基本信息', icon: 'icon-user', url: '/userinfo' },
        { text: '语音记录', icon: 'icon-call', url: '/userinfo/record' },
        { text: '修改密码', icon: 'icon-password', url: '/userinfo/safe' }
      ],
      activeIndex: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    changeMenu(index) {
      this.activeIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.userinfo-base {
  display: flex;
  background: $color-white;
  padding-top: 20px;
}
.base-left {
  position: relative;
  width: 200px;
  height: 200px;
  margin-right: 20px;
  flex: 0 0 auto;
  @media screen and (max-width: 768px) {
    display: none;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .avatar-editor {
    position: absolute;
    top: 110px;
    right: 34px;
  }
}
.base-right {
  padding: 0 10px;
  p {
    text-align: left;
    line-height: 2rem;
  }
  .username {
    font-size: 2rem;
    font-weight: bold;
    margin-right: 20px;
  }
  .job {
    color: $color-origin;
  }
  .descr {
    color: $color-gray;
  }
}
.userinfo-detail {
  background: $color-white;
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  padding: 30px 0;
  display: flex;
  @media screen and (max-width: 768px) {
    display: block;
  }
}
.left-menu {
  width: 200px;
  margin-right: 20px;
  flex: 0 0 auto;
  ul {
    width: 150px;
    display: inline-block;
  }
  li {
    padding: 10px;
    border: 1px solid #dcdcdc;
    margin-bottom: 20px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    &.active-menu {
      border-color: $color-base;
      color: $color-base;
    }
  }
  @media screen and (max-width: 768px) {
    width: initial;
    margin-right: 0;
    ul {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
  }
}
.right-content {
  width: 100%;
  padding: 0 10px;
  @media screen and (max-width: 768px) {
    width: initial;
  }
}
</style>
