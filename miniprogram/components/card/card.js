// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object
    },
    _id: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail() {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + this.data._id,
      })
    },
  },
  lifetimes: {
    created() {
      
    },
    attached() {

    },
    ready() {

    }
  }
})
