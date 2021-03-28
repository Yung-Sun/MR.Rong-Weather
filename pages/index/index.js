// index.js
// 获取应用实例
const app = getApp()




let _page, _this;
let getLocation = () => {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      console.log('纬度：' + latitude + '，经度：' + longitude)
      _this.getDistrict(latitude, longitude)
      wx.hideLoading()
      showLoading('正在加载')
    }
  })
}
let showLoading = (content) => {
  wx.showLoading({
    title: content,
    mask: true
  })
}

Page({
  data: {
    district: '定位中',
    districtId: undefined,
    text: '-',
    iconSrc: '../../images/icon/999.png'
  },

  // 页面初始化时获取位置信息
  onLoad() {
    _this = this;
    showLoading('正在定位')
    getLocation()
  },
  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `https://geoapi.qweather.com/v2/city/lookup?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${longitude},${latitude}`,
      success: function (res) {
        const districtId = res.data.location[0].id
        _page.setData({
          district: res.data.location[0].name,
          districtId: res.data.location[0].id
        })
        _page.getNowWeather(districtId)
        _page.getFutureWeather(districtId)
      }
    })
  },
  getNowWeather(districtId) {
    _page = this;
    wx.request({
      url: `https://devapi.qweather.com/v7/weather/now?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${districtId}`,
      success: function (res) {
        let iconId = res.data.now.icon
        let iconSrc = `../../images/icon/${iconId}.png`
        _page.setData({ ...res.data.now, iconSrc })
      }
    })
  },
  getFutureWeather(districtId) {
    wx.request({
      url: `https://devapi.qweather.com/v7/weather/3d?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${districtId}`,
      success: function (res) {
        let todayRowData, tomorrowRowData, afterTomorrowRowData
        [todayRowData, tomorrowRowData, afterTomorrowRowData] = res.data.daily
        _page.setData({ todayRowData, tomorrowRowData, afterTomorrowRowData })
        wx.hideLoading()
      }
    })
  }
})