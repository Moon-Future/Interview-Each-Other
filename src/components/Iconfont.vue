<template>
  <div
    class="icon-container"
    :class="flag ? has - margin : ''"
    :style="{ fontSize: fontSize + 'px', color: color }"
  >
    <svg class="iconfont" aria-hidden="true">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'icon-video'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: 'initial'
    },
    flag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline;
  .has-margin {
    margin: 0 10px;
  }
}
</style>
