/**
 * 话题发表，更新，回复
 */

const Router = require('koa-router')
const router = new Router()
const shortid = require('shortid')
const query = require('../database/init')
const { checkToken } = require('./util')

function strAdd(str, num) {
  let res = ''
  for (let i = 0; i < num; i++) {
    res += str
  }
  return res
}

// 发表主题
router.post('/write', async ctx => {
  let userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { title, content } = ctx.request.body
    const forbiddenWords = await query(`SELECT * FROM forbidden WHERE off != 1`)
    title = title.trim()
    content = content.trim()
    if (title.length > 100) {
      ctx.status = 400
      ctx.body = { message: '主题长度超度100个字符' }
      return
    }
    if (forbiddenWords.length !== 0) {
      forbiddenWords.forEach(ele => {
        let reg = new RegExp(ele.word, 'g')
        title = title.replace(reg, strAdd('*', ele.word.length))
        content = content.replace(reg, strAdd('*', ele.word.length))
      })
    }
    await query(`INSERT INTO topic (id, title, content, userid, createtime) VALUES (?, ?, ?, ?, ?)`, [
      shortid.generate(),
      title,
      content,
      userInfo.id,
      Date.now()
    ])
    ctx.body = { message: '提交成功' }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取主题列表
router.get('/getTopic', async ctx => {
  try {
    let result = await query(
      `SELECT t.id, t.title, t.userid as user, t.createtime, u.nickname, u.avatar, u.sex, j.id as job, j.name as jobm FROM topic as t, user as u, job as j WHERE t.off != 1 AND t.userid = u.id AND u.job = j.id`
    )
    ctx.body = { topicList: result }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
