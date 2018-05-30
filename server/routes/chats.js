const express = require('express')
const _ = require('underscore')
const router = express.Router()
const chats = require('../model/chats')
const {getUserProp} = require('./users')
const upload = require('../multer/index')

function rsp(errno=0,data='',msg=''){
  return {errno,data,msg}
}

router.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Credentials','true');   // 新增
  next()
})

router.get('/',function(req,res){
  console.log('操你妈')
})

router.post('/chatList',async function(req,res){
  const user = req.body.user
  let data = await getUserProp(user,'avatar')
  if(data){
    return res.json(rsp(0,{to:user,avatar:data},''))
  }
  return res.json(rsp(1,'','没有该用户'))
})
//获取聊天列表(对象以及头像地址)
router.get('/chatList',async function(req,res){
  const user = req.query.user
  let doc = await chats.find({},{_id:0,chatid:1})
  if(doc){
    let list = doc.reduce((acc,item,index)=>{
      if(item.chatid.includes(user)){
        acc.push(item.chatid)
      }
      return acc
    },[])
    let data = []
    let arr = [...new Set(list)]
    for(let n of arr){
      let [from,to] = n.split('_')
      let obj = from === user ? to : from
      let avatar = await getUserProp(obj,'avatar')
      data.push({
        to:obj,
        avatar:avatar
      })
    }
    return res.json(rsp(0,data,''))
  }
})
//获取与某一个人的聊天数据(最近五十条)
router.get('/chatData',function(req,res){
  const chatid = req.query.chatid
  chats.find({chatid},{_id:0,__v:0},function(err,doc){
    return res.json(rsp(0,doc.slice(-50),''))
  })
})
//聊天图片上传
router.post('/chatPic',upload.single('chat'),async function(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(rsp(0,path,''))
})
//聊天语音上传
router.post('/chatVoice',upload.single('audio'),async function(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(rsp(0,path,''))
})
router.io = function (io) {
  io.on('connection', function (socket,data) {
    console.log('connected');

    socket.on('online',function(data){
      socket.name = data
    })

    socket.on('sendMsg',function(data){
      const {from,to,content} = data
      const chatid = [from,to].sort().join('_')
      chats.create({chatid,...data},function(err,doc){
        if(!err){
          let {_id,__v,...data} = doc._doc
          let toObj = _.findWhere(io.sockets.sockets,{name:to})
          if(toObj){
            toObj.emit('recvMsg',data)
          }
        }
      })
    })
  });

  return io;
}


module.exports = router;
