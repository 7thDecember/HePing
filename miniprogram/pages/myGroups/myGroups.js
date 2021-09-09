// miniprogram/pages/myGroups/myGroups.js
const db = wx.cloud.database()
const _ = db.command
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    wx.setNavigationBarTitle({
      title: '我加入的',
    })
    var modify = require('../../modules/modifyData.js')
    var my_id=getApp().globalData.openid
    
    db.collection('post').where({
      members: _.elemMatch({
        openid: my_id,
      }),
    }).get()
    .then(res => {
      var data=res.data
      for (var item of data){
        modify.modifyData(item)
      }
      console.log(data)
      that.setData({
        infos:data
      })
    })
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