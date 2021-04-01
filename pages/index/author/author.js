// pages/author/author.js
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad() {
    wx.getUserProfile({
      desc: '显示名称',
      success: (res) => {
        console.log('hi')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  back() {
    console.log('返回Home')
  }

})