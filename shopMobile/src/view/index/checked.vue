<template>
  <div class="checked">
    <div class="bg"></div>
    <div class="select-address flex-row"  @click="goAddress()">
      <div class="address-left">
        <i class="iconfont icon-tongzhi"></i>
      </div>
      <div class="address-middel">
        <div class="no-address" v-if="!address">去选择配送地址</div>
        <div class="yes-address" v-else>
          <div class="n-p">{{address.name}} {{address.phone}}</div>
          <div class="a">{{address.region.province}} {{address.region.city}} {{address.region.region}} {{address.detail}}</div>
        </div>
      </div>
      <div class="address-right">
        <i class="iconfont icon-jinru"></i>
      </div>
    </div>
      <!--自提的地址信息-->
    <div class="k"></div>
    <!-- 商品列表 -->
    <div class="product-main">
      <div class="product-single flex-row" v-for="good in 2">
        <div class="left">
          <img src="https://starhubimage.zaokol.com/20191218111350af9080867.jpg" class="">
        </div>
        <div class="right">
          <div class="title textshow2">美乐斯</div>
          <div class="size">黑色，好看</div>
          <div class="num flex-row">
            <div class="price">￥125.00</div>
            <div>x65</div>
          </div>
        </div>
      </div>
    </div>
    <div class="product-sum">共{{order_total_num}}件商品，合计：<span>￥{{order_total_price}}</span></div>
    <div class="k"></div>
      <div>{{url}}</div>
    <div class="message">
      <input type="text" name="name" class="" placeholder="选填：买家留言（50字以内）" v-model='remark' maxlength="50">
    </div>
    <div class="k"></div>
    <div class="money">
      <div class="money-list flex-row">
        <div>商品总金额:</div>
        <div class="sum-price">￥88.65</div>
      </div>
      <div class="money-list flex-row">
        <div>优惠券:</div>
        <div  class="y-coupon" @click="couponShow()">
          <!--<div v-if="selectCoupon.couponId != ''">-￥{{ selectCoupon.reduced_price }}</div>-->
          <div >有2张优惠券可用<i class="iconfont icon-jinru"></i></div>
        </div>
        <!--<div >无优惠可用</div>-->
      </div>
      <div class="money-list flex-row">
        <div>配送费用:</div>
        <div v-if="address">
          <span v-if="intra_region" class="express-price">+￥{{express_price}}</span>
          <span v-else>不在配送范围</span>
        </div>
        <div class="no-address-t" v-else>请先选择配送地址</div>
      </div>
    </div>
    <div class="bottom-height"></div>
    <div class="bottom">
      <div class="bottom-left">实付款：<span>￥{{ actual_pay_price > 0 ? actual_pay_price:  order_pay_price }}</span></div>
      <div class="bottom-right" @click="pay()">提交订单</div>
    </div>

    <div class="nav">
      <div class="nav-list" :class="{ 'nav-list-n': !pdnav, 'nav-list-y': pdnav }" v-if="pdnavShow">
        <div><img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/homeW.png" class="wh100" @click="navBut(1)"></div>
        <div><img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/cateW.png" class="wh100" @click="navBut(2)"></div>
        <div><img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/flowW.png" class="wh100" @click="navBut(3)"></div>
        <div><img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/userW.png" class="wh100" @click="navBut(4)"></div>
      </div>
      <div class="show-but wh100" :class="{ 'show-but-n': !pdnav, 'show-but-y': pdnav }" @click="showBut()"><img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/sz.png" class="wh100"></div>
    </div>

    <div class="coupon-main" @click="couponShow()" v-if="pdCoupon">
      <div class="coupon-popup">
        <div class="coupon-top">
          <div class="coupon-title">选择优惠券</div>
          <div class="coupon-no-start" @click.stop="doNotCouponTap()">不使用优惠券</div>
        </div>
        <div class="coupon-list">

            <div class="list" v-for="(item,index) in coupon_list" :key="index"  @click.stop="selectCouponTap(item,index)">
                <div class="left">
                    <div class="many">
                        <span>￥</span>
                        <span>{{item.reduce_price}}</span>
                    </div>
                    <div class="can-use">满{{item.min_price}}元可用</div>
                </div>
                <div class="shu">
                    <div class="top-y"></div>
                    <div class="bottom-y"></div>
                </div>
                <div class="right">
                    <div class="r-explain">{{item.name}}</div>
                    <div class="time">{{item.start_time.text}}~{{item.end_time.text}}</div>
                </div>
                <div class="man-jian">{{ item.coupon_type.text }}</div>

            </div>

        </div>
        <div class="coupon-close" @click.stop="couponShow()">关闭</div>
      </div>
    </div>

  </div>
</template>

<script>
//import { orderBuyNow, orderCart ,selfMention} from '../config/getData';
import { MessageBox } from 'mint-ui';
export default {

data() {
  return {
    // 当前页面参数
    options: {},
    actual_pay_price: 0,
    order_pay_price: 0,
    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址‘
    exist_auth: false, // 是否需要实名
    goods: {}, // 商品信息
    goods_list: [], // 商品信息
    order_total_num: "", // 商品总数量
    order_total_price: "", // 商品总价
    intra_region: '', // 有无配送价
    express_price: '', // 配送价
    coupon_list: [], // 优惠券列表
    url:'',
    // 选择的优惠券
    selectCoupon: {
      index: null,
      couponId: '',
      reduced_price: '0.00'
    },

    // 买家留言
    remark: '',

    pdnav: false,
    pdnavShow: false,

    hasError: false,
    error: '',

    // 禁用submit按钮
    disabled: false,

    payData: {"1": '2'},
    pdPay: false,
    pdCoupon: false,
    // 自提地址
    selfAddress:{},
    // 默认是 线上买的
    selfShow:1,
    arId:'',// 自提的id

    // idCardName: '',
    // idCardNo: '',
  }
},

created(){
},
mounted(){


  //this.getOrderData();
    // 获取门店自提 地址接口
    //this.init();
},
methods: {
    // 验证是不是正整数
    isInteger(obj) {
        return typeof obj === 'number' && obj%1 === 0
    },
    init(){
        let that = this;
        selfMention().then(res=>{
//            console.log(res);
//            that.selfAddress = res.data[0];
            let list = res.data;
            // 判断本地是否存储了这个地址 用存储的地址
            that.arId = localStorage.getItem('selfId')
            localStorage.removeItem("selfId")
            console.log(that.arId)
//            console.log(arId)
            // 判断存在并且为整数
            if(that.arId){
                that.selfShow=2;
                console.log(that.arId)
                // 判断 在不在列表里面，在的话，就赋值，不在的话就默认显示1
                for(var i =0 ;i<list.length;i++){
                    if(list[i].id==that.arId){
                        that.selfAddress = list[i];
                    }else{
                        that.selfAddress = list[0];
                        that.arId = list[0].id;
                    }
                }

            }else{
                that.selfAddress = list[0];
                that.arId = list[0].id;
            }
        })
    },
    // 点击导航
    menu(num){
        this.selfShow = num;
    },
  navBut(i) {
    if (i == 1) {
      this.$router.push({path:'/'})
    }
    if (i == 2) {
      this.$router.push({path:'/classify'})
    }
    if (i == 3) {
      this.$router.push({path:'/shopCart'})
    }
    if (i == 4) {
      this.$router.push({path:'/personal'})
    }
  },
  selectCouponTap: function(item,index) {
    let dataset = {
      couponId:item.user_coupon_id,
      index:index
    };
    // 优惠券折扣金额
    let reducedPrice = this.coupon_list[dataset.index].reduced_price;
    dataset.reduced_price = reducedPrice;
    // 计算优惠后的价格
    let actualPayPrice = this.bcsub(this.order_pay_price, reducedPrice);
    this.selectCoupon = dataset
    this.actual_pay_price = actualPayPrice > 0 ? actualPayPrice : '0.01'
    this.couponShow();
  },
  bcsub: function(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },
  doNotCouponTap: function() {
    this.selectCoupon = {couponId: ''}
    this.actual_pay_price = this.order_pay_price
    this.couponShow();
  },
  goAddress() {
    if (this.exist_address) {
      this.$router.push({path:'/address',query:{from:"flow"}})
    } else {
      this.$router.push({path:'/addAddress'})
    }

  },
    // 点击去选择自提地址
    goSelfAddress(){
        this.$router.push({path:'/selfAddress'})
    },
  couponShow() {
    this.pdCoupon = !this.pdCoupon
  },
  pay() {
    console.log("支付")
    let _this = this,
      options = _this.options;


    if (_this.exist_auth == false) {
      MessageBox('提示', '因有境外商品，请进行实名认证').then(action => {
        _this.$router.push({path:'/addIdCard'})
      })
      return false;
    }

    if(_this.selfShow==1){
        if (!_this.address) {
            MessageBox('提示', '请填写地址');
            return false;
        }
    }
    if (_this.disabled) {
      return false;
    }

    if (_this.hasError) {
      MessageBox('提示',_this.error);
      return false;
    }

    // _this.disabled = true

    // 直接买 还是购物车
//    console.log(_this.options.order_type)

        // 创建订单-立即购买
    if (_this.options.order_type === 'buyNow') {
      console.log("立即购买")
      _this.payData = {
        "goods_id": _this.options.goods_id,
        "goods_num": _this.options.goods_num,
        "goods_sku_id": _this.options.goods_sku_id,
        "coupon_id": _this.selectCoupon.couponId, // 优惠券id
        "remark": _this.remark, // 留言
        "token": localStorage.getItem("token"),
        "order_type":'buyNow',
          "orderType":1,
          "orderAddType":'',
      }
    }
    // this.content.orderType,this.content.orderAddType
    // 创建订单-购物车结算
    if (_this.options.order_type === 'cart') {
      console.log("购物车")
      _this.payData = {
        "cart_ids": _this.options.cart_ids,
        "coupon_id": _this.selectCoupon.couponId,
        "remark": _this.remark,
        "token": localStorage.getItem("token"),
        "order_type":'cart',
          "orderType":1,
          "orderAddType":'',
      }

    }
    // 如果用户点击的是线下自提
      if(_this.selfShow==2){
          _this.payData.orderType = 2  //门店自提
          _this.payData.orderAddType = _this.arId
      }
    _this.showPay()




  },
  showPay() {
    this.pdPay = !this.pdPay
  },
  showBut() {
    let _this = this
    if (this.pdnav == false) {
      this.pdnavShow = true
    } else {
      setTimeout(function() {
        _this.pdnavShow = false
      }, 410)
    }
    setTimeout(function() {
      _this.pdnav = !_this.pdnav
    }, 10)
    // this.pdnav = !this.pdnav
  },
  getOrderData: function() {
    let _this = this,
      options = this.options;

    // 获取订单信息回调方法
    let callback = function(result) {
      if (result.msg == '没有找到用户信息') {
          MessageBox('提示','登陆过期');
          localStorage.removeItem("openid")
          localStorage.removeItem("is_bind_mobile")
          localStorage.removeItem("encrypt")
          localStorage.removeItem("token")
          localStorage.removeItem("user_id")
          _this.$router.push({path:'/'})
          return
      }
      if (result.code !== 1) {
        MessageBox('提示',result.msg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.hasError = true;
        _this.error = result.data.error_msg;
        MessageBox('提示',_this.error);
      }
      // _this.setData(result.data);
//      console.log(result.data)
      _this.address = result.data.address // 默认收货地址
      _this.exist_address = result.data.exist_address // 是否存在收货地址
      _this.exist_auth = result.data.exist_auth // 是否需要实名认证
      _this.goods_list = result.data.goods_list //商品信息
      _this.order_total_num = result.data.order_total_num  // 商品总数量
      _this.order_total_price = result.data.order_total_price // 商品总价
      _this.intra_region = result.data.intra_region // 有无配送价
      _this.express_price = result.data.express_price  // 配送价
      _this.coupon_list = result.data.coupon_list // 优惠券列表
      _this.order_pay_price = result.data.order_pay_price // 价格
    };

    // 立即购买
    if (options.order_type == 'buyNow') {
      orderBuyNow(options.goods_id,options.goods_num,options.goods_sku_id).then((res)=>{
        console.log(res)
        callback(res);
      })
    }

    // 购物车结算
    else if (options.order_type == 'cart') {
      orderCart(options.cart_ids).then((res)=>{
        console.log(res)
        callback(res);
      })
    }

  },

},
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/minxin";
.wh100{
  width:100%;
  height:100%;
  display: block;
}
// 顶部导航的样式
.top-bar{
    /*border:1px solid red;*/
    height:.8rem;
    justify-content: center;
    background: #fff;
    div{
        font-size: .32rem;
        color:#333;
        line-height:.8rem;
    }
    div:nth-child(2){
        margin-left: 1.6rem;
    }
    .tp-active{
        color:#ff005c;
        border-bottom: 2px solid #ff005c;
    }
}
.checked{
  min-height: 100vh;
  background: #f2f2f2;
  .k {
      width: 100%;
      height: .2rem;
      background: #f4f4f4;
    }
  .select-address {
    box-sizing: border-box;
    padding: .28rem 0;
    background:#fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAAANCAYAAADVGpDCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3Yjk4M2ExYy1jMDhkLTQ1OTktYTI0Ny1kZjNjYzdiYTQ5ZTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDQwNkY3RkU5N0NGMTFFNUI3N0M4NTU4MzM2RjlFODIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQwNkY3RkQ5N0NGMTFFNUI3N0M4NTU4MzM2RjlFODIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzgwZWI1NS03OGFhLTQzOTUtODQ4OC1lOWI5YmVlYTY1ZDciIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1OTRiYzUyMy1jMzc3LTExNzgtYTdkZS04NGY3YmM1ZGIxMDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz556PLxAAACBElEQVR42tyaSyhEYRTHP48imlKibDQeSSlkSlEWLCRFsZNH5FE2FqQ8ErIRC9lIkTwXSpMkWWChhEJCSnlkoUZGSsr78f98n43CMFPu/Z/6NZuZ2zn33/+cb869XkmLx8IDEQaGQJbgiytQDSY3MyL+LYnL/HxPXSoHDIJQQq2WQQk4Dbbb/yUB29LJ+6e3B66VB3ZITbUIEqSpCGoJBP1ghtBUD6ARpEtTGSEhXzd+awE9oJzQUPegWdf3QlBPMhgDMYRa7YNisGWkpP5qrBQtVBShUHugUE9hs4fUtwG0utlEjRivoA/Ug1sj3vjffr8FNJEK1auPFHcE9UTq5pdK2PwcoAzMG7mjuRrRYEIfK9jiDJSCBZJ6ynSTsBBqNQ0qgdPISbq6vJCFbJOaagrEk5gqWNczRGiqG1Ah1LLMafRkf5pYIUKtZnMJDXUNasAIST2ZYFioRx9ssQaKwJFZEv5uYmWDXVJTrYBEElP562PfPKGpnkAbSDOTqb6aWAGgW6iHol5kQj2CdtAJngnqkc1hHMQRNr9DPaXWzZj8Z2PZtFCxhEIdaKE2CGqRJ4060AH8CLUaALX6f5VpBZLhI9SaeZXQVHKNLt84SCIxVbhQi5YuQlNd6OVElZlN9TGxrGBUn2PZ4lyoTdIsST0FQj0UDSLUak6ot3gcBLVY3wQYAJoVXxmNERajAAAAAElFTkSuQmCC') bottom left repeat-x;
    background-size:1.2rem auto;
    position:relative;
    .address-left {
      width: .9rem;
      text-align: center;
      i {
        font-size: .4rem;
        color: #666;
      }
    }
    .address-middel {
      width: 5.5rem;
      .no-address {
        color: #666;
        font-size: .28rem;
      }
      .yes-address {
        color: #666;
        font-size: .28rem;

      }
    }
    .address-right {
      width: .9rem;
      text-align: right;
      i {
        font-size: .4rem;
        color: #666;
      }
    }
  }
  .product-main {
    box-sizing: border-box;
    padding: .2rem .3rem .04rem .3rem;
    background:#fff;
    border-bottom: .01rem solid #eee;
    .product-single {
      width: 100%;
      height: 1.8rem;
      margin-bottom: .1rem;
      justify-content: space-between;
      .left {
        width: 1.8rem;
        height: 1.8rem;
        img{
          width:100%;
        }
      }
      .right {
        width: 4.6rem;
        height: 1.8rem;
        .title {
          color: #333;
          font-size: .3rem;
        }
        .size {
          font-size: .26rem;
          color: #777;
          margin-top: .1rem;
        }
        .num {
          font-size: .3rem;
          color: #333;
          margin-top: .1rem;
          justify-content: space-between;
          .price {
            color: $bg1;
          }
        }
      }
    }
  }
  .product-sum {
    font-size: .28rem;
    color:#777;
    text-align: right;
    padding: .15rem .24rem;
    background: white;
    span {
      color: $bg1;
    }
  }
  .message {
    padding:.15rem .24rem;
    color:#444;
    font-size: .29rem;
    background: white;
    input{
      width:80%;
    }
  }
  .money {
    padding:0 .24rem;
    color:#444;
    background: white;
    box-sizing: border-box;
    .money-list {
      font-size: .29rem;
      padding: .15rem 0;
      border-bottom: .01rem solid #f1f1f1;
      justify-content: space-between;
      .y-coupon {
        color: $bg1;
        i {
          color: #666;
        }
      }
      .express-price {
        color: $bg1;
      }
      .no-address-t {
        color: #777;
      }
      .sum-price {
        color: $bg1;
      }
    }
  }
  .bottom {
    width: 100%;
    height: .9rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background: white;
    display: flex;
    .bottom-left {
      font-size: .32rem;
      line-height: .9rem;
      color:#777;
      flex:4;
      padding-left: .24rem;
      span {
        color: $bg1;
      }
    }
    .bottom-right {
      font-size: .34rem;
      flex: 2;
      text-align: center;
      line-height: .9rem;
      color: white;
      background: $bg1;
    }
  }
  .nav {
    width: .7rem;
    height: .7rem;
    position:fixed;
    right: .24rem;
    bottom: 2.4rem;
    .show-but {
      text-align: center;
      line-height: .7rem;
      color: white;
      font-size: .7rem;
      border-radius:100%;
      transition: All 0.4s ease-in-out;
      position: absolute;
      left: 0;
      top: 0;
    }
    .show-but-n {
      background: $bg1;
      transform: rotate(0deg);
      transition: All 0.4s ease-in-out;
    }
    .show-but-y {
      background: #FF7E95;
      transform: rotate(-45deg);
      transition: All 0.4s ease-in-out;
    }
    .nav-list {
      height: 3.5rem;
      background: #333;
      width: .7rem;
      position: absolute;
      left: 0;
      bottom: .01rem;
      border-radius: .38rem;
      transition: All 0.4s ease-in-out;
      div {
        width: .45rem;
        height: .45rem;
        margin: .2rem auto;
      }
    }
    .nav-list-n {
      opacity: 0;
      transition: All 0.4s ease-in-out;
    }
    .nav-list-y {
      opacity: 1;
      transition: All 0.4s ease-in-out;
    }
  }
  .coupon-main {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,.6);
    .coupon-popup {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      .coupon-top {
        background: white;
        border-bottom: .2rem solid white;
        .coupon-title {
          width: 100%;
          border-bottom: .2rem solid white;
          border-top: .4rem solid white;
          text-align: center;
          font-size: .32rem;
        }
        .coupon-no-start {
          margin: 0 auto;
          width:90%;
          height: .62rem;
          color:#888;
          border: .01rem solid #e3e3e3;
          border-radius: .1rem;
          text-align: center;
          line-height: .62rem;
        }
      }
      .coupon-close {
        width: 100%;
        height: .9rem;
        box-shadow:1px 5px 15px rgba(50, 50, 50, 0.3);
        background:$bg1;
        text-align: center;
        line-height: .9rem;
        font-size: .32rem;
        color: white;
      }>

      .coupon-list {
        box-sizing: border-box;
        padding: .15rem;
        background: white;
        max-height: 5.5rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        border-bottom: .2rem solid white;
        .list{
                background:linear-gradient(-125deg, #fd8fb4, #ffa3bc);
                height:1.8rem;
                border-radius: .06rem;
                margin-bottom: .22rem;
                @include flex-row;
                position: relative;
                overflow: hidden;
                .man-jian{
                    position:absolute;
                    top:0;
                    right:0;
                    z-index:10;
                    width:1.28rem;
                    padding:0.03rem 0;
                    background: #ff7d95;
                    font-size:$size22;
                    text-align:center;
                    color:#ffffff;
                    transform:rotate(45deg);
                    transform-origin:0.64rem 0.64rem;
                }
                .rec-action{
                    position: absolute;
                    right:.3rem;
                    bottom:.3rem;
                }
                .already-rec{
                    color:$colorf;
                    font-size: $size22;
                }
                .receive{
                    width:1.2rem;
                    height:0.46rem;
                    text-align: center;
                    line-height: 0.46rem;
                    border-radius: 0.23rem;
                    border:1px solid $colorf;
                    color:$colorf;
                    font-size: $size22;
                }
                .shu{
                    border-left:.04rem solid #fff;
                    margin:0 5px 0 3px;
                    background:#fff;
                    position: relative;
                    .bottom-y{
                        width:.32rem;
                        height:.32rem;
                        border-radius: 50%;
                        background: $bgf;
                        position: absolute;
                        bottom:-0.16rem;
                        left:-0.18rem;
                    }
                    .top-y{
                        width:.32rem;
                        height:.32rem;
                        border-radius: 50%;
                        background: $bgf;
                        position: absolute;
                        top:-0.16rem;
                        left:-0.18rem;
                    }
                }
                .left{
                    min-width: 2.28rem;
                    @include flex-col;
                    align-items: center;
                    justify-content: center;
                    padding: 0 .04rem;
                }
                .many{
                    @include flex-row;
                    align-items: flex-end;
                    span:nth-child(1){
                        color:$colorf;
                        font-size: $size30;
                    }
                    span:nth-child(2){
                        color:$colorf;
                        font-size: 0.52rem;
                    }
                }
                .can-use{
                    color:$colorf;
                    font-size: $size22;
                }
                .right{
                    @include flex-col;
                    .r-explain{
                        color:$colorf;
                        font-size: .38rem;
                        padding: .3rem 0 .3rem .14rem;
                    }
                    .time{
                        color:$colorf;
                        font-size: $size24;
                        padding-left: .14rem;
                    }
                }
            }
        .list:nth-child(2n) {
          background:linear-gradient(125deg, $bg1, #ff4a8d);
        }
      }
    }
  }
  .id-card-main {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,.6);
    .add-id-card{
        // height:100%;
        width: 100%;
        background: #fff;
        position: absolute;
        left: 0;
        bottom: 0;
        /*<!--background: $bgf2;-->*/
        .mint-toast{
            color:red;
        }
        .list{
            height:1rem;
            @include flex-row;
            align-items: center;
            border-bottom: 1px solid #dcdcdc;
            background: $bgf;
            padding: 0 0 0 .25rem;
            .active{
                color:#000;
            }
            div{
                color:$color66;
                width: 100%;
                height:100%;
                line-height: 1rem;
                font-size: $size28;
            }
            span{
                display: inline-block;
                width: 1.7rem;
                font-size: $size28;
            }
            input{
                width: 100%;
                height:100%;
                background: $bgf;
                font-size: $size28;
            }
        }
        .keep{
            width:7rem;
            margin:.8rem 0 .8rem .25rem;
            border-radius: 4px;
            height:.92rem;
            line-height: .92rem;
            text-align: center;
            color:$colorf;
            background: $bgm;
            font-size: $size30;
        }
    }
  }
}


</style>
