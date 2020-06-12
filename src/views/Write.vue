<template>
  <div class="write-container page-width">
    <Header ref="header" formStatus />
    <el-form :model="formData" :rules="rules" ref="writeForm">
      <el-form-item prop="title">
        <p class="label-text">
          <label>主题</label>
          <span>{{ titleLen }}/100</span>
        </p>
        <el-input v-model="formData.title" @input="inputTitle"></el-input>
      </el-form-item>
      <el-form-item prop="content">
        <p class="label-text">
          <label>内容</label>
          <span>{{ contentLen }}/2000</span>
        </p>
        <quill-editor ref="myQuillEditor" v-model="formData.content" :options="editorOption" @change="onEditorChange" />
      </el-form-item>
    </el-form>
    <div class="submit-btn">
      <el-button type="success" @click="submit" :loading="loading">
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import API from '@/utils/api'

export default {
  name: 'Write',
  components: {
    Header,
    quillEditor
  },
  data() {
    return {
      formData: {
        title: '',
        content: ''
      },
      text: '',
      titleLen: 0,
      contentLen: 0,
      rules: {
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.trim() === '') {
                callback(new Error('请输入内容'))
              } else if (this.text.length > 2000) {
                callback(new Error('长度在 1 到 2000 个字符'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      editorOption: {
        // Some Quill options...
        placeholder: '请输入......',
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
      loading: false
    }
  },
  methods: {
    inputTitle(value) {
      this.titleLen = value.length
    },
    onEditorChange({ quill, html, text }) {
      this.text = text.trim()
      this.contentLen = this.text.length
    },
    submit() {
      if (this.loading) return
      this.$refs.writeForm.validate(async valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        try {
          let res = await API.write(this.formData)
          this.$refs.writeForm.resetFields()
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.label-text {
  text-align: left;
  color: #606266;
  span {
    margin-left: 20px;
  }
}
.quill-editor {
  background: #fff;
}
/deep/ .ql-editor {
  min-height: 300px;
}
.submit-btn {
  text-align: right;
  margin: 20px 0;
}
</style>
