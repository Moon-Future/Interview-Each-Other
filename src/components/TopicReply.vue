<template>
  <div class="topic-reply">
    <div class="reply-text" v-show="replyData.length !== 0">
      <div class="reply-item" v-for="(item, index) in replyData" :key="index">
        <div class="user-info">
          <img class="avatar" :src="item.avatar || defaultAvatar" />
          <div class="reply-title">
            <span class="username">{{ item.nickname }}</span>
            <el-tooltip effect="light" :content="item.createtime" placement="top-start">
              <span class="replytime">{{ item.beforeTime }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="reply-content" v-html="item.content"></div>
      </div>
    </div>
    <div class="reply-textraea">
      <div class="reply-textraea-01">
        <img class="avatar" :src="userInfo.avatar || defaultAvatar" />
        <div class="reply-editor">
          <quill-editor
            ref="myQuillEditor"
            v-model="content"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
        </div>
      </div>
      <div class="reply-btn">
        <el-button type="success" @click="writeReply" :loading="loading">发射</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, beforeTime } from '@/utils/util'
import API from '@/utils/api'

export default {
  name: 'TopicReply',
  components: {
    quillEditor
  },
  data() {
    return {
      defaultAvatar: require('@/assets/avatar.jpg'),
      content: '',
      editorOption: {
        // Some Quill options...
        placeholder: '大佬，你怎么看......',
        readOnly: true,
        formats: {},
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        }
      },
      replyData: [],
      loading: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    },
    ...mapGetters(['userInfo', 'loginStatus'])
  },
  activated() {
    this.replyData = []
    this.$set(this.editorOption, 'placeholder', `${this.userInfo.nickname || '大佬'}，你怎么看......`)
    this.getReply()
  },
  methods: {
    onEditorBlur(quill) {},
    onEditorFocus(quill) {},
    onEditorReady(quill) {},
    onEditorChange({ quill, html, text }) {
      this.content = html
    },
    async writeReply() {
      if (!this.loginStatus) {
        this.setLoginVisiable(true)
        this.setLoginFlag(true)
        return
      }
      if (this.loading || this.content === '') return
      try {
        this.loading = true
        let content = this.content
        let hrefList = content.match(/<a(.*?)<\/a>/g) || []
        hrefList.forEach(hrefStr => {
          let href = hrefStr.match(/href="(.*?)"/)
          if (href && href[1].substr(0, 4) !== 'http' && href[1].substr(0, 2) !== '//') {
            let newHrefStr = hrefStr.replace(`href="${href[1]}"`, `href="//${href[1]}"`)
            let regexp = new RegExp(hrefStr, 'g')
            content = content.replace(regexp, newHrefStr)
          }
        })
        let res = await API.writeReply(this.$route.params.id, content)
        let id = res.data.data.id
        let replyContent = res.data.data.content
        let now = Date.now()
        this.replyData.push({
          id,
          avatar: this.userInfo.avatar,
          nickname: this.userInfo.nickname,
          content: replyContent,
          beforeTime: beforeTime(now),
          createtime: formatTime(new Date(now), 'yyyy-MM-dd hh:mm')
        })
        this.content = ''
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    async getReply() {
      try {
        let res = await API.getReply(this.$route.params.id)
        this.replyData = res.data.data
        this.replyData.forEach(ele => {
          ele.beforeTime = beforeTime(ele.createtime)
          ele.createtime = formatTime(new Date(ele.createtime), 'yyyy-MM-dd hh:mm')
        })
      } catch (err) {
        console.log(err)
      }
    },
    ...mapMutations({
      setLoginVisiable: 'SET_LOGINVISIABLE',
      setLoginFlag: 'SET_LOGINFLAG'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.reply-text {
  border-radius: 4px;
  background: $color-white;
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e2e2;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}
.reply-item {
  padding: 10px;
  border-bottom: 1px solid #e2e2e2;
  text-align: left;
  &:last-child {
    border-bottom: none;
  }
}
.user-info {
  display: flex;
  @media screen and (max-width: 768px) {
    align-items: flex-end;
  }
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
  flex: 0 0 auto;
}
.reply-title {
  .username {
    color: $color-gray;
    font-weight: bold;
  }
  .replytime {
    color: #cac7c7;
    margin-left: 20px;
    font-size: 0.8rem;
  }
}
.reply-content {
  text-align: left;
  margin-left: 60px;
  margin-top: -20px;
  line-height: 1.5rem;
  font-size: 0.9rem;
  @media screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }
}
.reply-textraea {
  margin-bottom: 20px;
  background: $color-white;
  padding: 10px;
  .avatar {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
}
.reply-textraea-01 {
  display: flex;
}
.reply-btn {
  text-align: right;
  margin-top: 10px;
}
.reply-editor {
  flex: 1;
}
/deep/ .ql-editor {
  min-height: 150px;
}
/deep/ .ql-toolbar {
  text-align: left;
}
</style>
