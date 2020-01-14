<template>
    <div class="add-address">
        <div class="list">
            <span>收货人</span>
            <input type="text" placeholder="请输入收货人姓名" v-model="name">
        </div>
        <div class="list">
            <span>手机号</span>
            <input type="number" placeholder="请输入收货人联系电话" v-model="tel">
        </div>
        <div class="kong"></div>
        <div class="list" @click="choiceAddress()">
            <span>所在地区</span>
            <!--<input type="number" placeholder="请选择省、市、区"  v-model="">-->
            <div :class="{active:active==2}">{{region}}</div>
        </div>
        <div class="list">
            <span>详细地址</span>
            <input type="text" placeholder="请输入街道小区楼层" v-model="addressDetail">
        </div>
        <div class="keep" @click="keep()">保存</div>
        <div v-if="addressShow">
            <div class="address-picker" >
                <!---->
                <p>
                    <span @click="choiceAddress()">取消</span>
                    <span @click="addressSure()">确定</span>
                </p>
                <mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
                <!--<p>地址3级联动：{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</p>-->
            </div>
        </div>
    </div>
</template>

<script>
    import { Picker,Toast } from 'mint-ui';
    import {addAddress,editAddress, singleAddress} from '../../api/getData'; // oneAddressDetail,editAddress
    import {validateMobile} from '../../assets/js/common';
    import myaddress from '../../config/pca.json'
    export default {
        data() {
            return {
                myAddressSlots: [
                    {
                        flex: 1,
                        defaultIndex: 0,
                        values: Object.keys(myaddress),  //省份数组
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: ['北京市'],
                        className: 'slot3',
                        textAlign: 'center'
                    },
                    {
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    },
                    {
                        flex: 1,
                        values: ["东城区","西城区","朝阳区","丰台区","石景山区","海淀区","门头沟区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云区","延庆区"],
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                myAddressProvince:'',
                myAddressCity:'',
                myAddresscounty:'',
                addressShow:false,
                region:'请选择省、市、区',//地址
                active:1,
                addressDetail:'',
                name:'',
                tel:'',
                user_id:3, // 用户id
                address_id:0,// 编辑的时候存在
            }
        },
      created(){
          document.title = '新增收货地址';
          this.address_id = this.$route.query.id ? this.$route.query.id : 0;
          if(this.address_id>0){
            this.init();
          }
      },
        methods: {
            init(){
                let that = this;
                let req = {'id': that.address_id}
                singleAddress(req).then(res=>{
                      let detail = res.data;
                      that.name = detail.name;
                      that.tel = detail.phone;
                      that.addressDetail = detail.address_detail;
                      that.region = [detail.province,detail.city,detail.area].join('-');
                  })
                  that.active = 2;
              },
//            点击保存
            validation() {
                if (this.name === '') {
                    Toast({
                        message: '收件人不能为空',
                        duration: 2000
                    });
                    return false;
                }
                if (this.tel.length < 1) {
                    Toast({
                        message: '手机号不能为空',
                        duration: 2000
                    });
                    return false;
                }
                if (this.tel.length !== 11) {
                    Toast({
                        message: '手机号长度有误',
                        duration: 2000
                    });
                    return false;
                }
                if(!validateMobile(this.tel)) {
                    Toast({
                        message: '请输入正确的手机号码',
                        duration: 2000
                    });
                    return false
                }
                if (this.region&&this.active!=2) {
                    Toast({
                        message: '省市区不能空',
                        duration: 2000
                    });
                    return false;
                }
                if (this.addressDetail === '') {
                    Toast({
                        message: '详细地址不能为空',
                        duration: 2000
                    });
                    return false;
                }
                return true;
            },
            keep(){
            // 编辑接口和新增的情况是不一样的
                let address = this.region.split('-');
                let req = { //需要的基本信息
                    id:this.user_id,
                    name:this.name,
                    province: address[0],
                    city: address[1],
                    area: address[2],
                    address_detail:this.addressDetail,
                    phone:this.tel,
                  };
                if(this.validation()){
                    if(this.address_id>0){
                      req.address_id = this.address_id
                        editAddress(req).then(res=>{
                          if(res.code==200){ window.history.go(-1) }
                          Toast({message: res.msg, duration: 2000 });
                        })
                    }else{
                        addAddress(req).then(res=>{
                            if(res.code==200){
                                window.history.go(-1)
                            }
                            Toast({message: res.msg, duration: 2000 });
                        })
                    }
                }

            },
//            点击确定选择地址
            addressSure(){
                this.region = this.myAddressProvince+'-'+this.myAddressCity+'-'+this.myAddresscounty;
                this.active=2;
                this.addressShow = !this.addressShow;
            },
            // 点击选择省市区
            choiceAddress(){
                this.addressShow = !this.addressShow;
//                this.myAddressSlots[0].defaultIndex = 0
            },
//            获取地区
            onMyAddressChange(picker, values) {
//                console.log(picker)
//                console.log(values)
//                if(myaddress[values[0]]){  //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
                    picker.setSlotValues(1,Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
                    picker.setSlotValues(2,myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
                    this.myAddressProvince = values[0];
                    this.myAddressCity = values[1];
                    this.myAddresscounty = values[2];
//                }
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
    .add-address{
        height:100%;
        /*<!--background: $bgf2;-->*/
        .mint-toast{
            color:red;
        }
        .list{
            height:1rem;
            @include flex-row;
            align-items: center;
            border-bottom: 1px solid #dcdcdc;
            background: $bgf;
            padding: 0 0 0 .25rem;
            .active{
                color:#000;
            }
            div{
                color:$color66;
                width: 100%;
                height:100%;
                line-height: 1rem;
                font-size: $size28;
            }
            span{
                display: inline-block;
                width: 1.7rem;
                font-size: $size28;
            }
            input{
                width: 100%;
                height:100%;
                background: $bgf;
                font-size: $size28;
            }
        }
        .keep{
            width:7rem;
            margin:.8rem 0 0 .25rem;
            border-radius: 4px;
            height:.92rem;
            line-height: .92rem;
            text-align: center;
            color:$colorf;
            background: $bgm;
            font-size: $size30;
        }
    }
    .address-picker{
        position: fixed;
        left:0;
        bottom:0;
        width:100%;
        background: $bgf;
        p{
            @include flex-row;
            align-items: center;
            padding: 0 .25rem;
            justify-content: space-between;
            height:.8rem;
            line-height: .8rem;
            border-bottom: 1px solid #dcdcdc;
            span{
                font-size: $size32;
            }
            span:nth-child(2){
                color:#1aade9;
            }
        }
    }
</style>
