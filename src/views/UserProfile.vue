<template>
  <div class="userprofile">
    <div class="titlebar">
      <el-divider content-position="left">
        <h3 class="title">基本信息</h3>
      </el-divider>
      <span class="editbtn" @click="editHandle">
        {{ readonly ? '编辑' : '返回' }}
      </span>
    </div>
    <el-form :model="formData" :rules="readonly ? {} : rules" ref="userForm" label-position="left" label-width="76px" class="form">
      <el-form-item label="ID">
        <span class="form-text">{{ userInfo.id }}</span>
      </el-form-item>
      <el-form-item label="账号">
        <span class="form-text">{{ userInfo.username }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <Iconfont v-if="readonly" :icon="userInfo.sex === 0 ? 'icon-girl' : 'icon-boy'" fontSize="30" />
        <template v-else>
          <el-radio-group v-model="formData.sex">
            <el-radio :label="0"><Iconfont icon="icon-girl" fontSize="30" /></el-radio>
            <el-radio :label="1"><Iconfont icon="icon-boy" fontSize="30" /></el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <span class="form-text" v-if="readonly">{{ userInfo.nickname }}</span>
        <template v-else>
          <el-input v-model="formData.nickname" placeholder="昵称"></el-input>
        </template>
      </el-form-item>
      <el-form-item label="职业">
        <span class="form-text" v-if="readonly">{{ userInfo.jobm || '未知' }}</span>
        <template v-else>
          <el-select v-model="formData.job" placeholder="请选择">
            <el-option v-for="item in jobArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="经验年数">
        <span class="form-text" v-if="readonly">{{ userInfo.worktime }} 年工作经验</span>
        <template v-else>
          <el-input-number v-model="formData.worktime" controls-position="right" precision="0" :min="0" :max="20"></el-input-number>
        </template>
      </el-form-item>
      <el-form-item label="个人宣言" prop="profile">
        <template v-if="readonly">
          <p class="form-text" v-for="(item, index) in profileArr" :key="index">{{ item }}</p>
        </template>
        <template v-else>
          <el-input type="textarea" v-model="formData.profile" placeholder="个人宣言" :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
        </template>
      </el-form-item>
    </el-form>
    <el-button type="success" v-if="!readonly" :loading="loading" @click="save">保存</el-button>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import { sexMap } from '@/utils/const'
import API from '@/utils/api'
import { Loading, Message } from 'element-ui'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Iconfont
  },
  data() {
    return {
      formData: {},
      sexMap: sexMap,
      jobArr: null,
      worktime: '',
      readonly: true,
      loading: false,
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        profile: [
          {
            min: 1,
            max: 250,
            message: '长度在 1 到 250 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    profileArr() {
      return this.userInfo.profile.split('\n')
    }
  },
  created() {},
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    // 点击编辑
    async editHandle() {
      try {
        if (this.readonly) {
          if (!this.jobArr) {
            let jobArr = (await API.getJob()).data
            this.jobArr = []
            jobArr.forEach(ele => {
              this.jobArr.push({
                value: ele.id,
                label: ele.name
              })
            })
          }
          this.formData = {
            username: this.userInfo.username,
            nickname: this.userInfo.nickname,
            sex: this.userInfo.sex,
            job: this.userInfo.job || '',
            worktime: this.userInfo.worktime || '',
            profile: this.userInfo.profile || '',
            info: true
          }
        }
        this.readonly = !this.readonly
      } catch (err) {
        console.log(err)
      }
    },

    // 保存提交
    save() {
      if (this.loading) return
      this.$refs.userForm.validate(async valid => {
        if (!valid) {
          return false
        }
        if (
          this.userInfo.nickname !== this.formData.nickname ||
          this.userInfo.sex != this.formData.sex ||
          this.userInfo.job !== this.formData.job ||
          this.userInfo.worktime !== this.formData.worktime ||
          this.userInfo.profile !== this.formData.profile
        ) {
          try {
            this.loading = true
            let res = await API.updateUserInfo(this.formData)
            this.loading = false
            this.setUserInfo({ userInfo: res.data.userInfo, status: true, token: res.data.token })
            this.readonly = !this.readonly
          } catch (err) {
            this.loading = false
            console.log(err)
          }
        } else {
          Message({
            message: '无需更新',
            duration: 1000,
            center: true
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.userprofile {
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
