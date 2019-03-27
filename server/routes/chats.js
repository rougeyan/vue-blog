const express = require('express')
const router = express.Router()
const _ = require('underscore')

const { cors } = require('../middleware')

module.exports = app => {
  const { multer } = app.blog_extend
  const { chatModel } = app.model
  const chatController = require('../controller/chat')(app)

  router.use(cors)

  router.post('/chatList', chatController.addChatObj)
  //获取聊天列表(对象以及头像地址)
  router.get('/chatList', chatController.getChatList)
  //获取与某一个人的聊天数据(最近五十条)
  router.get('/chatData', chatController.getChatData)
  //聊天图片上传
  router.post('/chatPic', multer.single('chat'), chatController.uploadPic)
  //聊天语音上传
  router.post('/chatVoice', multer.single('audio'), chatController.uploadVoice)
  //socket
  app.io = function (io) {
    io.on('connection', function (socket) {

      socket.on('online', function(data) {
        socket.name = data
      })

      socket.on('sendMsg', function(data) {
        const { from, to } = data
        const chatid = [from, to].sort().join('_')
        chatModel.create({ chatid, ...data }, function(err, doc) {
          if(!err){
            let { _id, __v, ...data } = doc._doc
            let toObj = _.findWhere(io.sockets.sockets, { name: to })
            if(toObj) {
              toObj.emit('recvMsg',data)
            }
          }
        })
      })
    })

    return io
  }
  return router
}
