<template>
  <div class="index-main">
    <div class="post">
      <h1>{{idea.blogTitle}}</h1>
      <h3 class="date" >{{formatDate}}&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:{{idea.count}}次</h3>
      <div v-html="compiledMarkdown" class="markdown-body" @click="scaleImg($event)"></div>
      <Comment
        :commentList="idea.comment"
        :blogDate="idea.blogDate"
        :user="user"
        :currentUser="users.userName"
        @commitSuccess="_getIdea"
      >
      </Comment>
    </div>
    <div class="operator">
      <a id="newer" class="blog-nav" @click.prevent="openOtherBlogs(idea.lastBlogDate)">&nbsp;&lt;上一篇</a>
      <a id="older" class="blog-nav" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇&nbsp;&gt;</a>
    </div>
    <el-dialog :visible.sync="dialogVisble"
               custom-class="fake"
               :show-close="false">
      <img :src="dialogSrc" alt="" class="dialogSrc">
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapActions ,mapGetters} from 'vuex'
  import {formatDateEng,formatDate} from '../../lib/lib'
  import Comment from './Comment.vue'
  export default{
    props:['id','user','users','currentBlogList'],
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': '_getIdea'
    },
    data(){
      return{
        dialogVisble:false,
        dialogSrc:'',
        commentList:[]
      }
    },
    components:{
      Comment
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.idea.blogContent, { sanitize: true })
      },
      formatDate(){
        return formatDateEng(this.idea.blogDate)
      },
      ...mapGetters({idea:'currentBlog'})
    },
    methods: {
      ...mapActions([
        'getCurrentBlogList',
        'getIdea'
      ]),
      _getIdea(){
        this.getIdea({userName:this.user,blogDate:this.id})
      },
      hasSiblings(arr){
        return index=>property=>arr[index]?arr[index][property]:'0'
      },
      openOtherBlogs(value){
        if(value && value!=='0'){
          this.$router.push(`${value}`)
        }else{
          this.$message.info('暂不可用！')
        }
      },
      scaleImg(e){
        if(e.target.src){
          this.dialogSrc = e.target.src
          this.dialogVisble=true
        }
      }
    },
    created(){
      this._getIdea()
    }
  }
</script>

<style>
  .markdown-body{
    max-width: 950px;
  }

  .blog-nav {
    position: fixed;
    bottom: 20px;
    height: 20px;
    line-height: 20px;
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, sans-serif;
    font-size: 15px;
    color: #999;
    text-decoration: none;
    cursor: pointer;
    letter-spacing: 1px;
    border-bottom: 3px solid transparent;
  }
  .blog-nav:hover {
    color: #333;
    border-bottom-color: #333;
  }
  #newer {
    left: 40px;
  }
  #older {
    right: 40px;
  }
  .fake{
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: none;
    background-color: rgb(127,127,127);
    visibility: hidden;
  }
  .dialogSrc{
    visibility: visible;
    width: 40vw;
  }
  @media screen and (max-width: 950px) {
    .blog-nav {
      position: absolute;
      bottom: 30px;
    }
    #newer {
      left: 0;
    }
    #older {
      right: 0;
    }
    .operator{
      position: relative;
      height: 60px;
    }
    .dialogSrc{
      width: 50vw;
    }
  }
  @media screen and (max-width:480px){
    .dialogSrc{
      width: 70vw;
    }
  }
</style>






