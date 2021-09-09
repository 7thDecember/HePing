// miniprogram/pages/myCollection/myCollection.js
const db = wx.cloud.database()
const app = getApp()
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
    const openid = app.globalData.openid
    wx.setNavigationBarTitle({
      title: '我的收藏',
    })
    var modify = require('../../modules/modifyData.js')
    var collections=[]
    var infos=[]
    db.collection('user').doc(openid).get().then(res => {
      // res.data 包含该记录的数据
      collections=res.data.collections

    })
    .then(res => {
      let infos_p=[]
      for(let item of collections) {
        infos_p[infos.length] = db.collection('post').doc(item).get().then(res => {
          var data=res.data
          modify.modifyData(data)
          infos[infos.length]=data
        })
        .catch(err => {
          db.collection('user').doc(openid).update({
            data: {
              collections: _.pull(item)
            }
          })
        })
      }
      return Promise.all(infos_p)
    })
    .then(res => {
      console.log(infos)
      that.setData({
        infos:infos
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