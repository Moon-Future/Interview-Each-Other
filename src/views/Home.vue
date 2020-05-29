<template>
  <div class="home">
    <div class="home-banner">
      <p class="title">看再多，不如说出来</p>
      <p class="subtitle">只语音，不视频，寻找小伙伴来一起互相面试吧</p>
      <el-button type="success" @click.native="join">立即加入</el-button>
    </div>
    <Header ref="header" formStatus :transparent="transparent" />
    <div class="container">
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

export default {
  name: 'Home',
  components: {
    Header,
    TopicList,
    RightBar
  },
  data() {
    return {
      transparent: true
    }
  },
  created() {
    const self = this
    document.addEventListener('scroll', function(e) {
      let scrollTop = document.documentElement.scrollTop
      self.transparent = scrollTop >= 350 ? false : true
    })
  },
  methods: {
    join() {
      this.$refs.header.login()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.home-banner {
  height: 400px;
  width: 100%;
  background-image: url('../assets/home-bg.png');
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
}
.home-bg {
  width: 100%;
}
.container {
  position: absolute;
  top: 350px;
  width: 100%;
  border-radius: 20px;
}
.home-content {
  margin: 20px auto;
  position: relative;
}
</style>
