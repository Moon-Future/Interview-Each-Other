<template>
  <div class="userprofile">
    <div class="titlebar">
      <el-divider content-position="left">
        <h3 class="title">基本信息</h3>
      </el-divider>
      <span class="editbtn" @click="readonly = !readonly">
        {{ readonly ? '编辑' : '返回' }}
      </span>
    </div>
    <el-form
      :model="formData"
      label-position="left"
      label-width="76px"
      class="form"
    >
      <el-form-item label="账号">
        <span class="form-text">{{ userInfo.username }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <Iconfont
          v-if="readonly"
          :icon="userInfo.sex === '0' ? 'icon-girl' : 'icon-boy'"
          fontSize="30"
        />
        <template v-else>
          <el-radio v-model="formData.sex" label="0"
            ><Iconfont icon="icon-girl" fontSize="30"
          /></el-radio>
          <el-radio v-model="formData.sex" label="1"
            ><Iconfont icon="icon-boy" fontSize="30"
          /></el-radio>
        </template>
      </el-form-item>
      <el-form-item label="昵称">
        <span class="form-text" v-if="readonly">{{ userInfo.nickname }}</span>
        <template v-else>
          <el-input v-model="formData.nickname" placeholder="昵称"></el-input>
        </template>
      </el-form-item>
      <el-form-item label="职业">
        <span class="form-text" v-if="readonly">{{ userInfo.job }}</span>
        <template v-else>
          <el-select v-model="jobValue" placeholder="请选择">
            <el-option
              v-for="item in jobArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="经验">
        <span class="form-text" v-if="readonly">{{ userInfo.workTime }}</span>
        <template v-else>
          <el-select v-model="workTime" placeholder="请选择">
            <el-option
              v-for="item in workTimeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="个人宣言">
        <span class="form-text" v-if="readonly">{{ userInfo.profile }}</span>
        <template v-else>
          <el-input
            type="textarea"
            v-model="formData.profile"
            placeholder="个人宣言"
            :autosize="{ minRows: 5, maxRows: 10 }"
          ></el-input>
        </template>
      </el-form-item>
    </el-form>
    <el-button type="success" v-if="!readonly">保存</el-button>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import { sexMap, jobArr, workTimeArr } from '@/utils/const'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Iconfont
  },
  data() {
    return {
      formData: {},
      sexMap: sexMap,
      jobArr: jobArr,
      jobValue: '',
      workTimeArr: workTimeArr,
      workTime: '',
      readonly: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.formData = {
      username: this.userInfo.username,
      nickname: this.userInfo.nickname,
      sex: this.userInfo.sex || '0',
      job: this.userInfo.job || '',
      worktime: this.userInfo.worktime || '',
      profile: this.userInfo.profile || ''
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
  .form-text {
    font-size: 1.2rem;
  }
}
</style>
