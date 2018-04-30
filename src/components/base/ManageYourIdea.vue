<template>
  <div class="manage-right">
    <el-form ref="form" :rules="rules" :model="idea" class="form-container">
      <el-form-item prop="blogTitle" class="title">
        <el-input style="width: 50%" v-model="idea.blogTitle" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item class="type">
        <el-radio v-model="idea.blogType" label="public">公开</el-radio>
        <el-radio v-model="idea.blogType" label="private">私密</el-radio>
      </el-form-item>
      <el-form-item class="text">
        <div id="editor" class="post">
          <textarea :value="idea.blogContent" @input="update" class="text-textarea"></textarea>
          <div v-html="compiledMarkdown" class="text-content markdown-body"></div>
        </div>
      </el-form-item>
      <el-form-item class="submit">
        <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="openDialog">上传</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible="dialogVisble"
               @close="closeDialog">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        action="/files"
        :httpRequest="upload"
        :before-upload="beforeAvatarUpload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-input placeholder="文件路径" v-model="imgpath" id="target">
        <el-button slot="append" @click="copy" data-clipboard-target="#target" class="btn">复制</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ClipboardJS from 'clipboard'
import {mapActions,mapGetters} from 'vuex'
import {formatDate} from '../../lib/lib'
import axios from 'axios'
import debounce from 'lodash/debounce'

export default{
  props:['blogDate','users','token'],
  data(){
    return{
      rules:{
        blogTitle:[{ required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }]
      },
      idea:{
        blogTitle:'',
        blogDate:'',
        blogContent:'',
        blogType:'public'
      },
      dialogVisble:false,
      imgpath:''
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.idea.blogContent, { sanitize: true })
    },
    ...mapGetters({
      blogList:'blogList'
    })
  },
  methods: {
    ...mapActions([
      'createNewIdea',
      'updateIdea',
    ]),
    copy(){
      let that = this
      const clipboard = new ClipboardJS('.btn');
      clipboard.on('success', function(e) {
        that.$notify({
          title: '提示',
          message: '已复制到粘贴板',
          duration: 1000
        });
        e.clearSelection();
      });
    },
    upload(){
      let formData = new FormData()
      formData.append('file',this.file)
      axios.post('/api/files',formData,{
        headers:{
          'Content-Type':'multipart/form-data',
          'Authorization':JSON.parse(localStorage.vuex).token,
          'userName':this.users.userName
        }
      }).then(res=>{
        if(res.data.res){
          this.imgpath = res.data.res
        }
      })
    },
    closeDialog(){
      this.dialogVisble = false
    },
    openDialog(){
      this.dialogVisble = true
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.includes('image');
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isImage) {
        this.$message.error('只能上传图片');
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
        return false
      }
      this.file = file
      return true
    },
    update:debounce(function (e) {
      let key = this.blogDate ? `article${this.blogDate}` : 'manuscript'
      localStorage.setItem(key,JSON.stringify(this.idea))
      this.idea.blogContent = e.target.value
    }, 300),
    _send(){
      async function a(){
        if(this.blogDate){
          await this.updateIdea(Object.assign(this.idea,{blogDate:this.blogDate},{userName:this.users.userName}))
        }else{
          await this.createNewIdea(Object.assign({userName:this.users.userName},this.idea))
        }
        this.clearForm()
      }
      a.bind(this)()
    },
    clearForm(){
      this.idea.blogTitle=''
      this.idea.blogContent=''
      this.idea.blogType='public'
    },
    sendIdea(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          if(this.idea.blogContent===''){
            this.$message.error('文章内容不能为空')
          }else{
            this.idea.blogDate = formatDate()
            this._send()
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let key = to.query.blogDate ?  `article${to.query.blogDate}` : 'manuscript'
    //如果是修改文章
    if(to.query.blogDate){
      next(vm => {
        vm.idea = vm.blogList.filter(item=>item.blogDate===to.query.blogDate)[0]
      })
    }
    //如果浏览器缓存中存在该文章的缓存,则读取它
    if(localStorage.getItem(key)){
      next(vm=>{
        vm.idea = JSON.parse(localStorage.getItem(key))
        vm.$notify({
          title: '提示',
          message: '已采用缓存中的内容',
          duration: 2000
        });
      })
    }else{
      next()
    }
  }
}
</script>

<style scoped>
  .form-container{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  #editor{
    display: flex;
    flex-direction: row;
    min-height: 50vh;
  }
  .text-textarea{
    min-height: 50vh;
    flex:0 0 450px;
  }
  .text-content{
    flex:0 0 450px;
    padding: 15px;
    min-height: 50vh;
    background-color: rgba(0,0,0,.1);
  }
  @media screen and (max-width: 600px) {
    #editor{
      flex-direction: column;
    }
    .text-textarea,.text-content{
      flex:0 1 100%;
      margin: 5px;
    }
  }
</style>
