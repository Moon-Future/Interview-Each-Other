<template>
  <div class="right-bar"></div>
</template>

<script>
export default {
  name: 'RightBar'
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
}
</style>
