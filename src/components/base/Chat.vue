<template>
  <div class="chat-container">
    <div class="fl-row tim">
      <!--聊天列表区域-->
      <div class="msg-list my-scrollbar">
        <span v-for="(item,index) in chatlist"
             :key="index">
          <img :src="item.avatar"
            alt=""
            class="avatar"
            @click="_getChatData(item)"
            v-if="item.to">
        </span>
        <img src="../../assets/add32.svg" alt="" class="avatar" @click="addChat">

        <el-popover
          placement="top"
          width="200"
          v-model="visible">
          <el-input  placeholder="添加聊天对象"
                     suffix-icon="el-icon-search"
                     v-model="input1"></el-input>
          <el-button type="primary" size="mini" @click="getChatObj" style="margin-top: 10px">确定</el-button>
        </el-popover>
      </div>

      <div class="fl-column msg-body">
        <!--聊天内容区域-->
        <div class="msg-data fl-column my-scrollbar" id="chat-content">
          <div v-for="(item,index) in message" :key="index" class="msg-section">
            <div class="time-container">
              <span class="time" v-if="index%10===0">{{getTime(item.timeStamp)}}</span>
            </div>
            <div v-if="item.from ===userName" class="fl-row right" >
              <span class="msg-text">{{item.content}}</span>
              <img :src="avatar" alt="" class="msg-avatar">
            </div>
            <div v-else class="fl-row left">
              <img :src="friendsAvatar" alt="" class="msg-avatar">
              <span class="msg-text">{{item.content}}</span>
            </div>
          </div>
        </div>
        <!--工具栏-->
        <div class="toolbar"></div>
        <!--输入区域-->
        <div class="msg-editor fl-column">
          <textarea name="" id="" v-model="msg" @keyup.enter="send"></textarea>
        </div>
        <!--发送按钮-->
        <div class="fl-row send">
          <div class="send_btn" @click.enter="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../service/apiManage'
  import {mapGetters,mapActions} from 'vuex'
  import apiManage from "../../service/apiManage"
  import {timestampToTime} from '../../lib/lib'
  export default {
    name: "Chat",
    data(){
      return{
        chatlist:[],
        friendsAvatar:'',
        friend:'',
        msg:'',
        visible:false,
        input1:''
      }
    },
    computed:{
      ...mapGetters([
        'userName',
        'message',
        'avatar'
      ]),
    },
    sockets:{
      connect: function(){
        console.log('socket connected')
      },
      recvMsg(val){
        this.$nextTick(()=>{
          console.log('下滑啊')
          let el = document.getElementById('chat-content')
          console.log(el.scrollTop)
          console.log(el.scrollHeight)
          console.log(el.clientHeight)
          el.scrollTop = el.scrollHeight
        })
      }
    },
    mounted(){
      this.$socket.emit('connect'); //在这里触发connect事件
    },
    methods:{
      ...mapActions([
        'socket_sendMsg',
        'getChatData'
      ]),
      send(){
        if(this.msg===''){
          this.$message.error('不能发送空消息')
          return
        }
        if(this.friend===''){
          this.$message.error('没有确定聊天对象')
          return
        }
        this.$socket.emit('sendMsg',{
          from:this.userName,
          to:this.friend,
          content:this.msg
        })
        this.socket_sendMsg({
          from:this.userName,
          to:this.friend,
          content:this.msg
        })
        this.msg = ''
      },
      _getChatData(item){
        let chatid = [item.to,this.userName].sort().join('_')
        this.getChatData({chatid})
        this.friendsAvatar = item.avatar
        this.friend = item.to
      },
      addChat(){
        this.visible = !this.visible
      },
      getChatObj(){
        apiManage.addChatObj({user:this.input1}).then(res=>{
          if(res.errno===0){
            this.chatlist.push(res.data)
            this.visible = false
          }
        })
      },
      getTime(timeStamp){
        let [date,time] = timestampToTime(timeStamp).split(' ')
        let today = new Date().toLocaleString('zh').split(' ')[0]
        if(today === date){
          return time
        }
        return `${date} ${time}`
      }
    },
    created(){
      apiManage.getChatList({user:this.userName}).then(res=>{
        if(res.errno===0){
          this.chatlist = res.data
          this._getChatData(this.chatlist[0])
        }
      })
    }
  }
</script>

<style scoped>
  .chat-container{
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tim{
    flex:0 1 800px;
    height: 70%;
    box-sizing: padding-box;
    box-shadow: 1px -1px 1px 1px ;
  }
  .fl-center{
    display: flex;
    flex-direction: row;
    margin:10px 0;
  }
  .fl-row{
    display: flex;
    flex-direction: row;
  }
  .fl-column{
    display: flex;
    flex-direction: column;
  }
  .msg-body{
    width: 100%;
    height: 100%;
  }
  .msg-list{
    width:65px;
    padding: 10px 5px;
    background-color: rgb(250,250,250);
    overflow-y: scroll;
  }
  .msg-data{
    flex:15;
    overflow-y: scroll;
  }
  .toolbar{
    flex:1;
    border-top:1px solid rgba(0,0,0,.2);
  }
  .msg-editor{
    flex: 3;
  }
  .msg-section{
    margin:10px 0;

  }
  .time-container{
    margin: 0 auto;
    text-align: center;
  }
  .time{
    color:rgb(100,100,100)
  }
  .msg-avatar{
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  .avatar{
    height: 50px;
    width: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
  img:hover{
    background-color: rgb(235,235,235);
  }
  textarea{
    border:white;
    background-color: white;
    height:100px;
    width: 95%;
  }
  .send{
    justify-content: flex-end;
    font-size: 12px;
  }
  .send_btn{
    background-color: #3a8ee6;
    line-height: 27px;
    width: 60px;
    border-radius: 2px;
    text-align: center;
    color: white;
    cursor: pointer;
  }
  .right,.left{
    min-height: 45px;
  }
  .right{
    justify-content: flex-end;
  }
  .left{
    justify-content: flex-start;
  }
  .msg-text{
    position:relative;
    padding: 5px 10px;
    border-radius: 8px;
    min-height: 32px;
    line-height: 32px;
    max-width: 50%;
    word-break: break-all;
  }
  .right .msg-text{
    background-color: rgb(38,141,245);
    color: white;
    margin-right:15px;
  }
  .right .msg-text::after{
    position: absolute;
    top:10px;
    right:-10px;
    content:'';
    height: 0;
    width: 0;
    border:5px solid transparent;
    border-left-color: rgb(38,141,245);
  }
  .left .msg-text{
    background-color: rgb(238,238,238);
    color: black;
    margin-left:15px;
  }
  .left .msg-text::before{
    position: absolute;
    top:10px;
    left:-10px;
    content:'';
    height: 0;
    width: 0;
    border:5px solid transparent;
    border-right-color: rgb(238,238,238);
  }
  .my-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  .my-scrollbar::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #eee;
  }
  .my-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgb(204,204,204);
  }
  @media (max-width: 767px) {
    .tim{
      flex-direction: column;
      height: 100%;
    }
    .msg-list{
      overflow-y: hidden;
      flex-direction: row;
      flex-flow: nowrap;
      justify-content: flex-start;
      width: 100%;
      height: 40px;
    }
    .fl-center{
      width: 40px;
    }
    .avatar{
      width: 35px;
      height: 35px;
    }
    .send_btn{
      margin:0 20px 20px 0;
    }
  }
</style>
