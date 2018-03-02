<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style type="text/postcss">
  html {
    margin: 0;
    padding: 0;
    height: 100vh;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  /*规定边框盒模型,并且从父元素继承,before,after伪类同理*/
  * {
    box-sizing: inherit;
    &:before,
    &:after {
       box-sizing: inherit;
     }
  }
  img {
    width: 100%;
    height: auto;
    /*把元素的顶端与行中最高元素的顶端对齐*/
    vertical-align: top;
    /*在img中content会引起部分浏览器下, 图片不显示,这个时候需要添加此项*/
    content: normal !important;
  }
  /*实现横纵比*/
  /*[attribute] 选择器用于选取带有指定属性的元素。*/
  [aspectratio] {
    position: relative;
  }
  [aspectratio]::before {
    content: '';
    display: block;
    width: 1px;
    margin-left: -1px;
    height: 0;
  }

  [aspectratio-content] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  /*flex布局,width为psd大小*/
  [flexContainer] {
    display: flex;
    width: 750px;
  }
  .block {
    margin-top: 15px;
  }
  ul,li {
    list-style: none outside none;
    margin: 0;
    padding: 0;
  }
  figure {
    display: block;
    margin: 0;
  }
  a {
    color: #666;
    text-decoration: none;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .index-header,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, sans-serif;
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
  /*markdown-css*/
  pre {
    color: #525252;
  }
  pre .function .keyword,
  pre .constant {
    color: #0092db;
  }
  pre .keyword,
  pre .attribute {
    color: #e96900;
  }
  pre .number,
  pre .literal {
    color: #ae81ff;
  }
  pre .tag,
  pre .tag .title,
  pre .change,
  pre .winutils,
  pre .flow,
  pre .lisp .title,
  pre .clojure .built_in,
  pre .nginx .title,
  pre .tex .special {
    color: #2973b7;
  }
  pre .class .title {
    color: #fff;
  }
  pre .symbol,
  pre .symbol .string,
  pre .value,
  pre .regexp {
    color: #42b983;
  }
  pre .title {
    color: #a6e22e;
  }
  pre .tag .value,
  pre .string,
  pre .subst,
  pre .haskell .type,
  pre .preprocessor,
  pre .ruby .class .parent,
  pre .built_in,
  pre .sql .aggregate,
  pre .django .template_tag,
  pre .django .variable,
  pre .smalltalk .class,
  pre .javadoc,
  pre .django .filter .argument,
  pre .smalltalk .localvars,
  pre .smalltalk .array,
  pre .attr_selector,
  pre .pseudo,
  pre .addition,
  pre .stream,
  pre .envvar,
  pre .apache .tag,
  pre .apache .cbracket,
  pre .tex .command,
  pre .prompt {
    color: #42b983;
  }
  pre .comment,
  pre .java .annotation,
  pre .python .decorator,
  pre .template_comment,
  pre .pi,
  pre .doctype,
  pre .deletion,
  pre .shebang,
  pre .apache .sqbracket,
  pre .tex .formula {
    color: #b3b3b3;
  }
  pre .coffeescript .javascript,
  pre .javascript .xml,
  pre .tex .formula,
  pre .xml .javascript,
  pre .xml .vbscript,
  pre .xml .css,
  pre .xml .cdata {
    opacity: 0.5;
  }
  .post {
    position: relative;
    border-bottom: 1px solid #e6e6e6;
  }
  .post h1,
  .post h2 {
    text-transform: uppercase;
  }
  .post h1 a:hover,
  .post h2 a:hover {
    border-bottom: 3px solid #666;
  }
  .post h1 {
    font-size: 32px;
    margin: 0 0 45px;
    letter-spacing: 1px;
  }
  .post h2 {
    font-size: 24px;
    margin: 60px 0 30px;
    position: relative;
  }
  .post h2:before {
    content: '';
    border-left: 5px solid #f66;
    position: absolute;
    left: -15px;
    height: 75%;
    top: 12%;
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
  .post .content {
    text-align: left;
    line-height: 1.8em;
  }
  .post .content p,
  .post .content ul,
  .post .content ol {
    margin: 1em 0 1.5em;
  }
  .post .content strong {
    font-weight: 600;
    color: #444;
  }
  .post .content ol {
    padding-left: 1.6em;
  }
  .post .content ul {
    padding-left: 15px;
    list-style-type: none;
  }
  .post .content ul li:before {
    position: absolute;
    font-weight: 600;
    content: " · ";
    margin: 0;
    left: 0;
  }
  .post .content a {
    color: #f66;
    border-bottom: 2px solid transparent;
  }
  .post .content a:hover {
    color: #f33;
    border-bottom-color: #f33;
  }
  .post .content .highlight,
  .post .content .highlight table {
    margin: 0;
    width: 100%;
  }
  .post .content .highlight {
    overflow-x: auto;
  }
  .post .content .highlight table,
  .post .content .highlight tr,
  .post .content .highlight td {
    padding: 0;
    border-collapse: collapse;
  }
  .post .content code {
    font-family: "Roboto Mono", "Menlo", "Consolas", monospace;
    font-size: 13px;
    background-color: #f6f6f6;
    margin: 0 5px;
    border-radius: 2px;
  }
  .post .content pre {
    font-family: "Roboto Mono", "Menlo", "Consolas", monospace;
    font-size: 13px;
    overflow-x: auto;
    text-align: left;
    padding: 15px 25px;
    background-color: #f6f6f6;
    line-height: 1.5em;
  }
  .post .content .code pre {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .post .content .gutter pre {
    padding: 15px 0 15px 15px;
    color: #75715e;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .post .content blockquote {
    margin: 2em 0;
    padding-left: 30px;
    border-left: 5px solid #e6e6e6;
  }
  .post .content blockquote p {
    font-size: 17px;
    font-style: italic;
    line-height: 1.8em;
    color: #999;
  }
  .post img {
    display: block;
    max-width: 100%;
  }
  /*@media screen and (max-width: 420px) {
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
    .post .content {
      font-size: 15px;
    }
    .post .content pre {
      font-size: 12px;
    }
    .post .content blockquote p {
      font-size: 16px;
    }
    .blog-nav {
      font-size: 14px;
      color: #444;
    }
  }*/


</style>
