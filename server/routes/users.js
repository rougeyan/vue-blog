const express = require('express');
const router = express.Router();
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


router.use(function(req, res, next) {
  const valid = [
    '/api//getUserInfo',
    '/api//changeUserInfo',
    '/api//createNewIdea',
    '/api//deleteIdea',
    '/api//changeIdea',
    '/api//checkStatus'
  ]
  //需要验证token
  if(valid.includes(req.originalUrl)){
    let tok = req.headers['authorization'] || req.body.token || ''
    token._check(req.body.userName,tok).then(data=>{
      if(data){
        next()
      }else{
        return res.json(response(1,'','凭证失效'))
      }
    })
  }else{
    next()
  }
})
/*注册功能
* 对获取的用户名密码进行检查，都通过后检测用户名是否次重复
* */
router.post('/createUser',async function(req, res) {
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
/*登录功能
*
* */
router.post('/checkUser',async function (req,res) {
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
/*修改个人信息功能
*
* */
router.post('/changeUserInfo',async function(req,res){
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    user.userInfo = req.body
    let data = await user.save()
    if(data){
      return res.json(response(0,'','修改成功'))
    }else{
      return res.json(response(1,'','修改失败'))
    }
  }else{
    return res.json(response(1,'','没有该用户'))
  }
})
/*获取个人信息
*
* */
router.post('/getUserInfo',async function(req,res){
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    return res.json(response(0,user.userInfo,''))
  }else{
    return res.json(response(1,'','没有该用户'))
  }
})
/*发布博客功能
*
* */
router.post('/createNewIdea',async function(req,res){
  let user = await users.findOne({'userName':userName})
  if(user){
    user.blogList.push({
      'blogTitle':req.body.blogTitle,
      'blogContent':req.body.blogContent,
      'blogDate':req.body.blogDate,
      'blogType':req.body.blogType
    })
    let data = user.save()
    if(data){
      return res.json(response(0,'','发布成功'))
    }else{
      return res.json(response(1,'','发布失败'))
    }
  }else{
    return res.json(response(1,'','用户不存在'))
  }
})
/*获取文章列表
*
* */
router.post('/getIdeaList',async function (req,res) {
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    let obj = user.blogList.toObject().map((item)=>filterProp(item))
    if(req.body.type==='all'){
      let data = user.blogList.reverse()
      return res.json(response(0,getPage(req.body.pgN,req.body.pgS,data),''))
    }
    if(req.body.type==='public'){
      let data = obj.filter((item)=>item.blogType==='public').reverse()
      return res.json(response(0,getPage(req.body.pgN,req.body.pgS,data),''))
    }
    return res.json(response(0,'',''))
  }else{
    return res.json(response(1,'','该用户没有文章'))
  }
})
/*获取某一篇文章
*
* */
router.post('/getIdea',async function(req,res){
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    let list = user.blogList,
        obj = {}
    list.forEach(function(item,index){
      if(item.blogDate===req.body.blogDate){
        obj = Object.assign(item.toObject(),{
          lastBlogDate:list[index-1]?list[index-1].blogDate:'0',
          nextBlogDate:list[index+1]?list[index+1].blogDate:'0'})
      }
    })
    obj.count = await token._incr(req.body.blogDate) || ''
    return obj.blogDate
      ? res.json(response(0,obj,''))
      : res.json(response(1,'','文章不存在'))

  }else{
    return res.json(response(1,'','用户不存在'))
  }
})
/*删除某一篇文章
*
* */
router.post('/deleteIdea',async function(req,res){
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    let index
    user.blogList.forEach((item,i)=>{
      if(item.blogDate===req.body.blogDate){
        index = i
      }
    })
    if(index!==undefined){
      user.blogList.splice(index,1)
      await user.save()
      await token._delete(req.body.blogDate)
      return res.json(response(0,'','操作成功'))
    }
    return res.json(response(1,'','文章不存在'))
  }else{
    return res.json(response(1,'','用户不存在'))
  }
})
/*修改某一篇文章
*
* */
router.post('/changeIdea',async function(req,res){
  let user = await users.findOne({'userName':req.body.userName})
  if(user){
    user.blogList.forEach((item,i)=>{
      if(item.blogDate===req.body.blogDate){
        item.blogTitle = req.body.blogTitle
        item.blogContent = req.body.blogContent
        item.blogType = req.body.blogType
      }
    })
    let data = await user.save()
    if(data){
      return res.json(response(0,'','修改成功'))
    }else{
      return res.json(response(1,'','修改失败'))
    }
  }else{
    return res.json(response(1,'','用户不存在'))
  }
})
/*检查token是否有效
*
* */
router.post('/checkStatus', function(req,res,next){
  return res.json(response(0,'',''))
})
/*注销登陆
*
* */
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
module.exports = router;
