<template>
  <div class="container">
    <div class="manage-container">
      <!--侧边栏区域-->
      <manage-side-bar :users="users"></manage-side-bar>
      <!--右侧内容区域-->
      <router-view :users="users"></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ManageSideBar from '../base/ManageSideBar.vue'
import {mapGetters} from 'vuex'

export default{
  name: 'Manage',
  components: {
    'manage-side-bar': ManageSideBar
  },
  computed: {
    ...mapGetters([
      'users',
      'token'
    ])
  }
}
</script>

<style>
.container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
}
.manage-container{
  display: flex;
  width: 100%;
}
.manage-left{
  height: 100%;
  border-right: 1px solid #c9c9c9;
}
.manage-right{
  margin: 20px 0 0 30px;
  flex:1 1 900px;
}
@media screen and (max-width: 480px) {
  .manage-right{
    margin: 10px 0 0 10px;
    flex:0 0 100%
  }

}
</style>

