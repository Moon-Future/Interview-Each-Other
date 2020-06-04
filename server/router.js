const Router = require('koa-router')
const user = require('./api/user')
const router = new Router({
  prefix: '/api'
})

router.use('/user', user.routes())

module.exports = router
