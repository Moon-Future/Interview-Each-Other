const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const { checkToken, dateFormat } = require('./util')

router.post('/message', async ctx => {
  let { message } = ctx.request.body
  console.log(message)
  ctx.body = { message: message }
})

module.exports = router
