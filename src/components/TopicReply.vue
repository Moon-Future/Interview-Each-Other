<template>
  <div class="topic-reply">
    <div class="reply-text">
      <div class="reply-item" v-for="(item, index) in arr" :key="index">
        <div class="user-info">
          <img class="avatar" :src="obj.src" />
          <div class="reply-title">
            <span class="username"> 1 XanderChen</span>
            <span class="replytime"> 4 分钟前</span>
          </div>
        </div>
        <div class="reply-content">
          <p>曾经也是这样, 不过不是因为想暴富而是纯属想抢注。</p>
          <p>
            直到我开始把域名纳入 "订阅" 记账范围, 最终发现自己的域名, 其实就是
            "毫无价值的撒钱"。它不会给我带来任何形式的利益,
            支付的几百块其实完全就是撒出去了。就算我拿这钱到某个群里发个红包,
            它的回馈都会比我买域名的回馈多得多。
          </p>
        </div>
      </div>
    </div>
    <div class="reply-textraea">
      <div class="reply-textraea-01">
        <img class="avatar" :src="obj.src" />
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
        <el-button type="success">发射</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'TopicReply',
  components: {
    quillEditor
  },
  data() {
    return {
      obj: {
        src: require('@/assets/avatar.jpg')
      },
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      replyContent: '',
      content: '',
      editorOption: {
        // Some Quill options...
        placeholder: '元芳，你怎么看...',
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
      }
    }
  },
  mounted() {
    console.log('this is current quill instance object', this.editor)
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorBlur(quill) {},
    onEditorFocus(quill) {},
    onEditorReady(quill) {},
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    }
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
