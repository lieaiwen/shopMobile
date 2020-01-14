<template>
  <div class="address bg1">
    <div class="no-content" v-if="list.length<=0">
      <img :src="img+'no-address-list.png'" alt="">
      <!--<span>亲，您还没有收货列表</span>-->
    </div>
    <!--列表-->
    <div class="list">
      <div class="option" v-for="(item,index) in list" :key="index" @click.stop="urlBack(item.address_id)">
        <div class="name">{{item.name}} {{item.phone}}</div>
        <div class="ress">{{item.province}} {{item.city}} {{item.area}} {{item.address_detail}}</div>
        <div class="operation">
          <div class="choice">
            <!---->
            <img v-if="item.isDefault == 1 " :src="img+'choice.png'" alt="">
            <img @click.stop="choiceDefault(item.address_id)" v-if="item.isDefault == 0" :src="img+'nochoice.png'" alt="">
            <span @click.stop="choiceDefault(item.address_id)"  v-if="item.isDefault == 0">选择</span>
            <span v-if="item.isDefault === 1">默认</span>
          </div>
          <div class="two">
            <div class="t-op" @click.stop="edit(item.address_id)">
              <img :src="img+'edit.png'" alt="">
              <span>编辑</span>
            </div>
            <div class="t-op" @click.stop="deleteThis(item.address_id)" >
              <img :src="img+'delete.png'" alt="">
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--增加新地址-->
    <div class="btn-add" @click="goAdd()">增加新地址</div>
  </div>
</template>

<script>
  import {addressList, deleteSingleAddress, setDefaultAddress} from '../../api/getData' // deleteAddress,defalutAddress
  import {Toast,MessageBox} from 'mint-ui';
  export default {
    data() {
      return {
        listShow:false,
        list:[],
        img:'https://campaign.zaokol.com/wechat/redpeople/test/h5img/',
        from:'detail',
      }
    },
    created(){
      document.title = '收货地址';
      this.from = this.$route.query.from ? this.$route.query.from : 'detail'
    },
    mounted() {
      this.init();
    },
    methods: {
      init(){
        addressList().then(res=>{
           this.list = res.data;
        })
      },
//            点击删除某个地址
      deleteThis(id){
        let that = this;
        let req = { id }
        MessageBox.confirm('你确定要移除当前收货地址吗?').then(action => {
          deleteSingleAddress(req).then(res=>{
            if(res.code==200){
              that.init();
            }
            Toast({ message: res.msg, duration: 2000});
          })
        }).catch(err => {
          console.log(2);
        });
      },
//            点击选择默认地址
      choiceDefault(address_id){
        let req = {
            'address_id':address_id,
        };
        setDefaultAddress(req).then(res=>{
          if(res.code==200){
            Toast({message: '设置成功', duration: 2000});
            this.init();
            if(this.from == 'flow'){
              this.$router.go(-1)
            }
          }else{
            Toast({message: res.msg, duration: 2000});
          }
        })
      },
      // 点击返回订单详情页
      urlBack(id){
        this.choiceDefault(id);
      },
//            点击编辑地址
      edit(id){
        this.$router.push({path:'/addAddress',query:{id:id}})
      },
//            点击添加新的地址
      goAdd(){
        this.$router.push({path:'/addAddress'})
      }
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
  .address{
    min-height:100vh;
    background: $bgf2;
    padding-bottom: 1rem;
    .list{
      .option{
        padding: .25rem 0 0 0;
        margin-bottom: .2rem;
        background: $bgf;
        .name{
          font-size: $size34;
          padding: 0 .2rem 0 .25rem;
        }
        .ress{
          font-size: $size26;
          color:$color99;
          padding: 0 .2rem .25rem .25rem;
        }
        .operation{
          @include flex-row;
          align-items: center;
          justify-content: space-between;
          height:.82rem;
          border-top:1px solid #dcdcdc;
          padding: 0 .2rem 0 .25rem;
          .choice{
            @include flex-row;
            align-items: center;
            img{
              width:.5rem;
              height:.5rem;
            }
            span{
              font-size: $size30;
              margin-left: .14rem;
            }
          }
          .two{
            @include flex-row;
            align-items: center;
            .t-op{
              @include flex-row;
              align-items: center;
              img{
                width:.3rem;
                height:.3rem;
                margin:0 .1rem 0 .3rem;
              }
              span{
                color:$color66;
                font-size: $size30;
              }
            }
          }
        }
      }
    }
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
  }
  .btn-add{
    width:100%;
    height:.92rem;
    line-height: .92rem;
    text-align: center;
    color:$colorf;
    background: $bgm;
    font-size: $size30;
    position: fixed;
    left:0;
    bottom:0;
  }

</style>
