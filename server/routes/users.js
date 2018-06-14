const express = require('express')
const router = express.Router()
const upload = require('../multer/index')
const mongoose = require('../mongodb/index')
const middleware = require('../middleware/index')
const blogController = require('../controller/blog')

router.use(middleware.cors)
//记录IP
router.use(middleware.collectIP)
//中间件:包含在validToken数组中的路径需要先验证token是否正确
router.use(middleware.validateToken)
//中间件:不包含在数组中的路径需要先验证是否存在该用户,如果有将结果挂载到req._user下
router.use(middleware.getUser)

//注册功能
router.post('/register',blogController.register);
//登录功能
router.post('/login',blogController.login);
//注销登陆
router.post('/logout',blogController.logout)
//检查token
router.post('/checkStatus',blogController.checkStatus)
//修改个人信息
router.put('/userinfo',blogController.updateUserInfo)
//获取个人信息
router.get('/userinfo',blogController.getUserInfo)
//发布博客功能
router.post('/ideas',blogController.createBlog)
//删除某一篇文章
router.delete('/ideas/:blogDate',blogController.deleteBlog)
//修改某一篇文章
router.put('/ideas/:blogDate',blogController.updateBlog)
//获取某一篇文章
router.get('/ideas/:blogDate',blogController.getBlog)
//获取文章列表
router.get('/ideas',blogController.getBlogList)
//图片上传
router.post('/files',upload.single('file'),blogController.uploadPic)
//头像上传
router.post('/avatar',upload.single('avatar'),blogController.uploadAvatar)
//获取IP地址
router.get('/pv',blogController.getIP)
//评论
router.post('/comment',blogController.postComment)
//获取评论
router.get('/comment',blogController.getComment)
//应该用redis俩搞,设计之初没有计划好,现在已经比较混乱了
//喜欢/取消喜欢某文章
router.post('/like',blogController.likeBlog)
//web push
router.post('/subscription',blogController.subscription)
//推送
router.post('/push',blogController.push)
//收藏
router.post('/collect',blogController.collect)
//创建收藏夹
router.post('/collectList',blogController.createCollect)
module.exports = {
  users:router
};
