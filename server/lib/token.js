const redis = require('../redis/index')
const jwt = require('jsonwebtoken')
const SECRET ='CalabashBlog'

const token = {
  //生成并设置token
  sign(user){
    let token = jwt.sign({user:user}, SECRET)
    redis.set(user,token)
    redis.expire(user,3600)
    return token
  },
  //更新token
  updateToken(user){
    redis.expire(user,3600)
  },
  //获取token Promise
  getToken(user){
    return redis.get(user).then(res=>res)
  },
  //删除token
  delToken(user){
    return redis.del(user).then(res=>res)
  },
  //检查token
  checkToken(user,token){
    return (async function(){
      let tok = await this.getToken(user)
      if(tok === token){
        this.updateToken(user)
        return true
      }else{
        return false
      }
    }.bind(this))()
  }
}

module.exports = token
