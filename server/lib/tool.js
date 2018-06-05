const users = require('../model/users')
//获取用户某个属性
async function getUserProp(user,key){
  let doc = await users.findOne({'userName':user})
  if(doc){
    return doc[key] || ''
  }
  return false
}
//分页
const getPage = (pgN,pgS,arr)=>arr.slice((pgN-1)*pgS).slice(0,pgS)
//api v1
const response = function(errno=0,res='',msg='',token=''){
  return token
    ? { errno, res, msg, token}
    : { errno, res, msg,}
}
//api v2
function rsp(errno=0,data='',msg=''){
  return {errno,data,msg}
}

module.exports = {
  getPage,
  response,
  getUserProp,
  rsp
}
