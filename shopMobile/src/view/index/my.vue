<template>
  <div class="personal">
    <div class="user-bg-box">
      <div class="header-bg">
        <img :src="avatar" >
      </div>
    </div>
    <div class="menu flex-row">

      <div class="list" @click="goOrder(2)">
        <img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/nopay.png" alt="">
        <span>待付款</span>
        <div class="circular" v-if="orderCount.payment>0">{{orderCount.payment}}</div>
      </div>
      <div class="list">
        <div class="list-spe">
          <div class="avatar">
            <img :src="avatar" >
          </div>
          <span>{{userInfo.nickName}}</span>
        </div>
      </div>
      <div class="list" @click="goOrder(3)">
        <img src="https://campaign.zaokol.com/wechat/redpeople/test/h5img/dshouhuo.png" alt="">
        <span>已付款</span>
        <div class="circular" v-if="orderCount.received>0">{{orderCount.received}}</div>
      </div>

    </div>
    <div class="kong"></div>
    <div class="options" @click="slideMenu(1)">
      <div class="left-name">
        <img :src="this.GLOBAL+'saddress.png'" alt="">
        <span>收货地址</span>
      </div>
      <img class="more" :src="this.GLOBAL+'more-right.png'" alt="">
    </div>

    <div class="options" @click="slideMenu(3)">
      <div class="left-name">
        <img :src="this.GLOBAL+'lingjuan.png'" alt="">
        <span>我的优惠券</span>
      </div>
      <img class="more" :src="this.GLOBAL+'more-right.png'" alt="">
    </div>

    <div class="options" @click="slideMenu(4)">
      <div class="left-name" >
        <img :src="this.GLOBAL+'help.png'" alt="">
        <span>公司简介</span>
      </div>
      <img class="more" :src="this.GLOBAL+'more-right.png'" alt="">
    </div>
    <div class="options" @click="slideMenu(5)">
      <div class="left-name" >
        <img :src="this.GLOBAL+'leave.png'" alt="">
        <span>用户登出</span>
      </div>
      <img class="more" :src="this.GLOBAL+'more-right.png'" alt="">
    </div>
  </div>
</template>

<script>
  import store from '../../store/index'
  export default {

    data() {
      return {
        userInfo:{},//个人的详情
        orderCount:{},//订单数
        avatar:'https://campaign.zaokol.com/wechat/redpeople/test/h5img/defaultHeader.png',
      }
    },
    mounted() {
      document.title = '个人中心';
       console.log(store.state.userInfo)
      this.avatar = store.state.userInfo.avatar
    },
    methods: {

//            下面的导航
      slideMenu(num){
        if(num==1){
          this.$router.push({path:'/address'})
        }else if(num==2){
          this.$router.push({path:'/coupon'})
        }else if(num==3){
          this.$router.push({path:'/myCoupon'})
        }else if(num==4){
          this.$router.push({path:'/personalHelp'})
        }else if(num==5){
          this.$messagebox.confirm('确定登出用户？').then(action => {
            window.localStorage.clear()
            store.commit('login',{})
            this.$router.push({path:'/login'})
          }).catch(err => {
            console.log(2);
          });
        }else if(num==6){
          this.$router.push({path:'/dealerIndex'})
        }else if(num==7){
          this.$router.push({path:'/idCardList'})
        }

      },
//            点击去订单页面
      goOrder(num){
        this.$router.push({path:'/order',query:{num:num}})
      },
    },
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'width:100%;height:100%');
    },
    beforeDestroy () {
      document.querySelector('body').removeAttribute('style')
    }
  }
</script>

<style lang="scss" scoped>
  .personal{
    background: #fff;
    height:100%;
    .menu{
      align-items: center;
      justify-content: space-around;
      padding: .25rem 0;
      background: #fff;
      .list{
        display: flex;
        flex-direction: column;
        align-items: center;
        align-items: center;
        justify-content: center;
        width:1rem;
        height:.8rem;
        position: relative;
        img{
          width:.4rem;
          height:.4rem;
        }
        span{
          color:#999;
          font-size: .24rem;
        }
        .circular{
          min-width: .3rem;
          height: .3rem;
          text-align: center;
          line-height: .3rem;
          border-radius: 50%;
          font-size: .22rem;
          color:#fff;
          background: #fff;
          position: absolute;
          top:-0.1rem;
          right:0.1rem;
        }
      }
      .list-spe{
        position: absolute;
        top:-.7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-items: center;
        justify-content: center;
        .avatar {
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 50%;
          background: #fff;
          text-align: center;
          padding-top: .05rem;
          border:1px solid #dcdcdc;
          img {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
          }
        }
        span{
          display: inline-block;
          color:#333;
          font-size: .28rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width:1.6rem;
          text-align: center;
        }
      }
    }
    .options{
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 .25rem;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      align-items: center;
      justify-content: space-between;
      height:.92rem;
      .left-name{
        display: flex;
        flex-direction: row;
        align-items: center;
        align-items: center;
        img{
          width:.36rem;
          height:.36rem;
        }
        span{
          font-size: .26rem;
          margin-left: .3rem;
        }
      }
      .more{
        width:.12rem;
        height:.22rem;
      }
    }
  }
  .user-bg-box {
    width: 100%;
    background: #fff;
    display: block;
    height: 2.3rem;
    overflow: hidden;
  }

  .header-bg {
    width: 100%;
    height: 7.5rem;
    animation-name: shop;
    animation-duration: 18s;
    animation-iteration-count: infinite;
    filter: blur(5px);
    overflow: hidden;
    display: block;
    img{
      width:100%;
      height:100%;
    }
  }
  @-webkit-keyframes shop {
    0% {
      transform: translateY(-80px);
    }

    50% {
      transform: translateY(0px);
    }

    100% {
      transform: translateY(-80px);
    }
  }

  @keyframes shop {
    0% {
      transform: translateY(-80px);
    }

    50% {
      transform: translateY(0px);
    }

    100% {
      transform: translateY(-80px);
    }
  }
</style>
