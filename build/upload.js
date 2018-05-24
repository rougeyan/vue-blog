const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const path = require('path')

let failed = []
let successful = []

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

ssh.connect({
  host: 'x',
  username: 'x',
  port:22,
  password:'x'
}).then(async ()=>{
  await ssh.exec('rm -rf /alidata/www/blog/dist')
  ssh.putDirectory('../dist', '/alidata/www/blog/dist').then(function() {
    console.log("The File thing is done")
    ssh.exec('pm2 restart 2')
  }, function(error) {
    console.log("Something's wrong")
    console.log(error)
  })
})
