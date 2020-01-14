<template>
  <div class="service">
    <div class="bg"></div>
    <div class="list" v-for="(item,index) in dataList " :key="index">
      <div class="header flex-row" @click="select(index)">
        <div>{{item.title}}</div>
        <img :src="imgUrl + 'p-b.png'" v-if="item.select">
        <img :src="imgUrl + 'p-t.png'" v-else>
      </div>
      <div class="content" v-if="item.select">{{item.content}}</div>
    </div>
    <div class="mobile">
      <span>客服电话：<a href="tel:86-15000458803">15537120243</a></span>
      <span>客服微信：<a>liewenai</a></span>
    </div>
    <div style="width: 100%;height: 1rem"></div>
  </div>
</template>

<script>

  import {Toast} from 'mint-ui';
  export default {
    data() {
      return {
        imgUrl: this.GLOBAL,
        dataList: [
          {"title": "1.什么时候发货？",select:false,'content':'红人姿造局商城的发货时间正常是工作日48小时内发货，您可以在我的订单页中查看您的包裹是否已发货。'},
          {"title": "2.物流状态不更新怎么办？",select:false,'content':'一般物流信息到达派送网点才会更新，不同快递公司配送时效会有所区别，由于物流公司没有及时录入快递信息，可能没有最新的物流状态，希望您耐心等待一下，或者您可以直接联系快递公司查件。'},
          {"title": "3.如何修改订单地址和电话？",select:false,'content':'包裹发货前，您可以联系客服修改订单中的地址和电话。包裹签收前，您可以联系快递公司修改订地址/电话。'},
          {"title": "4.如何退款退货？",select:false,'content':'您的订单支付成功后未发货，您可以联系客服申请退款；\n' +
          '您的订单状态时发货中/已收到包裹，您在收到包裹后安排拒收或者寄回，货物退回后可联系客服申请退款。\n' +
          '*报销运费：产品原因退款将报销退回运费，您个人原因发生的退款将不报销退回运费。'},
          {"title": "5.退款到账时间？",select:false,'content':'申请退款成功后会在1个工作日内退回您的支付账户中。'},
          {"title": "6.怎么查看商品日期？",select:false,'content':'-日本美妆类商品\n' +
          '根据日本《药事法》的规定，对于那些“在通常的保管条件下3年以內会发生质变“的化妆品，才要求在商品上标明有效日期。一般未开封的基础护肤品保质期为3年，彩妆是5年，所以没有标日期。开封后请尽量在12个月内用完。\n' +
          '- 英语系（包括欧美、澳洲、新西兰等）国家\n' +
          '欧洲的洗护品、化妆品，一般不标注日期。根据欧洲护肤品统一条例规定：凡可使用30个月以上的商品，可不写保质期。所以欧洲很多包装上只有出厂批号没有标注日期。\n' +
          'MFD、MFG、MAN格式：意思都是制造/生产日期\n' +
          '例如，MFG 300517 08：02，表示生产日期是2017年05月30日，08：02\n' +
          '-韩国商品日期：日期格式是“年/月/日”，或“年/月”。也有的是沿用英语系国家的标注方式。\n' +
          '韩文：제조（制造/生产）\n' +
          '韩文：까지（截至）；기한（期限）\n' +
          '韩文：년 （年） 월 （月）\n' +
          '例如：2018년12월，表示是2018年12月前使用\n' +
          '英语：MFG（制造/生产）'},
          {"title": "7.支付方式有哪些？",select:false,'content':'红人姿造局商城支持支付宝（花呗）、微信支付。'},
          {"title": "8.红人优惠券如何领取？",select:false,'content':' 红人优惠券展示在商城首页，点击即可领取。'},
        ]
      }
    },
    created(){
      document.title = '联系客服'
    },
    mounted(){
    },
    methods: {
      select(index) {
        this.dataList[index].select = !this.dataList[index].select
      },
      go(){
        Toast({
          message: '提示',
          position: 'bottom',
          duration: 50000
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
  .service{
    .list {
      box-sizing: border-box;
      padding-left: .3rem;
      background: white;
      .header {
        height: 1.2rem;
        width: 100%;
        font-size: .32rem;
        line-height: 1.2rem;
        font-weight: bold;
        border-bottom: 1px solid #ececec;
        justify-content: space-between;
        img {
          margin-right: .3rem;
          width: .22rem;
          height: auto;
        }
      }
      .content {
        font-size: .32rem;
        border-bottom: .01rem solid #ececec;
        box-sizing: border-box;
        padding: .45rem .3rem .45rem .6rem;
        color: #666;
      }
    }
    .mobile {
      margin-top: .45rem;
      text-align: center;
      font-size: .25rem;
      color: #9da6af;
      span {
        margin: 0 .2rem;
        a {
          color: #498cff;
          text-decoration: underline;
        }
      }
    }
  }
</style>


