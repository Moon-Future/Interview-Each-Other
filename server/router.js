const Router = require('koa-router')
const user = require('./api/user')
const topic = require('./api/topic')
const room = require('./api/room')
const router = new Router({
  prefix: '/api'
})

router.use('/user', user.routes())
router.use('/topic', topic.routes())
router.use('/room', room.routes())

module.exports = router
