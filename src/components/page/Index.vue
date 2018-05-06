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
    <canvas id="canvas" style="width:100%; height:100%"></canvas>
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
      '$route': function(){
        this.getInfo()
      },
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
  ;(function(window){
    function Dotline(option){
      this.opt = {
        dom:'canvas',//画布id
        cw:screen.availWidth,//画布宽
        ch:screen.availHeight,//画布高
        ds:100,//点的个数
        r:0.5,//圆点半径
        cl:'#999',//颜色
        dis:100,//触发连线的距离
        ...option
      };

      this.c = document.getElementById(this.opt.dom);//canvas元素id
      this.ctx = this.c.getContext('2d');
      var devicePixelRatio = window.devicePixelRatio || 1;
      var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
        this.ctx.mozBackingStorePixelRatio ||
        this.ctx.msBackingStorePixelRatio ||
        this.ctx.oBackingStorePixelRatio ||
        this.ctx.backingStorePixelRatio || 1;
      var ratio = devicePixelRatio / backingStoreRatio;
      this.c.width = this.opt.cw*ratio;//canvas宽
      this.c.height = this.opt.ch*ratio;//canvas高
      this.dotSum = this.opt.ds;//点的数量
      this.radius = this.opt.r;//圆点的半径
      this.disMax = this.opt.dis*this.opt.dis;//点与点触发连线的间距
      this.color = this.opt.cl;//设置粒子线颜色
      this.dots = [];
      //requestAnimationFrame控制canvas动画
      let RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
      let _self = this;
      //增加鼠标效果
      let mousedot = {x:null,y:null,label:'mouse'};
      this.c.onmousemove = function(e){
        e = e || window.event;
        mousedot.x = e.clientX - _self.c.offsetLeft;
        mousedot.y = e.clientY - _self.c.offsetTop;
      };
      this.c.onmouseout = function(e){
        mousedot.x = null;
        mousedot.y = null;
      }
      //控制动画
      this.animate = function(){
        _self.ctx.clearRect(0, 0, _self.c.width, _self.c.height);
        _self.drawLine([mousedot].concat(_self.dots));
        RAF(_self.animate);
      };
    }
    //画点
    Dotline.prototype.addDots = function(){
      let dot;
      for(let i=0; i<this.dotSum; i++){//参数
        dot = {
          x : Math.floor(Math.random()*this.c.width)-this.radius,
          y : Math.floor(Math.random()*this.c.height)-this.radius,
          ax : (Math.random() * 2 - 1) / 1.5,
          ay : (Math.random() * 2 - 1) / 1.5
        }
        this.dots.push(dot);
      }
    };
    //点运动
    Dotline.prototype.move = function(dot){
      dot.x += dot.ax;
      dot.y += dot.ay;
      //点碰到边缘返回
      dot.ax *= (dot.x>(this.c.width-this.radius)||dot.x<this.radius)?-1:1;
      dot.ay *= (dot.y>(this.c.height-this.radius)||dot.y<this.radius)?-1:1;
      //绘制点
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI*2, true);
      this.ctx.stroke();
    };
    //点之间画线
    Dotline.prototype.drawLine = function(dots){
      let nowDot;
      let _that = this;
      //自己的思路：遍历两次所有的点，比较点之间的距离，函数的触发放在animate里
      this.dots.forEach(function(dot){
        _that.move(dot);
        for(let j=0; j<dots.length; j++){
          nowDot = dots[j];
          if(nowDot===dot||nowDot.x===null||nowDot.y===null) continue;//continue跳出当前循环开始新的循环
          let dx = dot.x - nowDot.x,//别的点坐标减当前点坐标
            dy = dot.y - nowDot.y,
            dc = dx*dx + dy*dy;
          if(Math.sqrt(dc)>Math.sqrt(_that.disMax)) continue;
          // 如果是鼠标，则让粒子向鼠标的位置移动
          if (nowDot.label && Math.sqrt(dc) >Math.sqrt(_that.disMax)/2) {
            dot.x -= dx * 0.02;
            dot.y -= dy * 0.02;
          }
          let ratio = (_that.disMax - dc) / _that.disMax;
          _that.ctx.beginPath();
          _that.ctx.lineWidth = ratio ;
          _that.ctx.strokeStyle = _that.color;
          _that.ctx.moveTo(dot.x, dot.y);
          _that.ctx.lineTo(nowDot.x, nowDot.y);
          _that.ctx.stroke();
        }
      });
    };
    //开始动画
    Dotline.prototype.start = function(){
      let _that = this;
      this.addDots();
      setTimeout(function() {
        _that.animate();
      }, 100);
    }
    window.Dotline = Dotline;
  }(window));
  //调用
  window.onload = function(){
    let dotline = new Dotline({
      dom:'canvas',//画布id
      ds:132,//点的个数
      r:3,//圆点半径
      dis:88//触发连线的距离
    }).start();
  }
</script>

<style >
  #canvas{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index:-1;
  }
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





