// pages/index/index.js
const {URL} = require('../../utils/http');
// const app = getApp();
// console.log(app.globalData)
Page({

  /*** 页面的初始数据*/
  data: {
    isLogin: false,
    phoneNum: '',
    isStu: true
  },
  onLoad() {
    // 逻辑判断是否已经登录
    const that = this;
    const app = getApp();
    wx.login({
      success: function (res) {
        app.globalData.OpenId = res.code;
        that.setData({
          code: res.code
        });
        wx.request({
          url: `${URL}AccountManage/VerifyLogin`,
          data: {
            WechatCode: that.data.code
          },
          method: 'post',
          success: function (res) {
            // console.log(res.data);
            if (res.data.Code == 200) {
              // console.log(res.data);
              app.globalData.Authorization = res.data.Data.Authorization;
              app.globalData.phoneNum = res.data.Data.UserName;
              app.globalData.UserId = res.data.Data.UserId;
              if (res.data.Data.LoginType === 2) {
                wx.redirectTo({
                  url: '../worker/worker',
                })
              } 
              else {
                that.setData({
                  isLogin: true,
                  phoneNum: app.globalData.phoneNum
                })
              }
            }else{
              wx.redirectTo({
                url: '../login/login',
              })
            }
          }
        })
      }
    })
    // if(!!app.globalData.Authorization) {
    //   this.setData({
    //     isLogin: true,
    //     phoneNum: app.globalData.phoneNum
    //   })
    // }
  },
  scan() {
    wx.scanCode({
      success: (res)=> {
       
      },
      fail: (rej)=> {
        
      }
    })
  },
  washClick: function () {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
      //跳转我要洗衣
      wx.navigateTo({
        url: '../wash/wash',
      })
    }
    
  },
  orderClick: function () {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转我的订单
      wx.navigateTo({
        url: '../order/order',
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
  logoutClick:function(){
    const that = this;
    const app = getApp();
    wx.request({
      url: `${URL}AccountInfo/LoginOut`,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method:'post',
      success:function(res){
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