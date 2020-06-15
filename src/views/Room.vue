<template>
  <div class="room">
    <div class="content">
      <div class="member">
        <p class="role">面试者</p>
        <el-avatar :size="200" src="http://pic1.zhimg.com/50/v2-ab30cf77a79a5d8ff051a418493c5652_hd.jpg"></el-avatar>
        <div class="member-info">
          <p>刺客五六七</p>
        </div>
        <div class="device-icon">
          <div class="audio-icon">
            <Iconfont :icon="'icon-audio'" :color="audioActive ? playColor : stopColor" :fontSize="36" @click.native="muteAudio"></Iconfont>
            <span v-show="!audioActive">已静音</span>
          </div>
          <Iconfont :icon="'icon-hangup'" :color="color" :fontSize="36"></Iconfont>
        </div>
        <div id="self-video"></div>
      </div>
      <div class="center">
        <p class="time">通话开始：{{ startTime }}</p>
        <p class="time">通话时长：{{ talkTime }}</p>
        <div class="line"></div>
        <div class="resume">
          <h3 class="title">简历</h3>
        </div>
      </div>
      <div class="member">
        <p class="role">面试官</p>
        <el-avatar :size="200" src="http://pic1.zhimg.com/50/v2-ab30cf77a79a5d8ff051a418493c5652_hd.jpg"></el-avatar>
        <div class="member-info">
          <p>刺客五六七</p>
        </div>
        <div id="opposite-video"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont.vue'
import { formatTime } from '../utils/util'
// import TRTC from 'trtc-js-sdk'
// import RtcClient from '../utils/rtc-client'
import API from '@/utils/api'

export default {
  name: 'Room',
  data() {
    return {
      client_: null,
      rtc: null,
      remoteStreams_: [],
      members_: {},
      oppositeid_: 'opposite-video',
      color: 'red',
      stopColor: '#909399',
      playColor: '#409EFF',
      audioActive: true,
      startTime: formatTime(new Date(), 'hh:mm'),
      talkTime: '00 : 00',
      talkSeconds: 0
    }
  },

  components: {
    Iconfont
  },

  created() {
    // TRTC.getDevices()
    //   .then(devices => {
    //     devices.forEach(item => {
    //       console.log('device: ' + item.kind + ' ' + item.label + ' ' + item.deviceId)
    //     })
    //   })
    //   .catch(error => console.error('getDevices error observed ' + error))
    // this.talkSecondsInterval()
    console.log('进入')
    API.entryInfo('进入')
  },

  async beforeDestroy() {
    console.log('关闭')
    await API.entryInfo('关闭')
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
  }
}
</script>

<style lang="scss" scoped>
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
  display: flex;
  justify-content: space-between;
  width: 80%;
  height: 80%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  z-index: 1;
  padding: 20px 50px;
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
.member {
  display: flex;
  flex-flow: column;
  color: #fff;
}
.role {
  margin-bottom: 20px;
  font-size: 30px;
}
.member-info {
  margin-top: 50px;
  height: 100px;
}
.device-icon {
  display: flex;
  justify-content: space-around;
  margin: 50px 0;
}
.audio-icon {
  display: flex;
  flex-flow: column;
  position: relative;
  span {
    font-size: 12px;
    color: #909399;
    position: absolute;
    bottom: -16px;
  }
}
.center {
  color: #fff;
  font-size: 26px;
  text-align: left;
  padding: 0 30px;
  flex: 1;
  .time {
    padding-bottom: 10px;
  }
  .line {
    width: 100%;
    margin-bottom: 10px;
    border: 1px dashed;
  }
}
.resume {
  font-size: 16px;
}
// #self-video, #opposite-video {
//   width: 300px;
//   height: 300px;
//   border: 1px solid blue;
// }
</style>
