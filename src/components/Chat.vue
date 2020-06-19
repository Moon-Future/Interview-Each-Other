<template>
  <div class="chat-container">
    <div class="chat-item" :class="{ self: item.self, system: item.system }" v-for="(item, index) in chatContent" :key="index">
      <template v-if="item.system">
        <p class="system-msg">{{ item.text }}</p>
      </template>
      <template v-else>
        <template v-if="!item.self">
          <el-avatar shape="square" :src="userInfo.avatar"></el-avatar>
        </template>
        <div class="chat-item-content">
          <span class="username">{{ userInfo.nickname }}</span>
          <div class="content-wrapper">
            <p>{{ item.text }}</p>
          </div>
        </div>
        <template v-if="item.self">
          <el-avatar shape="square" :src="userInfo.avatar"></el-avatar>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',
  props: {
    chatContent: {
      type: Array,
      default() {
        return [
          { self: true, text: '你在干吗？' },
          {
            system: true,
            text: `"风一样的男人" 进入房间`
          },
          { self: true, text: '你在干吗？' },
          { self: false, text: '我在吃饭啊，你呢？' },
          {
            self: false,
            text:
              '腾讯云实时音视频,基于CDN2.0互动直播解决方案,单房可容纳10万人同时观看,支持跨终端/全平台互通,全球接入点专线互联,9.9元立即开启20000分钟标清视频通话体验'
          },
          {
            system: true,
            text: `"风一样的男人" 拍了拍 "自己的猪头"`
          },
          {
            self: true,
            text:
              '腾讯云实时音视频,基于CDN2.0互动直播解决方案,单房可容纳10万人同时观看,支持跨终端/全平台互通,全球接入点专线互联,9.9元立即开启20000分钟标清视频通话体验'
          },
          {
            system: true,
            text: `"风一样的男人" 进入房间`
          },
          {
            system: true,
            text: `"风一样的男人" 进入房间`
          },
          {
            system: true,
            text: `"风一样的男人" 进入房间`
          }
        ]
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.chat-container {
  padding: 10px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.chat-item {
  text-align: left;
  display: flex;
  padding: 20px 0;
  .chat-item-content {
    display: flex;
    flex-flow: column;
    margin-left: 10px;
    max-width: 80%;
  }
  .username {
    font-size: 12px;
  }
  .content-wrapper {
    background: $color-white;
    color: $color-black;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    margin-top: 5px;
    text-align: left;
    p {
      line-height: 20px;
    }
  }
  &.self {
    text-align: right;
    justify-content: flex-end;
    .chat-item-content {
      margin-left: 0;
      margin-right: 10px;
    }
    .content-wrapper {
      background: $color-green;
    }
  }
  &.system {
    padding: 2px 0;
    .system-msg {
      text-align: center;
      width: 80%;
      margin: auto;
      font-size: 12px;
      line-height: 16px;
      color: $color-gray;
    }
  }
}
</style>
