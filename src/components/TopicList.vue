<template>
  <div class="topic-list">
    <ul>
      <li>
        <p>标题</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopicList'
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.topic-list {
  background: $color-white;
  margin-right: 260px;
  border-radius: 2px;
  padding: 10px 20px;
}
</style>
