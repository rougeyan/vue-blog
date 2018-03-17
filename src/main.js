import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import store from './store'

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
