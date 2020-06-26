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
              @click.native="callTo(item.user, item.nickname)"
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
      topicList: [],
      wait: 60,
      calls: {},
      notifications: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'loginStatus'])
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
    // 中断呼叫
    breakCall(userId) {
      if (this.calls[userId]) {
        delete this.calls[userId]
        this.$socket.emit('breakCall', userId)
      }
    },
    // 呼叫某人
    callTo(userId, nickname) {
      if (!this.loginStatus) {
        this.$message('请先登陆')
        return
      }
      if (this.userInfo.id === userId || this.calls[userId]) {
        return
      }
      this.calls[userId] = true
      this.$socket.emit('callRequest', userId)
      const createElement = this.$createElement
      let notify = this.$notify({
        duration: 0,
        message: createElement('div', {}, [
          createElement('h3', { style: { paddingBottom: '10px' } }, `正在邀请【${nickname}】进行面试通话`),
          createElement('div', { style: { textAlign: 'right' } }, [
            createElement(
              'el-button',
              {
                attrs: {
                  loading: true,
                  size: 'mini'
                }
              },
              '等待接听'
            ),
            createElement(
              'el-button',
              {
                attrs: {
                  type: 'danger',
                  size: 'mini'
                },
                on: {
                  click: () => {
                    notify.close()
                  }
                }
              },
              '挂断'
            )
          ])
        ]),
        onClose: () => {
          this.breakCall(userId)
        }
      })
      this.notifications[userId] = notify
    }
  },
  sockets: {
    // 通话请求响应
    callResponse(data) {
      if (data.type === 'offline') {
        this.$message('对方不在线 😮')
        this.notifications[data.targetUser.id].close()
        delete this.notifications[data.targetUser.id]
      }
    },
    // 请求被拒绝
    refuseCall(data) {
      const { targetUser } = data
      this.notifications[targetUser.id].close()
      delete this.notifications[targetUser.id]
    },
    // 对方接受请求
    acceptCall(data) {
      const { targetUser } = data
      delete this.calls[targetUser.id]
      this.notifications[targetUser.id].close()
      delete this.notifications[targetUser.id]
      this.$router.push({
        path: `/room/${this.userInfo.id}`
      })
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
