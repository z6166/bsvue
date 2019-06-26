import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import User from './views/User.vue'
import BookShow from './views/BookShow'
import OrderCreate from "@/views/OrderCreate";

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/book/show/:id',
      name: 'bookshow',
      component: BookShow
    },
    {
      path: '/book/buy/:id/',
      name: 'ordercreate',
      component: OrderCreate
    },
  ]
})
