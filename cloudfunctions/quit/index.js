// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _id = event._id
  const data = await db.collection('post').doc(_id).update({
    data: {
      members: _.pull({
        openid: wxContext.OPENID
      })
    }
  })
  return {
    data
  }
}