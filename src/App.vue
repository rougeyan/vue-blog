<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name:'App'
  }
</script>

<style lang="less">
  @import './assets/style/index.less';
  /*针对el-upload的响应式css*/
  .upload-demo{
    .el-upload-dragger{
      width: 100%;
    }
    .el-upload{
      width: 70%;
    }
  }
</style>
