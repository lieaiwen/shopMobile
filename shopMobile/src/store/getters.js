// 相当于过滤器
export default {
  memberInfo(state){
    switch(state.userStatus){
      case 0:
        return '普通会员'
        break
      case 1:
        return 'vip会员'
        break
      case 2:
        return `高级会员V${state.userStatus}`
        break
      default:
        return '普通会员'
    }
  }
}
