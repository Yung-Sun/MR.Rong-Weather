// index.js
// 获取应用实例
const app = getApp()
let _page, _this;
let fetch = () => {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      console.log('纬度：' + latitude + '，经度：' + longitude)
      _this.getDistrict(latitude, longitude)
      wx.hideLoading()
      showLoading('正在加载')
    },
    fail(res) {
      console.log(res)
      wx.showToast({
        title: '定位失败，请开启定位权限或手机GPS',
        icon: 'none',
        duration: 10000
      })
    }
  })
}
let showLoading = (content) => {
  wx.showLoading({
    title: content,
    mask: true
  })
}
let setStorage = (key, data) => {
  wx.setStorage({
    key: key,
    data: data,
    success: function (res) {
      console.log(key + '已储存在Storage')
    }
  })
}

Page({
  data: {
    district: '定位中',
    districtId: undefined,
    text: '-',
    iconSrc: '../../images/icon/999.png',
    tempListType: 'tempByDay',
    menuVisible: false
  },


  // 页面初始化时获取位置信息
  onLoad() {
    _this = this;
    wx.stopPullDownRefresh()
    showLoading('正在定位')
    fetch()
  },
  // 页面方法
  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `https://geoapi.qweather.com/v2/city/lookup?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${longitude},${latitude}`,
      success(res) {
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
      url: `https://devapi.qweather.com/v7/weather/7d?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${districtId}`,
      success: function (res) {
        let todayRowData
        [todayRowData] = res.data.daily
        let dailyData = res.data.daily
        _page.setData({ dailyData, todayRowData })
        _page.getFutureWeatherByHour(districtId)
        setStorage('dailyData', dailyData)
        wx.hideLoading()
      }
    })
  },
  getFutureWeatherByHour(districtId) {
    wx.request({
      url: `https://devapi.qweather.com/v7/weather/24h?key=74be5e8b8bdb46ca970b3703ae3f165d&location=${districtId}`,
      success: function (res) {
        let fullHourlyData = res.data.hourly
        let evenHourlyData = []
        for (let i = 0; i < fullHourlyData.length; i++) {
          if (i % 2 !== 0) {
            evenHourlyData.push(fullHourlyData[i])
          }
        }
        _page.setData({ evenHourlyData })
      }
    })
  },
  toggle(e) {
    let tempListType = e.currentTarget.dataset.type
    _page.setData({ tempListType })
  },
  changeMenuVisible() {
    let menuVisible = !this.data.menuVisible
    if (menuVisible) {
      this.animate('.iconWrapper', [
        { translateX: -20, opacity: 0 },
        { translateX: 0, opacity: 1 }
      ], 200)
    } else if (!menuVisible) {
      console.log('hi')
      this.animate('.iconWrapper', [
        { translateX: 0, opacity: 0 },
        { translateX: -20, opacity: 1 }
      ], 200)
    }

    _page.setData({ menuVisible })
  },

  // 监听用户下拉动作
  onPullDownRefresh: function () {
    _this = this;
    _this.onLoad()
  }
})