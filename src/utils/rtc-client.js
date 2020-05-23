import TRTC from 'trtc-js-sdk'
import genTestUserSig from '../../server/secret/GenerateTestUserSig'

export default class RtcClient {
  // sdkAppId_: number
  // userId_: string
  // userSig_: string
  // roomId_: string
  // isJoined_: boolean
  // isPublished_: boolean
  // isAudioMuted: boolean
  // isVideoMuted: boolean
  // localStream_: any
  // remoteStreams_: any
  // members_: any
  // client_: any
  // playid_: string

  constructor(options) {
    const { sdkAppId, userSig } = genTestUserSig(options.userId)
    this.userId_ = options.userId
    this.roomId_ = options.roomId
    this.playid_ = options.playid
    this.sdkAppId_ = sdkAppId
    this.userSig_ = userSig

    this.isJoined_ = false
    this.isPublished_ = false
    this.isAudioMuted = false
    this.isVideoMuted = false
    this.localStream_ = null
    this.remoteStreams_ = []
    this.members_ = new Map()

    // create a client for RtcClient
    this.client_ = TRTC.createClient({
      mode: 'videoCall',
      sdkAppId: this.sdkAppId_,
      userId: this.userId_,
      userSig: this.userSig_
    })
    // this.handleEvents()
  }

  async join() {
    if (this.isJoined_) {
      console.warn('duplicate RtcClient.join() observed')
      return
    }
    try {
      // join the room
      await this.client_.join({
        roomId: this.roomId_
      })
      console.log('join room success')
      this.isJoined_ = true

      // not to specify cameraId/microphoneId to avoid OverConstrainedError
      this.localStream_ = TRTC.createStream({
        audio: true,
        video: false,
        mirror: true
      })
      try {
        // initialize the local stream and the stream will be populated with audio/video
        await this.localStream_.initialize()
        console.log('initialize local stream success')

        this.localStream_.on('player-state-changed', event => {
          console.log(`local stream ${event.type} player is ${event.state}`)
        })

        // publish the local stream
        await this.publish()

        this.localStream_.play(this.playid_)
      } catch (e) {
        console.error('failed to initialize local stream - ' + e)
      }
    } catch (e) {
      console.error('join room failed! ' + e)
    }
    // 更新成员状态
    const states = this.client_.getRemoteMutedState()
  }

  async leave() {
    if (!this.isJoined_) {
      console.warn('leave() - please join() firstly')
      return
    }
    // ensure the local stream is unpublished before leaving.
    await this.unpublish()

    // leave the room
    await this.client_.leave()

    this.localStream_.stop()
    this.localStream_.close()
    this.localStream_ = null
    this.isJoined_ = false
  }

  async publish() {
    if (!this.isJoined_) {
      console.warn('publish() - please join() firstly')
      return
    }
    if (this.isPublished_) {
      console.warn('duplicate RtcClient.publish() observed')
      return
    }
    try {
      await this.client_.publish(this.localStream_)
    } catch (e) {
      console.error('failed to publish local stream ' + e)
      this.isPublished_ = false
    }

    this.isPublished_ = true
  }

  async unpublish() {
    if (!this.isJoined_) {
      console.warn('unpublish() - please join() firstly')
      return
    }
    if (!this.isPublished_) {
      console.warn('RtcClient.unpublish() called but not published yet')
      return
    }

    await this.client_.unpublish(this.localStream_)
    this.isPublished_ = false
  }

  muteLocalAudio() {
    this.localStream_.muteAudio()
  }

  unmuteLocalAudio() {
    this.localStream_.unmuteAudio()
  }

  muteLocalVideo() {
    this.localStream_.muteVideo()
  }

  unmuteLocalVideo() {
    this.localStream_.unmuteVideo()
  }

  resumeStreams() {
    this.localStream_.resume()
    for (let stream of this.remoteStreams_) {
      stream.resume()
    }
  }

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
      this.members_.set(userId, remoteStream)
      this.client_.subscribe(remoteStream)
      console.log(
        `remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`
      )
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
      remoteStream.play(id, { objectFit: 'contain' })
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
      let streamId = this.members_.get(evt.userId).getId()
      if (streamId) {
        console.log('xxx')
      }
    })
    this.client_.on('unmute-video', evt => {
      console.log(evt.userId + ' unmute video')
      const stream = this.members_.get(evt.userId)
      if (stream) {
        let streamId = stream.getId()
        if (streamId) {
          console.log('xxx')
        }
      }
    })
  }

  showStreamState(stream) {
    console.log(
      'has audio: ' + stream.hasAudio() + ' has video: ' + stream.hasVideo()
    )
  }

  getUidByStreamId(streamId) {
    for (let [uid, stream] of this.members_) {
      if (stream.getId() == streamId) {
        return uid
      }
    }
  }
}
