<template>
  <div class="topic-detail">
    <Header ref="header" formStatus />
    <div class="container page-width">
      <div class="left">
        <div class="topic-top">
          <div class="topic-header">
            <div class="header-left">
              <h3 class="title">
                社区/论坛类的是不是不太行了，怎么还没看见前后端分离的成熟产品呢？
              </h3>
            </div>
            <img class="avatar" :src="topic.src" alt="" />
          </div>
          <div class="topic-content">
            <p>每天写代码不能进步</p>
            <p>如果作为产品或者其他的 能想到把积累的数据产生回报</p>
            <p>程序员如何往这方面发展呢 比如我有一个 idea</p>
          </div>
        </div>
        <topic-reply></topic-reply>
      </div>
      <right-bar></right-bar>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import RightBar from '@/components/RightBar.vue'
import TopicReply from '@/components/TopicReply.vue'

export default {
  name: 'TopicDetail',
  components: {
    Header,
    RightBar,
    TopicReply
  },
  data() {
    return {
      topic: {
        src: require('@/assets/avatar.jpg')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.container {
  position: relative;
  word-break: break-all;
}
.left {
  margin-right: 260px;
  @media screen and (max-width: 768px) {
    margin-right: 0;
  }
}
.topic-top {
  background: $color-white;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}
.topic-header {
  position: relative;
  min-height: 120px;
  border-bottom: 1px solid #e2e2e2;
}
.header-left {
  display: flex;
  padding: 20px 100px 20px 10px;
  text-align: left;
  .title {
    color: #333;
    font-weight: bold;
    line-height: 2rem;
    font-size: 1.5rem;
  }
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  position: absolute;
  right: 10px;
  top: 10px;
}
.topic-content {
  padding: 20px 10px;
  line-height: 1.5rem;
  text-align: left;
}
</style>
