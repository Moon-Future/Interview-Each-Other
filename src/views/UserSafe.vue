<template>
  <div class="usersafe">
    <div class="titlebar">
      <el-divider content-position="left">
        <h3 class="title">修改密码</h3>
      </el-divider>
    </div>
    <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" class="form" width="500px" label-position="left" label-width="76px">
      <el-form-item label="原密码" prop="oldPass">
        <el-input type="password" v-model="passwordForm.oldPass"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="passwordForm.newPass"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="reNew">
        <el-input type="password" v-model="passwordForm.reNew"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="success" :loading="loading" @click="save">保存</el-button>
  </div>
</template>

<script>
import API from '@/utils/api'

const crypto = require('crypto')
const pattern = /^[\w._-]{6,16}$/
export default {
  name: 'UserSafe',
  data() {
    return {
      passwordForm: {
        oldPass: '',
        newPass: '',
        reNew: ''
      },
      passwordRules: {
        oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPass: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入新密码'))
              } else if (!pattern.test(value.trim())) {
                callback(new Error('6 ~ 16位，可包含字母 数字 _ - .'))
              } else {
                callback()
              }
            }
          }
        ],
        reNew: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请重复新密码'))
              } else if (value !== this.passwordForm.newPass) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    save() {
      if (this.loading) return
      this.$refs.passwordForm.validate(async valid => {
        if (!valid) {
          return false
        }
        try {
          let subForm = {}
          subForm.oldPass = crypto
            .createHash('sha1')
            .update(this.passwordForm.oldPass.trim())
            .digest('hex')
          subForm.newPass = crypto
            .createHash('sha1')
            .update(this.passwordForm.newPass.trim())
            .digest('hex')
          subForm.reNew = crypto
            .createHash('sha1')
            .update(this.passwordForm.reNew.trim())
            .digest('hex')
          this.loading = true
          let res = await API.updateUserInfo(subForm)
          this.loading = false
          this.$refs.passwordForm.resetFields()
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

.usersafe {
  text-align: left;
}
.titlebar {
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  .title {
    color: $color-base;
    font-size: 1.5rem;
  }
  .editbtn {
    position: absolute;
    right: 0;
    font-size: 0.5rem;
    background: $color-white;
    border-radius: 20px;
    display: inline-block;
    width: 3rem;
    line-height: 1.4rem;
    border: 1px solid $color-gray;
    color: $color-gray;
    cursor: pointer;
  }
}
.form {
  text-align: left;
  max-width: 500px;
  .form-text {
    font-size: 1.2rem;
  }
}
</style>
