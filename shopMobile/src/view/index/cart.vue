<template>
  <div class="shop-cart">
    <div class="no-content" v-if="list.length==0">
      <img :src="img+'no-order-list.png'" alt="">
      <span @click="goIndex()">去购物</span>
    </div>
    <div v-if="list.length>0" class="operation" @click="editList()">{{edit}}</div>
    <div class="list" v-if="list.length>0">
      <div class="option" v-for="(item,index) in list" :key="index">
        <div class="choice" @click="readyBuy(index)">
          <img v-if="!item.checked" :src="img+'nochoice.png'" alt="">
          <img v-if="item.checked" :src="img+'choice.png'" alt="">
        </div>
        <div class="ban">
          <img :src="item.goodsDetail.img" alt="">
        </div>
        <div class="explain">
          <div class="conent">{{item.goodsDetail.shop_name}}</div>
          <div class="rule">{{item.goodsDetail.category}}</div>
          <div class="last">
            <span>￥{{item.goodsDetail.price}}</span>
            <div class="number">
              <div @click="reduceNum(item.cart_id,index)" :class="['reduce',{'no-reduce':item.goods_num==1}]">-</div>
              <input type="number" disabled v-model="item.goods_num">
              <div @click="addNum(item.cart_id,index)" class="reduce">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--全选-->
    <div v-if="list.length>0" class="footer">
      <div class="left">
        <div class="all-many" v-if="edit=='编辑'">合计：￥{{totalMany}}</div>
      </div>
      <div class="many-btn" @click="operation()">{{btnEdit}}</div>
    </div>
  </div>
</template>

<script>
import { CartList, changeCartShopNum, deleteSingleShop, downOrder} from '@/api/getData';
import { Toast,MessageBox, Indicator} from 'mint-ui';
import { imgUrl } from '@/assets/js/common'
	export default {
		data() {
			return {
        edit:'编辑',
        list:[],//列表
        allChoice:false,//全选按钮
        btnEdit:'去结算',
        totalMany:'0.00',
        img:imgUrl,
      }
		},
    created(){
      document.title = '购物车'
		  this.init();
    },
		mounted() {
		},
		methods: {
      init(){
        let that = this;
        CartList().then(res => {
          let a = res.data;
          a.forEach((item)=>{
            that.$set(item,'checked',false)
          })
          that.list = a;
        })
      },
//点击去首页购物
      goIndex(){
        this.$router.replace('/categoryList')
      },
//            点击选中这个商品
      readyBuy(index){
        let a = this.list;
        let that = this;
        a.forEach((item,i)=>{
          if(i==index){
            this.$set(item,'checked',true)
          }else{
            this.$set(item,'checked',false)
          }
        })
        that.list = a;
        this.updateTotalPrice();
      },
//            点击全选
      choiceAll(){
        if(this.allChoice){
          this.list.forEach((item)=>{
            item.checked=false
          })
        }else{
          this.list.forEach((item)=>{
            item.checked=true
          })
        }
        this.allChoice = !this.allChoice;
        this.updateTotalPrice();

      },
//            点击编辑列表
      editList(){
        if(this.edit=="编辑"){
          this.edit = "完成";
          this.btnEdit = "删除";
        }else{
          this.edit = "编辑";
          this.btnEdit = "去结算";
        }
      },
//            获取选中的goods_sku_id
      getSkuId(num){
        let a = [];
        this.list.forEach((item,index)=>{
          if(item.checked){
            if(num){
              let c = item.goods_id
              a.push(c)
            }else{
              let c = item.cart_id
              a.push(c)
            }

            let d = item.goods_num
            a.push(d)
          }
        })
        return a;
      },
//            点击按钮的事件
      operation(){
        let that = this;
        let num = that.getSkuId()[0];
        if(that.btnEdit == "去结算"){
          let num = that.getSkuId(1)[0];
          if(num>0){
            console.log('跳转到结算页面')
            // 这个时候已经生成订单了，只剩下的就是支付了
            let req = {
              goods_id:num,
              goods_num:that.getSkuId()[1]
            }
            downOrder(req).then(res => {
              if(res.code==200){ // 下单成功 跳转到详情页 付款
                that.$router.push({path:'/orderDetail',query:{'id':res.data,'from':'cart'}})
              }else{
                Toast({message: res.msg, position: 'middle', duration: 2000});
              }
            })
          }else{
            MessageBox.alert('你还没有选择商品')
          }
        }else{

          if(num>0){
            let req = {id:num}
            MessageBox.confirm('你确定要移除当前选择商品吗?').then(action => {
              deleteSingleShop(req).then(res=>{
                if(res.code==200){
                  Toast({message: res.msg, duration: 1500});
                  that.init();
                  that.updateTotalPrice();
                }else{
                  Toast({message: res.msg, duration: 2000});
                }
              })
            }).catch(err => {
              console.log(2);
            });

          }else{
            MessageBox.alert('你还没有选择商品')
          }


        }
      },
//            点击减少商品
      reduceNum(id,index){
        let that = this;
        if(that.list[index].goods_num>1){
          let req = { id:id, type:'reduce' }
          changeCartShopNum(req).then(res=>{
            if(res.code==200){
              that.list[index].goods_num--;
              that.updateTotalPrice();
            }else{
              Toast({message: res.msg, duration: 2000 });
            }
          })
        }
      },
//            点击添加商品
      addNum(id,index){
        let that = this;
        let req = { id:id, type:'add' }
        changeCartShopNum(req).then(res=>{
          if(res.code==200){
            that.list[index].goods_num++;
            that.updateTotalPrice();
          }else{
            Toast({message: res.msg, duration: 2000 });
          }
        })
      },
//            更新结算总额
      updateTotalPrice(){
        this.totalMany = 0.00;
        let a = this.totalMany;
        this.list.forEach((item)=>{
          if(item.checked){
            a += item.goods_num*item.goodsDetail.price;
          }
        })
        this.totalMany = a.toFixed(2);
      },



    },
	}
</script>

<style scoped lang="scss">
  @import "../../assets/css/minxin";
  .shop-cart{
    width:100%;
    min-height:100vh;
    /*<!--background: $bgf7;-->*/
    padding-bottom: 2.2rem;
    .operation{
      padding: .15rem;
      text-align: right;
      font-size: $size30;
    }
    .option{
      @include flex-row;
      justify-content: space-around;
      align-items: center;
      padding: .26rem .2rem;
      border-bottom: 1px solid #eee;
      background: $bgf;
      .choice{
        /*width:.5rem;*/
        /*height:.5rem;*/
        img{
          width:.52rem;
          height:.5rem;
        }
      }
      .ban{
        width:1.84rem;
        height:1.84rem;
        img{
          width:100%;
          height:100%;
        }
      }
      .explain{
        width:4.3rem;
        .conent{
          display:-webkit-box;
          word-break:break-all;
          text-overflow:ellipsis;
          overflow:hidden;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
          font-size: $size30;
          min-height:.8rem;
        }
        .rule{
          font-size: $size24;
          color:$color99;
          margin-bottom: .24rem;
        }
      }
      .last{
        @include flex-row;
        justify-content: space-between;
        align-items: center;
        span{
          font-size: $size32;
          color:$colorm;
        }
        .number{
          @include flex-row;
          align-items: center;
          input{
            width:.6rem;
            height:.52rem;
            border-top:1px solid #dcdcdc;
            border-bottom:1px solid #dcdcdc;
            background: $bgf;
            text-align: center;
            border-radius: 0;
            box-sizing: border-box;
          }
          .reduce{
            width:.6rem;
            height:.52rem;
            font-size: .4rem;
            text-align: center;
            line-height: .48rem;
            border:1px solid #dcdcdc;
            box-sizing: border-box;
            border-radius: unset;
            img{
              width:100%;
              height:100%;
            }
          }
          .no-reduce{
            background: #f2f2f2;
            color:$color99;
          }
          .add{

          }
        }
      }
    }
    .footer{
      @include flex-row;
      align-items: center;
      justify-content: space-between;
      height:1rem;
      border-top:1px solid #dcdcdc;
      padding-left: .2rem;
      background: $bgf;
      position: fixed;
      bottom:1.1rem;
      left:0;
      width:100%;

      .left {
        @include flex-row;
        align-items: center;
        .all-choice {
          @include flex-row;
          align-items: center;
          img {
            width: .5rem;
            height: .5rem;
          }
          span {
            font-size: $size30;
            margin: 0 .1rem;
          }
        }
        .all-many {
          font-size: $size30;
          color: $colorm;
        }
      }
      .many-btn{
        width:1.6rem;
        text-align: center;
        line-height: 1rem;
        font-size: $size30;
        background: $bgm;
        color:$bgf;
      }
    }
    /*没有的时候*/
    .no-content{
      @include flex-col;
      align-items: center;
      justify-content: center;
      padding-top: 2rem;
      img{
        height:2.6rem;
        width:3rem;
      }
      span{
        display: inline-block;
        background:#fff;
        border:1px solid #ccc;
        height:.6rem;
        line-height:.6rem;
        font-size:$size28;
        width:2rem;
        margin:0 auto;
        border-radius:.05rem;
        text-align:center;
        color:#777;
        margin-top:.4rem;
      }
    }
  }
</style>
