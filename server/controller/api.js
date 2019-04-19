module.exports = app => {
  const { blogModel, logModel } = app.model
  const { rsp, redisTool } = app.helper
  /**
   * @description 早期对MongoDB操作不熟悉. 暂未重构
   */
  return {
    // 分析文章发布时间
    analyzeBlogDate(req, res) {
      blogModel.find({ 'author': 'Calabash' }, { blogDate: 1, _id: 0 },function (e, doc) {
        if(doc) {
          const arr = doc.reduce((acc, item) => {
            acc.push(item.blogDate.slice(8, 10))
            return acc
          }, [])
          let cache = {}
          for(let n of arr){
            cache[n] ? cache[n]++ : cache[n] = 1
          }
          const data = Object.keys(cache).reduce((acc, key) => {
            acc.push({ value: cache[key], name: `${key}点` })
            return acc
          }, [])
          return res.json(rsp(0, data, ''))
        }
      })
    },
    // 最近十天访问记录
    async getPvLog(req, res) {
      const oneDay = 1000 * 60 * 60 * 24
      let date = new Date().getTime()
      let list = [],
        index = 10,
        data = []
      while (index > 0){
        let time = new Date(date - index * oneDay).toLocaleString('zh').split(' ')[0].replace(/\//g, '-')
        list.push(time)
        index --
      }
      for (let n of list) {
        let len = await redisTool.getIpLog(n)
        let arr = len.map(item => item.split('-')[0])
        data.push([...new Set(arr)].length)
      }
      return res.json(rsp(0, data, ''))
    },
    //记录接口数据到数据库
    async insertLog(obj) {
      let res = recordApi(obj.url, obj.method)
      if(res){
        obj.url = obj.url.split('?')[0]
        await logModel.create(obj)
      }
    },
    //获取指定接口的访问时长记录
    async getLogByUrl(req,res) {
      let url = req.body.url
      if(req.body.url === '/api/v1/idea') {
        url = /\/api\/v1\/ideas\/\d{14}/
      }
      let list = await logModel.find({ url }, { _id: 0, __v: 0 })
      return res.json(rsp(0, list.slice(-50), ''))
    },
    //处理女朋友的正则需求
    async sendMyLove(req,res) {
      let {type,content} = req.body
      let list = content.split(/\n/)
      let data = ``
      let deleteList = []
      //去除/N
      if(type==='1'){
        data = list.map((item)=>{
          let flag = /\\N\\N.*\\N/.test(item)
          if(flag){
            item = item.replace(/\\N\\N.{3,}?\\N/g,function(match){
              deleteList.push(match)
              return ' '
            })
          }
          return item
        }).join('\n')
      }
      //首字母大写,加句号
      if(type==='2'){
        data = list.map(item=>{
          item = item.trim()
          //该行是否含有英文字母
          let flag = /[a-zA-Z]/.test(item)
          if(flag){
            let res = ''
            //是否是小写字母开头:)
            let startWithWord = /^[a-z]/.test(item)
            if(startWithWord){
              res = `${item[0].toUpperCase()}${item.slice(1)}.`
            }else{
              res = `${item}.`
            }
            deleteList.push(item)
            return res
          }else{
            return item
          }
        }).join('\n')
      }
      // 去除空行加语句拼接
      if (type === '3'){
        let noEmptyRow = list.filter(item => item.trim() !==  '')
        for (let n of noEmptyRow){
          if(/^[a-z]/.test(n)){
            data += ` ${n}`
          } else {
            data += `\n${n}`
          }
        }
      }
      return res.json(rsp(0,{
        content:data,
        deleteList:deleteList.join('\n')
      },''))
    }
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
