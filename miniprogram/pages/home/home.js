// pages/home/home.js
var that
const db = wx.cloud.database()
const app = getApp()
var modify = require('../../modules/modifyData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "全部",
        isActive: true
      },
      {
        id: 1,
        name: "美妆",
        isActive: false
      },
      {
        id: 2,
        name: "水果",
        isActive: false
      },
      {
        id: 3,
        name: "拼车",
        isActive: false
      },
      {
        id: 4,
        name: "其他",
        isActive: false
      }
    ],
    area: 0,
    date:new Date().toLocaleDateString(),
    loading: true
  },
  handleItemChange(e) {
    const {index} = e.detail
    const {tabs, infos, field_map} = this.data

    tabs.forEach(item => item.isActive = index == item.id ? true : false)
    this.setData({
      tabs,
      area: index
    })
    if (index === 0) {
      this.setData({
        infos_area: infos
      })
    }
    else {
      const infos_area = infos.filter(item => item.area === index)
      this.setData({
        infos_area
      })
    }
  },
  detail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    const app = getApp()
    const {field_map} = app.globalData
    this.setData({
      field_map,
    })
    // wx.requestSubscribeMessage({
    //   tmplIds: ['b84Y8uoHlHR9rDSl_dk0puI3TdVbBCZVGWF7CosPQ08']
    // })
    // .then(res => {
    //   console.log(res)
    //   return wx.cloud.callFunction({
    //     name: 'message1'
    //   })
    // })
    // .then(res => {
    //   console.log(res)
    // })
    // wx.cloud.callFunction({
    //   name: 'message1'
    // })
    // .then(res => {
    //   console.log(res)
    // })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const _this = this
    setTimeout(() => {
      _this.setData({
        loading: false
      })
    },1500)
  },
  clear(e){
    this.onShow()
  },

  selectResult: function (e) {
    console.log("搜索",e)
    const searchKey=e.detail.value
    const _ = db.command
    db.collection('post').where(
      _.or([
        {
          title:db.RegExp({
            regexp:searchKey,
            options:'i',
          }),
        },
        {
          content:db.RegExp({
            regexp:searchKey,
            options:'i',
          }),
        }
      ])).get()
      .then(res=>{
        const data = res.data
        for(let item of data) {
          modify.modifyData(item)
        }
        that.setData({
          infos: data,
          infos_area: data,
        })  
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    db.collection('post').orderBy('date', 'desc').where({
      state: true
    }).get()
    .then(res => {
      const data = res.data
      // console.log(data)
      // 修改日期格式
   
      for (var item of data){
        modify.modifyData(item)
      }
      console.log(data)
      this.setData({
        infos: data,
        infos_area: data,
      })  
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