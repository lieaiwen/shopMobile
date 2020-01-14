<template>
  <div class="checked">
    <div class="bg"></div>

    <div class="select-address flex-row"  @click="goAddress()">
      <div class="address-left">
        <i class="iconfont icon-tongzhi"></i>
      </div>
      <div class="address-middel">
        <div class="no-address" v-if="JSON.stringify(address) == '{}'">去选择配送地址</div>
        <div class="yes-address" v-else>
          <div class="n-p">{{address.name}} {{address.phone}}</div>
          <div class="a">{{address.province}} {{address.city}} {{address.area}} {{address.address_detail}}</div>
        </div>
      </div>
      <div class="address-right">
        <i class="iconfont icon-jinru"></i>
      </div>
    </div>

    <div class="k"></div>
    <!-- 商品列表 -->
    <div class="product-main">
      <div class="product-single flex-row" >
        <div class="left">
          <img :src="goodDetail.img" class="wh100">
        </div>
        <div class="right">
          <div class="title textshow2">{{goodDetail.goods_name}}</div>
          <div class="size">{{goodDetail.category}}</div>
          <div class="num flex-row">
            <div class="price">￥{{goodDetail.price}}</div>
            <div>x{{orderDetail.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="product-sum">共{{orderDetail.goods_num}}件商品，合计：<span>￥{{orderDetail.all_many}}</span></div>
    <div class="k"></div>
    <div class="message">
      <input type="text" name="name" class="wh100" placeholder="选填：买家留言（50字以内）" v-model='remark' maxlength="50">
    </div>
    <div class="k"></div>
    <div class="money">
      <div class="money-list flex-row">
        <div>商品总金额:</div>
        <div class="sum-price">￥{{orderDetail.all_many}}</div>
      </div>
      <div class="money-list flex-row">
        <div>优惠券:</div>
        <div v-if="coupon_detail.length > 0" class="y-coupon" @click="couponShow()">
          <div v-if="selectCoupon.id != ''">-￥{{ selectCoupon.price }}</div>
          <div v-else>有{{coupon_detail.length}}张优惠券可用<i class="iconfont icon-jinru"></i></div>
        </div>
        <div v-else>无优惠可用</div>
      </div>
    </div>
    <div class="bottom-height"></div>
    <div class="bottom">
      <div class="bottom-left">实付款：<span>￥{{ (orderDetail.all_many - selectCoupon.price).toFixed(2) }}</span></div>
      <div class="bottom-right" v-if="orderDetail.is_pay==0" @click="pay()">支付</div>
      <div class="bottom-right active" v-else >已支付</div>
    </div>

    <div class="nav">
      <div class="nav-list" :class="{ 'nav-list-n': !pdnav, 'nav-list-y': pdnav }" v-if="pdnavShow">
        <div><img :src="this.GLOBAL+'homeW.png'" class="wh100" @click="navBut(1)"></div>
        <div><img :src="this.GLOBAL+'cateW.png'" class="wh100" @click="navBut(2)"></div>
        <div><img :src="this.GLOBAL+'flowW.png'" class="wh100" @click="navBut(3)"></div>
        <div><img :src="this.GLOBAL+'userW.png'" class="wh100" @click="navBut(4)"></div>
      </div>
      <div class="show-but wh100" :class="{ 'show-but-n': !pdnav, 'show-but-y': pdnav }" @click="showBut()"><img :src="this.GLOBAL+'sz.png'" class="wh100"></div>
    </div>

    <div class="coupon-main" @click="couponShow()" v-if="pdCoupon">
      <div class="coupon-popup">
        <div class="coupon-top">
          <div class="coupon-title">选择优惠券</div>
          <div class="coupon-no-start" @click.stop="doNotCouponTap()">不使用优惠券</div>
        </div>
        <div class="coupon-list">

          <div class="list" v-for="(item,index) in coupon_detail" :key="index"  @click.stop="selectCouponTap(item.use_id,item.reduce_price,item.id)">
            <div class="left">
              <div class="many">
                <span>￥</span>
                <span>{{item.reduce_price}}</span>
              </div>
              <div class="can-use">满{{item.base_price}}元可用</div>
            </div>
            <div class="shu">
              <div class="top-y"></div>
              <div class="bottom-y"></div>
            </div>
            <div class="right">
              <div class="r-explain">红人优惠卷</div>
              <div class="time">{{item.create_time | couponTime}} ~ {{item.over_time | couponTime}}</div>
            </div>

            <div class="man-jian">满减卷</div>

          </div>

        </div>
        <div class="coupon-close" @click.stop="couponShow()">关闭</div>
      </div>
    </div>

  </div>
</template>

<script>
  import { orderMessage,payOrder} from '../../api/getData';
  import { Toast, MessageBox } from 'mint-ui';
  export default {

    data() {
      return {
        // 当前页面参数
        options: {},
        actual_pay_price: 0,
        order_pay_price: 0,

        exist_address: false, // 是否存在收货地址‘

        order_total_num: "", // 商品总数量
        order_total_price: "", // 商品总价
        intra_region: '', // 有无配送价
        express_price: '', // 配送价
        coupon_list: [], // 优惠券列表
        url:'',
        // 选择的优惠券
        selectCoupon: {
          id: '',
          tid:'',
          price: '0.00'
        },

        // 买家留言
        remark: '',

        pdnav: false,
        pdnavShow: false,

        hasError: false,
        error: '',

        // 禁用submit按钮
        disabled: false,

        pdPay: false,
        pdCoupon: false,
        // 商品详情
        address:{},
        goodDetail:{},
        orderDetail:{},
        userDetail:{},
        order_id:'',// 订单id
        from:'detail',// 来源分为2种 1 详情进来的 2 购物车进来的 cart
        type:1,// 1 2 用 address 3 的意思是已经付过款了则用 order里面的信息
        coupon_detail:[],// 优惠券列表
      }
    },
    filters: {
      couponTime: function (value) {
        return value.slice(0,10)
      }
    },
    created(){
      this.order_id = this.$route.query.id;
      this.from = this.$route.query.from ? this.$route.query.from : 'detail'
      this.type = this.$route.query.type ? this.$route.query.type : '1'
      this.init();
    },
    methods: {
      // 验证是不是正整数
      isInteger(obj) {
        return typeof obj === 'number' && obj%1 === 0
      },
      init(){
        let that = this;
        let req = {'id':that.order_id};
        orderMessage(req).then(res => {
          let orderDetail = res.data.orderMsg
          that.goodDetail = res.data.goodsMsg;
          that.orderDetail = orderDetail;
          that.userDetail = res.data.userMsg;
          that.coupon_detail = res.data.coupon_detail;
          if(that.type==3){ // 已经付款了则
            let a = {};
            a.name = orderDetail.name;
            a.phone =orderDetail.phone;
            a.province =orderDetail.province;
            a.city = orderDetail.city;
            a.area = orderDetail.area;
            a.address_detail = orderDetail.address_detail;
            that.address = a
//
            that.selectCoupon.id=1;
            that.selectCoupon.price=(orderDetail.all_many - orderDetail.true_pay_many).toFixed(2);

          }else{
            that.address = res.data.address || {};
          }
        })
      },
      // 点击导航
      menu(num){
        this.selfShow = num;
      },
      // 点击付款
      pay(){
        let that = this;
        if(Object.keys(that.address).length<=0){
          Toast({ message: '请选择收货地址', duration: 2000});
          return
        }
          let req = {
          id:that.order_id,
          price:that.orderDetail.all_many ,
          from:that.from,
          address:that.address,
          userCID : that.selectCoupon.id,
          userTID : that.selectCoupon.tid};
        // 判断如果使用优惠券
//       /*
// selectCoupon: {
//        id: '',
//          price: '0.00'
//      },
// */
        if(that.selectCoupon.id){
            req.price = (that.orderDetail.all_many - that.selectCoupon.price).toFixed(2);
        }


        payOrder(req).then(res =>{
          if(res.code==200){
            that.init();
            Toast({ message: '支付成功，看看其他的商品！', duration: 2000});
          }else{
            Toast({ message: res.msg, duration: 2000});
          }
        })
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
      selectCouponTap: function(id,price,tid) {
        this.selectCoupon.id = id // 这个id 是优惠券的id
        this.selectCoupon.price = price
        this.selectCoupon.tid = tid
//        // 优惠券折扣金额
//        let reducedPrice = this.coupon_list[dataset.index].reduced_price;
//        dataset.reduced_price = reducedPrice;
//        // 计算优惠后的价格
//        let actualPayPrice = this.bcsub(this.order_pay_price, reducedPrice);
//        this.selectCoupon = dataset
//        this.actual_pay_price = actualPayPrice > 0 ? actualPayPrice : '0.01'

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
        if(this.type==3){
          return;
        }
        if (this.address) {
          this.$router.push({path:'/address',query:{from:"flow"}})
        } else {
          this.$router.push({path:'/addAddress'})
        }

      },

      couponShow() {
        this.pdCoupon = !this.pdCoupon
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

      },


    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
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
        .left {
          width: 1.8rem;
          height: 1.8rem;
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
      border-top:1px solid #dcdcdc;
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
      .active{
        background: #dcdcdc;
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
    .wh100 {
      width: 100%;
      height: 100%;
      display: block;
    }
  }


</style>
