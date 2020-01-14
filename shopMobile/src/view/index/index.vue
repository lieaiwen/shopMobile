<template>
    <div class="index">

      <mt-tab-container v-model="active" class="main-content" >
        <mt-tab-container-item id="tab-container1">
          <!--轮播图-->
          <div class="wheel">
            <mt-swipe id="one" :auto="4000" :show-indicators=isShow data-color="red" >
              <mt-swipe-item v-for="(item,index) in bannerList" :key="index" >
                <img @click="goDetail(item.detail_id)" class="ban" :src="item.img_url" alt="">
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <!--优惠券-->
          <div class="coupon" >
            <div class="two" v-for="(item,index) in couponList" :key="index" @click="receive(item.id,item.ishave)">
              <div  :class="['t-left',{'t-lingqu':item.ishave==1},{'red':item.ishave==0}]" >
                <div class="many"><span>￥</span>{{item.reduce_price}}</div>
                <div class="all-can">满{{item.base_price}}元可用</div>
              </div>
              <div class="t-right" v-if="item.ishave==0">立即领取</div>
              <div class="t-right t-l" v-else>已领取</div>
              <div class="t-top"></div>
            </div>
            <!--<div class="two">-->
              <!--<div class="t-left t-active">-->
                <!--<div class="many"><span>￥</span>10</div>-->
                <!--<div class="all-can">满100.00元可用</div>-->
              <!--</div>-->
              <!--<div class="t-right">立即领取</div>-->
              <!--<div class="t-top"></div>-->
            <!--</div>-->
          </div>

          <!-- 搜索框 -->
          <div class="search">
            <div @click="goSearch()" :class="['main','angle-radius']">
              <i class="iconfont icon-sousuo"></i>
              <input type="text" :placeholder="placeholder" disabled>
            </div>
          </div>
          <!--商品列表-->
          <div :class="['shop-group','shop-gg3' ]" >
            <div :class="['option','option2']" v-for="(item,index) in list" :key="index" @click="goDetail(item.id)" data-id="item.goods_id">
              <div class="shop-img">
                <img :src="item.img" alt="">
              </div>
              <div style="-webkit-box-orient: vertical;" class="shop-name textshow2"  >{{item.shop_name}}</div>
              <div class="shop-many" >￥{{item.price}}</div>
            </div>
          </div>

        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container2">
          <category v-if="active=='tab-container2'"></category>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container3">
          <cart v-if="active=='tab-container3'"></cart>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container4">
          <my v-if="active=='tab-container4'"></my>
        </mt-tab-container-item>
      </mt-tab-container>

      <!--底部导航-->
      <mt-tabbar v-model="footSelected" :fixed="true">
        <mt-tab-item id="index">
          <img v-if="footSelected== 'index'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/home-active.png">
          <img v-if="footSelected!= 'index'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/home.png" >
          首页
        </mt-tab-item>
        <mt-tab-item id="category">
          <img v-if="footSelected != 'category'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/cate.png">
          <img v-if="footSelected == 'category'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/cate-active.png">
          分类
        </mt-tab-item>
        <mt-tab-item id="cart">
          <img v-if="footSelected != 'cart'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/flow.png">
          <img v-if="footSelected == 'cart'" slot="icon" src="@/assets/images/cart.png">
          购物车
        </mt-tab-item>
        <mt-tab-item id="my">
          <img v-if="footSelected != 'my'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/user.png">
          <img v-if="footSelected == 'my'" slot="icon" src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/user-active.png">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
</template>

<script>
  import my from './my.vue'
  import category from './category'
  import cart from './cart'
  import { allGoodsList, bannerData, couponItems, receiveCoupon } from '@/api/getData';
  import { Toast} from 'mint-ui';
	export default {
    components:{ my, category, cart },
		data() {
			return {
        isShow:true,
        footSelected:'index',
        active:'tab-container1',
        placeholder:'搜索商品',
        list:[],
        bannerList: [],
        couponList:[],// 优惠券列表
      }
		},
    watch: {
      footSelected(val) {
        console.log(val)
        if(val == "index"){
          this.active = 'tab-container1'
        }else if(val == "category") {
          this.active = 'tab-container2'
        }else if(val == "cart") {
          this.active = 'tab-container3'
        }else {
          this.active = 'tab-container4'
        }
      },
    },
    created(){
      this.init();
      this.init2();
      console.log(123)
      this.footSelected = this.$route.query.cart ? 'cart' : 'index'
    },
		mounted() {
		},
		methods: {
      init(){
        let that = this;
        let req = {
          page: 1,
          pageSize: 10,
          goods_name:'', // 商品名字
          category_name:'', // 分类名字
          type:'all',
          sortPrice:0,
        };
        // 轮播图的
        bannerData().then(res =>{
          that.bannerList = res.data;
        })
        allGoodsList(req).then(res =>{
          that.list = that.list.concat(res.data);
          that.count = res.count;
        })


      },
      init2(){
        let that = this;
        // 优惠券的
        couponItems().then(res=>{
          that.couponList = res.data;
        })
      },
      // 点击去列表页
      goSearch(){
        this.$router.push({path:'/categoryList'})
      },
      // 点击去详情
      goDetail(id){
        console.log(id)
        this.$router.push({path:'/goodsDetail', query:{'id':id } })
      },
      // 点击领取优惠券
      receive(id,num){
        if(num==1){
          return;
        }
        let req = {id: id };
        receiveCoupon(req).then(res =>{
          if(res.code == 200){
            Toast({ message: '领取成功', duration: 2000});
            this.init2();
          }else{
            Toast({ message: res.msg, duration: 2000});
          }
        })
      },
    },
	}
</script>

<style scoped lang="scss">
  @import "../../assets/css/minxin";
  .mint-swipe-items-wrap > div{
    background: #eee;
  }
  .wheel{
    width:100%;
    height:4rem;
    border-bottom: 1px solid #dcdcdc;
    .ban{
      width:100%;
      height:100%;
    }
    .dot-rectangle{}
  }
  .main-content{
    /*height:calc(100vh - 4rem - 55px);*/
    /*border:1px solid red;*/
    padding-bottom: 56px;
  }
  /*搜索start*/
  .search{
    height:1rem;
    width: 100%;
    background: $bgf2;
    @include flex-row;
    align-items: center;
    justify-content: center;
    .main{
      width:7rem;
      i {
        color: #666;
      }
      @include flex-row;
      height:.62rem;
      background: $bgf;
      align-items: center;
      padding: 0 .1rem;
      input{
        width:100%;
        height:100%;
        background:$bgf;
        font-size: .26rem;
        border:none;
        margin:0;
        padding: 0 0 0 .1rem;
      }
    }
    .s-left{

    }
    .s-right{
      justify-content: flex-end;
      input{
        width:auto;
      }
    }
    .s-center{
      justify-content: center;
      input{
        width:auto;
      }
    }
    .angle-radius{
      border-radius: .05rem;
    }
    .angle-round{
      border-radius: .31rem;
      overflow: hidden;
    }
  }
  /*搜索end*/
  /*商品列表stat*/
  .shop-group{
    color: #333;
    /*height:10rem;*/
    @include flex-row;
    flex-wrap: wrap;
    background: $bgf2;
    padding: 0 .14rem;
    /*justify-content: space-around;*/
    .option{
      margin: .1rem .1rem;
      @include flex-col;
      background: $bgf;
      .shop-img{
        width:3.4rem;
        height:3.4rem;
        /*border-bottom: 1px solid #eee;*/
        img{
          width:100%;
          height:100%;
        }
      }
      .shop-img1{
        width:2.3rem;
        height:2.3rem;
        border-top-right-radius: .1rem;
        border-top-left-radius: .1rem;
        img{
          width:100%;
          height:100%;
        }
      }
      .shop-name{
        font-size: .28rem;
        color:$color33;
        padding: .3rem .1rem 0 .1rem;
        margin-bottom: .1rem;
        min-height:.8rem;
        width:3.4rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .shop-name1{
        width:2.3rem;
        font-size: .22rem;
        height:auto;
        color:$color33;
      }
      .shop-many{
        color:$colorm;
        padding: 0 0 .3rem .1rem;
        font-size: .26rem;
      }
    };
    .option2{
      margin:.1rem .08rem;
      border-radius: .14rem;
      overflow: hidden;
      width:3.4rem;

    }
    .group-column{
      margin:.1rem 0rem;
      border:1px solid #eee;
      border-radius: .1rem;
    }
  }
  .shop-group1{
    overflow-x: scroll;
    flex-wrap: initial;
    padding-right:.1rem;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
  }
  .shop-gg3{
    justify-content: space-around;
  }

  /*商品优惠券列表*/
  .coupon{
    @include flex-row;
    align-items: center;
    padding: .2rem .2rem;
    overflow-x: scroll;
    .two{
      @include flex-row;
      width:3.6rem;
      height:1rem;
      position: relative;
      margin-right: .22rem;
      padding-right: .2rem;
      .t-left{
        width:2.4rem;
        height:100%;
        text-align: center;
        @include flex-col;
        align-items: center;
        justify-content: center;
        div{
          color:#fff;
          span{
            font-size: $size24;
          }
        }
        .many{
          font-size: .32rem;
        }
      }
      .t-active{
        background: linear-gradient(to right,#c073fc, #e984f1);
      }
      .yellow{
        background: linear-gradient(to right,#fcb455, #f9c758);
      }
      .blue{
        background: linear-gradient(to right,#32a0df, #4eb6c7);
      }
      .red{
        background: linear-gradient(to right,#ff4343, #ff6464);
      }
      .violet{
        background: linear-gradient(to right,#c073fc, #e984f1);
      }
      .t-lingqu{
        background: linear-gradient(to right,#a7a6a7, #b9b9b9);
      }
      .t-right{
        width:1rem;
        height:100%;
        background: #4e4e4e;
        color:$colorf;
        font-size: .28rem;
        padding: .12rem .2rem 0 .2rem;
      }
      .t-l{
        padding: 0;
        text-align: center;
        line-height: 1rem;
        background: #949494;
      }
      .t-top{
        position: absolute;
        height:.3rem;
        width:.3rem;
        border-radius: 50%;
        overflow: hidden;
        background: $bgf;
        top:.35rem;
        left:-0.15rem;
      }
    }
  }

</style>
