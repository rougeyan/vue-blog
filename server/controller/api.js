const logs = require('../model/logs')
const {rsp} = require('../lib/tool')
module.exports = {
  insertLog,
  getLogByUrl
}

async function getLogByUrl(req,res){
  let url = req.body.url
  if(req.body.url==='/api/v1/idea'){
    url = /\/api\/v1\/ideas\/\d{14}/
  }
  let list = await logs.find({url:url},{_id:0,__v:0})
  return res.json(rsp(0,list,''))
}

async function insertLog(obj){
  let res = recordApi(obj.url,obj.method)
  if(res){
    obj.url = obj.url.split('?')[0]
    await logs.create(obj)
  }
}

function recordApi(url,method){
  if(/^\/api/.test(url)){
    let el = [url.split('?')[0],method].join('-')
    const rules = [
      '/api/v1/login-POST',
      '/api/v1/checkStatus-POST',
      '/api/v1/userinfo-GET',
      '/api/v1/ideas-GET',
      '/api/v1/comment-POST',
      '/api/v1/like-POST'
    ]
    if(rules.includes(el) ||  /\/api\/v1\/ideas\/\d{14}-GET/.test(el)){
      return true
    }else{
      return false
    }
  }else{
    return false
  }

}
