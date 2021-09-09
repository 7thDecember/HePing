// components/newMessages/newMessages.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userName:String,
    time:String,
    firstMessage:String,
    numOfUnread:Number,
    avatar:String,
    replyTo:Array,
    reply:Boolean,
    read:Boolean,
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

  },
  lifetimes: {
    created() {
      
    },
    attached() {
      // console.log(this.data.postid)
    },
    ready() {

    }
  }
})
