<template>
  <div class="classify">
    <div class="input-main">
      <div class="input-bor flex-row" @click='goSeek()'>
        <i class="iconfont icon-sousuo"></i>
        <span> 搜索商品</span>
      </div>
    </div>

    <!-- 分类样式：一级分类(小图) 10 -->
    <div class="classify-2 scroll-y" >
      <div v-for="(item, index) in list2" :key="index" class="listSingle" @click="goList(item.category_title)">
        <img  :src="item.logo_url">
        <div class="name">{{item.category_title}}</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import { listCategory } from '@/api/getData'
  export default {
    data() {
      return {
        imgUrl: this.GLOBAL,
        list2:[],
      }
    },
    created(){
      this.init()
    },
    mounted(){
      document.title = '全部分类'
    },
    methods: {
      init(){
        listCategory().then(res => {
          console.log(res)
          this.list2 = res.data;
        })
      },
      goSeek() {
        this.$router.push('/categoryList')
      },
      go(){
        Toast({
          message: '提示',
          position: 'bottom',
          duration: 50000
        });
      },
      goList(title) {
        this.$router.push({path:'/categoryList',query:{title:title}})
      },
      tabS(item) {
        console.log(item)
        for (let i = 0; i < this.list3.length; i++) {
          this.list3[i].select = false
        }
        this.list3Childe = item.child
        item.select = true
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
  .classify{
    height:100vh;
    box-sizing: border-box;
    .input-main {
      width: 100%;
      height: .94rem;
      background: $bgf;
      padding:.13rem .13rem .18rem .13rem;
      box-sizing: border-box;
      color: #666;
      .input-bor {
        width:100%;
        font-size: $size30;
        position:relative;
        background:#f7f7f7;
        height: .63rem;
        border-radius: .32rem;
        text-align: center;
        justify-content: center;
      }
    }
    .classify-2 {
      width: 100%;
      position: absolute;
      left: 0;
      top: .94rem;
      padding:0 .2rem .2rem .2rem;
      box-sizing:border-box;
      .listSingle {
        float:left;
        padding: .25rem;
        width: 33.3333%;
        text-align:center;
        box-sizing:border-box;
        img {
          width: 1.87rem;
          height: 1.87rem;
        }
      }
    }
  }


</style>
