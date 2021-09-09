function modifyData (info) {
  info.areaName = getApp().globalData.field_map[info.area]
  let t1 = Date.parse(info.date)
  let t2 = Date.parse(new Date())
  let days = Math.abs(parseInt((t2 - t1) / 1000 / 3600 / 24))

  if (days === 0) {
    info.date = '今天'
  }
  else if (days === 1) {
    info.date = '昨天'
  }
  else if (days === 2) {
    info.date = '前天'
  }
  else if (days < 365) {
    const tmp = info.date.toLocaleDateString().split('/').slice(1)
    info.date = tmp.join('月') + '日'
  }
  else {
    const tmp = info.date.toLocaleDateString().split('/')
    info.date = tmp[0] + '年' + tmp[1] + '月' + tmp[2] + '日'
  }
 
}

module.exports.modifyData = modifyData