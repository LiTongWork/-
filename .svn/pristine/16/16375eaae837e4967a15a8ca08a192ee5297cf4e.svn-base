// pages/index/index.js
const {URL} = require('../../utils/http');
Page({

  /*** 页面的初始数据*/
  data: {
    isLogin: false,
    phoneNum: '',
    isStu: true
  },
  onLoad() {
    // 逻辑判断是否已经登录
    const app = getApp();
    if(!!app.globalData.Authorization) {
      this.setData({
        isLogin: true,
        phoneNum: app.globalData.phoneNum
      })
    }
  },
  scan() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.scanCode({
      success: (res)=> {
      },
      fail: (rej)=> {
      },
      complete: function() {
      }
    })
  },
  // mineClick: function () {
  //   //跳转个人中心
  //   wx.navigateTo({
  //     url: '../mine/mine',
  //   })
  // },
  orderClick: function () {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转我的订单
      wx.navigateTo({
        url: '../workerOrder/workerOrder',
      })
    }
    
   
  },
  changeClick:function(){
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转密码修改页
      wx.navigateTo({
        url: '../change/change',
      })
    }
    
  },
  //退出按钮，进入登录页
  logoutClick: function () {
    const that = this;
    const app = getApp();
    wx.request({
      url: `${URL}AccountInfo/LoginOut`,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'post',
      success: function (res) {
        app.globalData.Authorization = '';
        app.globalData.phoneNum = '';
        that.setData({
          isLogin: false,
          phoneNum: ''
        })
        wx.redirectTo({
          url: '../login/login'
        });

      }
    })
  }

})