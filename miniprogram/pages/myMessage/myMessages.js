// pages/my/myMessage/myMessages.js
var db = wx.cloud.database()
const _ = db.command
var that
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      { id:0,
        name:'私信',
        isActive:true,
      },
      { id:1,
        name:'留言',
        isActive:false,
      },
    ],
    currentTab:0,
    messages:[],
    comments:[],
    openid:getApp().globalData.openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的消息',
    })
    that=this
    
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
    console.log('onshow')
    const openid=getApp().globalData.openid
    const time = openid + '.time'
    db.collection('chatgroup').orderBy(time, 'desc').where({
      members:getApp().globalData.openid,
    }).get()
    .then(res=>{
      const data = res.data
      this.data.messages=[]
      const messages=this.data.messages
      // 修改日期格式
      data.forEach((info) => {
        let members=info.members
        var user_id=null
        if(members.indexOf(openid)==0){
          user_id=members[1]
        }else{
          user_id=members[0]
        }
        console.log('user_id',user_id)
        db.collection('user').doc(user_id).get()
        .then(res => {
          console.log(res.data)
          messages[messages.length] = {
            user_openid:user_id,
            userName:res.data.nickname,
            avatar:res.data.avatar,
            time:info[openid].time,
            firstMessage:info[openid].lastMessage,
            numOfUnread:info[openid].unread,
          }
          that.setData({
            messages: messages
          })
        })

        })
        
    })
    console.log(this.data.openid)
    db.collection('post').where({
      comment:_.elemMatch({
        'replyTo.0': openid,
      }),
    }).get()
    .then(res => {
      console.log(res.data)
      var arr=res.data.map((item) => {
        const comment = item.comment
        const _id = item._id
        comment.forEach(info => info.postid = _id)
        return comment
      })
      console.log(arr)
      for(var i=0;i<arr.length-1;i++){
        arr[0] = arr[0].concat(arr[i+1])
      }
      arr=arr[0]
      var newarr = arr.filter(item =>item['replyTo'][0]==openid)
      newarr=newarr.sort(this.compare)
      that.setData({
        comments:newarr,
      })
      console.log(this.data.comments)
      
    })
    console.log(this.data.messages)
  },
  compare(obj1,obj2){
    var val1=obj1.time
    var val2=obj2.time
    if(val1<val2){
      return 1;
    }else if(val1>val2){
      return -1;
    }else{
      return 0;
    }
  },
  goToChatroom(e){
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
      this.ToMessagePage(res.data[0]._id,friend_name,friend_id)
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
  goToPost(e){
    console.log(e.currentTarget.dataset.postid)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.postid
    })
  },
  handleItemChange(e) {
        const currentTab = e.detail.index
        const {tabs} = this.data
        console.log(currentTab)
        tabs.forEach(item => item.isActive = currentTab == item.id ? true : false)
        this.setData({
          tabs,
          currentTab : currentTab,
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