import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './registerServiceWorker'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
//Vue.use(VueSocketio, socketio('http://127.0.0.1:3000'), store);
Vue.use(VueSocketio, socketio('https://blog.calabash.top:3000'), store);
Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(ELEMENT)


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
