<template>
  <div class="index-main"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busy"
       infinite-scroll-distance="10"
  >
    <ul class="list">
      <li v-for="n in currentBlogList">
        <span class="date">{{formatDate(n.blogDate)}}</span>
        <span class="title">
          <router-link :to="'articles/'+n.blogDate" append>{{n.blogTitle}}</router-link>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDateEng,throttle} from '../../lib/lib'
import { mapActions,mapMutations } from 'vuex'
export default{
  name:'BlogBody',
  props:['user','users','currentBlogList'],
  data(){
    return{
      busy:false,
      pgN:1,
      pgS:6,
    }
  },
  methods:{
    ...mapActions([
      'getCurrentBlogList',
      'getMoreBlog'
    ]),
    ...mapMutations([
      'LOAD_MORE'
    ]),
    formatDate(value){
      return formatDateEng(value)
    },
    loadMore(){
      this.busy = true
      this.pgN++
      this.getMoreBlog({userName:this.user,type:'public',pgN:this.pgN,pgS:this.pgS}).then((res)=>{
        if(res==='gg'){
          this.busy = true
        }
      })
      this.busy = false
    },
  },
  created(){
    this.getCurrentBlogList({userName:this.user,type:'public',pgN:1,pgS:this.pgS})
  }
}
</script>

<style scoped>
  .index-main{
    min-height: 800px;
  }
  .list{
    display: flex;
    flex-direction: column;
    list-style-type: none;
  }
  .list>li {
    display: flex;
    flex-basis: 56px;
    flex-direction: row;
    align-content: center;
    margin: 30px 0 30px;
    border-bottom: 1px solid #e6e6e6;
  }
  .date{
    line-height: 56px;
    font-size: 13px;
    color: #999;
  }
  .title{
    line-height: 56px;
    margin-left: 30px;
    font-size: 20px;
    letter-spacing: 1px;
    color: #444;
  }
  .title:hover{
    color: #f33;
  }
  @media screen and (max-width: 420px) {
    .list>li{
      margin: 20px 0 20px;
    }
  }
</style>


