<template>
  <div class="home">
    <div class="home-banner" :style="{ height: height + 'px' }">
      <p class="title">看再多，不如说出来</p>
      <p class="subtitle">只语音，不视频，寻找小伙伴来一起互相面试吧</p>
      <el-button type="success" @click.native="join">立即加入</el-button>
    </div>
    <Header ref="header" formStatus :transparent="transparent" />
    <div
      class="container"
      :style="{ top: (mobeil ? 50 : height - 100) + 'px' }"
    >
      <div class="home-content page-width">
        <topic-list></topic-list>
        <right-bar></right-bar>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import TopicList from '@/components/TopicList.vue'
import RightBar from '@/components/RightBar.vue'
import { throttle } from '@/utils/util'
import http from '@/utils/http.js'

export default {
  name: 'Home',
  components: {
    Header,
    TopicList,
    RightBar
  },
  data() {
    return {
      transparent: true,
      height: 400,
      mobeil: false
    }
  },
  created() {
    const self = this
    this.resizeHandle()
    document.addEventListener('scroll', function(e) {
      if (self.mobeil) return
      self.transparent =
        document.documentElement.scrollTop >= self.height - 100 ? false : true
    })
    window.addEventListener(
      'resize',
      throttle(function() {
        self.resizeHandle()
      }, 500)
    )
  },
  methods: {
    join() {
      this.$refs.header.login()
    },
    resizeHandle() {
      this.height = Math.max(400, (window.innerHeight * 3) / 5)
      this.mobeil = window.innerWidth <= 768 ? true : false
      this.transparent = this.mobeil ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.home-banner {
  height: 400px;
  width: 100%;
  background-image: url('../assets/home-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  .title {
    color: $color-white;
    font-size: 3.75rem;
    font-weight: bold;
  }
  .subtitle {
    color: $color-white;
    margin: 20px;
    font-size: 1.4rem;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
}
.home-bg {
  width: 100%;
}
.container {
  position: absolute;
  top: 350px;
  width: 100%;
  border-radius: 20px;
  @media screen and (max-width: 768px) {
    top: 50px;
  }
}
.home-content {
  margin: 20px auto;
  position: relative;
  @media screen and (max-width: 768px) {
    margin: auto;
  }
}
</style>
