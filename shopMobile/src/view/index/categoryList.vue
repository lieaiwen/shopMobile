<template>
  <div class="product-list">
    <!--搜索按钮-->
    <div class="seek-main">
      <div class="seek-bor">
        <div class="search-input flex-row">
          <div class="left flex-row">
            <i class="iconfont icon-sousuo"></i>
          </div>
          <input  type="text" name="" class="search-right" v-model="seekData">
        </div>
        <div class="search-button" @click="seekBut()">
          <div>搜索</div>
        </div>
      </div>
    </div>



    <div class="tab-main flex-row">
      <div class="tab-but" :class="{ 's': type == 'all' }" @click="tabBut('all')">综合</div>
      <div class="tab-but" :class="{ 's': type == 'sales' }" @click="tabBut('sales')">销量</div>
      <div class="tab-but" :class="{ 's': type == 'price' }" @click="tabBut('price')">
        <span>价格</span>
        <img :src="this.GLOBAL+'pn.png'"  v-if="type != 'price'">
        <img :src="this.GLOBAL+'pb.png'" v-if="type == 'price' && sortPrice == 0">
        <img :src="this.GLOBAL+'pt.png'"  v-if="type == 'price' && sortPrice == 1">
      </div>
    </div>

    <div class="list-main-1"  v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"  >
      <div class="list-single" v-for="(item, index) in list" :key="index" @click="goDetail(item.id)">
        <img :src="item.img">
        <div class="list-single-title textshow2" style="-webkit-box-orient: vertical;">{{item.shop_name}}</div>
        <div  class="list-single-price">￥{{item.price}} </div>
      </div>
      <div class="no-content" v-if="list.length==0">
        <img :src="this.GLOBAL+'no-productlist.png'" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { allGoodsList } from '@/api/getData';

  import {Toast, Indicator} from 'mint-ui';
  export default {

    data() {
      return {
        pdListType: 1,
        tabType: 1,

        sumPage: 0,
        pdScroll: true,
        //
        list: [],
        seekData:'',
        page:1,
        pageSize:10,
        category_name:'', //分类 标题
        count:0,
        loading:false,
        type:'all',// all 综合 sales 销量 price
        sortPrice:0,//0 降 1 升
      }
    },
    created(){
      this.category_name = this.$route.query.title ? this.$route.query.title : ''
      this.init();
    },
    mounted(){
      document.title = '商品列表'
    },
    methods: {
      init(){
        Indicator.open({text: '加载中...', spinnerType: 'fading-circle'});
        let that = this;
        let req = {
          page:this.page,
          pageSize:this.pageSize,
          goods_name:this.seekData, // 商品名字
          category_name:this.category_name, // 分类名字
          type:this.type,
          sortPrice:this.sortPrice,
        };
        allGoodsList(req).then(res =>{
           that.list = that.list.concat(res.data);
           that.count = res.count;
           Indicator.close();
           that.seekData = '';
        })
      },
      // 上拉加载更多
      loadMore(){
        let that = this;
        this.loading = true;
        setTimeout(() => {
          if(that.list.length<that.count){
            that.page+=1;
            that.init();
          }
          that.loading = false;
        }, 2500);
      },



      goDetail(id) {
        this.$router.push({path:'/goodsDetail',query:{id:id }})
      },

      tabBut(type) {
        if(type == 'price'){
          if(this.sortPrice==0){
            this.sortPrice=1
          }else{
            this.sortPrice=0
          }
        }
        this.list = [];
        this.page = 1;
        this.type = type;
        this.init();

      },
      httpData() {

      },
      listScroll($event) {

      },

      // 点击搜索
      seekBut(){
        this.list = [];
        this.page = 1;
        this.init();
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
  .seek-main {
    width: 100%;
    background: #f4f4f4;
    box-sizing: border-box;
    padding: .2rem .25rem;}
  .seek-bor {
    display:flex;
    height: .64rem;
    .search-input {
      width:80%;
      background:#fff;
      border-radius: .1rem 0 0 .1rem;
      box-sizing:border-box;
      overflow:hidden;
      display: flex;
      height:100%;
      .left {
        width: .56rem;
        box-sizing: border-box;
        padding: .1rem;
        i {
          font-size: .32rem;
          color: $color66;
        }
      }
      .search-right {
        flex: 1;
        font-size: .26rem;
        padding: 0;
        margin:0;
        height:100%;
        border:none;
      }
    }
    .search-button {
      width:20%;
      box-sizing:border-box;
      div {
        line-height: .64rem;
        height: .64rem;
        font-size: .28rem;
        border-radius:0 .1rem .1rem 0;
        text-align: center;
        background: $bg1;
        color: white;
      }
    }
  }
  .product-list{
    /*没有的时候*/
    width: 100%;
    height: 100%;
    .no-content{
      @include flex-col;
      align-items: center;
      justify-content: center;
      padding-top: 1rem;
      img{
        height:2.6rem;
        width:3rem;
      }
      span{
        font-size: $size26;
        color:$color99;
      }
    }
    .tab-main {
      position: fixed;
      left: 0;
      top: 1rem;
      width: 100%;
      height: .8rem;
      border-bottom: .01rem solid #eee;
      .tab-but {
        width: 33.3%;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
        color: #333;
        font-size: .28rem;
        img {
          width: .18rem;
          height: auto;
        }
      }
      .s {
        color: $bg1;
      }
    }
    .list-main-1 {
      position: fixed;
      left: 0;
      width: 100%;
      top: 1.8rem;
      background: #f7f7f7;
      height: calc(100% - 1.8rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .list-single {
        box-sizing:border-box;
        width:50%;
        height: 5.3rem;
        float:left;
        border-bottom:.08rem solid #f7f7f7;
        background: white;
        img {
          width: 100%;
          height: 3.7rem;
        }
        .list-single-title {
          color: #333;
          margin-top: .1rem;
          font-size: .3rem;
          box-sizing:border-box;
          padding: 0 .12rem;
          min-height: .8rem;
        }
        .list-single-price {
          margin-top: .1rem;
          color: $bg1;
          font-size: .34rem;
          box-sizing:border-box;
          padding: 0 .12rem;
          .del {
            text-decoration:line-through;
            padding-left: .1rem;
            color:#999;
            font-size: 0.2rem;
          }
        }
      }
      .list-single:nth-child(2n-1) {
        border-right:.04rem solid #f7f7f7;
      }
    }
    .list-main-2 {
      position: fixed;
      left: 0;
      width: 100%;
      top: 1.8rem;
      background: #f7f7f7;
      height: calc(100% - 1.8rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .list-single {
        box-sizing:border-box;
        width:100%;
        padding: .15rem;
        border-bottom: .01rem solid #f7f7f7;
        background: white;
        img {
          width: 2.2rem;
          height: 2.2rem;
        }
        .right {
          width: 65%;
          .list-single-title {
            color: #333;
            margin-top: .1rem;
            font-size: .3rem;
            box-sizing:border-box;
            padding: 0 .12rem;
          }
          .list-single-price {
            margin-top: .1rem;
            color: $bg1;
            font-size: .34rem;
            box-sizing:border-box;
            padding: 0 .12rem;
            .del {
              text-decoration:line-through;
              padding-left: .1rem;
              color:#999;
              font-size: 0.2rem;
            }
          }
        }

      }
    }
  }


</style>
