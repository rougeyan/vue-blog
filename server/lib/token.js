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
  _update(user){
    redis.expire(user,3600)
  },
  _getValue(user){
    return redis.get(user).then(res=>res)
  },
  _delete(user){
    return redis.del(user).then(res=>res)
  },
  _check(user,token){
    return this._getValue(user).then(res=>{
      if(res === token){
        this._update(user)
        return true
      }else{
        return false
      }
    })
  },
  _incr(blog){
    redis.incr(blog)
    return this._getValue(blog).then(res=>res)
  },
  ipLog(data){
    let time = new Date().toLocaleString('zh', { hour12: false }).split(' ')[0];
    redis.sadd(JSON.stringify(time),data);
  },
  getIpLog(data){
     return redis.smembers(JSON.stringify(data)).then(res=>res)
  }
}

module.exports = token


