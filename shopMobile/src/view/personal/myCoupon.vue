<template>
    <div class="my-coupon bg1">
        <div class="menu">
            <div :class="{active:which==1}" @click="menu(1)">未使用</div>
            <div :class="{active:which==2}" @click="menu(2)">已使用</div>
            <!--<div :class="{active:which==3}" @click="menu(3)">已过期</div>-->
        </div>
        <div class="no-content" v-if="list.length==0">
            <img :src="this.GLOBAL+'no-count-list.png'" alt="">
        </div>
        <div class="content" v-if="list.length>0">
            <div :class="['list',which==2 ? 't-lingqu':'' ]" v-for="(item,index) in list" :key="index">
                <div class="left">
                    <div class="many">
                        <span>￥</span>
                        <span>{{item.coupon_detail.reduce_price}}</span>
                    </div>
                    <div class="can-use">满{{item.coupon_detail.base_price}}元可用</div>
                </div>
                <div class="shu">
                    <div class="top-y"></div>
                    <div class="bottom-y"></div>
                </div>
                <div class="right">
                    <div class="r-explain">{{'满减卷'}}</div>
                    <div class="time">{{item.coupon_detail.over_time}}</div>
                </div>
                <!--满减卷-->
                <div :class="['man-jian', item.is_use==0 ?'man-nl':'man-l']">满减卷</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {singleCoupon} from '@/api/getData';
    import { Toast } from 'mint-ui';
    export default {
        data() {
          return {
            list:[],
            which:1,
            type:'1',//
          }
        },
      created(){
        document.title = '我的优惠券';
        this.init();
      },
        methods: {
            init(){
              let that = this;
              let req = {type: that.type};
              singleCoupon(req).then((res)=>{
                that.list = res.data;
              })
            },
            //            点击导航
            menu(num){
                this.which = num;
                if(num==1){
                    this.type = '1'
                }else if(num==2){
                    this.type = "2"
                }else{
                    this.type = "3"
                }
                this.init();
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
    .my-coupon{
        min-height:100vh;
        background: $bgf2;
        .menu{
            @include flex-row;
            align-items: center;
            height:.8rem;
            width:100%;
            background: $bgf;
            border-bottom: 1px solid #dcdcdc;
            div{
                text-align: center;
                width:50%;//33.33
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
        /*优惠券*/
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
            padding: .2rem;
            .list{
                background: linear-gradient(to right,#fcb455, #f9c758);
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

                    font-size:$size22;
                    text-align:center;
                    color:#ffffff;
                    transform:rotate(45deg);
                    transform-origin:0.64rem 0.64rem;
                }
                .man-l{
                    background: #9e9e9e;
                }
                .man-nl{
                    background:#a771ff;
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
        }
    }
</style>
