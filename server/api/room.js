const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const { checkToken, dateFormat } = require('./util')
const genUserSig = require('../secret/GenerateTestUserSig')
const { userMap } = require('./socket')

router.post('/message', async ctx => {
  let { message } = ctx.request.body
  console.log(message)
  ctx.body = { message: message }
})

router.get('/getUserSig', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  const { userId } = ctx.request.query
  const userSig = genUserSig(userId)
  ctx.body = { data: userSig }
})

module.exports = router
