//Action 类似于 mutation，不同在于：
// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
// 记得 mutation 必须同步执行这个限制么？Action 就不受约束
export default {
  buyVip({commit}, e){
    return new Promise((resolve,reject)=>{
      commit('setMemberInfo',{
        userStatus:e.userStatus,
        vipLevel:e.vipLevel
      })
    })
  },
  otherMethods({commit,state}){

  }
}
