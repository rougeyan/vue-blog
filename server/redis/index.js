const Redis = require("ioredis");
const redis = new Redis();


redis.on("connect", function () {
  console.log('连接redis成功');
});

redis.on("error", function (error) {
  console.log(error);
});


module.exports = redis
