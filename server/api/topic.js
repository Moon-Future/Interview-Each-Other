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
    await query(`INSERT INTO topic (id, title, content, user, createtime) VALUES (?, ?, ?, ?, ?)`, [
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
      `SELECT t.id, t.title, t.user as user, t.createtime, u.nickname, u.avatar, u.sex, j.id as job, j.name as jobm FROM topic as t, user as u, job as j WHERE t.off != 1 AND t.user = u.id AND u.job = j.id ORDER BY createtime DESC`
    )
    ctx.body = { topicList: result }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取主题内容
router.get('/getContent', async ctx => {
  try {
    let { topic } = ctx.request.query
    let result = await query(`SELECT t.*, u.avatar, u.nickname FROM topic t, user u WHERE t.id = ? AND t.user = u.id AND t.off != 1`, [topic])
    ctx.body = { data: result[0] || {} }
  } catch (err) {
    throw new Error(err)
  }
})

// 插入主题回复
router.post('/writeReply', async ctx => {
  let userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    let { content, topic } = ctx.request.body
    if (content.trim() === '') {
      ctx.status = 400
      ctx.body = { message: '请输入内容' }
      return
    }
    const forbiddenWords = await query(`SELECT * FROM forbidden WHERE off != 1`)
    let id = shortid.generate()
    if (forbiddenWords.length !== 0) {
      forbiddenWords.forEach(ele => {
        let reg = new RegExp(ele.word, 'g')
        content = content.replace(reg, strAdd('*', ele.word.length))
      })
    }
    await query(`INSERT INTO reply (id, content, topic, user, createtime) VALUES (?, ?, ?, ?, ?)`, [
      id,
      content.trim(),
      topic,
      userInfo.id,
      Date.now()
    ])
    ctx.body = { data: { id: id, content } }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取主题回复
router.get('/getReply', async ctx => {
  try {
    let { topic } = ctx.request.query
    let result = await query(
      `SELECT r.*, u.avatar, u.nickname FROM reply r, user u WHERE r.topic = ? AND r.off != 1 AND r.user = u.id  ORDER BY createtime`,
      [topic]
    )
    ctx.body = { data: result }
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
