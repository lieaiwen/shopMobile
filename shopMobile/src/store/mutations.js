// 相当于方法器
export default {
  login(state,v){
    state.userInfo=v;
    console.log(state)
  },
  setMemberInfo(state,v){
    state.userStatus = v.userStatus;
    state.vipLevel = v.vipLevel
  }
}
