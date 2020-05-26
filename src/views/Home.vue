<template>
  <div class="home">
    <Header formStatus />
    <div class="container">
      <nav-bar></nav-bar>
      <div class="page-width">666</div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'Home',
  components: {
    Header,
    NavBar
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50px;
  width: 100%;
}
</style>
