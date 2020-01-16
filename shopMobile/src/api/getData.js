import axios from 'axios'//引入axios
// 测试的
const defaulturl = "http://localhost/mySelfShop/tt/thinkphp5/public/";//定义接口公共的前半部分地址
// 正式的
//const defaulturl = "http://www.zliel.top/thinkphp5/public/";//定义接口公共的前半部分地址
import qs from 'qs';
import store from '../store/index'
import router from '../router'
import { Toast } from 'mint-ui';
// 请求超时时间
axios.defaults.timeout = 50000;

// post请求头

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//1.0 请求拦截器
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.userInfo.token || localStorage.getItem('token');
    token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    return Promise.error(error);
  })
// 2.0 响应拦截器
axios.interceptors.response.use(
  response => {
    if(response.status === 200) {
      return Promise.resolve(response)
    } else{
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200 的情况
  error => {
    if(error.response.status){
      switch (error.response.status){
          // 401未登录
          case 401:
          router.push({
            path:'/login',
            query:{redirect: router.currentRoute.fullPath}
          })
          break;
          case 403:
            Toast({
              message: '登录过期，请重新登录',
              duration: 1000,
              forbidClick: true
            });
            // 清除token
            store.commit('login',{})
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
              router.replace({
                path: '/login',
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }, 1000);
             break;
          // 404请求不存在
          case 404:
            Toast({
              message: '网络请求不存在',
              duration: 1500,
              forbidClick: true
            });
            break;
          // 其他错误，直接抛出错误提示
          default:
            Toast({
              message: error.response.data.message,
              duration: 1500,
              forbidClick: true
            });
      }
      return Promise.reject(error.response)
    }
  }
)



// 对axios 的封装
const $http = {
  get:function(url,params) {
    return new Promise((resolve, reject) => {
      axios.get(url,{
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err =>{
        reject(err)
      })
    })
  },
  post:function(url,params){
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params)
      ).then( res =>{
        resolve(res.data)
      }).catch( err => {
        reject(err)
      })
    })
  },
  // axios all 的原理
  // function getUserAccount() {
  //  return axios.get('/user/12345');
  // }
  //
  // function getUserPermissions() {
  //   return axios.get('/user/12345/permissions');
  // }
  //
  // axios.all([getUserAccount(), getUserPermissions()])
  //   .then(axios.spread(function (acct, perms) {
  //     // Both requests are now complete
  // }));
  all:function(resArrFun){
    return new Promise((resolve,reject) =>{
      axios.all(resArrFun).then(res=>{
        resolve(res.data)
      }).catch(err=>{
        reject(err)
      })
    })
  }

};
// 这种情况不管是post还是get 都只用 下面的方式请求就行啦
// let req = {coupon_id:1,wxapp_id: 10001, token: localStorage.getItem("token")};
// gtc(req).then(res=>{
//   console.log(res);
// })

// 登录接口
export const loginUser= p => $http.post(`${defaulturl}index.php?s=/index/Login/login`, p);


// 领取优惠券post 接口
export const gtc= p => $http.post(`${defaulturl}index.php?s=/api/user.coupon/receive`, p);
// 获取 首页信息接口
export const indexx = p => $http.get(`${defaulturl}index.php?s=/api/page/home`, p);
//

//获取 分类列表 接口
export const listCategory = p => $http.get(`${defaulturl}index.php?s=/index/Category/getCategoryList`,p);



// 商品列表
export const allGoodsList = p => $http.get(`${defaulturl}index.php?s=/index/Goods/goodsItems`,p);
// 获取 优惠券列表 首页的
export const couponItems = p => $http.get(`${defaulturl}index.php?s=/index/Coupon/CouponItems`,p);
// 领取优惠券列表 receiveCoupon
export const receiveCoupon = p => $http.post(`${defaulturl}index.php?s=/index/Coupon/receiveCoupon`,p);

// 4.0 获取当个商品信息 singleGoodsDetail
export const singleGoodsDetail = p => $http.get(`${defaulturl}index.php?s=/index/Goods/singleGoodsDetail`,p);

// 1.0 获取banner列表
export const bannerData = p => $http.get(`${defaulturl}index.php?s=/index/Banner/BannerList`,p);


// 获取 1.0  地址列表
export const addressList = p => $http.post(`${defaulturl}index.php?s=/index/user/singleUser`,p);
// 2.0 增加收货地址
export const addAddress = p => $http.post(`${defaulturl}index.php?s=/index/user/addAddress`,p);
// 3.0 获取单个收货地址 singleAddress
export const singleAddress = p => $http.get(`${defaulturl}index.php?s=/index/user/singleAddress`,p);
// 4.0 编辑收货地址
export const editAddress = p => $http.post(`${defaulturl}index.php?s=/index/user/editAddress`,p);
// 5.0 删除单个收货地址 deleteSingleAddress
export const deleteSingleAddress = p => $http.post(`${defaulturl}index.php?s=/index/user/deleteSingleAddress`,p);
// 6.0 设置默认收货地址
export const setDefaultAddress = p => $http.post(`${defaulturl}index.php?s=/index/user/setDefaultAddress`,p);


// 注册 1.0 发送验证码
export const sendCode = p => $http.post(`${defaulturl}index.php?s=/index/login/sendCode`,p);
// 真的简单那登录 2.0
export const mobileLogin = p => $http.post(`${defaulturl}index.php?s=/index/login/mobileLogin`,p);


//1.0  立即购买接口 也就是下单 downOrder
export const downOrder = p => $http.post(`${defaulturl}index.php?s=/index/order/downOrder`,p);
// 2.0 加入购物车接口
export const addReachCart = p => $http.post(`${defaulturl}index.php?s=/index/cart/addReachCart`,p);


// 3.0 订单详情页面 orderMessage
export const orderMessage = p => $http.post(`${defaulturl}index.php?s=/index/order/orderMessage`,p);


// 1.0 个人中心获取个人优惠券列表 singleCoupon
export const singleCoupon = p => $http.get(`${defaulturl}index.php?s=/index/coupon/singleCoupon`,p);
// 2.0 支付订单接口
export const payOrder = p => $http.post(`${defaulturl}index.php?s=/index/order/payOrder`,p);
// 3.0 获取订单列表 OrderList
export const orderList = p => $http.post(`${defaulturl}index.php?s=/index/order/OrderList`,p);
// 4.0 获取购物车列表 CartList
export const CartList = p => $http.post(`${defaulturl}index.php?s=/index/Cart/CartList`,p);
// 5.0 修改购物车 商品数量
export const changeCartShopNum = p => $http.post(`${defaulturl}index.php?s=/index/Cart/changeCartShopNum`,p);
// 6.0 删除购物车 商品
export const deleteSingleShop = p => $http.post(`${defaulturl}index.php?s=/index/Cart/deleteSingleShop`,p);

// 7.0 获取公司详情的 companyMessage
export const companyMessage = p => $http.get(`${defaulturl}index.php?s=/index/Message/companyMessage`,p);


