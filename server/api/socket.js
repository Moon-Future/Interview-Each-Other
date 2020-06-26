const jwt = require('jsonwebtoken')
const { tokenConfig } = require('../secret/code')
const { user } = require('../database/config')
let userMap = {}, // 连接 websocket 的人员，key: userId
  roomMap = {}, // 房间对象，key: roomId
  calltoMap = {}, // 通话请求记录(主动拨打者 id 为 key)
  callgetMap = {}, // 通话请求记录(接收者 id 为 key)
  userCounter = 0

// 验证是否登陆
function checkLogin(socket) {
  if (!socket._userInfo_ || !userMap[socket._userInfo_.id]) {
    return false
  }
  return true
}

// 人员离开房间，房间删除此人员
function leaveRoom(io, socket, roomId) {
  if (!checkLogin(socket)) return false
  if (socket._room_) {
    let index = socket._room_.indexOf(roomId)
    socket._room_.splice(index, 1)
    socket.leave(roomId)
    io.to(roomId).emit('chatMessage', { system: true, userInfo: {}, text: `"${socket._userInfo_ && socket._userInfo_.nickname}" 离开了房间` })
  }
  let indexRoom = 0
  let userList = roomMap[roomId] || []
  for (let i = 0, len = userList.length; i < len; i++) {
    if (userList[i].id === socket._userInfo_.id) {
      indexRoom = i
      break
    }
  }
  userList.splice(indexRoom, 1)
  if (userList.length === 0) {
    delete roomMap[roomId]
  } else {
    io.to(roomId).emit('leaveRoom', { userList: userList })
  }
}

function socketHandle(io) {
  // socket连接
  io.on('connection', socket => {
    // 验证是否登陆
    socket.on('login', token => {
      try {
        const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        userInfo.socketId = socket.id
        if (!userMap[userInfo.id]) {
          userMap[userInfo.id] = userInfo
          userCounter++
        }
        socket._userInfo_ = userInfo
        io.emit('onlineCounter', userCounter)
      } catch (err) {
        return false
      }
    })

    // 退出登陆
    socket.on('logout', token => {
      if (!checkLogin(socket)) return false
      try {
        const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        if (userMap[userInfo.id]) {
          delete userMap[userInfo.id]
          userCounter--
          io.emit('onlineCounter', userCounter)
        }
        // 如果加入过房间，人员离开房间，房间删除此人员
        if (socket._room_) {
          for (let i = 0, len = socket._room_.length; i < len; i++) {
            leaveRoom(io, socket, socket._room_[i])
          }
        }
      } catch (err) {
        return false
      }
    })

    // 进入房间
    socket.on('joinRoom', id => {
      if (!checkLogin(socket)) return false
      // 记录房间中人员
      roomMap[id] = roomMap[id] || []
      roomMap[id].push(socket._userInfo_)
      // 记录人员进入房间 id
      socket._room_ = socket._room_ || []
      socket._room_.push(id)
      // 加入房间
      socket.join(id)
      io.to(id).emit('chatMessage', { system: true, userInfo: {}, text: `"${socket._userInfo_ && socket._userInfo_.nickname}" 进入了房间` })
      io.to(id).emit('joinRoom', { userList: roomMap[id] })
    })

    // 离开房间
    socket.on('leaveRoom', id => {
      // 人员离开房间，删除记录的房间 id
      leaveRoom(io, socket, id)
    })

    // 请求通话
    socket.on('callRequest', userId => {
      if (!checkLogin(socket)) return false
      if (!userMap[userId]) {
        // 不在线
        socket.emit('callResponse', { type: 'offline', targetUser: { id: userId } })
        return
      }
      let userInfo = socket._userInfo_
      let sourceUser = userInfo.id // 发起通话者
      calltoMap[sourceUser] = calltoMap[sourceUser] || {}
      callgetMap[userId] = callgetMap[userId] || {}
      if (calltoMap[sourceUser][userId]) {
        // 正在拨打
        return
      } else {
        calltoMap[sourceUser][userId] = true
        callgetMap[userId][sourceUser] = sourceUser
      }
      let targetUser = userMap[userId] // 接受通话者
      let targetSocket = io.sockets.sockets[targetUser.socketId]
      // 向目标用户发起请求
      targetSocket.emit('callRequest', {
        type: 'call',
        sourceUser: {
          id: userInfo.id,
          nickname: userInfo.nickname,
          avatar: userInfo.avatar
        }
      })
    })

    // 中断通话
    socket.on('breakCall', userId => {
      if (!checkLogin(socket)) return false
      let userInfo = socket._userInfo_
      let sourceUser = userInfo.id
      calltoMap[sourceUser] && delete calltoMap[sourceUser][userId]
      let targetUser = userMap[userId]
      if (targetUser) {
        let targetSocket = io.sockets.sockets[targetUser.socketId]
        // 告知目标用户已中断请求
        targetSocket.emit('breakCall', {
          type: 'break',
          sourceUser: {
            id: userInfo.id
          }
        })
      }
    })

    // 拒绝请求，请求通话人 id
    socket.on('refuseCall', sourceUserId => {
      if (!checkLogin(socket)) return false
      let userInfo = socket._userInfo_
      let userId = userInfo.id
      if (callgetMap[userId] && callgetMap[userId][sourceUserId]) {
        let sourceUser = userMap[sourceUserId]
        if (sourceUser) {
          let sourceSocket = io.sockets.sockets[sourceUser.socketId]
          sourceSocket.emit('refuseCall', {
            type: 'refuse',
            targetUser: {
              id: userId
            }
          })
        }
      }
    })

    // 接受请求进入房间
    socket.on('acceptCall', sourceUserId => {
      if (!checkLogin(socket)) return false
      let userInfo = socket._userInfo_
      let userId = userInfo.id
      if (callgetMap[userId] && callgetMap[userId][sourceUserId]) {
        let sourceUser = userMap[sourceUserId]
        if (sourceUser) {
          let sourceSocket = io.sockets.sockets[sourceUser.socketId]
          sourceSocket.emit('acceptCall', {
            type: 'accept',
            targetUser: {
              id: userId
            }
          })
        }
      }
    })

    // 聊天信息
    socket.on('chatMessage', data => {
      if (!checkLogin(socket)) return false
      socket._room_ = socket._room_ || []
      if (socket._room_.indexOf(data.id) !== -1) {
        io.to(data.id).emit('chatMessage', {
          userInfo: {
            id: socket._userInfo_.id,
            nickname: socket._userInfo_.nickname,
            avatar: socket._userInfo_.avatar
          },
          text: data.msg
        })
      }
    })

    socket.on('disconnect', () => {
      // 删除在线人员
      if (socket._userInfo_ && userMap[socket._userInfo_.id]) {
        delete userMap[socket._userInfo_.id]
        userCounter--
        io.emit('onlineCounter', userCounter)
      }
      // 如果加入过房间，人员离开房间，房间删除此人员
      if (socket._room_) {
        for (let i = 0, len = socket._room_.length; i < len; i++) {
          leaveRoom(io, socket, socket._room_[i])
        }
      }
    })
  })
}

module.exports = socketHandle
