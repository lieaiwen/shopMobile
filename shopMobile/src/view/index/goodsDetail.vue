<template>
  <div class="detail">
    <img :src="this.GLOBAL+'gotop.png'" class="gotop" @click="gotop" v-if="pdtop">
    <div class="banner">
      <mt-swipe :auto="4000" :continuous="true">
        <mt-swipe-item >
          <img :src="detail.img" class="wh100">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="brand flex-row" >
      {{detail.category}}
      <span class="flex-row">品牌官方合作</span>
    </div>
    <div class="k"></div>
    <div class="content">
      <div class="share" >
        <!--<img src="../../assets/images/collect1.png">-->

      </div>
      <div class="title">{{detail.shop_name}}</div>
      <div class="price">
        ¥{{detail.price}}
        <div class="sales">库存：{{detail.stock}}--已售: {{detail.sale_number}}</div>
      </div>
    </div>

    <div class="k"></div>

    <div class="detail-title" >
      <!-- 已选 {{goods_num}}个@click="showSku()" -->
      规格数量选择
      <div class="show-sku" >
        <i class="iconfont icon-jinru"></i>
      </div>
    </div>


    <div class="k"></div>

    <div class="detail-title">商品描述</div>
    <div v-html="detailContent" class="detail-content"></div>


    <div class="bottom-height"></div>
    <div class='bottom'>
      <div class="service" @click="goIndex()">
        <img :src="this.GLOBAL + 'indexI.png'" class="wh100">
      </div>
      <div class="cart" @click="goCart()">
        <img :src="this.GLOBAL + 'cartI.png'" class="wh100">
      </div>
      <div class="share" @click="goService()">
        <img :src="this.GLOBAL + 'serviceI.png'" class="wh100">
      </div>
      <div class="add-cart" @click="showSku()">加入购物车</div>
      <div class="buy" @click="showSku()">立即购买</div>
    </div>





    <div class="pay-bg" v-if="showView" @click="showSku()"></div>
    <div class="pay-tab" :class="{ 'an': showView }">
      <div class="pay-top flex-row">
        <img :src="detail.img" class="left">
        <div class="right">
          <div class="goods-price">¥{{detail.price}}</div>
          <div class="stock-num">库存: {{detail.stock}}</div>
        </div>
        <div class="pay-top-x" @click="showSku()">
          <img :src="this.GLOBAL + 'failure.png'" class="wh100">
        </div>
      </div>
      <!--数量的加减-->
      <div class="sku-main">
        <div>
          <div class="sku-title">购买数量</div>
          <button class="default" :class="{ 'default-active': goods_num == 1 }" @click="down()">-</button>
          <input bindinput="import" type="tel" v-model="goods_num" disabled>
          <button class="default"  @click="up()">+</button>
        </div>
      </div>

      <div class="pay-bottom">
        <div class="left"  v-if="detail.stock > 0" @click="addCart()">加入购物车</div>
        <div class="right"  v-if="detail.stock > 0" @click="goChecked()">立即购买</div>
        <div class="out-stock" v-if="detail.stock == 0">暂无现货</div>
      </div>

    </div>
  </div>
</template>

<script>

  import { singleGoodsDetail, downOrder, addReachCart} from '@/api/getData';
  import {Toast} from 'mint-ui';
  import {  Indicator  } from 'mint-ui';
//  import QRCode from 'qrcode'
//  import {pdopenid,accredit,isWeiXin,pdmobile} from '../../assets/js/common';
  export default {
    data() {
      return {
        bannerArr: [
          {"file_path": ''},
        ],
        imgUrl: this.GLOBAL,
        goods_id: '',
        goods_sales: '',
        detailContent: '',
        pdshare: false,
        showView: false,
        pdtop: false,
        detail: {}, // 商品详情信息
        goods_num: 1, // 商品数量
        cart_total_num: 0, // 购物车商品总数量
        specData: {}, // 多规格信息
        // 记录规格的数组
        goods_spec_arr: [],

      }
    },
    created(){
      document.title = '商品详情'
      // 获取 商品id
      this.goods_id = this.$route.query.id;
      window.addEventListener('scroll', this.handleScroll, true);
      this.init();
    },
    methods: {
      // 1.0 获取商品详情
      init(){
        let that = this;
        let req = { id:that.goods_id };
        singleGoodsDetail(req).then(res =>{
          that.detail = res.data;
          that.detailContent = res.data.content;
        })
      },
      // 2.0 点击 立即购买
      showSku(){
        // 判断用户是否登录 且token 对不对
        this.showView = !this.showView;
      },

      // 1.0 直接购买 去下单页面
      goChecked() {
        // 这个时候已经生成订单了，只剩下的就是支付了
        let req = {
          goods_id:this.goods_id,
          goods_num:this.goods_num
        }
        downOrder(req).then(res => {
          this.showView = false;
          if(res.code==200){ // 下单成功 跳转到详情页 付款
            this.$router.push({path:'/orderDetail',query:{'id':res.data}})
          }else{
            Toast({message: res.msg, position: 'middle', duration: 2000});
          }
        })
      },
      // 2.0 加入到购物车
        addCart () {
          let that = this;
          let req = {
            goods_id:that.goods_id,
            goods_num:that.goods_num
          }
          addReachCart(req).then(res =>{
            this.showView = false;
            if(res.code==200){ // 下单成功 跳转到详情页 付款
              Toast({message: '加入购物车成功', position: 'middle', duration: 2000});
            }else{
              Toast({message: res.msg, position: 'middle', duration: 2000});
            }
          })
        },
      handleScroll () {
        if (window.scrollY > 500) {
          this.pdtop = true
        } else {
          this.pdtop = false
        }
      },
      goService() { this.$router.push({path: '/service'}) },
      gotop() { scroll(0, 0) },
      up: function() { this.goods_num = ++this.goods_num },
      down: function() {
        if (this.goods_num > 1) {
          this.goods_num = --this.goods_num
        }
      },
      // 点击去首页
      goIndex(){
        this.$router.push({path:'/index'})
      },
      // 点击去购物车
      goCart(){
        this.$router.push({path:'/index',query:{'cart':1}})
      },

    },

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
  .wh100{
    width:100%;
    height:100%;
  }
  .detail{
    padding-bottom: 1.2rem;
    .comment-list {
      width: 100%;
      background: white;
      .comment-single {
        box-sizing: border-box;
        padding: .24rem;
        border-bottom: .01rem solid #eee;
        .comment-name {
          color: #999;
          font-size: .26rem;
          img {
            width: .25rem;
            height: .25rem;
            margin-left: .1rem;
          }
        }
        .comment-content {
          font-size: .3rem;
          color:#333;
          margin: .1rem 0;
          display:-webkit-box;
          word-break:break-all;
          text-overflow:ellipsis;
          overflow:hidden;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        }
        .comment-time {
          color: #999;
          font-size: .22rem;
          margin-top: .1rem;
        }
      }
    }
    .share-img-main {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0,0,0,.6);
      .save-img-text {
        width: 100%;
        color: white;
        font-size: .24rem;
        margin-top: .7rem;
        text-align: center;
        position: relative;
        .share-img-close {
          width: .44rem;
          height: .44rem;
          position: absolute;
          right: 1rem;
        }
      }
      .share-img {
        width: 4.2rem;
        display: block;
        margin: 0 auto;
        margin-top: .2rem;
        height: auto;
        border: .02rem solid white;
      }
      .text-bor {
        width: 5.5rem;
        margin: 0 auto;
        margin-top: .35rem;
        border-radius: .1rem;
        background: white;
        box-sizing: border-box;
        padding: .4rem .35rem;
        .top, .copy-but {
          width: 2.9rem;
          height: .5rem;
          border-radius: .26rem;
          margin: 0 auto;
          text-align: center;
          line-height: .5rem;
          border: .01rem solid $colorm;
          font-size: .28rem;
        }
        .top {
          color: $colorm;
        }
        .copy-but {
          color: white;
          background: $colorm;
        }
        .txt {
          width: 100%;
          box-sizing: border-box;
          padding: .3rem;
          border: .01rem solid #eee;
          background: #fafafa;
          font-size: .24rem;
          color: #333;
          margin: .2rem  0;
          word-wrap:break-word;
          .txt-content {
            display: block;
            max-height: 1rem;
          }
        }
      }

    }
    .brand {
      width: 100%;
      height: 1.1rem;
      box-sizing: border-box;
      padding: 0 .3rem;
      color: #333b48;
      font-size: .34rem;
      font-weight: bold;
      span {
        background: #ff005c;
        color: white;
        text-align: center;
        width: 1.55rem;
        height: .3rem;
        justify-content: center;
        border-radius: .15rem;
        font-size: .2rem;
        margin-left: .2rem;
      }
    }
    .k {
      width: 100%;
      height: .2rem;
      background: #f4f4f4;
    }

    .share-bg {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0,0,0, .6);
    }

    .share-tab {
      position: fixed;
      width: 100%;
      left: 0;
      bottom: -10rem;
      background:#f8f8f8;
      text-align: center;
      transition: All 0.4s ease-in-out;
      div {
        background: white;
        height: .9rem;
        line-height: .9rem;
        font-size: .32rem;
        color: #333;
      }
    }
    .pay-bg {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0,0,0, .6);
    }
    .share-img-bg {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0,0,0, .6);
      img {
        width: 80%;
        height: auto;
        margin: 0 auto;
        display: block;
      }
    }
    .pay-tab {
      position: fixed;
      width: 100%;
      left: 0;
      bottom: -10rem;
      transition: All 0.4s ease-in-out;
      background: white;
      .pay-top {
        width: 100%;
        padding: .24rem;
        position: relative;
        justify-content: space-between;
        .left {
          width: 2rem;
          height: 2rem;
          border:1px solid #dcdcdc;
        }
        .right {
          width: 4.8rem;
          .goods-price {
            color: $bg1;
            font-size: .34rem;
            font-weight: bold;
            margin-top: 1rem;
          }
          .stock-num {
            color: #999;
            font-size: .3rem;
            margin-top: .1rem;
          }
        }
        .pay-top-x {
          width: .5rem;
          height: .5rem;
          position: absolute;
          right: .24rem;
          top: .24rem;
        }
      }
      .sku-main {
        box-sizing: border-box;
        padding: .2rem .24rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        max-height: 6rem;
        div {
          .sku-title {
            font-size: .28rem;
            color:#444;
            margin-bottom: .1rem;
            position: relative;
          }
          .default {
            width: .6rem;
            height: .52rem;
            float:left;
            line-height: .48rem;
            padding:0;
            background:#fff;
            color:#444;
            font-size: .40rem;
            border-radius:unset;
            border: .01rem solid #eee;
          }
          .default-active {
            background:#f7f7f7;
            color:#ddd;
          }
          input {
            float:left;
            width: .8rem;
            height: .52rem;
            line-height: .52rem;
            border: .01rem solid #eee;
            text-align:center;
            font-size: .28rem;
            color:#444;
            background: white;
          }
          div {
            .sku-item {
              position:relative;
              display:inline-block;
              overflow:hidden;
              height: .6rem;
              font-size: .31rem;
              padding:0 .3rem;
              margin:0 .2rem .2rem 0;
              line-height: .6rem;
              border: .01rem solid #ccc;
              background:white;
              border-radius: .1rem;
              color:#ccc;
            }
            .sku-item-y {
              color: $bg1;
              border: .01rem solid $bg1;
              background:white;
            }
          }
        }
      }
      .pay-bottom {
        width: 100%;
        height: 1rem;
        background: white;
        margin-top: .2rem;
        .out-stock {
          width: 100%;
          float: left;
          background:#ccc;
          color:#fff;
          text-align:center;
          font-size: .34rem;
          height: 1rem;
          line-height: 1rem
        }
        .left {
          width: 50%;
          height: 1rem;
          float: left;
          background: #f4f4f4;
          text-align: center;
          line-height: 1rem;
          color: #333;
          font-size: .34rem;
        }
        .right {
          width: 50%;
          height: 1rem;
          float: left;
          background: $bg1;
          text-align: center;
          line-height: 1rem;
          color: white;
          font-size: .34rem;
        }
      }
    }
    .an {
      bottom: 0;
      transition: All 0.4s ease-in-out;
    }
    .banner {
      height: 7.5rem;
    }

    .content {
      box-sizing: border-box;
      padding: .3rem;
      position: relative;
      .share {
        position: absolute;
        width: .8rem;
        height: .66rem;
        line-height: .66rem;
        right: .4rem;
        top: .3rem;
        color: #666;
        border-left: .01rem solid #d0d0d0;
        box-sizing: border-box;
        padding-left: .3rem;
        img {
          width: .48rem;
          height: auto;
        }
      }
      .title {
        width: 5.8rem;
        min-height: .66rem;
        font-size:.32rem;
        color:#444;
        font-weight:bold;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        overflow:hidden;
      }

      .price {
        width: 100%;
        font-size: .4rem;
        margin-top: .1rem;
        color: $bg1;
        font-weight:bold;
        position: relative;

        .promotion {
          background: #fbdad3;
          color: #ae234a;
          font-size: .18rem;
          box-sizing: border-box;
          padding: .02rem .04rem;
          text-align: center;
          margin-left: .1rem;
        }
        .del {
          text-decoration:line-through;
          padding-left: .1rem;
          color:#ccc;
          font-size: .24rem;
        }
        .sales {
          position: absolute;
          font-size: .24rem;
          color: #ccc;
          right: 0;
          top: .1rem;
        }
        .is-oversea {
          font-size:.24rem;
          color:#ff015d;
          font-weight:bold;
        }
      }
    }
    .detail-title {
      width: 100%;
      height: .9rem;
      font-size: .3rem;
      line-height: .9rem;
      box-sizing: border-box;
      padding-left: .24rem;
      color: #444;
      position: relative;
      font-weight: 600;
      border-bottom:.01rem solid #eee;
      div {
        font-size: .3rem;
        color: #444;
        font-weight: 600;
        i {
          font-size: .4rem;
          color: #ccc;
        }
      }
      .more {
        box-sizing: border-box;
        padding-right: .24rem;
        color: #ccc;
      }
      .show-sku {
        width: .5rem;
        height: .5rem;
        position: absolute;
        right: .2rem;
        top: .2rem;
        color: #ccc;
        text-align: center;
        line-height: .5rem;
        i {
          font-size: .4rem;
        }
      }
    }
    .bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .9rem;
      background: white;
      border-top: 0.01rem solid #d0d0d0;
      box-shadow: .01rem .05rem .15rem rgba(50, 50, 50, 0.3);
      .service, .share {
        width: .99rem;
        height: 1rem;
        float: left;
        border-right: 0.01rem solid #d0d0d0;
      }
      .cart {
        width: .99rem;
        height: 1rem;
        float: left;
        position: relative;
        border-right: 0.01rem solid #d0d0d0;
        .cart-num {
          background:$bg1;
          position:absolute;
          right: .1rem;
          top: .1rem;
          border-radius: .3rem;
          height: .3rem;
          min-width: .3rem;
          color: white;
          font-size: .22rem;
          text-align: center;
        }
      }
      .add-cart {
        width: 2.25rem;
        height: 1rem;
        float: left;
        background: #fbfbfb;
        text-align: center;
        line-height: 1rem;
        color: #434343;
        font-size: .26rem;
      }
      .buy {
        width: 2.25rem;
        height: 1rem;
        float: right;
        background: $bg1;
        text-align: center;
        line-height: 1rem;
        color: white;
        font-size: .26rem;
      }
    }
    .mint-swipe-item {
      // background: red;
    }
    .gotop {
      width: .9rem;
      height: .9rem;
      position: fixed;
      right: .2rem;
      bottom: 1.5rem;
    }
  }

</style>
<style lang="scss">
  .detail-content {
    img {
      width: 100%;
      height: auto;
    }
  }
  //这里写动态生成的
</style>


