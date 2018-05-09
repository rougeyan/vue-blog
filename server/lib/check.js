const fs = require('fs')
const request = require('superagent')
const path = require('path')
const filepath = '/alidata/server/nginx-1.4.4/conf/vhosts/blog.conf'
const filename = path.relative(__dirname,filepath)
const baseUrl = 'https://blog.calabash.top'
const fileRegex = /\/static.*?\.(js|css)/g

async function getHtml(){
  let res = await request.get(baseUrl)
  if(res){
    let str = res.text
    return str.match(fileRegex)
  }
}

async function init(){
  let source = await getHtml()
  fs.readFile(filename,(err,data)=>{
    let str = data.toString()
    let obj = str.match(fileRegex)
    str = str.replace(fileRegex,function(match){
      return source[obj.indexOf(match)]
    })
    fs.writeFile(filename,str,(err)=>{
      if(err) return false
      else{
        return true
      }
    })

  })
}

module.exports.updateNginxConf = init

module.exports.validateLength = function (value='',min=4,max=16){
  return value.length>=min && value.length<=max
}
