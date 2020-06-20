<template>
  <div class="room">
    <div class="content">
      <div class="header">
        <router-link class="header-logo" to="/">Interview</router-link>
        <ul class="header-right">
          <li>Call</li>
          <li>挂断</li>
        </ul>
      </div>
      <div class="wrapper">
        <div class="wrapper-left">
          <div class="user-list beauty-Scroll">
            <el-scrollbar>
              <p class="room-counter">当前房间人数：{{ userList.length }}</p>
              <div class="user-item" v-for="(item, index) in userList" :key="index">
                <el-avatar :size="size" :src="item.avatar"></el-avatar>
                <p class="name">{{ item.nickname }}</p>
                <div class="call-icon">
                  <Iconfont icon="icon-call" fontSize="20"></Iconfont>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="user-audio">
            <div class="userinfo">
              <div class="member">
                <el-avatar :size="100" shape="square" :src="userInfo.avatar"></el-avatar>
                <p>{{ userInfo.nickname }}</p>
              </div>
              <div class="member">
                <el-avatar :size="100" shape="square" :src="userInfo.avatar"></el-avatar>
                <p>{{ userInfo.nickname }}</p>
              </div>
            </div>
            <div class="device-wrapper">
              <div class="device-icon">
                <div class="audio-icon">
                  <Iconfont :icon="'icon-audio'" :color="audioActive ? playColor : stopColor" :fontSize="36" @click.native="muteAudio"></Iconfont>
                  <span v-show="!audioActive">已静音</span>
                </div>
                <Iconfont :icon="'icon-hangup'" :color="color" :fontSize="36"></Iconfont>
              </div>
            </div>
          </div>
        </div>
        <div class="wrapper-right">
          <Chat ref="chat" :chatContent="chatContent" :roomId="$route.params.id"></Chat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import Chat from '@/components/Chat.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { formatTime } from '../utils/util'
// import TRTC from 'trtc-js-sdk'
// import RtcClient from '../utils/rtc-client'
import { mapGetters } from 'vuex'
import API from '@/utils/api'

export default {
  name: 'Room',
  components: {
    Iconfont,
    // quillEditor,
    Chat
  },
  data() {
    return {
      client_: null,
      rtc: null,
      remoteStreams_: [],
      members_: {},
      oppositeid_: 'opposite-video',
      color: 'red',
      stopColor: '#bbb3b3',
      playColor: '#15ddfd',
      audioActive: true,
      startTime: formatTime(new Date(), 'hh:mm'),
      talkTime: '00 : 00',
      talkSeconds: 0,
      userList: [],
      chatContent: []
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },

  activated() {
    // TRTC.getDevices()
    //   .then(devices => {
    //     devices.forEach(item => {
    //       console.log('device: ' + item.kind + ' ' + item.label + ' ' + item.deviceId)
    //     })
    //   })
    //   .catch(error => console.error('getDevices error observed ' + error))
    // this.talkSecondsInterval()
    this.chatContent = []
    this.$socket.emit('joinRoom', this.$route.params.id)
  },

  beforeRouteLeave(to, form, next) {
    this.$socket.emit('leaveRoom', this.$route.params.id)
    next()
  },

  methods: {
    talkSecondsInterval() {
      setInterval(() => {
        this.talkSeconds += 1
        this.talkTimeFormat()
      }, 1000)
    },

    talkTimeFormat() {
      let mins = Math.floor(this.talkSeconds / 60).toString()
      let secs = (this.talkSeconds % 60).toString()
      this.talkTime = `${mins[1] ? mins : '0' + mins} : ${secs[1] ? secs : '0' + secs}`
    },

    createRoom() {
      // let rct = new RtcClient({
      //   userId: '8023',
      //   roomId: '6666',
      //   playid: 'self-video'
      // })
      // rct.join()
      // this.client_ = rct.client_
      // this.handleEvents()
    },

    muteAudio() {
      this.audioActive = !this.audioActive
    },

    handleEvents() {
      this.client_.on('error', err => {
        console.error(err)
        alert(err)
        location.reload()
      })
      this.client_.on('client-banned', err => {
        console.error('client has been banned for ' + err)
      })
      // fired when a remote peer is joining the room
      this.client_.on('peer-join', evt => {
        const userId = evt.userId
        console.log('peer-join ' + userId)
        this.color = 'red'
      })
      // fired when a remote peer is leaving the room
      this.client_.on('peer-leave', evt => {
        const userId = evt.userId
        console.log('peer-leave ' + userId)
      })
      // fired when a remote stream is added
      this.client_.on('stream-added', evt => {
        const remoteStream = evt.stream
        const id = remoteStream.getId()
        const userId = remoteStream.getUserId()
        this.members_[userId] = remoteStream
        this.client_.subscribe(remoteStream)
        console.log(`remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`)
      })
      // fired when a remote stream has been subscribed
      this.client_.on('stream-subscribed', evt => {
        const uid = evt.userId
        const remoteStream = evt.stream
        const id = remoteStream.getId()
        this.remoteStreams_.push(remoteStream)
        remoteStream.on('player-state-changed', event => {
          console.log(`${event.type} player is ${event.state}`)
          if (event.type == 'video' && event.state == 'STOPPED') {
            console.log('xxx')
          }
          if (event.type == 'video' && event.state == 'PLAYING') {
            console.log('xxx')
          }
        })
        // objectFit 为播放的填充模式，详细参考：https://trtc-1252463788.file.myqcloud.com/web/docs/Stream.html#play
        remoteStream.play(this.oppositeid_, { objectFit: 'contain' })
        // 添加“摄像头未打开”遮罩
        console.log('stream-subscribed ID: ', id)
      })
      // fired when the remote stream is removed, e.g. the remote user called Client.unpublish()
      this.client_.on('stream-removed', evt => {
        const remoteStream = evt.stream
        const id = remoteStream.getId()
        remoteStream.stop()
        this.remoteStreams_ = this.remoteStreams_.filter(stream => {
          return stream.getId() !== id
        })
        console.log(`stream-removed ID: ${id}  type: ${remoteStream.getType()}`)
      })

      this.client_.on('stream-updated', evt => {
        const remoteStream = evt.stream
        let uid = this.getUidByStreamId(remoteStream.getId())
        if (!remoteStream.hasVideo()) {
          console.log('xxx')
        }
        console.log(
          'type: ' +
            remoteStream.getType() +
            ' stream-updated hasAudio: ' +
            remoteStream.hasAudio() +
            ' hasVideo: ' +
            remoteStream.hasVideo() +
            ' uid: ' +
            uid
        )
      })

      this.client_.on('mute-audio', evt => {
        console.log(evt.userId + ' mute audio')
      })
      this.client_.on('unmute-audio', evt => {
        console.log(evt.userId + ' unmute audio')
      })
      this.client_.on('mute-video', evt => {
        console.log(evt.userId + ' mute video')
        let streamId = this.members_[evt.userId].getId()
        if (streamId) {
          console.log('xxx')
        }
      })
      this.client_.on('unmute-video', evt => {
        console.log(evt.userId + ' unmute video')
        const stream = this.members_[evt.userId]
        if (stream) {
          let streamId = stream.getId()
          if (streamId) {
            console.log('xxx')
          }
        }
      })
    },

    showStreamState(stream) {
      console.log('has audio: ' + stream.hasAudio() + ' has video: ' + stream.hasVideo())
    },

    getUidByStreamId(streamId) {
      // for (let [uid, stream] of this.members_) {
      //   if (stream.getId() == streamId) {
      //     return uid
      //   }
      // }
    }
  },

  sockets: {
    chatMessage(message) {
      this.chatContent.push(message)
      this.$nextTick(() => {
        this.$refs.chat.scrollBottom()
      })
    },
    joinRoom(data) {
      this.userList = data.userList
    },
    leaveRoom(data) {
      this.userList = data.userList
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

// https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589660150097&di=833ceb670fcaa23f38328ee20c877de3&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2Fd22bbcc815668a3244e4237c1731b98d8ee370a3.jpg
.room {
  background-image: url('http://tva1.sinaimg.com/large/6f8a2832gy1fjb9jqlvsdj21hc0xc153.jpg');
  background-position: center top;
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  z-index: 1;
  color: $color-white;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: -30px;
    background-image: url('http://tva1.sinaimg.com/large/6f8a2832gy1fjb9jqlvsdj21hc0xc153.jpg');
    background-position: center top;
    background-size: cover;
    background-attachment: fixed;
    filter: blur(5px);
  }
}
.header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #583d54;
  padding: 0 50px;
  box-sizing: border-box;
  ul.header-right {
    display: flex;
    li {
      margin-left: 20px;
    }
  }
}
.wrapper {
  display: flex;
  width: 100%;
  position: absolute;
  top: 50px;
  bottom: 0px;
}
.wrapper-left {
  width: 50%;
  border-right: 1px solid #583d54;
  display: flex;
  position: relative;
}
.room-counter {
  text-align: left;
  padding: 10px;
}
.user-list {
  width: 250px;
  .user-item {
    display: flex;
    align-items: center;
    padding: 10px;
    span {
      flex: 0 0 auto;
    }
    .call-icon {
      width: 30px;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      padding: 2px 0;
      flex: 0 0 auto;
    }
    .name {
      width: 150px;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
  }
}
.user-audio {
  position: absolute;
  left: 250px;
  height: 100%;
  right: 0;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  .userinfo {
    display: flex;
    justify-content: space-around;
  }
  .device-wrapper {
    display: flex;
    justify-content: center;
    .device-icon {
      width: 60%;
      display: flex;
      justify-content: space-around;
    }
  }
}
.audio-icon {
  display: flex;
  flex-flow: column;
  position: relative;
  span {
    font-size: 12px;
    color: #bbb3b3;
    position: absolute;
    bottom: -16px;
  }
}

.wrapper-right {
  width: 50%;
}

@media screen and (max-width: 1024px) {
  .user-list {
    display: none;
  }
  .user-audio {
    left: 0;
  }
}

@media screen and (max-width: 768px) {
  .user-list {
    display: none;
  }
  .user-audio {
    left: 0;
  }
  .wrapper-left {
    width: 100%;
  }
  .wrapper-right {
    display: none;
  }
}
</style>
