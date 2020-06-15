<template>
  <div class="topic-detail">
    <Header ref="header" formStatus />
    <div class="container page-width">
      <div class="left">
        <div class="topic-top">
          <div class="topic-header">
            <div class="header-left">
              <h3 class="title">
                {{ topicData.title }}
              </h3>
            </div>
            <img class="avatar" :src="topicData.avatar" alt="" />
          </div>
          <div class="topic-content" v-show="topicData.content" v-html="topicData.content"></div>
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
import API from '@/utils/api'

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
      },
      topicId: '',
      topicData: {}
    }
  },
  activated() {
    this.topicData = {}
    this.getTopicContent()
  },
  methods: {
    async getTopicContent() {
      try {
        let res = await API.getTopicContent(this.$route.params.id)
        this.topicData = res.data.data
      } catch (err) {
        console.log(err)
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
