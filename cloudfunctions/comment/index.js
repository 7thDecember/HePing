// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  const newComment = event
  newComment.id = wxContext.OPENID
  const data = await db.collection('post').doc(id).update({
    data: {
      comment: _.push(newComment)
    }
  })
  return {
    data
  }
}