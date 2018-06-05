<template>
  <div class="manage-right">
    <el-form label-position="left" label-width="80px">
      <el-form-item label="Twitter">
        <el-input v-model="userInfo.twitter" class="input">
          <template slot="prepend">Twitter</template>
        </el-input>
      </el-form-item>
      <el-form-item label="github">
        <el-input v-model="userInfo.github" class="input">
          <template slot="prepend">Github</template>
        </el-input>
      </el-form-item>
      <el-form-item label="微博">
        <el-input v-model="userInfo.weibo" class="input">
          <template slot="prepend">微博</template>
        </el-input>
      </el-form-item>
      <el-form-item label="设置头像">
        <el-upload
          class="upload-demo"
          drag
          :show-file-list="false"
          :file-list="fileList"
          action="/avatar"
          :httpRequest="upload"
          :before-upload="beforeAvatarUpload"
          multiple>
          <img v-if="avatar" :src="avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-button  icon="el-icon-edit" @click="_changeUserInfo">提交</el-button>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapGetters,mapMutations} from 'vuex'
import api from '../../service/apiManage'
export default{
  name: 'ManageSetting',
  data(){
    return{
      imageUrl: '',
      file :'',
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userName',
      'avatar',
      'token'
    ]),
  },
  methods: {
    ...mapActions([
      'updateUserInfo',
      'setAvatar'
    ]),
    ...mapMutations([
      'SET_AVATAR'
    ]),
    _changeUserInfo () {
      this.updateUserInfo(Object.assign(this.userInfo, {userName: this.userName}))
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.includes('image')
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isImage) {
        this.$message.error('只能上传图片')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      this.file = file
      return true
    },
    // 文件上传
    upload () {
      let formData = new FormData()
      formData.append('avatar', this.file)
      api.setAvatar(formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': this.token,
          'userName': this.userName
        }
      }).then(res=>{
        if(res.res){
          this.SET_AVATAR(res.res)
        }
      })
    },
  }
}
</script>

<style scoped>
.el-upload--text{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
