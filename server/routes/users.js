const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
    token.checkToken(req.body.userName,tok).then(data=>{
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
router.post('/createUser', function(req, res) {
  let userName = req.body.userName,
      userPwd = req.body.userPwd
  if(check.validateLength(userName) && check.validateLength(userPwd)){
      users.findOne({'userName':userName}).then(function(doc){
        if(doc){
          return res.json(response(1,'','该昵称已被占用'))
        }else{
          users.create(req.body).then(function(doc){
            if(doc){
              return res.json(response(0,'','注册成功'))
            }else{
              return res.json(response(1,'','注册失败'))
            }
          })
        }
      })
  }else{
    return res.json(response(1,'','数据非法'))
  }
});
/*登录功能
*
* */
router.post('/checkUser',function (req,res) {
  let userName = req.body.userName
  if(1){
    users.findOne(req.body,_Loginfilter ).then(function(doc){
      if(doc){
        let tokenVal = token.sign(userName)
        return res.json(response(0,doc,'登录成功',tokenVal))
      }else{
        return res.json(response(1,'','用户名或密码错误'))
      }
    })
  }else{
    return res.json(response(1,'','数据非法'))
  }
});
/*修改个人信息功能
*
* */
router.post('/changeUserInfo',function(req,res){
  /*后端数据验证模块*/
  /*后台数据校验*/
  if(1){
    users.findOne({'userName':req.body.userName}).then((doc)=>{
      if(doc){
        doc.userInfo = req.body
        doc.save().then((data)=>{
          if(data){
            return res.json(response(0,'','修改成功'))
          }else{
            return res.json(response(1,'','修改失败'))
          }
        })
      }else{
        return res.json(response(1,'','没有该用户'))
      }
    })
  }else{
    return res.json(response(1,'','非法数据'))
  }
})
/*获取个人信息
*
* */
router.post('/getUserInfo',function(req,res){
  /*后台数据校验*/
  if(1){
    users.findOne({'userName':req.body.userName}).then((doc)=>{
      if(doc){
        return res.json(response(0,doc.userInfo,''))
      }else{
        return res.json(response(1,'','没有该用户'))
      }
    })
  }else{
    return res.json(response(1,'','非法数据'))
  }
})
/*发布博客功能
*
* */
router.post('/createNewIdea',function(req,res){
  let userName = req.body.userName
  /*后台数据校验*/
  if(1){
    users.findOne({'userName':userName}).then(function(doc){
      if(doc){
        doc.blogList.push({
          'blogTitle':req.body.blogTitle,
          'blogContent':req.body.blogContent,
          'blogDate':req.body.blogDate,
          'blogType':req.body.blogType
        })
        doc.save().then((data)=>{
          if(data){
            return res.json(response(0,'','发布成功'))
          }else{
            return res.json(response(1,'','发布失败'))
          }
        })
      }else{
        return res.json(response(1,'','用户不存在'))
      }
    })
  }else{
    return res.json(response(1,'','数据非法'))
  }
})
/*获取文章列表
*
* */
router.post('/getIdeaList',function (req,res) {
  if(1){//校验通过
    users.findOne({'userName':req.body.userName}).then(function(doc){
      if(doc){
        let obj = doc.blogList.toObject().map((item)=>filterProp(item))
        if(req.body.type==='all'){
          let data = doc.blogList.reverse()

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
  }else{
    return res.json(response(1,'','数据非法'))
  }
})
/*获取某一篇文章
*
* */
router.post('/getIdea',function(req,res){
  /*后端数据校验部分*/
  if(1){
    users.findOne({'userName':req.body.userName}).then(function(doc){
      if(doc){
        let obj
        doc.blogList.forEach(function(item,index,arr){
          if(item.blogDate===req.body.blogDate){
            obj = Object.assign(item.toObject(),{
              lastBlogDate:doc.blogList[index-1]?doc.blogList[index-1].blogDate:'0',
              nextBlogDate:doc.blogList[index+1]?doc.blogList[index+1].blogDate:'0'})
            return res.json(response(0,obj,''))
          }
        })
        if(!obj){
          return res.json(response(1,'','文章不存在'))
        }
      }else{
        return res.json(response(1,'','用户不存在'))
      }
    },(err)=>{})
  }else{
    return res.json(response(1,'','数据非法'))
  }
})
/*删除某一篇文章
*
* */
router.post('/deleteIdea', function(req,res){
  /*后台数据校验*/
  if(1){
    users.findOne({'userName':req.body.userName}).then((doc)=>{
      if(doc){
        let index
        doc.blogList.forEach((item,i)=>{
          if(item.blogDate===req.body.blogDate){
            index = i
          }
        })
        if(index!==undefined){
          doc.blogList.splice(index,1)
          doc.save().then((data)=>{
            if(data){
              return res.json(response(0,'','操作成功'))
            }else{
              return res.json(response(1,'','文章不存在'))
            }
          })
        }
      }else{
        return res.json(response(1,'','用户不存在'))
      }
    })
  }else{
    return res.json(response(1,'','非法数据'))
  }
})
/*修改某一篇文章
*
* */
router.post('/changeIdea', function(req,res){
  /*后台数据校验*/
  if(1){
    users.findOne({'userName':req.body.userName}).then((doc)=>{
      if(doc){
        doc.blogList.forEach((item,i)=>{
          if(item.blogDate===req.body.blogDate){
            item.blogTitle = req.body.blogTitle
            item.blogContent = req.body.blogContent
            item.blogType = req.body.blogType
          }
        })
        doc.save().then((data)=>{
          if(data){
            return res.json(response(0,'','修改成功'))
          }else{
            return res.json(response(1,'','修改失败'))
          }
        })
      }else{
        return res.json(response(1,'','用户不存在'))
      }
    })
  }else{
    return res.json(response(1,'','非法数据'))
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
  token.delToken(userName).then(result=>{
    if(result===1 || result ===0){
      return res.json(response(0,'','注销成功'))
    }else{
      return res.json(response(1,'','凭证已过期'))
    }
  })
})
module.exports = router;
