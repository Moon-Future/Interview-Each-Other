<template>
  <div class="topic-list">
    <nav-bar></nav-bar>
    <ul>
      <li class="topic-item" v-for="(item, index) in topicList" :key="index">
        <img class="topic-avatar" :src="item.src" alt="" />
        <article class="topic-info">
          <h3 class="title">
            社区/论坛类的是不是不太行了，怎么还没看见前后端分离的成熟产品呢？
          </h3>
          <div class="topic-bottom">
            <el-tag size="mini" type="info">{{ item.type }}</el-tag>
            <span class="topic-user">{{ item.user }}</span>
            <span>4 分钟前</span>
            <Iconfont
              :icon="'icon-call'"
              :fontSize="20"
              :color="'#909399'"
            ></Iconfont>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'TopicList',
  data() {
    return {
      topicList: [
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src: require('@/assets/avatar.jpg'),
          type: '前端',
          user: 'ChenLiang'
        }
      ]
    }
  },
  components: {
    Iconfont,
    NavBar
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.topic-list {
  background: $color-white;
  margin-right: 260px;
  border-radius: 4px;
  box-shadow: 0 2px 49px 0 rgba(3, 47, 137, 0.05);
  @media screen and (max-width: 768px) {
    margin-right: 0;
  }
}
.topic-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid $color-shallowgray;
  .topic-avatar {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    flex: 0 0 auto;
    @media screen and (max-width: 768px) {
      width: 40px;
      height: 40px;
    }
  }
}
.topic-info {
  margin-left: 20px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  text-align: left;
  flex: 0 1 auto;
  .title {
    line-height: 1.5rem;
  }
}
.topic-bottom span {
  margin-right: 10px;
  font-size: 14px;
  color: $color-gray;
  &.topic-user {
    color: $color-black;
    font-weight: bold;
  }
}
</style>
