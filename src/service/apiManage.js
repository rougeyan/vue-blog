import BaseModule from './apiSettings'

/*因为规模不大 全部写在一个js中好了- -*/
class apiManage extends BaseModule {
  constructor() {
    super()
  }
  //注册
  createUser(obj){
    return this.$http.post('register',obj)
  }
  //登陆
  checkUser(obj){
    return this.$http.post('login',obj)
  }
  //注销登陆
  logout(obj){
    return this.$http.post('logout',obj)
  }
  //检查登陆状态
  checkStatus(obj){
    return this.$http.post('checkStatus',obj)
  }

  //修改用户信息
  changeUserInfo(obj){
    return this.$http.put('userinfo',obj)
  }
  //获取用户信息
  getUserInfo(obj){
    return this.get('userinfo',obj)
  }
  //发送新博文
  createNewIdea(obj){
    return this.$http.post('ideas',obj)
  }
  //删除博客
  deleteIdea(obj){
    let {blogDate,...data} = obj
    let url = `ideas/${blogDate}`
    return this.$http.delete(url,{data:data})
  }
  //修改博文
  changeIdea(obj){
    let {blogDate,...data} = obj
    let url = `ideas/${blogDate}`
    return this.$http.put(url,data)
  }
  //获取某一个文章
  getIdea(obj){
    let {blogDate,...data} = obj
    let url = `ideas/${blogDate}`
    return this.get(url,data)
  }
  //获取博文列表
  getIdeaList(obj){
    return this.get('ideas',obj)
  }
  upload(obj,config){
    return this.$http.post('files',obj,config)
  }
  //获取pv
  getPv(obj){
    return this.get('pv',obj)
  }
  //ip地址查询
  getIpAddress(obj){
    return this.get('https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json',obj)
  }
  //发布评论
  postComment(obj){
    return this.post('comment',obj)
  }
  //获取评论
  getComment(obj){
     return this.get('comment',obj)
  }
  //喜欢/取消喜欢
  like(obj){
    return this.post('like',obj)
  }
}


export default new apiManage()
