// pages/change/change.js
const {
  URL
} = require('../../utils/http');
Page({

  /*** 页面的初始数据*/
  data: {
    oldPsd: '',
    newPsd1: '',
    newPsd2: '',
    Authorization: ''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    const app = getApp();
    this.setData({
      Authorization: app.globalData.Authorization
    })
  },
  //获取
  inputOld: function (e) {
    this.setData({
      oldPsd: e.detail.value
    })
  },
  inputNew1: function (e) {
    this.setData({
      newPsd1: e.detail.value
    })
  },
  inputNew2: function (e) {
    this.setData({
      newPsd2: e.detail.value
    })
  },
  submitClick: function () {
    var old = this.data.oldPsd;
    var new1 = this.data.newPsd1;
    var new2 = this.data.newPsd2;
    if (old == '' || new1 == '' || new2 == '') {
      wx.showModal({
        title: '密码不能为空！',
        showCancel: false
      })
      return false
    } else if (new1.length < 6 || new1.length > 32) {
      wx.showModal({
        title: '密码长度有误(6-32)！',
        showCancel: false
      })
      return false
    } else if (new2 != new1) {
      wx.showModal({
        title: '新密码不一致！',
        showCancel: false
      })
      return false
    } else {
      //需要判断密码是否符合规则，后期可调整
      const data = {
        Password: this.data.oldPsd,
        PasswordNew: this.data.newPsd1
      };
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: `${URL}AccountInfo/ChangePassword`,
        data: data,
        header: {
          'content-type':'application/json',
          Authorization: this.data.Authorization
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          wx.hideLoading();
          if(res.data.Code == 200){
            wx.showToast({
              title: '修改成功',
              icon: 'succes',
              duration: 2000,
              mask:true,
              success: function() {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 2000)
              }
            });
            
          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            })
            return false;
          }
          
        },
        fail: () => {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 2000,
            mask:true,
          })
        },
        // complete: () => { wx.hideLoading()}
      });
    }
  },

})