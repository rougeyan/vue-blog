<template>
  <div class="box" ref="box">
    <el-form label-width="80px" class="maxeano">
      <el-form-item label="转换方式:" >
        <el-select v-model="form.type" placeholder="请选择">
          <el-option value="1" label="去掉时间">
          </el-option>
          <el-option value="2" label="大写加句号"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转换内容:">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="变化部分:">
        <el-input type="textarea" v-model="deleteList" autosize disabled></el-input>
      </el-form-item>
      <el-form-item label="转换结果:">
        <el-input type="textarea" v-model="result" autosize></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from '../../service/apiManage'
  import { generateVM } from '../../lib/lib'
  export default {
    name: "MaxeanoOnly",
    data(){
      return{
        form:{
          type:'1',
          content:''
        },
        result:'',
        deleteList:''
      }
    },
    mounted(){
      generateVM({
        container: this.$refs['box'],
        content: "我爱宝贝"
      })
    },
    methods:{
      submit(){
        api.sendMyLove(this.form).then(res=>{
          if(res.data){
             this.deleteList = res.data.deleteList
             this.result = res.data.content
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .box{
    width: 100%;
    height: 100%;

    .maxeano{
      margin: 20px;
      width:50%;
    }
  }

</style>
