<template>
  <nav class="nav-container">
    <ul class="page-width nav-list">
      <li v-for="(item, index) in navList" :key="index">
        <Iconfont :icon="item.icon" />
        <a href="">{{ item.name }}</a>
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
        { name: '前端', icon: 'icon-html' },
        { name: '后端', icon: 'icon-java' },
        { name: 'Android', icon: 'icon-anzhuo' },
        { name: 'IOS', icon: 'icon-ios' }
      ]
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
  line-height: 40px;
}
.nav-list {
  display: flex;
  li {
    margin-right: 20px;
    a {
      margin-left: 5px;
    }
  }
}
</style>
