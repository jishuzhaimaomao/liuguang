// Register a Page.
var repository = require('../../utils/repository.js');

Page({
  data: {
    typeNameInvalid: false,
    typeUnitInvalid: false
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
  bindTypeNameInput: function (e) {
    var name = e.detail.value;
    this.data.typeNameInvalid = !name;
    console.log('typeNameInvalid:', this.data.typeNameInvalid);
    this.setData({
      typeNameInvalid: this.data.typeNameInvalid
    });
  },
  bindTypeUnitInput: function (e) {
    var unit = e.detail.value;
    this.data.typeUnitInvalid = !unit;
    console.log('typeUnitInvalid:', this.data.typeUnitInvalid);
    this.setData({
      typeUnitInvalid: this.data.typeUnitInvalid
    });
  },
  formSubmit: function (e) {
    var val = e.detail.value;
    var name = val.typeName;
    var unit = val.typeUnit;
    console.log(val);

    this.data.typeNameInvalid = !name;
    this.data.typeUnitInvalid = !unit;
    if (this.data.typeNameInvalid || this.data.typeUnitInvalid) {
      this.setData({
        typeNameInvalid: this.data.typeNameInvalid,
        typeUnitInvalid: this.data.typeUnitInvalid
      });
      return;
    }

    var type = {
      name: name,
      unit: unit
    };

    repository.insertCustomType(type, (result) => {
      if (result.success) {
        console.log('insertCustomType success');
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
        console.log('insertCustomType fail');
      }
    });
  }
})