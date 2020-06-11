const Router = require('koa-router')
const user = require('./api/user')
const topic = require('./api/topic')
const router = new Router({
  prefix: '/api'
})

router.use('/user', user.routes())
router.use('/topic', topic.routes())

module.exports = router
