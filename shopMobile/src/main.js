// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import './assets/js/rem.js'
import 'mint-ui/lib/style.css'; //引入css
import './assets/css/common.css' //图标
import './assets/font/iconfont.css' //图标
import store from './store/index.js'
Vue.use(Mint);
Vue.config.productionTip = false
import {imgUrl} from './assets/js/common';
Vue.prototype.GLOBAL = imgUrl

// 定义路由巡航
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    console.log(store.state.userInfo.token,localStorage.getItem('token'))
    console.log(store.state.userInfo.token || localStorage.getItem('token'))
    if (store.state.userInfo.token || localStorage.getItem('token')) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
