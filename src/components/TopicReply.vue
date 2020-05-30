<template>
  <div class="topic-reply">
    <div class="reply-item" v-for="(item, index) in arr" :key="index">
      <img class="avatar" :src="obj.src" />
      <div class="right-item">
        <div class="reply-title">
          <span class="username"> 1 XanderChen</span>
          <span class="replytime"> 4 分钟前</span>
        </div>
        <div class="reply-content">
          <p>曾经也是这样, 不过不是因为想暴富而是纯属想抢注。</p>
          <p>
            直到我开始把域名纳入 "订阅" 记账范围, 最终发现自己的域名, 其实就是
            "毫无价值的撒钱"。它不会给我带来任何形式的利益,
            支付的几百块其实完全就是撒出去了。就算我拿这钱到某个群里发个红包,
            它的回馈都会比我买域名的回馈多得多。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopicReply',
  data() {
    return {
      obj: {
        src: require('@/assets/avatar.jpg')
      },
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.topic-reply {
  background: $color-white;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px 0;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e2e2;
}
.reply-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e2e2e2;
  &:last-child {
    border-bottom: none;
  }
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
  flex: 0 0 auto;
}
.right-item {
  display: flex;
  flex-flow: column;
  text-align: left;
}
.reply-title {
  .username {
    color: $color-gray;
    font-weight: bold;
  }
  .replytime {
    color: #cac7c7;
    margin-left: 20px;
    font-size: 0.8rem;
  }
}
.reply-content {
  line-height: 1.5rem;
  margin-top: 20px;
  padding-right: 20px;
  font-size: 0.9rem;
}
</style>
