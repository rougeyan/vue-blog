<template>
  <el-menu
    default-active="new-idea"
    class="manage-left el-menu-vertical-demo "
    :router="true"
    :collapse="isCollapse"
  >
    <el-menu-item index="new-idea">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="ideas">
      <i class="el-icon-search"></i>
      <span slot="title">管理文章</span>
    </el-menu-item>
    <el-menu-item index="setting">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
    <el-menu-item index="pv" v-if="userName==='Calabash'">
      <i class="el-icon-bell"></i>
      <span  slot="title">日志</span>
    </el-menu-item>
    <el-menu-item :index="`/${userName}`" >
      <i class="el-icon-back"></i>
      <span  slot="title">返回首页</span>
    </el-menu-item>
    <el-menu-item index="/" @click="_logout">
      <i class="el-icon-close"></i>
      <span  slot="title">退出登录</span>
    </el-menu-item>
  </el-menu>
</template>

<script type="text/ecmascript-6">
import {mapMutations,mapActions,mapGetters} from 'vuex'
export default{
  name:'ManageSideBar',
  data(){
    return{
      isCollapse:window.innerWidth<480
    }
  },
  computed:{
    ...mapGetters([
      'userName'
    ])
  },
  methods:{
    ...mapMutations([
      'BACK_INDEX'
    ]),
    ...mapActions([
      'logout'
    ]),
    _logout(){
      this.logout({userName:this.userName})
    },
    handleResize(){
      this.isCollapse = window.innerWidth<480
    }
  },
  mounted(){
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .manage-left{
    padding-right: 24px;
  }
</style>
