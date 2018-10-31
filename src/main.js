import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import HttpTool from './pulign/http.js'
import App from './App'
import router from './router'
import '@/assets/index.css'

Vue.use(ElementUI)
Vue.use(HttpTool)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
