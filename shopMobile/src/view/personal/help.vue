<template>
    <div class="help">
        <div class="list"  >
            <div class="header">
             {{detail.company_name}}
            </div>
            <div class="content flex-row">
              <span>公司地址：</span>
              <p>{{detail.address}}</p>
             </div>
            <div class="content flex-row">
              <span>主要内容：</span>
              <p>{{detail.company_describe}}</p>
             </div>
          <div class="content flex-row">
            <span>联系方式：</span>
            <p>{{detail.phone}}</p>
          </div>
          <div class="content flex-row">
            <span>更新时间：</span>
            <p>{{detail.update_time}}</p>
          </div>
        </div>
    </div>
</template>

<script>
  import {companyMessage} from '@/api/getData'
    export default {
        data() {
            return {
              detail:{},
            }
        },
        created(){
          this.init();
        },
        mounted() {
            document.title = '公司简介';
//            this.init();
        },
        methods: {
            init(){
              companyMessage().then( res =>{
                    this.detail = res.data;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/minxin";
    .help{
        .list{
            padding: 10px;
            .header{
                font-size: $size32;
                padding-bottom: .1rem;
                align-items: flex-start;
              text-align: center;
            }
          span{
            width:30%;text-align: right;
            display: inline-block;
          }
          p{
            width:70%;
          }
            .content{
                font-size: $size26;
                color:$color66;
              align-items: flex-start;
              padding: 20px;
            }
        }
    }
</style>
