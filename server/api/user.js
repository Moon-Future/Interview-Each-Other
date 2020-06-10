const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const axios = require('axios')
const { checkToken, dateFormat } = require('./util')
const { tokenConfig, githubConfig } = require('../secret/code')
// const { transporter, mailOptions } = require('./email')
const cosUpload = require('./tencentCloud')

// 提交表单处理
function formParse(req) {
  let form = new formidable.IncomingForm()
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
      } else {
        resolve({ fields, files })
      }
    })
  })
}

// 注册
router.post('/register', async ctx => {
  try {
    let { username, password, rePassword, nickname } = ctx.request.body
    const date = Date.now()
    const result = await query(`SELECT * FROM user WHERE username = ?`, [username])
    if (result.length !== 0) {
      ctx.status = 400
      ctx.body = { message: '用户已存在' }
      return
    }
    if (password !== rePassword) {
      ctx.status = 400
      ctx.body = { message: '两次密码不同' }
      return
    }
    if (username.trim().length > 100) {
      ctx.status = 400
      ctx.body = { message: '用户长度在 1 到 100 个字符' }
      return
    }
    let userID = shortid.generate()
    await query(
      `INSERT INTO user (id, username, password, nickname, avatar, email, createtime) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userID, username.trim(), password, nickname.trim().slice(0, 10), '', username.trim(), date]
    )
    ctx.body = { message: '注册成功' }
    // mailOptions.subject = 'English4Coder 有新的注册用户'
    // mailOptions.html = `
    //   <h1>新注册用户</h1>
    //   <p>账户: ${username}</p>
    //   <p>昵称: ${name}</p>
    //   <p>时间: ${dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</p>
    // `
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return console.log(error)
    //   }
    // })
  } catch (err) {
    throw new Error(err)
  }
})

// 登陆
router.post('/login', async ctx => {
  try {
    const { username, password } = ctx.request.body
    const result = await query(`SELECT u.*, j.name as jobm FROM user u, job j WHERE u.username = ? AND u.password = ? AND u.job = j.id`, [
      username,
      password
    ])
    if (result.length === 0) {
      ctx.status = 400
      ctx.body = { message: '用户名或密码有误' }
      return
    }
    const userInfo = result[0]
    delete userInfo.password
    const token = jwt.sign({ id: result[0].id }, tokenConfig.privateKey, {
      expiresIn: '7d'
    })
    ctx.body = { token: 'Bearer ' + token, userInfo }
  } catch (err) {
    throw new Error(err)
  }
})

router.get('/getUserMore', async ctx => {
  try {
    const params = ctx.request.query
    const { userID } = params
    const result = await query(`SELECT * FROM user_website WHERE userID = ?`, [userID])
    ctx.body = { code: 1, data: result }
  } catch (err) {
    throw new Error(err)
  }
})

router.get('/getUserInfo', async ctx => {
  try {
    const token = ctx.get('Authorization')
    let userInfo = {}
    if (token === '') {
      ctx.body = { userInfo, loginStatus: false }
    } else {
      try {
        userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        ctx.body = { userInfo, loginStatus: true }
      } catch (err) {
        ctx.body = { userInfo, loginStatus: false }
      }
    }
  } catch (err) {
    throw new Error(err)
  }
})

router.get('/getUser', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    ctx.body = { code: 0, message: '请先登陆' }
    return
  }
  if (!userInfo.root) {
    ctx.body = { code: 0, message: '没有权限' }
    return
  }
  try {
    let rst = await query(`SELECT * FROM user WHERE off != 1`)
    ctx.body = { code: 1, data: rst }
  } catch (err) {
    throw new Error(err)
  }
})

// Github授权登陆
router.get('/githubCallback', async ctx => {
  try {
    const host = ctx.get('host')
    const NODE_ENV = host.includes('localhost') ? 'dev' : 'pro' // dev, pro
    const params = ctx.request.query
    const tokenResponse = await axios.post(githubConfig.accessURL, {
      client_id: githubConfig[NODE_ENV].client_id,
      client_secret: githubConfig[NODE_ENV].client_secret,
      code: params.code
    })
    const userResponse = await axios.get(`${githubConfig.tokenURL}${tokenResponse.data}`)
    const userData = userResponse.data
    const userID = userData.id + 'Github'
    const date = Date.now()
    let userInfo = {
      id: userID,
      username: 'Github',
      name: userData.name,
      avatar: userData.avatar_url,
      email: userData.email
    }
    let websiteList = [{ name: 'Github', url: userData.html_url }]
    if (userData.blog) {
      websiteList.push({ name: 'Blog', url: userData.blog })
    }
    userInfo.website = websiteList

    // 注册
    const result = await query(`SELECT * FROM user WHERE id = ?`, [userID])
    if (result.length === 0) {
      await query(
        `INSERT INTO user (id, name, avatar, email, createTime) 
        VALUES (?, ?, ?, ?, ?)`,
        [userID, userInfo.name, userInfo.avatar, userInfo.email, date]
      )
      for (let i = 0, len = websiteList.length; i < len; i++) {
        let item = websiteList[i]
        await query(
          `INSERT INTO user_website (id, userID, name, url, createTime) 
          VALUES (?, ?, ?, ?, ?)`,
          [shortid.generate(), userID, item.name, item.url, date]
        )
      }
    } else {
      if (result[0].root == 1) {
        userInfo.root = true
      }
      userInfo.avatar = result[0].avatar
      userInfo.name = result[0].name
      userInfo.email = result[0].email
      userInfo.createTime = result[0].createTime
    }
    // 登陆时间
    await query(`UPDATE user SET lastTime = ? WHERE id = ?`, [Date.now(), userID])
    const token = jwt.sign(userInfo, tokenConfig.privateKey)

    ctx.response.redirect(githubConfig[NODE_ENV].redirect + '?token=Bearer ' + token)
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/updateUserInfo', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    const { sex, nickname, job, worktime, profile, info, newPass, oldPass, reNew } = ctx.request.body
    let userData = (await query(`SELECT * FROM user WHERE id = ?`, [userInfo.id]))[0]
    delete userData.password
    // 基本信息更新
    if (info) {
      if (
        userData.nickname !== nickname ||
        userData.sex != sex ||
        userData.job !== job ||
        userData.worktime !== worktime ||
        userData.profile !== profile
      ) {
        let res = await query(`UPDATE user SET nickname = ?, sex = ?, job = ?, worktime = ?, profile = ?, updatetime = ? WHERE id = ?`, [
          nickname.trim().slice(0, 10),
          sex,
          job,
          worktime,
          profile.trim(),
          Date.now(),
          userData.id
        ])
        userData = (await query(`SELECT u.*, j.name as jobm FROM user u, job j WHERE u.id = ? AND u.job = j.id`, [userInfo.id]))[0]
        delete userData.password
        let token = jwt.sign({ id: userData.id }, tokenConfig.privateKey, {
          expiresIn: '7d'
        })
        ctx.body = {
          message: '更新成功',
          userInfo: userData,
          token: 'Bearer ' + token
        }
      } else {
        ctx.status = 400
        ctx.body = { message: '无需更新' }
      }
    } else {
      // 修改密码
      if (userInfo.id.includes('Github')) {
        ctx.body = { message: 'Github用户' }
        return
      }
      if (newPass !== reNew) {
        ctx.status = 400
        ctx.body = { message: '两次密码不同' }
        return
      }
      const rst = await query(`SELECT * FROM user WHERE id = ? AND password = ?`, [userInfo.id, oldPass])
      if (rst.length === 0) {
        ctx.status = 400
        ctx.body = { message: '原密码错误' }
        return
      }
      await query(`UPDATE user SET password = ? WHERE id = ?`, [newPass, userInfo.id])
      ctx.body = { message: '密码修改成功' }
    }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/upload', async ctx => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    return
  }
  try {
    const { files } = await formParse(ctx.req)
    const avatarData = files.avatar
    const filePath = avatarData.path
    const fileName = '/avatar/' + userInfo.id + '.jpg'
    const result = await cosUpload(fileName, filePath)
    if (result.statusCode === 200) {
      let avatar = 'https://' + result.Location
      await query(`UPDATE user SET avatar = ? WHERE id = ?`, [avatar, userInfo.id])
      ctx.body = { message: '上传成功', avatar: avatar + '?r=' + Math.random() }
    } else {
      ctx.status = 400
      ctx.body = { message: '上传失败' }
    }
  } catch (err) {
    throw new Error(err)
  }
})

// 获取 job 列表
router.get('/getJob', async ctx => {
  try {
    const result = await query(`SELECT * FROM job WHERE off != 1`)
    ctx.body = result
  } catch (err) {
    throw new Error(err)
  }
})

module.exports = router
