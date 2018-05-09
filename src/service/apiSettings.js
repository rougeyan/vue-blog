import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'

const path = [
  'put userinfo',
  'post ideas',
  'delete ideas',
  'put ideas',
  'post checkStatus',
  'post files',
  'get pv',
  'post comment'
]

class BaseModule{
  constructor(){
    this.$http = axios.create({
      timeout: 10000,  // 请求超时时间
      baseURL:'/api',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    })
    //请求拦截器
    this.$http.interceptors.request.use(config => {
      path.forEach((val)=>{
        let v = val.split(' ')
        if(v[0]===config.method && config.url.includes(v[1]) ){
          config.headers['authorization'] = JSON.parse(localStorage.vuex).token
        }
      })
      if(config.url==='https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json'){
        config.headers['authorization']="APPCODE b62dc60dc06342848faf46fec2ce4293"
      }
      if (config.method === "post" || config.method === "put" || config.method === "delete"){
        config.data = qs.stringify(config.data);
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
      Message({
        showClose:true,
        message:'响应出错',
        type:'error'
      })
      return Promise.resolve(error.response)
    })

  }
  get(url,params={}){
    return this.$http.get(url,{params:params})
  }
  post(url,data=undefined,config={}){
    return this.$http.post(url,data,{...config})
  }
  put(url,data=undefined,config={}){
    return this.$http.put(url,data,{...config})
  }
  delete(url,config){
    return this.$http.delete(url,config)
  }
}

export default BaseModule
