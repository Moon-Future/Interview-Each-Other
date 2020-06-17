const Koa = require('koa')
const app = new Koa()
const session = require('koa-session') // session管理
const cors = require('koa2-cors') // 解决跨域
const bodyParser = require('koa-bodyparser') // 解析POST请求数据
const staticfile = require('koa-static') // 关联静态文件
const path = require('path')
const router = require('./router')
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const socketHandle = require('./api/socket')

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
}
app.keys = ['login secret']
app.use(session(CONFIG, app))
app.use(cors({}))
app.use(bodyParser())
app.use(staticfile(path.join(__dirname, '../dist'))) // 部署上线时读取静态文件
app.use(router.routes()).use(router.allowedMethods())

socketHandle(io)

server.listen(1756, () => {
  console.log('listen at port 1756...')
})
