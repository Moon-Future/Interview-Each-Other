const jwt = require('jsonwebtoken')
const { tokenConfig } = require('../secret/code')
const { user } = require('../database/config')
let userMap = {},
  roomMap = {},
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
    console.log('connection')

    // 验证是否登陆
    socket.on('login', token => {
      try {
        const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
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

    socket.on('callRequest', userId => {
      if (!checkLogin(socket)) return false
      console.log('userId', userId)
    })

    socket.on('chatMessage', data => {
      if (!checkLogin(socket)) return false
      socket._room_ = socket._room_ || []
      if (socket._room_.indexOf(data.id) !== -1) {
        io.to(data.id).emit('chatMessage', { userInfo: socket._userInfo_, text: data.msg })
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
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
