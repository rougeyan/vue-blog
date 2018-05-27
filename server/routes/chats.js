const express = require('express')
const router = express.Router()
const chats = require('../model/chats')
const {getUserProp} = require('./users')

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
      if(!acc.includes(item.chatid)){
        acc.push(item.chatid)
      }
      return acc
    },[])
    let data = []
    for(let n of list){
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
//获取与某一个人的聊天数据
router.get('/chatData',function(req,res){
  const chatid = req.query.chatid
  chats.find({chatid},{_id:0,__v:0},function(err,doc){
    return res.json(rsp(0,doc,''))
  })
})



router.io = function (io) {
  io.on('connection', function (socket) {
    console.log('connected');
    socket.on('sendMsg',function(data){
      const {from,to,content} = data
      const chatid = [from,to].sort().join('_')
      const timeStamp = new Date().getTime()
      console.log(data)
      chats.create({chatid,...data,timeStamp},function(err,doc){
        if(!err){
          let {_id,__v,...data} = doc._doc
          console.log(data)
          io.emit('recvMsg',data)
        }
      })
    })
  });

  return io;
}
module.exports = router;
