<template>
  <div class="chat-container">
    <div class="chat-content beauty-Scroll">
      <el-scrollbar ref="scrollbar">
        <div
          class="chat-item"
          :class="{ self: item.userInfo && userInfo.id === item.userInfo.id, system: item.system }"
          v-for="(item, index) in chatContent"
          :key="index"
        >
          <template v-if="item.system">
            <p class="system-msg">{{ item.text }}</p>
          </template>
          <template v-else>
            <template v-if="userInfo.id !== item.userInfo.id">
              <el-avatar shape="square" :src="item.userInfo.avatar"></el-avatar>
            </template>
            <div class="chat-item-content">
              <span class="username">{{ item.userInfo.nickname }}</span>
              <div class="content-wrapper" v-html="item.text"></div>
            </div>
            <template v-if="userInfo.id === item.userInfo.id">
              <el-avatar shape="square" :src="item.userInfo.avatar"></el-avatar>
            </template>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <div class="chat-textarea">
      <quill-editor ref="myQuillEditor" v-model="chatHtml" :options="editorOption" @change="onEditorChange" />
      <div class="btn-send">
        <el-button size="mini" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',
  components: {
    quillEditor
  },
  props: {
    chatContent: {
      type: Array,
      default() {
        return [
          // { userInfo: {}, text: '你在干吗？' },
          // {
          //   system: true,
          //   text: `"风一样的男人" 拍了拍 "自己的猪头"`
          // }
        ]
      }
    },
    roomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chatHtml: '',
      chatText: '',
      editorOption: {
        formats: {},
        modules: {
          toolbar: []
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.editorOption.modules.keyboard = {
      bindings: {
        custom: {
          key: 'enter',
          shortKey: true,
          handler: () => {
            this.send()
          }
        }
      }
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.chatText = text
    },
    send() {
      this.$socket.emit('chatMessage', { msg: this.chatHtml, id: this.roomId })
      this.chatHtml = ''
      return true
    },
    scrollBottom() {
      this.$refs.scrollbar.wrap.scrollTop = this.$refs.scrollbar.wrap.scrollHeight
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.chat-container {
  height: 100%;
}
.chat-item {
  text-align: left;
  display: flex;
  padding-top: 20px;
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
    padding: 8px 10px;
    font-size: 14px;
    margin-top: 5px;
    text-align: left;
    line-height: 20px;
    min-height: 36px;
    min-width: 28px;
    box-sizing: border-box;
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
.chat-content {
  height: 70%;
  padding: 10px;
  overflow: auto;
  box-sizing: border-box;
}
.chat-textarea {
  height: 30%;
  background: $color-white;
  color: $color-black;
  display: flex;
  flex-flow: column;
}
/deep/ .quill-editor {
  height: calc(100% - 32px);
  .ql-toolbar {
    display: none;
  }
}
.btn-send {
  height: 30px;
  text-align: right;
  padding: 2px;
}
</style>
