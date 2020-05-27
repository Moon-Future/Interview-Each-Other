<template>
  <div class="home">
    <Header formStatus />
    <div class="container">
      <nav-bar></nav-bar>
      <div class="home-content page-width">
        <topic-list></topic-list>
        <right-bar></right-bar>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import NavBar from '@/components/NavBar.vue'
import TopicList from '@/components/TopicList.vue'
import RightBar from '@/components/RightBar.vue'

export default {
  name: 'Home',
  components: {
    Header,
    NavBar,
    TopicList,
    RightBar
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50px;
  width: 100%;
}
.home-content {
  margin-top: 20px;
  position: relative;
}
</style>
