// miniprogram/pages/my/test/test.js
//仿头像点击进私信页面
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
var that
var login = require('../../../modules/login.js')
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    users:[],
    openId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this

    db.collection('user').get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log('db: get usersInfo success',res.data)
        //console.log( that.data.users)
        that.setData({
          users:res.data,
          //openId:app.globalData.openid,
        })
      }
    })
    console.log('users:', this.data.users)

    
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
  getUnread(){
    db.collection('unread_count').where({
      userId:this.data.openId,
      count:_.neq(0)
    })
    .get()
    .then(res=>{
      console.log('get unread count:',res)
      if(res.data.length>0){
        //未完成
      }
    })
  },
  goToChatroom(e){
    login.loginCheck('test')
    console.log('调用loginCheck',this.data.module)
    let friend_id= e.currentTarget.dataset.openid
    let friend_name= e.currentTarget.dataset.name
    let my_id=app.globalData.openid
    console.log('my_id:',my_id)
    console.log('friend_id:',friend_id)
    console.log('friend_name:',friend_name)
    const _ = db.command
    
    db.collection('chatgroup').where(
      this.searchCondition(my_id,friend_id)
    ).get().then(res => {
      console.log('查询结果：',res.data)
      //若无数据则添加
      if(res.data.length==0){
        db.collection('chatgroup').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            members: [
              friend_id,
              my_id,
            ],
            [friend_id]:{
              unread:0,
              lastMessage:null,
              time:Date.now()
            },
            [my_id]:{
              unread:0,
              lastMessage:null,
              time:Date.now()
            },
          }
        }).then(res => {
          console.log(res)
          this.ToMessagePage(res._id,friend_name,friend_id)
        })
      }else{
        this.ToMessagePage(res.data[0]._id,friend_name,friend_id)
      }

    })
    
  },
  searchCondition(my_id,friend_id){
    if(my_id==friend_id){
      console.log('myself')
      return{members: [my_id, my_id]}
    }else{
      console.log('myfriend')
      return{members: _.all([ my_id,friend_id])}
    }
  },
  ToMessagePage(group_id,friend_name,friend_id){
    console.log('GID',group_id)
    wx.navigateTo({
      url: '../message/message?group_id='+group_id+'&nickname='+friend_name+'&friend_id='+friend_id,
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