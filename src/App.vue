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

<style>
  html,body,#app{
    height: 100%;
    width: 100%;
  }
  body {
    font-size: 16px;
    word-spacing: 1px;
    color: #666;
    margin: 0;
    padding: 0;
  }
  img {
    border: none;
  }
  a {
    color: #666;
    text-decoration: none;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .font0{
    font-size: 0;
  }
  .index-header,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, sans-serif;
    font-weight: 400;
    color: #444;
  }
  textarea {
    border: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }
  .post {
    position: relative;
    padding: 15px;
    border-bottom: 1px solid #e6e6e6;
  }
  .post h1 {
    font-size: 32px;
    margin: 0 0 45px;
    letter-spacing: 1px;
  }
  .post h3 {
    margin: 30px 0 15px;
  }
  .post .date {
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, sans-serif;
    font-size: 13px;
    color: #999;
    margin: 0 0 30px;
    letter-spacing: 1px;
  }
  .markdown-body {
    box-sizing: border-box;
    padding: 45px;
  }
  .markdown-body h1,h2,h3{
    padding-bottom: 0!important;
  }
  .el-upload-dragger{
    width: 100%;
  }
  .el-upload{
    width: 70%;
  }
  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }
  @media screen and (max-width: 420px) {
    .index-main {
      margin-top: 32px;
    }
    .post h1 {
      font-size: 24px;
      margin: 0 0 30px;
    }
    .post h2 {
      font-size: 20px;
      margin: 30px 0 15px;
    }
    .post h3 {
      font-size: 16px;
      line-height: 1.3em;
    }
    .post .date {
      font-size: 12px;
      margin: 0 0 20px;
    }
    .blog-nav {
      font-size: 14px;
      color: #444;
    }
  }
</style>
