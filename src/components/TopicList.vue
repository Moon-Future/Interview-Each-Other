<template>
  <div class="topic-list">
    <nav-bar></nav-bar>
    <ul>
      <li class="topic-item" v-for="(item, index) in topicList" :key="index">
        <img class="topic-avatar" :src="item.avatar" alt="" />
        <article class="topic-info">
          <router-link class="title" :to="`/topicdetail/${item.id}`">
            {{ item.title }}
          </router-link>
          <div class="topic-bottom">
            <el-tag size="mini" type="info">{{ item.jobm }}</el-tag>
            <span class="topic-user">{{ item.nickname }}</span>
            <!-- <el-tooltip effect="light" :content="item.createtime" placement="top-start">
              <span>{{ item.beforeTime }}</span>
            </el-tooltip> -->
            <span>{{ item.beforeTime }}</span>
            <Iconfont
              v-if="item.user !== userInfo.id"
              :icon="'icon-call'"
              :fontSize="20"
              :color="'#909399'"
              @click.native="callTo(item.user)"
            ></Iconfont>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import NavBar from '@/components/NavBar.vue'
import { formatTime, beforeTime } from '@/utils/util'
import API from '@/utils/api'
import { mapGetters } from 'vuex'

export default {
  name: 'TopicList',
  components: {
    Iconfont,
    NavBar
  },
  data() {
    return {
      topicList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getTopic()
  },
  methods: {
    async getTopic() {
      try {
        let result = await API.getTopic()
        this.topicList = result.data.topicList
        this.topicList.forEach(ele => {
          ele.beforeTime = beforeTime(ele.createtime)
          ele.createtime = formatTime(new Date(ele.createtime), 'yyyy-MM-dd hh:mm')
        })
      } catch (err) {
        console.log(err)
      }
    },
    callTo(userId) {
      if (this.userInfo.id === userId) {
        return
      }
      this.$socket.emit('callRequest', userId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.topic-list {
  background: $color-white;
  margin-right: 260px;
  border-radius: 4px;
  box-shadow: 0 2px 49px 0 rgba(3, 47, 137, 0.05);
  min-height: 500px;
  @media screen and (max-width: 768px) {
    margin-right: 0;
  }
}
.topic-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid $color-shallowgray;
  .topic-avatar {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    flex: 0 0 auto;
    @media screen and (max-width: 768px) {
      width: 40px;
      height: 40px;
    }
  }
}
.topic-info {
  margin-left: 20px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  text-align: left;
  flex: 0 1 auto;
  .title {
    color: $color-black;
    font-weight: bold;
    line-height: 1.5rem;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.topic-bottom span {
  margin-right: 10px;
  font-size: 14px;
  color: $color-gray;
  &.topic-user {
    color: $color-black;
    font-weight: bold;
  }
}
</style>
