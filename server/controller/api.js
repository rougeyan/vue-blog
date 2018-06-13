const logs = require('../model/logs')
const users = require('../model/users')
const {rsp} = require('../lib/tool')
const token = require('../lib/token')

module.exports = {
  insertLog,
  getLogByUrl,
  getPvLog,
  analyzeBlogDate
}
//获取指定接口的访问时长记录
async function getLogByUrl(req,res){
  let url = req.body.url
  if(req.body.url==='/api/v1/idea'){
    url = /\/api\/v1\/ideas\/\d{14}/
  }
  let list = await logs.find({url:url},{_id:0,__v:0})
  return res.json(rsp(0,list.slice(-10),''))
}
//记录接口数据到数据库
async function insertLog(obj){
  let res = recordApi(obj.url,obj.method)
  if(res){
    obj.url = obj.url.split('?')[0]
    await logs.create(obj)
  }
}
//获取最近十天的访问量记录
async function getPvLog(req,res){
  let date = new Date().getTime()
  let list = [],
      index = 10,
      data = []
  while(index>0){
    let time = new Date(date-index*1000*60*60*24).toLocaleString('zh').split(' ')[0].replace(/\//g,'-')
    list.push(time)
    index --
  }
  for(let n of list){
    let len = await token.getIpLog(n)
    let arr = len.map(item=>item.split('-')[0])
    data.push([...new Set(arr)].length)
  }
  return res.json(rsp(0,data,''))
}
//分析文章发布时间:)
async function analyzeBlogDate(req,res){
  let list = await users.findOne({'userName':'Calabash'},{blogList:1,_id:0})
  let dateList = list.blogList.reduce((acc,item)=>{
    acc.push(item.blogDate.slice(8,10))
    return acc
  },[])
  let cache = {}
  for(let n of dateList){
    cache[n]
      ? cache[n]++
      : cache[n]=1
  }
  let data = []
  for(let n of Object.keys(cache)){
    data.push({value:cache[n],name:`${n}点`})
  }
  return res.json(rsp(0,data,''))
}

analyzeBlogDate('','')
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
