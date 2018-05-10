const express = require('express');
const router = express.Router();
const upload = require('../multer/index')
const mongoose = require('../mongodb/index')
const token = require('../lib/token')
const users = require('../model/users')
const check = require('../lib/check')

const response = function(errno=0,res='',msg='',token=''){
  return token ?
    {
      errno,
      res,
      msg,
      token
    }:{
      errno,
      res,
      msg,
    }
}
//分页
const getPage = (pgN,pgS,arr)=>arr.slice((pgN-1)*pgS).slice(0,pgS)
//过滤一个元素:暂时指定是blogContent
const filterProp = (item)=>{
  let {blogContent,...newItem} = item
  return newItem
}
const _Loginfilter = {'userPwd':0,'__v':0,'blogList':0}
//记录IP
router.use(function(req,res,next){
  let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
  //ip,时间,路径
  const noValidPath = [
    '/pv',
    '/checkStatus',
    '/userinfo'
  ]
  if(!noValidPath.includes(req.path) && ip.length){
    token.ipLog(ip,req.url)
  }
  next()
})
//中间件:包含在validToken数组中的路径需要先验证token是否正确
router.use(async function(req, res, next) {
  const validToken = [
    'PUT/userinfo', //修改用户信息
    'POST/ideas',   //新增博文
    'DELETE/ideas', //删除博文
    'PUT/ideas',    //修改博文
    'POST/checkStatus' ,//检查token
    'POST/files', //上传图片
    'GET/pv',
    'POST/comment',
    'POST/like'
  ]
  if(validToken.includes(req.method+req.path)){
    let tok = req.headers['authorization'] || req.body.token || '',
        userName = req.body.userName || req.headers['username'] || req.query.userName || ''
    if(userName!=='Calabash' && req.path==='/pv'){
      return res.json(response(1,'','没有权限'))
    }
    //冲突- -
    if(req.path==='/comment' || req.path==='/like'){
      userName = req.body.user
    }
    let data = await token._check(userName,tok)
    if(data){
      next()
    }else{
      return res.json(response(1,'','凭证失效,请重新登录'))
    }
  }else{
    next()
  }
})
//中间件:不包含在数组中的路径需要先验证是否存在该用户,如果有将结果挂载到req._user下
router.use(async function(req,res,next){
  const noValidUser = [
    '/checkStatus',
    '/logout',
    '/register',
    '/login',
    '/files',
    '/pv',

  ]
  if(!noValidUser.includes(req.path)){
    let userName = req.body.userName || req.query.userName
    let user = await users.findOne({'userName':userName})
    if(user){
      req._user = user
      next()
    }else{
      return res.json(response(1,'','没有该用户'))
    }
  }else{
    next()
  }
})
//注册功能
router.post('/register',async function(req, res) {
  let {userName,userPwd}= req.body
  if(check.validateLength(userName) && check.validateLength(userPwd)){
    let user = await users.findOne({'userName':userName})
    if(user){
      return res.json(response(1,'','该昵称已被占用'))
    }else{
      let createUser = await users.create(req.body)
      return createUser
        ? res.json(response(0,'','注册成功'))
        : res.json(response(1,'','注册失败'))
    }
  }else{
    return res.json(response(1,'','数据非法'))
  }
});
//登录功能
router.post('/login',async function (req,res) {
  let userName = req.body.userName
  let user = await users.findOne(req.body,_Loginfilter )
  if(user){
    let tokenVal = await token.sign(userName)
    user.blogList = []
    return res.json(response(0,user,'登录成功',tokenVal))
  }else{
    return res.json(response(1,'','用户名或密码错误'))
  }
});
//注销登陆
router.post('/logout',function(req,res){
  let { userName } = req.body
  token._delete(userName).then(result=>{
    if(result===1 || result ===0){
      return res.json(response(0,'','注销成功'))
    }else{
      return res.json(response(1,'','凭证已过期'))
    }
  })
})
//检查token
router.post('/checkStatus', function(req,res){
  return res.json(response(0,'',''))

})

//稍微有点RESTful的感觉吧!

//修改个人信息
router.put('/userinfo',async function(req,res){
  req._user.userInfo = req.body
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','修改成功'))
  }else{
    return res.json(response(1,'','修改失败'))
  }
})
//获取个人信息
router.get('/userinfo',async function(req,res){
  return res.json(response(0,req._user.userInfo,''))
})

//发布博客功能
router.post('/ideas',async function(req,res){
  req._user.blogList.push({
    'blogTitle':req.body.blogTitle,
    'blogContent':req.body.blogContent,
    'blogDate':req.body.blogDate,
    'blogType':req.body.blogType
  })
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','发布成功'))
  }else{
    return res.json(response(1,'','发布失败'))
  }
})
//删除某一篇文章
router.delete('/ideas/:blogDate',async function(req,res){
  let index
  req._user.blogList.forEach((item,i)=>{
    if(item.blogDate===req.params.blogDate){
      index = i
    }
  })
  if(index!==undefined){
    req._user.blogList.splice(index,1)
    await req._user.save()
    await token._delete(req.params.blogDate)
    return res.json(response(0,'','操作成功'))
  }
  return res.json(response(1,'','文章不存在'))
})
//修改某一篇文章
router.put('/ideas/:blogDate',async function(req,res){
  req._user.blogList.forEach((item,i)=>{
    if(item.blogDate===req.params.blogDate){
      item.blogTitle = req.body.blogTitle
      item.blogContent = req.body.blogContent
      item.blogType = req.body.blogType
    }
  })
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','修改成功'))
  }else{
    return res.json(response(1,'','修改失败'))
  }
})
//获取某一篇文章
router.get('/ideas/:blogDate',async function(req,res){
  let blogDate = req.params.blogDate
  let list = req._user.blogList,
    obj = {}
  list.forEach(function(item,index){
    if(item.blogDate===blogDate){
      obj = Object.assign(item.toObject(),{
        lastBlogDate:list[index-1]?list[index-1].blogDate:'0',
        nextBlogDate:list[index+1]?list[index+1].blogDate:'0'})
    }
  })
  //解决同一页面刷新重复计数的问题,但是如果两个文章间切换还是存在问题
  if(req.cookies.Cal === undefined || req.cookies.Cal !== blogDate){
    obj.count = await token._incr(blogDate) || ''
    res.cookie('Cal',blogDate,{maxAge:1000*60*10,secure:true,path:'/api/ideas'})
  }else{
    obj.count = await token._getValue(blogDate)
  }
  return obj.blogDate
    ? res.json(response(0,obj,''))
    : res.json(response(1,'','文章不存在'))
})
//获取文章列表
router.get('/ideas',async function (req,res) {
  let obj = req._user.blogList.toObject().map((item)=>filterProp(item))
  if(req._user.blogList.toObject().length===0){
    return res.json(response(1,'','该用户没有文章'))
  }
  if(req.query.type==='all'){
    let data = req._user.blogList.reverse()
    return res.json(response(0,getPage(req.query.pgN,req.query.pgS,data),''))
  }
  if(req.query.type==='public'){
    let data = obj.filter((item)=>item.blogType==='public').reverse()
    return res.json(response(0,getPage(req.query.pgN,req.query.pgS,data),''))
  }
  return res.json(response(0,'',''))
})
//图片上传
router.post('/files',upload.single('file'),async function(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(response(0,path,''))
})
//获取IP地址
router.get('/pv',async function(req,res){
  let date= req.query.date
  let result = await token.getIpLog(date)
  return res.json(response(0,result,''))
})
//评论
router.post('/comment',async function(req,res){
  let {blogDate,userName,...commentBody} = req.body
  req._user.blogList.toObject().forEach((item,index)=>{
    if(item.blogDate===blogDate){
      req._user.blogList[index].comment.push(commentBody)
    }
  })
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','评论成功'))
  }else{
    return res.json(response(1,'','评论失败'))
  }
})
//获取评论
router.get('/comment',async function(req,res){
  req._user.blogList.toObject().forEach((item)=>{
    if(item.blogDate===req.query.blogDate){
      return res.json(response(0,item.comment,''))
    }
  })
})
//应该用redis俩搞,设计之初没有计划好,现在已经比较混乱了
//喜欢/取消喜欢某文章
router.post('/like',async function(req,res){
  let {userName,user,blogDate,flag=false} = req.body
  let query = await users.findOne({'userName':user})
  if(query){
    let liked
    query.likeList.forEach((item,index)=>{
      if(item.blogDate===blogDate && item.author===userName){
        liked = true
      }
    })
    if(liked){
      //flag为true则是取消喜欢
      if(flag){
        let count = ''
        query.likeList = query.likeList.filter((item)=>item.author!==userName || item.blogDate!==blogDate)
        await query.save()
        req._user.blogList.toObject().forEach((item,index)=>{
          if(item.blogDate===blogDate){
            if(req._user.blogList[index].likeCount===undefined){
              req._user.blogList[index].likeCount = 0
            }
            req._user.blogList[index].likeCount -=1
            count = req._user.blogList[index].likeCount
          }
        })
        await req._user.save()
        return res.json(response(0,{likeList:query.likeList,count:count},'已经失去你的爱:('))

      }
      return res.json(response(0,'','只能喜欢一次哦:)'))
    }else{
      let count = ''
      query.likeList.push({
        author:userName,
        blogDate:blogDate
      })
      await query.save()
      req._user.blogList.toObject().forEach((item,index)=>{
        if(item.blogDate===blogDate){
          if(req._user.blogList[index].likeCount===undefined){
            req._user.blogList[index].likeCount = 0
          }
          req._user.blogList[index].likeCount +=1
          count = req._user.blogList[index].likeCount
        }
      })
      await req._user.save()
      return res.json(response(0,{likeList:query.likeList,count:count},'已收到你的爱:)'))
    }
  }else{
    return res.json(response(1,'','没有该用户'))
  }
})


module.exports = router;
