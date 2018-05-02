<template>
  <div class="page-container">
    <div class="index-container">
      <blog-index-header :user="user" :users="users" ></blog-index-header>
      <blog-index-links @openDialog="openDialog" :infoList="infoList"></blog-index-links>
      <transition name="move" mode="out-in">
        <router-view :users="users" :currentBlogList="currentBlogList"></router-view>
      </transition>
      <login-dialog :openLoginDialog="openLoginDialog" @closeDialog="closeDialog"></login-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BlogHeader from '../base/BlogHeader'
  import BlogLinks from  '../base/BlogLinks'
  import LoginDialog from '../base/LoginDialog'
  import {mapMutations,mapGetters,mapActions} from 'vuex'
  export default{
    name:'index',
    //来源为router动态参数
    props:['user'],
    data(){
      return{
        infoList:{
          twitter:'http://www.lanternpro.site/',
          github:'https://github.com/',
          weibo:'https://weibo.com/'
        }
      }
    },
    components:{
      'blog-index-header':BlogHeader,
      'blog-index-links':BlogLinks,
      'login-dialog':LoginDialog
    },
    computed:{
      ...mapGetters([
        'openLoginDialog',
        'loginStatus',
        'users',
        'token',
        'userInfo',
        'currentBlogList'
      ])
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getInfo'
    },
    methods:{
      ...mapMutations([
        'OPEN_LOGIN_DIALOG'
      ]),
      ...mapActions([
        'checkStatus',
        'getUserInfo'
      ]),
      openDialog(){
        //如果本地有token,检验token,没有就打开登录窗口
        if(this.token){
          this.checkStatus({userName:this.users.userName})
        }else{
          this.OPEN_LOGIN_DIALOG(true)
        }
      },
      closeDialog(){
        if(this.openLoginDialog){
          this.OPEN_LOGIN_DIALOG(false)
        }
      },
      getInfo(){
        this.getUserInfo({userName:this.user}).then(res=>{
          if(res===1){
            this.infoList = this.userInfo
          }else{
            this.infoList = res
          }
        })
      }
    },
    created(){
      this.getInfo()
    }
  }
</script>

<style >
  .page-container{
    display: flex;
    justify-content: center;
    width: inherit;
    height: inherit;
  }
  .index-container{
    display: flex;
    flex-direction: column;
    flex:0 1 700px;
    width: inherit;
    height: inherit;
  }
  .index-header{
    margin-top: 50px;
    letter-spacing: 5px;
    cursor: pointer;
    text-align: center;
  }
  .index-links{
    margin-top: 20px;
    text-align: center;
  }
  .index-main{
    margin-top: 20px;
  }
  .index-links a {
    cursor: pointer;
    margin: 0 5px;
  }
  .index-links img {
    width: 15px;
    height: 15px;
  }
  @media screen and (max-width: 700px) {
    .index-main{
      margin: 10px;
    }
  }

</style>





