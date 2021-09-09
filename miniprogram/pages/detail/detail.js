// pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const login = require('../../modules/login')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此处的openid为用户的openid
    // info里的openid为发帖人的openid
    inTeam: false,
    inCollection: false,
    captainButtons: [
      {
        text: '完成组队'
      },
      {
        type: 'warn',
        text: '解散队伍'
      }
    ],
    othersButtonsOut: [
      {
        text: '加入队伍'
      }
    ],
    othersButtonsIn: [
      {
        text: '退出队伍'
      }
    ],
    loading: true,
    textInputValue:null,
    comments:[],
    placeholder:'',
    replyTo:[],
    reply:false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载帖子信息
    // 加载用户头像
    const _this = this
    const db = wx.cloud.database()
    const field_map = app.globalData.field_map
    this.setData({
      openid: app.globalData.openid,
      id: options.id
    })
    var newarr=[]
    db.collection('post').doc(this.data.id).get()
    .then(res => {
      const info = res.data
      // 处理分类
      info.areaName = field_map[info.area]
      // 处理日期
      const time = new Date(info.date).toLocaleDateString()
      const now = new Date().toLocaleDateString()
      // 去年及以前
      if (time[3] != now[3]) {
        info.date = time.replace('/','月').replace('/','日') + '日'
      }
      // 今天发布显示时间
      else if (time.slice(-1)[0] == now.slice(-1)[0]) {
        info.date = new Date(info.date).toLocaleTimeString()
      }

      else {
        info.date = time.split('/').slice(1).join('月') + '日'
      }
      var arr=res.data.comment
      console.log(arr)
      newarr = arr.map(item =>
        {if(item['replyTo'][0]==app.globalData.openid){
          item['read']=true
          return item
        }
      })  
      console.log(newarr)
      _this.setData({
        info,
        comments:info.comment,
        replyTo:[info._openid,info.nickname]
      })
      return info
    })
    .then((info) => {
      console.log(newarr)
      db.collection('post').doc(this.data.id).update({
        data: {
          // 表示指示数据库将字段自增 10
          comment: newarr
        },
      })
      const members_id = info.members.map(user => user.openid)
      if(members_id.indexOf(this.data.openid) > -1) {
        this.setData({
          inTeam: true
        })
      }
      return db.collection('user').doc(this.data.openid).get()
    })
    .then((res) => {
      const collections = res.data.collections
      if (collections.indexOf(this.data.info._id) > -1) {
        this.setData({
          inCollection: true
        })
      }
    })
    .catch(err => {
      return
    })

  },
  finish: function () {
    wx.showModal({
      title: '提示',
      content: '完成组队后将无法变更成员'
    })
    .then(res => {
      this.setData({
        'info.state': false
      })
      db.collection('post').doc(this.data.info._id).update({
        data: {
          state: false
        }
      })
    })
    .catch(err => {
      return
    })
    
  },
  disband: function () {
    wx.showModal({
      title: '解散队伍不可撤销',
      content: '是否解散队伍'
    })
    .then(res => {
      return db.collection('post').doc(this.data.info._id).remove()
    }, err => {
      return
    })
    .then((res) => {
      return wx.cloud.deleteFile({
        fileList: this.data.info.img_path
      })
    })
    .then((res) => {
      return wx.showToast({
        title: '正在解散',
        icon: 'loading',
        mask: true,
        duration: 1000
      })
    })
    .then(() => {
      wx.switchTab({
        url: '/pages/home/home',
      })
    })
  },
  quit: function () {
    const _this = this
    let members = this.data.info.members
    members = members.filter(member => {
      return member.openid != this.data.openid
    })
    
    wx.cloud.callFunction({
      name: 'quit',
      data: {
        _id: _this.data.info._id
      },
    })
    .then(res => {
      _this.setData({
        'info.members': members,
        inTeam: false
      })
      wx.showToast({
        title: '退出成功',
        duration: 2000
      })
    })
    .catch(res => {
      wx.showToast({
        title: '退出失败',
        icon: 'error',
        duration: 2000
      })
    })
  },
  async join() {
    const _this = this
    const res = await login.loginCheck()
    if (res == false) {
      return
    }
    const member = app.globalData.userInfo
    member.openid = this.data.openid
    const members = this.data.info.members
    if (members.map((item) => item.openid).indexOf(this.data.openid) > -1) {
      await wx.showToast({
        title: '您已在队伍中',
        icon: 'error',
        duration: 2000
      })
      return
    }
    members.push(member)

    wx.cloud.callFunction({
      name: 'join',
      data: {
        _id: _this.data.info._id,
        member
      },
    })
    .then(res => {
      _this.setData({
        'info.members': members,
        inTeam: true
      })
      wx.showToast({
        title: '加入成功',
        duration: 2000
      })
    })
    .catch(res => {
      wx.showToast({
        title: '加入失败',
        icon: 'error',
        duration: 2000
      })
    })

  },
  async collect() {
    const res = await login.loginCheck()
    const _ = db.command

    if (res == false) {
      return
    }

    // 如果数组中不包含_id，则添加进去
    const new_collections = await db.collection('user').doc(app.globalData.openid).update({
      data: {
        collections: _.addToSet(this.data.info._id)
      }
    })
    this.setData({
      inCollection: true
    })

    console.log(new_collections)
  },
  cancleCollect() {
    const _ = db.command
    db.collection('user').doc(app.globalData.openid).update({
      data: {
        collections: _.pull(this.data.info._id)
      }
    })
    this.setData({
      inCollection: false
    })
  },
  driveOut: function (e) {
    const _this = this
    if(this.data.openid == this.data.info._openid) {
      wx.showModal({
        title: '提示',
        content: '是否请出该成员',
        success: function (res) {
          if (res.confirm) {
            const index = e.currentTarget.dataset.index
            const members = _this.data.info.members
            members.splice(index, 1)
            db.collection('post').doc(_this.data.info._id).update({
              data: {
                members
              }
            })
            .then(res => {
              _this.setData({
                'info.members': members
              }),
              wx.showToast({
                title: '该成员已被请出',
                duration: 2000
              })
            })
          }
        }
      })
      
    }
  },
  captainTap (e) {
    if (e.detail.index == 0) {
      this.finish()
    }
    else if (e.detail.index == 1) {
      this.disband()
    }
  },
  async othersTap (e) {
    if (this.data.inTeam == false) {
      await this.join()
    }
    else {
      this.quit()
    }
  },
  ToMessagePage(group_id,friend_name,friend_id){

    wx.navigateTo({
      url: '../message/message?group_id='+group_id+'&nickname='+friend_name+'&friend_id='+friend_id,
      fail: function(res) {
        console.log(res)
      },
    })
  },
  searchCondition(my_id,friend_id){
    if(my_id==friend_id){

      return{members: [my_id, my_id]}
    }else{
      console.log('myfriend')
      return{members: _.all([ my_id,friend_id])}
    }
  },
  async goToChatroom(e){
    const res = await login.loginCheck()
    if (res == false) {
      return
    }
    const member = this.data.info.members[e.currentTarget.dataset.index]
    let friend_id = member.openid
    let friend_name = member.nickName
    let my_id = this.data.openid

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
  async comment(e) {
    const _this = this
    const res = await login.loginCheck()
    if (res == false) {
      return
    }

    var text=e.detail.value
    console.log(text)
    if(text!=""){
      wx.cloud.callFunction({
        name: 'comment',
        data: {
          id: _this.data.id,
          userName: app.globalData.userInfo.nickName,
          time: new Date(),
          numOfUnread: 0,
          firstMessage: text,
          avatar: app.globalData.userInfo.avatarUrl,
          replyTo: _this.data.replyTo,
          read: false,
          reply:this.data.reply,
  
        }
      })
      .then(res => {
        _this.setData({
          textInputValue: '',
          placeholder:'',
          reply:false
        })
      })
    }


  },
  reply(e) {
    var nickname=e.currentTarget.dataset.nickname
    var id=e.currentTarget.dataset.id
    this.setData({
      replyTo:[id,nickname],
      placeholder:"回复"+nickname+':',
      reply:true,
      focus:true,
    })
    console.log(this.data.replyTo)
  },
  onBlur(){
    this.setData({
      replyTo:[this.data.info._openid,this.data.info.nickname],
      placeholder:'',
      reply:false
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
    const _this = this
    setTimeout(() => {
      db.collection('post').doc(_this.data.id).watch({
        onChange: function (snapshot) {
          if (snapshot.type != 'init') {
            let comments = _this.data.comments
            const comments_new = snapshot.docChanges.map((item) => Object.values(item.updatedFields)[0])
            comments = comments.concat(comments_new)
            _this.setData({
              comments
            })
          }
        },
        onError: function (err) {
          wx.showToast({
            title: '加载评论失败',
            icon: 'error'
          })
        }
      })
      _this.setData({
        loading: false
      })
    },2000)
    
    console.log('结束监听')
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
  onPullDownRefresh: function (e) {
    console.log(e)
    
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