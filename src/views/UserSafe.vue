<template>
  <div class="userprofile">
    <div class="titlebar">
      <el-divider content-position="left">
        <h3 class="title">修改密码</h3>
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
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    color: $color-base;
    font-size: 1.5rem;
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
.form {
  text-align: left;
  .form-text {
    font-size: 1.2rem;
  }
}
</style>
