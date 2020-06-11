<template>
  <div class="write-container page-width">
    <Header ref="header" formStatus />
    <el-form :model="formData" :rules="rules" ref="writeForm">
      <el-form-item label="主题" prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item prop="content">
        <p class="label-text"><label>内容</label></p>
        <quill-editor ref="myQuillEditor" v-model="formData.content" :options="editorOption" />
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
      rules: {
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
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
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
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
