<template>
  <div class="userinfo-container">
    <Header ref="header" formStatus :transparent="transparent" />
    <div class="userinfo-base page-width">
      <div class="base-left">
        <img class="avatar" :src="userInfo.avatar" alt="" />
        <Iconfont class="avatar-editor" icon="icon-editor" fontSize="40" @click.native="toggleShow"></Iconfont>
      </div>
      <div class="base-right">
        <p>
          <span class="username">{{ userInfo.nickname }}</span>
          <span class="job">{{ userInfo.jobm }}</span>
        </p>
        <p>{{ userInfo.worktime }} 年工作经验</p>
        <p class="descr" v-for="(item, index) in profileArr" :key="index">{{ item }}</p>
      </div>
    </div>
    <div class="userinfo-detail page-width">
      <div class="left-menu">
        <ul>
          <router-link
            tag="li"
            :to="item.url"
            :class="{ 'active-menu': index === activeIndex }"
            v-for="(item, index) in menuList"
            :key="index"
            @click.native="changeMenu(index)"
          >
            <Iconfont :icon="`${item.icon}${index === activeIndex ? '-active' : ''}`" margin="0 10px 0 0" />
            {{ item.text }}
          </router-link>
        </ul>
      </div>
      <div class="right-content">
        <router-view />
      </div>
    </div>

    <my-upload
      field="avatar"
      @crop-upload-success="cropUploadSuccess"
      v-model="show"
      :width="300"
      :height="300"
      :url="uploadUrl"
      :headers="headers"
      img-format="png"
    ></my-upload>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Iconfont from '@/components/Iconfont.vue'
import myUpload from 'vue-image-crop-upload'
import { URL } from '@/utils/api'
import { deepClone } from '@/utils/util'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'UserInfo',
  components: {
    Header,
    Iconfont,
    myUpload
  },
  data() {
    return {
      menuList: [
        { text: '基本信息', icon: 'icon-user', url: '/userinfo/profile' },
        { text: '语音记录', icon: 'icon-call', url: '/userinfo/record' },
        { text: '修改密码', icon: 'icon-password', url: '/userinfo/safe' }
      ],
      activeIndex: 0,
      uploadUrl: URL.upload,
      show: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    profileArr() {
      return this.userInfo.profile.split('\n')
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    changeMenu(index) {
      this.activeIndex = index
    },

    // 显示上传组件
    toggleShow() {
      this.show = !this.show
    },

    // 上传成功
    cropUploadSuccess(jsonData, field) {
      let userInfo = deepClone(this.userInfo)
      userInfo.avatar = jsonData.avatar
      this.setUserInfo({ userInfo })
    }
  },
  watch: {
    '$route.path'(newPath) {
      for (let i = 0, len = this.menuList.length; i < len; i++) {
        if (newPath === this.menuList[i].url) {
          this.activeIndex = i
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.userinfo-container {
  background: $color-white;
  padding-bottom: 50px;
}
.userinfo-base {
  display: flex;
  padding-top: 20px;
}
.base-left {
  position: relative;
  width: 200px;
  height: 200px;
  margin-right: 20px;
  flex: 0 0 auto;
  @media screen and (max-width: 768px) {
    display: none;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .avatar-editor {
    position: absolute;
    top: 110px;
    right: 34px;
  }
}
.base-right {
  max-width: 700px;
  padding: 0 10px;
  p {
    text-align: left;
    line-height: 2rem;
  }
  .username {
    font-size: 2rem;
    font-weight: bold;
    margin-right: 20px;
  }
  .job {
    color: $color-origin;
  }
  .descr {
    color: $color-gray;
  }
}
.userinfo-detail {
  border-radius: 4px;
  padding: 30px 0;
  margin-top: 50px;
  display: flex;
  @media screen and (max-width: 768px) {
    display: block;
  }
}
.left-menu {
  width: 200px;
  margin-right: 20px;
  flex: 0 0 auto;
  ul {
    width: 150px;
    display: inline-block;
  }
  li {
    padding: 10px;
    border: 1px solid #dcdcdc;
    margin-bottom: 20px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    &.active-menu {
      border-color: $color-base;
      color: $color-base;
    }
  }
  @media screen and (max-width: 768px) {
    width: initial;
    margin-right: 0;
    ul {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
  }
}
.right-content {
  width: 100%;
  padding: 0 10px;
  @media screen and (max-width: 768px) {
    width: initial;
  }
}
</style>
