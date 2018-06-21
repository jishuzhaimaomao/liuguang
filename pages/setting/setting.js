//logs.js
var util = require('../../utils/util.js')
var repository = require('../../utils/repository.js');
var recordStartX = 0;
var currentOffsetX = 0;
var app=getApp();
Page({
  data: {
    customTypes: [],
    userInfo:{},
    openId:''
  },
  onShow: function () {
    var types = repository.getCustomTypes();
    types.forEach((i) => {
      i.offsetX = 0;
    });
    this.setData({
      customTypes: types
    })
  },
  onLoad:function(){
    var that=this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  },
  touchStart: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(e.target.dataset);
    console.log(e.currentTarget.dataset);

    console.log(index);
    if (index === undefined) {
      return;
    }

    recordStartX = e.touches[0].clientX;
    var item = this.data.customTypes[index];
    if (item['offsetX'] === undefined) {
      item.offsetX = 0;
    }
    currentOffsetX = item.offsetX;
    console.log('start x ', recordStartX);
  }
  ,
  touchMove: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    if (index === undefined) {
      return;
    }

    var customTypes = this.data.customTypes;
    var item = customTypes[index];
    var x = e.touches[0].clientX;
    var mx = recordStartX - x;
    console.log('move x ', mx);

    var result = currentOffsetX - mx;
    if (result >= -80 && result <= 0) {
      item.offsetX = result;
    }
    this.setData({
      customTypes: customTypes
    });
  }
  ,
  touchEnd: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    if (index === undefined) {
      return;
    }

    var customTypes = this.data.customTypes;
    var item = customTypes[index];
    console.log('end x ', item.offsetX);

    if (item.offsetX < -40) {
      item.offsetX = -80;

    } else {
      item.offsetX = 0;

    }
    this.setData({
      customTypes: customTypes
    });
  },
  deleteTypeEvent: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    if (index === undefined) {
      return;
    }

    var types = repository.getCustomTypes();
    types.splice(index, 1);
    types.forEach((t) => {
      t.offsetX = 0;
    });
    repository.saveCustomTypes(types, (r) => {
      if (r.success) {
        that.setData({
          customTypes: types
        });
      }
    })
  }
  ,
  resetMiniApp: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['重置'],
      itemColor: '#e64340',
      success: function (res) {
        if (res.tapIndex != undefined) {
          if (res.tapIndex == 0) {
            wx.showModal({
              title: '提示',
              content: '重置小程序将抹掉所有填写的数据，您是否确定要重置？',
              success: function (res) {
                if (res.confirm) {
                  repository.reset((r) => {
                    if (r.success) {
                      wx.showToast({
                        title: '重置成功',
                        icon: 'success',
                        duration: 1000
                      });
                      that.setData({
                        customTypes: []
                      });
                      setTimeout(() => {
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      },1000);
                    }
                  });
                }
              }
            })
          }
        }
      },
      fail: function (res) {
        //console.log(res.errMsg)
      }
    })
  }

})
