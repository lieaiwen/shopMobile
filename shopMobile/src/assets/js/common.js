export const imgUrl = "https://campaign.zaokol.com/wechat/redpeople/test/h5img/" // 正式

//1.0手机号码的正则
export function validateMobile(pone) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(pone)) {
    return false;
  } else {
    return true;
  }
}
