const jwt = require('jsonwebtoken')
const { tokenConfig } = require('../secret/code')
const { user } = require('../database/config')
let userMap = {},
  userCounter = 0

function socketHandle(io) {
  // socket连接
  io.on('connection', socket => {
    console.log('connection')
    socket.on('chat', msg => {
      console.log('message: ' + msg)
      // io.emit('chat', msg)
      socket.emit('chatserver', msg + 'xxx')
    })

    // 验证是否登陆
    socket.on('login', token => {
      try {
        const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        userMap[socket.id] = userInfo
        userCounter++
        console.log('userCounter', userCounter)
        io.emit('onlineCounter', userCounter)
      } catch (err) {
        return false
      }
    })

    // 退出登陆
    socket.on('logout', () => {
      if (userMap[socket.id]) {
        delete userMap[socket.id]
        userCounter--
        io.emit('onlineCounter', userCounter)
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
      if (userMap[socket.id]) {
        delete userMap[socket.id]
        userCounter--
        io.emit('onlineCounter', userCounter)
      }
    })
  })
}

module.exports = socketHandle
