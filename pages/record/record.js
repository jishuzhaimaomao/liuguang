var repository = require('../../utils/repository.js');
var util = require('../../utils/util.js');
var address2;
// Register a Page.
Page({
  data: {
    types: [],
    selectedType: {},
    date: '',
    time: '',
    amount: null,
    remark: '',
    amountInvaild: false,
    text:'无'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onload');
    var types = repository.getRecordTypes();
    var selectedType;
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      if (type.checked) {
        selectedType = type;
      }
    }
    this.setData({
      types: types,
      selectedType: selectedType
    });
  },
  onReady: function () {
    // 页面渲染完成
    console.log('onReady');
  },
  onShow: function () {
    // 页面显示
    console.log("onShow");
    var now = new Date();
    var dateString = util.formatTime(now);
    var arr = dateString.split(' ');
    this.setData({
      date: arr[0],
      time: arr[1]
    });
  },
  onHide: function () {
    // 页面隐藏
    console.log('onHide');
  },
  onUnload: function () {
    // 页面关闭
    console.log('onUnload');
  },
chooseLocation:function(){
  var that = this;
wx.chooseLocation({
  
  success: function(res) {
    address2=res.address;
    console.log(address2);
    that.setData({
      text:address2,
      'address':res.address,
      'latitude':res.latitude,
      'longitude':res.longitude
    })
  },
  fail:function(){

  },
  complete:function(){

  }
})
},
  bindAmountInput: function (e) {
    var amount = e.detail.value;
    this.data.amountInvaild = !amount;
    console.log('amountInvaild:', this.data.amountInvaild);
    this.setData({
      amountInvaild: this.data.amountInvaild
    });
  },
  bindDateChange: function (e) {
    var val = e.detail.value;
    this.data.date = val;
    this.setData({
      date: val
    });
  },
  bindTimeChange: function (e) {
    var val = e.detail.value;
    this.data.time = val;
    this.setData({
      time: val
    });
  },
  selectedTypeChange: function (e) {
    console.log('selectedTypeChange');

    var val = e.detail.value;
    var selectedType;
    var types = this.data.types;
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      if (type.name === val) {
        console.log(`selected type :${type.name}`);
        type.checked = true;
        selectedType = type;
      }
      else {
        type.checked = false;
      }
    }
    this.setData({
      //types: types,
      selectedType: selectedType
    });
  },
  cancleEvent: function (e) {
    // sent data change to view
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function (res) {
        ;
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  saveEvent: function (e) {
    var va=this;
    var data = va.data;
    var amount = data.amount || data.selectedType.default;
    console.log(`type:${data.selectedType.name} amount:${amount} date:${data.date} time:${data.time} remark:${data.remark} text:${address2}`);
  },
  formSubmit: function (e) {
    var that = this;
    var val = e.detail.value;
    var amount = val.amount;
   
    that.data.amountInvaild = !amount;
    if (that.data.amountInvaild) {
      that.setData({
        amountInvaild: that.data.amountInvaild
      });
      return;
    }
    var date = val.date;
    var time = val.time;
    var type = val.type;
    var remark = val.remark;
    var address= val.address;
    var text=val.text;
    that.data.amount = amount;
    that.data.date = date;
    that.data.time = time;
    that.data.remark = remark;
    that.data.address=address;
    that.data.text=text;
    console.log(`type:${type} amount:${amount} date:${date} time:${time} remark:${remark} text:${address2}`);
    var record = {
      type: type,
      amount: amount,
      date: date,
      time: time,
      remark: remark,
      text:address2,
      unit: that.data.selectedType.unit
    };
    repository.insertRecord(record, (result) => {
      if (result.success) {
        console.log('insertRecord success');
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 500
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 500);
      }
      else {
        console.log('insertRecord fail');
      }
    });
  }
})