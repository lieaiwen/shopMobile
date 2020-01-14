<template>
    <div class="order bg1">
        <div class="menu">
            <div :class="{active:type==1}" @click="menu(1)">全部</div>
            <div :class="{active:type==2}" @click="menu(2)">待付款</div>
            <div :class="{active:type==3}" @click="menu(3)">已付款</div>
        </div>
        <div class="no-content" v-if="list.length==0">
            <img :src="img+'no-order-list.png'" alt="">
            <!--<span>亲，暂无优惠券哦</span>-->
        </div>
        <!--列表-->
        <div class="content" v-if="list.length>0">
            <div class="list" v-for="(item,index) in list" :key="index">
                <div class="top">
                    <div class="one-row">
                        <span>商品列表</span>
                        <div class="add-zt">
                            <div class="flex-row" v-if="item.is_pay==0">未付款</div>
                          <div class="flex-row" v-else>已付款</div>
                        </div>

                    </div>
                    <div class="one-row two-row">
                        <span >订单号:{{item.order_number}}</span>
                        <span>{{item.create_time}}</span>
                    </div>
                </div>
                <div class="shop" @click="goDetail(item.order_id)">
                    <div class="shop-img" >
                        <div >
                        <img :src="item.goodsDetail.img" alt="">
                        </div>
                    </div>
                    <div class="number">
                        <span>共{{item.goods_num}}件</span>
                        <img :src="img+'more-right.png'" alt="">
                    </div>
                </div>
                <div class="many-expresion">
                    <div class="many">
                        <span>合计：</span>
                        <div>￥{{item.all_many}}</div>
                    </div>
                    <div class="expresion">
                        <div v-if="item.is_pay==1" >已付款</div>
                        <div v-else  @click="goPay(item.order_id)" class="active">去付款</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {orderList, payOrder} from '@/api/getData';
    import { Toast,MessageBox, Indicator} from 'mint-ui';

    export default {

        data() {
            return {
                list:[],//所有的数据都用这一个
                type:1,// 1全部 2 未付款 3已付款
                img:this.GLOBAL,
                erShow:false,
            }
        },
        created(){
           document.title = '我的订单';
            this.type = this.$route.query.num;
             this.init();
        },
        methods: {

            // 二维码的东西
            init(){
                Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
                let that = this;
                let req ={type:that.type};
                orderList(req).then(res=>{
                  if(res.code==200){
                    that.list = res.data;
                  }else{
                    Toast({ message: res.msg, duration: 2000 });
                  }
                  Indicator.close();
                })
            },

//            点击进入订单详情页
            goDetail(id){
                this.$router.push({path:'/orderDetail',query:{'id':id,type:this.type}})
            },
//            点击导航
            menu(num){
                this.type = num;
                this.init();
            },
//            点击付款
            goPay(id){
               this.$router.push({path:'/orderDetail',query:{'id':id,type:2}})
              return;
                let that = this;
                let req = {id:id,price:many};
                payOrder(req).then(res =>{
                  if(res.code==200){
                    Toast({ message: '支付成功，看看其他的商品！', duration: 1500});
                    setTimeout(function(){
                      that.init();
                    },1500)
                  }else{
                    Toast({ message: res.msg, duration: 2000});
                  }
                })
            },
//            点击取消订单
            cancelOrder(id){
                let that = this;
                MessageBox.confirm('确定取消订单?').then(action => {
                    resetOrder(id).then(res=>{
                        that.init();
                    })
                }).catch(err => {
                        console.log(2);
                });

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
    @import "../../assets/css/minxin";
    .order{
        min-height:100vh;
        background: $bgf2;
      .flex-row{
        display: flex;
        flex-direction: row;
        align-items: center;
      }
        .menu{
            @include flex-row;
            align-items: center;
            height:.8rem;
            width:100%;
            background: $bgf;
            border-bottom: 1px solid #dcdcdc;
            div{
                text-align: center;
                width:33.33%;
                height:.8rem;
                line-height: .8rem;
                font-size: $size28;
                color:$color66;
            }
            .active{
                color:$colorm;
                border-bottom: 2px solid $colorm;
            }
        }
        /*没有的时候*/
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
        .content{
            overflow: hidden;
            .list{
                background: $bgf;
                margin-top: .2rem;
            }
            .top{
                height:1.4rem;
                padding: 0 .3rem;
                overflow: hidden;
                border-bottom: 1px solid #dcdcdc;
                .one-row{
                    @include flex-row;
                    align-items: center;
                    justify-content: space-between;
                    margin-top:.2rem;
                    span{
                        font-size: $size30;
                        span{
                            font-size: $size30;
                            font-weight: bold;
                            color:#ff005c;
                        }
                    }
                    .add-zt{
                        @include flex-row;
                        align-items: center;
                    }
                    div{
                        font-size: $size30;
                        color:$colorm;
                    }
                }
                .two-row{
                    span{
                        font-size: $size24;
                        color:$color66;
                    }
                }
            }
            .shop{
                @include flex-row;
                align-items: center;
                justify-content: space-between;
                padding: 0.1rem .3rem .1rem .25rem;
                border-bottom: 1px solid #dcdcdc;
                .shop-img{
                    @include flex-row;
                    width:5.5rem;
                    height:1.6rem;
                    overflow: scroll;
                    img{
                        width:1.6rem;
                        height:1.6rem;
                        margin-right: .1rem;
                    }
                }
                .number{
                    @include flex-row;
                    align-items: center;
                    span{
                        font-size: $size28;
                        color:$color66;
                        margin-right:3px;
                    }
                    img{
                        width:0.12rem;
                        height:.22rem;
                    }
                }
            }
            .many-expresion{
                @include flex-row;
                align-items: center;
                justify-content: space-between;
                padding: 0 .25rem;
                height:.9rem;
                .many{
                    @include flex-row;
                    align-items: center;
                    span{
                        font-size: $size30;
                        color:$color66;
                    }
                    div{
                        font-size: $size30;
                        color:$colorm;
                    }
                }
                .expresion{
                    @include flex-row;
                    align-items: center;
                    div{
                        padding: 0.06rem 0.2rem;
                        border-radius: .06rem;
                        border:1px solid #dcdcdc;
                        font-size: $size28;
                        margin-left:.1rem;
                    }
                    .ex-hx{
                        border:1px solid $colorm;
                        color:$colorm;
                    }
                    .active{
                        border:1px solid $colorm;
                        color:$colorm;
                    }
                }
            }
        }
    }
</style>
