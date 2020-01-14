<template>
    <div class="login">
        <div class="title">登录</div>
        <div class="access">
          <img :src="this.GLOBAL+'phone.png'" alt="">
          <input type="tel" placeholder="请输入手机号" v-model="phone" @blur="blur()" @focus="focus(1)">
        </div>
        <div class="access access-last">
          <img :src="this.GLOBAL+'yzm.png'" alt="">
          <input class="last" type="tel" placeholder="请输入验证码" v-model="code" @blur="blur()" @focus="focus(2)">
          <span v-if="send" @click="needCode()">发送验证码</span>
          <span v-else>{{time}}s</span>
        </div>
        <div class="btn" @click="login()">
            <mt-button type="primary" size="normal">登录</mt-button>
        </div>
    </div>
</template>

<script>
    import {sendCode, mobileLogin} from '../../api/getData';
    import {validateMobile} from '@/assets/js/common';
    import { Toast ,MessageBox} from 'mint-ui';
    import store from '../../store/index'
    export default {
        data() {
            return {
                phone:'',
                code:'',
                time:60,
                send:true,
                loginNum:1,//1授权过来的，
                redirect:'',//
            }
        },
        created(){
          // 先获取参数如果有得话，就登录成功 跳转回去，如果没有的话就跳转到首页
         this.redirect =  this.$route.query.redirect
        },
        mounted() {

        },
        methods: {
            blur() {
               window.scroll(0,0);
            },
            focus() {
              window.scroll(0,0);
            },
//            获取验证码
            needCode(){
                if(!validateMobile(this.phone)){
                    Toast({message: '请输入正确的手机号码', duration: 2000 });
                }else{
                        let that = this;
                        that.send= false;
                        that.time = 60;
                        let times = that.time;
                    let name = setInterval(function () {
                        that.time =  times--
                        if (times == -1) {
                            clearInterval(name);
                            that.send=true
                        }
                    }, 1000);
                    let req = {
                      phone:that.phone
                    };
                  sendCode(req).then((res)=>{
                        if (res.code == 200) {
                            MessageBox('提示', res.data);
                        } else {
                            Toast({ message: res.msg, duration: 2000 });
                        }
                    })
                }
            },
//          点击登录
            login(){
                let that = this;
                if(!validateMobile(that.phone)){
                    Toast({ message: '请输入正确的手机号码', duration: 2000});
                    return
                }else if(that.code.length!=6){
                    Toast({message: '请输入正确的验证码', duration: 2000 });
                    return
                }else{
                  let req = { phone: that.phone, code:that.code }
                  mobileLogin(req).then(res=>{
                        console.log(res) // 用户的基本信息
                        if(res.code==200){
                          store.commit('login',{
                            id:res.data.id,
                            token:res.data.token,
                            phone:res.data.phone,
                            avatar:res.data.avatar,
                            consume:res.data.consume,
                          })
                          localStorage.setItem('token',res.data.token)
                          this.$router.push({path:'/index' })
                            if(that.redirect){ //存在就 返回不存在就进入首页
                              this.$router.go(-2);
                            }else{
                              this.$router.push({path:'/index' })
                            }
                        } else {
                            Toast({message: res.msg, duration: 2000});
                        }
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minxin";
    .login{
        padding: 0 .25rem;
      height: 100vh;
      overflow: hidden;
        .title{
            margin:1.8rem 0 1.6rem 0;
            text-align: center;
            font-size: .4rem;
        }
        .access{
            margin-bottom: .3rem;
            height:.88rem;
           border:1px solid #aaa;
            @include flex-row;
            align-items: center;
            img{
                width:.4rem;
                height:.4rem;
                margin:0 .14rem;
            }
            input{
                // border:1px solid red;
                width:100%;
                height:100%;
            }
            input.last{

            }
            span{
                display: inline-block;
                width:2.4rem;
                height:.88rem;
                color:#fff;
                background: #ff005c;
                text-align: center;
                line-height: .88rem;
                border-radius: .04rem;
                font-size: .26rem;
                margin-right:-1px;
            }
        }
        .access-last{
            input{
                width:4rem;
            }
        }
        .btn{
            margin-top:1rem;
        }
        .mint-button--primary{
            width:100%;
            background: #ff005c;
        }
    }
</style>
