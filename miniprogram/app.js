//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        console.log('[云函数] [login] user openid: ', this.globalData.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    this.globalData = {
      hasUserInfo: false,
      openid:'',
      field_map: {
        "0": "全部",
        "1": "美妆",
        "2": "水果",
        "3": "拼车",
        "4": "其他"
      },
      post_data: {
        tlength: 20,
        title: '',
        content: '',
        imax: 3,
        imgList: [],  
        num: 2,
        minStatus: 'disable',
        address: null,
        choosenarea: 0,
        finish: false,
        upload_info: {
          nickname: null,
          openId: null,
          avatar: null,
          area: -1,
          title: '',
          content: '',
          num: 2,
          location: {
            latitude: null,
            longitude: null,
            address: null
          },
          date: null,
          members: [],
          state: true,
          img_path: [],
          comment: []
        }
      },
      // detail(e) {
      //   wx.navigateTo({
      //     url: '/pages/detail/detail?id=' + e.currentTarget.dataset.index,
      //   })
      // },
    }
  }
})
