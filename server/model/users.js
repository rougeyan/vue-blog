const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  "userId":String,
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
    "blogDate":String
  }],
  "blogList":[{
    "blogId":String,
    "blogTitle":String,
    "blogDate":String,
    "blogContent":String,
    "blogType":String,
    "likeCount":Number,
    "comment":[{
      "user":String,
      "date":String,
      "text":String
    }]
  }]
})

module.exports = mongoose.model('user',userSchema)
