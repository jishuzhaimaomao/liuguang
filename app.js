//app.js
App({

    onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
        console.log('APP-onLaunch 生命周期函数--监听小程序初始化');
    },

    onShow: function () {
        console.log('App-onShow 生命周期函数--监听小程序显示');
    },

    onHide: function () {
        console.log('App-onHide 生命周期函数--监听小程序隐藏');
    },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})