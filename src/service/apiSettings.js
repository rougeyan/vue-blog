import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'

class BaseModule{
  constructor(){
    this.$http = axios.create({
      timeout: 10000,  // 请求超时时间
      baseURL:'/api'
    })
    this.dataMethodDefaults = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        'authorization': JSON.parse(localStorage.vuex).token
      },
      transformRequest: [function(data){
        return qs.stringify(data)
      }]
    }
    this.cache = []
    this.expireTime = 3000
    //请求拦截器
    this.$http.interceptors.request.use(config => {
      if(config.method === 'post'){
        let hitCache = this.cache.filter((item)=>{
          return (item.timeStamp + this.expireTime) > new Date().getTime()
        }).filter((item)=>{
          return item.url === config.url
        })
        if(hitCache.length>0){
          return Promise.reject({
            msg:'重复请求',
            errno:1,
            isCustom:true
          })
        }
        this.cache.push({
          url:config.url,
          timeStamp:new Date().getTime()
        })
      }
      return config
    }, error => {
      Message({
        showClose:true,
        message:'请求出错',
        type:'error'
      })
      return Promise.reject(error)
    })
    //响应拦截器
    this.$http.interceptors.response.use(response => {
      //如果状态码正确且有msg字段[说明需要使用Message组件]
      if(response.status === 200){
        if(response.data.msg){
          Message({
            showClose:true,
            message:response.data.msg,
            type:response.data.errno?'error':'success'
          })
        }
        return response.data
      }else{
        Message({
          showClose:true,
          message:response.status,
          type:'error'
        })
      }
    }, error =>{
      if(error.isCustom){
        Message({
          message:error.msg,
          type:'error'
        })
      }else{
        Message({
          showClose:true,
          message:'响应出错',
          type:'error'
        })
      }
      return Promise.resolve(error)
    })
  }
  get(url,data={},config={}){
    return this.$http.get(url,{params:data,...this.dataMethodDefaults,...config})
  }
  post(url,data=undefined,config={}){
    return this.$http.post(url,data,{ ...this.dataMethodDefaults, ...config })
  }
  put(url,data=undefined,config={}){
    return this.$http.put(url,data,{ ...this.dataMethodDefaults, ...config })
  }
  delete(url,config){
    return this.$http.delete(url,config)
  }
}

export default BaseModule
