const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  "userName":String,
  "userPwd":String,
  "avatar":String,
  "userInfo":{
    "twitter":String,
    "github":String,
    "weibo":String
  },
  "likeList":[{
    "author":String,
    "blogDate":String,
    "blogTitle":String
  }],
  "blogList":[{
    "blogTitle":String,
    "blogDate":String,
    "blogContent":String,
    "blogType":String,
    "likeCount":{
      type:Number,
      default:0
    },
    "comment":[{
      "user":String,
      "date":String,
      "text":String
    }]
  }]
})

module.exports = mongoose.model('user',userSchema)
