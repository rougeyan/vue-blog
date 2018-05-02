/**
 * Created by 11210 on 2017/8/8.
 */

export const currentBlog = state=>state.currentBlog

export const currentBlogList = state=>state.currentBlogList

export const users = state=>state.users

export const userName = state=>state.users.userName

export const loginStatus = state=>state.loginStatus

export const openLoginDialog = state=>state.openLoginDialog

export const userInfo = state=>{
  if(state.users.userInfo){
    return state.users.userInfo
  }else{
    return {
      twitter:'http://www.lanternpro.site/',
      github:'https://github.com/',
      weibo:'https://weibo.com/'
    }
  }
}

export const blogList = state=>state.users.blogList

export const token = state=>state.token
