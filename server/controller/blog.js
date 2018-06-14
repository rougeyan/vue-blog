const token = require('../lib/token')
const users = require('../model/users')

const pushMessage = require('../webpush/index')
const {response,getUserProp,getPage} = require('../lib/tool')


//shit
const filterProp = (item)=>{
  let {blogContent,...newItem} = item
  return newItem
}
const _Loginfilter = {'userPwd':0,'__v':0,'blogList':0}

//注册
async function register(req,res){
  let {userName,userPwd}= req.body
  let user = await users.findOne({'userName':userName})
  if(user){
    return res.json(response(1,'','该昵称已被占用'))
  }else{
    let createUser = await users.create(req.body)
    return createUser
      ? res.json(response(0,'','注册成功'))
      : res.json(response(1,'','注册失败'))
  }
}
//登录
async function login(req,res){
  let userName = req.body.userName
  let user = await users.findOne(req.body,_Loginfilter )
  if(user){
    let tokenVal = await token.sign(userName)
    user.blogList = []
    return res.json(response(0,user,'登录成功',tokenVal))
  }else{
    return res.json(response(1,'','用户名或密码错误'))
  }
}
//注销
function logout(req,res){
  let { userName } = req.body
  token._delete(userName).then(result=>{
    if(result===1 || result ===0){
      return res.json(response(0,'','注销成功'))
    }else{
      return res.json(response(1,'','凭证已过期'))
    }
  })
}
//检查token
function checkStatus(req,res){
  return res.json(response(0,'',''))
}
//修改个人信息
async function updateUserInfo(req,res){
  req._user.userInfo = req.body
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','修改成功'))
  }else{
    return res.json(response(1,'','修改失败'))
  }
}
//获取个人信息
async function getUserInfo(req,res){
  return res.json(response(0,req._user.userInfo,''))
}


//发布博客
async function createBlog(req,res){
  req._user.blogList.push({
    'blogTitle':req.body.blogTitle,
    'blogContent':req.body.blogContent,
    'blogDate':req.body.blogDate,
    'blogType':req.body.blogType
  })
  let data = await req._user.save()
  if(data){
    if(req._user.userName==='Calabash' || 'Maxeano' || 'maxeano'){
      await sendNotification({
        title:'新消息',
        body:`${req._user.userName}发布了新的文章 ${req.body.blogTitle}`,
        icon:'/calabash24.png'
      })
    }
    return res.json(response(0,'','发布成功'))
  }else{
    return res.json(response(1,'','发布失败'))
  }
}
//删除博客
async function deleteBlog(req,res){
  let index = req._user.blogList.findIndex((item,i)=>item.blogDate===req.params.blogDate)
  if(index!==-1){
    req._user.blogList.splice(index,1)
    await req._user.save()
    await token._delete(req.params.blogDate)
    return res.json(response(0,'','操作成功'))
  }
  return res.json(response(1,'','文章不存在'))
}
//修改博客
async function updateBlog(req,res){
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
}
//获取博客
async function getBlog(req,res){
  let blogDate = req.params.blogDate
  let list = req._userObj.blogList
  let index = list.findIndex((item,index)=>item.blogDate===blogDate)
  let {_id,blogType,...filterObj} = Object.assign(list[index],{
    lastBlogDate:list[index-1]?list[index-1].blogDate:'0',
    nextBlogDate:list[index+1]?list[index+1].blogDate:'0'})

  //解决同一页面刷新重复计数的问题,但是如果两个文章间切换还是存在问题
  if(req.cookies.Cal === undefined || req.cookies.Cal !== blogDate){
    filterObj.count = await token._incr(blogDate) || ''
    res.cookie('Cal',blogDate,{maxAge:1000*60*10,secure:true,path:'/api/ideas'})
  }else{
    filterObj.count = await token._getValue(blogDate)
  }
  let data = []
  for(let item of filterObj.comment){
    let avatar = await getUserProp(item.user,'avatar');
    data.push({...item,avatar})
  }
  filterObj.comment = data
  return filterObj.blogDate
    ? res.json(response(0,filterObj,''))
    : res.json(response(1,'','文章不存在'))
}
//获取博客列表
async function getBlogList(req,res) {
  let obj = req._userObj.blogList.reverse()
  if(obj.length===0){
    return res.json(response(1,'','该用户没有文章'))
  }
  if(req.query.type==='all'){
    let data = getPage(req.query.pgN,req.query.pgS,obj)
      .reduce((acc,item)=>{
        let {_id,likeCount,comment,...data} = item
        acc.push(data)
        return acc
      },[])
    return res.json(response(0,data,''))
  }
  if(req.query.type==='public'){
    let data = obj.filter((item)=>item.blogType==='public')
    let result = getPage(req.query.pgN,req.query.pgS,data)
      .reduce((acc,item)=>{
        let {_id,likeCount,comment,blogType,blogContent,...data} = item
        acc.push(data)
        return acc
      },[])
    return res.json(response(0,result,''))
  }
  return res.json(response(0,'',''))
}
//发布评论
async function postComment(req,res){
  let {blogDate,userName,...commentBody} = req.body
  let index = req._user.blogList.findIndex((item,index)=>item.blogDate===blogDate)
  req._user.blogList[index].comment.push(commentBody)
  let data = await req._user.save()
  if(data){
    return res.json(response(0,'','评论成功'))
  }else{
    return res.json(response(1,'','评论失败'))
  }
}
//获取评论
async function getComment(req,res){
  let blog = req._user.blogList.find((item)=>item.blogDate===req.query.blogDate)
  let data = []
  for(let item of blog.comment){
    let avatar = await getUserProp(item.user,'avatar');
    data.push({avatar,...item})
  }
  return res.json(response(0,data,''))
}
//喜欢/取消喜欢文章
async function likeBlog(req,res){
  let {userName,user,blogDate,blogTitle,flag} = req.body
  let blogList = req._userObj.blogList
  let query = await users.findOne({'userName':user})

  if(query){
    let liked = query.likeList.findIndex((item,index)=>item.blogDate===blogDate && item.author===userName)
    if(liked !== -1){
      let count = ''
      query.likeList = query.likeList.filter((item)=>item.author!==userName || item.blogDate!==blogDate)
      await query.save()
      blogList.forEach((item,index)=>{
        if(item.blogDate===blogDate){
          req._user.blogList[index].likeCount -=1
          count = req._user.blogList[index].likeCount
        }
      })
      await req._user.save()
      return res.json(response(0,{likeList:query.likeList,count:count},'已经失去你的爱:('))
    }else{
      let count = ''
      query.likeList.push({
        author:userName,
        blogDate:blogDate,
        blogTitle:blogTitle
      })
      await query.save()
      req._userObj.blogList.forEach((item,index)=>{
        if(item.blogDate===blogDate){
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
}
//图片上传
async function uploadPic(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(response(0,path,''))
}
//头像上传
async function uploadAvatar(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  req._user.avatar = path
  await req._user.save()
  return res.json(response(0,path,'设置成功'))
}
//获取ip地址
async function getIP(req,res){
  let date= req.query.date
  let result = await token.getIpLog(date)
  return res.json(response(0,result,''))
}
//浏览器订阅
async function subscription(req,res){
  const value = req.body.data
  token.saveSubscription('subscription',value)
  return res.json(response(0,'',''))
}
//推送
async function push(req,res){
  let data = req.body
  await sendNotification(data)
  return res.json(response(0,'',''))
}
//遍历推送
async function sendNotification(data){
  let list = await token.getSubscription('subscription')
  for(let n of list){
    let res = await pushMessage(n,JSON.stringify(data))
    if(typeof res === 'string'){
      token.removeSubscription(res)
    }
  }
}
//收藏
async function collect(req,res){
  let {userName,author,blogDate,collect} = req.body
  let index = req._user.collectList.findIndex(item=>item.collectTitle===collect)
  if(req._user.collectList[index].list.some(item=>item.blogDate===blogDate)){
    return res.json(response(1,'','已收藏该文章'))
  }
  req._user.collectList[index].list.push({author,blogDate})
  await req._user.save()
  return res.json(response(0,'','收藏成功'))
}
//创建收藏夹
async function createCollect(req,res){
  let {userName,...obj} = req.body
  if(req._user.collectList.some(item=>item.collectTitle===obj.title)){
    return res.json(response(1,'','该收藏夹已存在'))
  }
  req._user.collectList.push({
    'collectTitle':obj.title,
    'collectType':obj.type,
    'collectDesc':obj.desc
  })
  await req._user.save()
  return res.json(response(0,'','创建成功'))
}

module.exports = {
  register,
  login,
  logout,
  checkStatus,
  updateUserInfo,
  getUserInfo,
  createBlog,
  deleteBlog,
  updateBlog,
  getBlog,
  getBlogList,
  postComment,
  getComment,
  likeBlog,
  uploadPic,
  uploadAvatar,
  getIP,
  subscription,
  push,
  collect,
  createCollect
}
