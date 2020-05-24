<template>
  <div class="home">
    <Header formStatus />
    <div class="container">
      <div class="content">666</div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50px;
  width: 100%;
  padding: 30px 0;
  .content {
    width: 80%;
    min-width: 600px;
    margin: auto;
  }
}
</style>
