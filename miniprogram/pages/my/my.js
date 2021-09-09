// pages/my/my.js
const login = require('../../modules/login')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onTabItemTap(item) {
    const res = await login.loginCheck()
    if (res == false) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
    else {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      })
    }
  },
  onLoad: function (options) {

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
  goToMyMessages(e){
    wx.navigateTo({
      url: '/pages/myMessage/myMessages',
      fail: function(res) {
        console.log(res)
      },
    })    
  },
  goToMyCollections(e){
    wx.navigateTo({
      url: '/pages/myCollection/myCollection',
      fail: function(res) {
        console.log(res)
      },
    })    
  },
  goToMyReplys(e){
    wx.navigateTo({
      url: '/pages/myReplys/myReplys',
      fail: function(res) {
        console.log(res)
      },
    })    
  },
  goToMyGroups(e){
    wx.navigateTo({
      url: '/pages/myGroups/myGroups',
      fail: function(res) {
        console.log(res)
      },
    })    
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