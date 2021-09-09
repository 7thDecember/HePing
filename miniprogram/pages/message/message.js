// miniprogram/pages/my/message/message.js
//私信页面
const app = getApp() 
var db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo:null,
    logged: false,
    takeSession: false,
    requestResult: '',
    //chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: [],
    //chatRoomGroupName: 'Alan',

    // functions for used in chatroom components
    // onGetUserProfile: null,
    // getOpenID: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设标题栏
    wx.setNavigationBarTitle({
      title: options.nickname,
    })

    this.setData({
      chatRoomGroupId: options.group_id,
      userInfo: app.globalData.userInfo,
      friendid:options.friend_id,
    })
    db.collection('chatgroup').doc(options.group_id).update({
      // data 传入需要局部更新的数据
      data: {
        [getApp().globalData.openid]:{
          unread: 0,
        }
      },
    })

    // this.setData({
    //   onGetUserProfile: this.getUserProfile,
    //   getOpenID: this.getOpenID,
    // })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          // this.setData({
          //   containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          // })
        }
      },
    })  
  },
  // getOpenID: async function() {
  //   if (this.openid) {
  //     return this.openid
  //   }
  //   const { result } = await wx.cloud.callFunction({
  //     name: 'login',
  //   })

  //   return result.openid
  // },

  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  //   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   var that=this
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       this.setData({
  //         avatarUrl: res.userInfo.avatarUrl,
  //         userInfo: res.userInfo,
  //       })
  //       console.log(res.userInfo)
  //     }
  //   })
  // },

  

  onShareAppMessage() {
    return {
      title: '即时通信 Demo',
      path: '/pages/im/room/room',
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})