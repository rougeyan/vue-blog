<template>
  <div class="manage-right">
    <el-tabs v-model="activeName2" type="border-card" >
      <!--我喜欢的区域-->
      <el-tab-pane label="我喜欢的" name="first">
        <el-table
          :data="likeList"
          style="width: 100%">
          <!--移动端表格-->
          <el-table-column type="expand" v-if="isShow">
            <template slot-scope="scope">
              <el-button type="primary" @click="$router.push(`/${scope.row.author}/articles/${scope.row.blogDate}`)">查看</el-button>
              <i class="font0"></i>
              <el-button type="danger" @click="deleteLike(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="blogDate"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者"
            width="180">
          </el-table-column>
          <el-table-column
            prop="blogTitle"
            label="标题">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="!isShow">
            <template slot-scope="scope">
              <el-button type="primary" @click="$router.push(`/${scope.row.author}/articles/${scope.row.blogDate}`)">查看</el-button>
              <i class="font0"></i>
              <el-button type="danger" @click="deleteLike(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--我收藏的区域-->
      <el-tab-pane label="我收藏的" name="secont">
        <el-table
          :data="collectList"
          style="width: 100%">
          <!--移动端表格-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.list">
                <el-table-column
                  label="作者"
                  prop="author">
                </el-table-column>
                <el-table-column
                  label="文章编号"
                  prop="blogDate">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope1">
                    <el-button type="plain" @click="$router.push(`/${scope1.row.author}/articles/${scope1.row.blogDate}`)">查看</el-button>
                    <el-button type="danger" @click="_deleteCollectBlog(scope.row,scope1.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="collectTitle"
            label="收藏夹名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="collectDesc"
            label="收藏夹描述"
            width="180">
          </el-table-column>
          <el-table-column
            prop="collectType"
            label="类型">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="_deleteCollect(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--个人信息区域-->
      <el-tab-pane label="个人信息" name="third">
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
      </el-tab-pane>
      <!--个性化设置区域-->
      <el-tab-pane label="个性化" name="four">
        <el-form>
          <el-form-item label="canvas线条颜色">
            <el-color-picker v-model="color1" color-format="rgb" @change="changeCanvasColor"></el-color-picker>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

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
      fileList: [],
      activeName2:'first',
      isShow:window.innerWidth < 420,
      color1:''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userName',
      'avatar',
      'token',
      'likeList',
      'collectList',
      'lineColor'
    ])
  },
  created(){
    this.color1 = this.lineColor
  },
  methods: {
    ...mapActions([
      'updateUserInfo',
      'setAvatar',
      'likethis',
      'deleteCollect',
      'deleteCollectBlog'
    ]),
    ...mapMutations([
      'SET_AVATAR',
      'SET_CANVAS_LINECOLOR'
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
    deleteLike(obj){
      this.likethis({
        blogDate: obj.blogDate,
        blogTitle:obj.blogTitle,
        userName: obj.author,
        user: this.userName,
      })
    },
    _deleteCollect(obj){
      this.deleteCollect({
        userName:this.userName,
        collectTitle:obj.collectTitle
      })
    },
    _deleteCollectBlog(obj,obj1){
       this.deleteCollectBlog({
        blogDate: obj1.blogDate,
        collectTitle:obj.collectTitle,
        author: obj1.author,
        userName: this.userName,
      })
    },
    changeCanvasColor(){
      this.SET_CANVAS_LINECOLOR(this.color1)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/style/index.less';

  .margin-right{
    .el-upload--text{
      border: 1px dashed @borderColor;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover{
        border-color: @blueBorder;
      }
    }
  }
  /deep/ .avatar-uploader-icon{
    height: 178px;
    line-height: 178px;
    display: block;
  }
  /deep/ .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
