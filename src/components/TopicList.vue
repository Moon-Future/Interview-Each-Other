<template>
  <div class="topic-list">
    <ul>
      <li class="topic-item" v-for="(item, index) in topicList" :key="index">
        <el-avatar shape="square" :size="size" :src="item.src"></el-avatar>
        <article class="topic-info">
          <h3>
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

export default {
  name: 'TopicList',
  data() {
    return {
      size: 80,
      topicList: [
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        },
        {
          src:
            'http://img0.imgtn.bdimg.com/it/u=417706534,1312488002&fm=15&gp=0.jpg',
          type: '前端',
          user: 'ChenLiang'
        }
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

.topic-list {
  background: $color-white;
  margin-right: 260px;
  border-radius: 2px;
}
.topic-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid $color-shallowgray;
}
.topic-info {
  margin-left: 20px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  text-align: left;
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
