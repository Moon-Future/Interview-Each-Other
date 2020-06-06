<template>
  <div class="userprofile">
    <div class="titlebar">
      <el-divider content-position="left">
        <h3 class="title">基本信息</h3>
      </el-divider>
      <span class="editbtn">编辑</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.titlebar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    color: $color-base;
    font-size: 2rem;
  }
  .editbtn {
    position: absolute;
    right: 0;
    font-size: 0.5rem;
    background: $color-white;
    border-radius: 20px;
    display: inline-block;
    width: 3rem;
    line-height: 1.4rem;
    border: 1px solid $color-gray;
    color: $color-gray;
    cursor: pointer;
  }
}
</style>
