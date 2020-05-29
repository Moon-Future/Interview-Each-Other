<template>
  <div class="right-bar">
    <ul>
      <li class="right-item" v-for="(item, index) in topicList" :key="index">
        <el-avatar :size="size" :src="item.src"></el-avatar>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RightBar',
  data() {
    return {
      size: 30,
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
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.right-bar {
  background: $color-white;
  width: 230px;
  height: 300px;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 4px;
}
</style>
