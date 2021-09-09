async function loginCheck (route) {
  // const that = e
  const app = getApp()
  const db = wx.cloud.database()
  const hasUserInfo = app.globalData.hasUserInfo
  //若未登录
  if (hasUserInfo == false) {
    console.log('未登录')

    //获取缓存中数据
    //??若不同用户登录，会获取相同缓存吗
    const info = wx.getStorageSync('userInfo')

    if (info) {
      app.globalData.userInfo = info
      app.globalData.hasUserInfo = true
      return true
    }
    
    try {
      const res = await wx.getUserProfile({
        desc: '用于完善资料'
      })
      console.log(res)
      app.globalData.userInfo=res.userInfo
      app.globalData.hasUserInfo = true

      wx.setStorageSync(
        "userInfo",
        res.userInfo
      )
      await db.collection('user').doc(
        app.globalData.openid,
      ).set({
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          userInfo:res.userInfo,
          nickname: res.userInfo.nickName,
          avatar:res.userInfo.avatarUrl,
          collections: []
        },
      })
      return true
    }
    catch {
      return false
    }

  }
}

module.exports.loginCheck = loginCheck