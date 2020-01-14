import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const routes = [
  // {
  //   path: '/',
  //   name: 'HelloWorld',
  //   component: HelloWorld
  // },
  {
    path:'/',           //这个表示的是根目录，即一进入的页面
    redirect:'/index',    //设置页面一进来就显示的页面，即重定向到goods组件，这里写的内容是对应组将的component的值
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    path: '/index',
    name: 'Index',
    component:() => import (  "@/view/index/index.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    path: '/personalHelp',
    name: 'PersonalHelp',
    component:() => import (  "@/view/personal/help.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  //  所有商品列表 categoryList
  {
    path: '/categoryList',
    name: 'CategoryList',
    component:() => import (  "@/view/index/categoryList.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 商品详情
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component:() => import (  "@/view/index/goodsDetail.vue"),
    meta: {
      keepAlive: true, // 需要被缓存
      requireAuth: true, // 需要验证token
    }
  },
  // 功能页面 联系客服
  {
    path: '/service',
    name: 'service',
    component:() => import (  "@/view/service/service.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 地址页面
  {
    path: '/address',
    name: 'address',
    component:() => import (  "@/view/personal/address.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 新增地址页面
  {
    path: '/addAddress',
    name: 'addAddress',
    component:() => import (  "@/view/personal/addAddress.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 我的优惠券
  {
    path: '/myCoupon',
    name: 'myCoupon',
    component:() => import (  "@/view/personal/myCoupon.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 订单支付页面
  {
    path: '/checked',
    name: 'checked',
    component:() => import (  "@/view/index/checked.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component:() => import (  "@/view/index/login.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  // 订单详情页面
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component:() => import (  "@/view/index/orderDetail.vue"),
  },
  // 订单列表页面
  {
    path: '/order',
    name: 'order',
    component:() => import (  "@/view/index/order.vue"),
    meta: {
      requireAuth: true, // 需要验证token
    }
  },
]




export default new Router({
  mode: 'history',
  routes,
})
