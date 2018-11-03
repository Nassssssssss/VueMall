import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import User from '@/views/user'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    component: Login
  },{
    path: '/',
    component: Home,
    children:[{
      name:'users',
      path: '/users',
      component: User,
    }]
  }]
})
