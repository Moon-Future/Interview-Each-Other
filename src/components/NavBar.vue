<template>
  <nav class="nav-container">
    <ul class="nav-list">
      <li v-for="(item, index) in navList" :key="index">
        <div class="icon-wrapper">
          <Iconfont :icon="item.icon" :color="item.color" />
        </div>
        <a href="" :class="{ active: active === index }">{{ item.name }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'

export default {
  data() {
    return {
      navList: [
        { name: '前端', icon: 'icon-html', color: 'initial' },
        { name: '后端', icon: 'icon-java', color: 'initial' },
        { name: 'Android', icon: 'icon-anzhuo', color: '#67C23A' },
        { name: 'IOS', icon: 'icon-ios', color: '#b3aeae' }
      ],
      active: 1
    }
  },
  components: {
    Iconfont
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';
.nav-container {
  background: $color-white;
  padding: 20px 0 0 20px;
  border-radius: 4px 4px 0 0;
  @media screen and (max-width: 768px) {
    display: none;
  }
}
.nav-list {
  display: flex;
  li {
    margin-right: 20px;
    display: flex;
    align-items: center;
    user-select: none;
    .icon-wrapper {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: $color-shallowgray;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a {
      margin-left: 5px;
      &.active {
        color: $color-base;
      }
    }
  }
}
</style>
