<template>
  <div class="right-bar">
    <ul>
      <li class="user-item" v-for="(item, index) in topicList" :key="index">
        <el-avatar :size="size" :src="item.src"></el-avatar>
        <div class="user-info">
          <span>ChenLiang</span>
          <span>666 分钟</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RightBar',
  data() {
    return {
      size: 60,
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.right-bar {
  background: $color-white;
  width: 230px;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    display: none;
  }
}
.user-item {
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px dashed $color-shallowgray;
  .user-info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    padding: 5px;
    margin-left: 10px;
    text-align: left;
  }
  &:last-child {
    border-bottom: none;
  }
}
</style>
