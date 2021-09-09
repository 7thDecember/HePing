// pages/publish/publish.js
const login = require('../../modules/login')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // hasUserInfo: false
    area: [
      {name: '美妆', value: 1, url: 'cloud://cloud1-2gy6e8d9d5960bf8.636c-cloud1-2gy6e8d9d5960bf8-1305587529/project_image/beauty.jpg'},
      {name: '水果', value: 2, url: 'cloud://cloud1-2gy6e8d9d5960bf8.636c-cloud1-2gy6e8d9d5960bf8-1305587529/project_image/fruit.jpg'},
      {name: '拼车', value: 3, url: 'cloud://cloud1-2gy6e8d9d5960bf8.636c-cloud1-2gy6e8d9d5960bf8-1305587529/project_image/transports.jpg'},
      {name: '其他', value: 4, url: 'cloud://cloud1-2gy6e8d9d5960bf8.636c-cloud1-2gy6e8d9d5960bf8-1305587529/project_image/others.jpg'},
    ],
    loading: true
  },
  // 当领域、标题、正文填写完毕后即可提交
  judgeFinish: function () {
    const area = this.data.upload_info.area
    const title = this.data.upload_info.title
    const content = this.data.upload_info.content
    if (area > 0 && title.length > 0 && content.length > 0) {
      this.setData({
        finish: true
      })
    }
    else {
      this.setData({
        finish: false
      })
    }
  },
  chooseArea: function (e) {
    const area = e.currentTarget.dataset.area
    this.setData({
      choosenarea: area,
      'upload_info.area': area
    })
    this.judgeFinish()
  },
  inpTitle: function (e) {
    const value = e.detail.value
    this.setData({
      title: value,
      'upload_info.title': value
    })
    this.judgeFinish()
  },
  inpText: function (e) {
    const value = e.detail.value
    this.setData({
      content: value,
      'upload_info.content': value
    })
    this.judgeFinish()
  },
  //点击添加选择
  chooseSource: function () {
    const _this = this
    wx.showActionSheet({
      itemList: ["拍照", "从相册中选择"],
      itemColor: "#000000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.imgWShow("camera")        //拍照
          } else if (res.tapIndex == 1) {
            _this.imgWShow("album")      //相册
          }
        }
      }
    })
  },

  // 点击调用手机相册/拍照
  imgWShow: function (type) {
    const _this = this;
    let len = 0;
    if (_this.data.imgList != null) {
      len = _this.data.imgList.length
    }   //获取当前已有的图片
    wx.chooseImage({
      count: _this.data.imax - len,     //最多还能上传的图片数,这里最多可以上传5张
      sizeType: ['original', 'compressed'],        //可以指定是原图还是压缩图,默认二者都有
      sourceType: [type],             //可以指定来源是相册还是相机, 默认二者都有
      success: function (res) {
        wx.showToast({
          title: '正在上传...',
          icon: "loading",
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表,tempFilePaths可以作为img标签的scr属性显示图片
        const imgListNew = res.tempFilePaths
        _this.setData({
          imgList: _this.data.imgList.concat(imgListNew)
        })
      },
      fail: function () {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
        return;
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
    console.log(e)
    const index = e.currentTarget.dataset.index;
    const _this = this;
    wx.previewImage({
      current: _this.data.imgList[index],
      urls: _this.data.imgList
    })
  },
  /**
   * 点击删除图片
   */
  deleteImg: function (e) {
    var _this = this;
    var imgList = _this.data.imgList;
    var index = e.currentTarget.dataset.index;      //获取当前点击图片下标
    wx.showModal({
      title: '提示',
      content: '确认要删除该图片吗?',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确定了")
          imgList.splice(index, 1);
        } else if (res.cancel) {
          console.log("点击取消了");
          return false
        }
        _this.setData({
          imgList
        })
      }
    })
  },
  /*点击减号*/
  bindMinus: function() {
    let num = this.data.num
    num = num > 2 ? num-1 : 2
    const minStatus = num > 2 ? 'normal' : 'disable'
    const maxStatus = num < 8 ? 'normal' : 'disable'
    this.setData({
      num: num,
      'upload_info.num': num,
      minStatus: minStatus,
      maxStatus: maxStatus
    })
  },
  /*点击加号*/
  bindPlus: function() {
    let num = this.data.num
    num = num < 8 ? num+1 : 8
    const minStatus = num > 1 ? 'normal' : 'disable'
    const maxStatus = num < 8 ? 'normal' : 'disable'
    
    this.setData({
      num: num,
      'upload_info.num': num,
      minStatus: minStatus,
      maxStatus: maxStatus
    })
  },
  /*输入框事件*/
  bindManual: function(e) {
    let num = e.detail.value;
    num = num > 8 ? 8 : num
    num = num < 1 ? 1 : num
    const minStatus = num > 1 ? 'normal' : 'disable';
    const maxStatus = num < 8 ? 'normal' : 'disable';
    this.setData({
      num:num,
      minStatus: minStatus,
      maxStatus: maxStatus
    })
    this.judgeFinish()
  },
  openmap: function (e) {
    const _this = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.chooseLocation({
          success: function (res) {
            _this.setData({
              address: res.address,
              'upload_info.location.latitude': res.latitude,
              'upload_info.location.longitude': res.longitude,
              'upload_info.location.address': res.address,

            })
          },
          fail: function (err) {
            console.log(err);
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  showToast: function (e) {
    wx.showToast({
      title: '请至少填写分类、标题和正文',
      icon: 'none',
      duration: 2000
    })
  },
  post: function (e) {
    const _this = this
    const openid = app.globalData.openid
    const nickname = app.globalData.userInfo.nickName
    const avatar = app.globalData.userInfo.avatarUrl
    const db = wx.cloud.database()
    const members = [app.globalData.userInfo]
    members[0].openid = openid
    this.setData({
      'upload_info.date': db.serverDate(),
      'upload_info.nickname': nickname,
      'upload_info.members': members,
      'upload_info.avatar': avatar,
    })
    db.collection('post').add({
      data: this.data.upload_info
    })
    .then(res => {
      return res._id
    })
    .then(res => {
      const imgList = this.data.imgList
      const path = 'post_img/' + res 
      const len = imgList.length
      const pList = []
      for (let i = 0; i < len; i++) {
        const type = imgList[i].split('.').splice(-1)[0]
        pList.push(wx.cloud.uploadFile({
          cloudPath: path + '_' + i  + '.' + type,
          filePath: this.data.imgList[i]
        }))
      }
      return Promise.all(pList)
    })
    .then(async res => {
      const img_path = []

      if(res.length > 0) {
        const _id = res[0].fileID.split('/').splice(-1)[0].split('_').splice(0,1)[0]
        for(let img of res) {
          img_path.push(img.fileID)
        }
        await db.collection('post').doc(_id).update({
          data: {
            img_path
          }
        })
      }
      
    })
    .then(res => {
      wx.switchTab({
        url: '/pages/home/home',
        success: function (res) {
          const app = getApp()
          const data = app.globalData.post_data
          _this.setData({
            ...data
          })
        }
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const app = getApp()
    const data = app.globalData.post_data
    this.setData({
      ...data
    })
  },
  async onTabItemTap(item) {
    const res = await login.loginCheck()
    if (res == false) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
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