//Page Object
const {
  URL
} = require('../../utils/http');
Page({
  data: {
    clothes: [],
    totalPrice: 0,
    StudentRemark: ''
  },
  //options(Object)
  onLoad: function (option) {
    let list = [];
    if (option.order) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const order = JSON.parse(option.order);
      const app = getApp();
      const that = this;
      app.globalData.IndentCode = order.indentCode;
      wx.request({
        url: `${URL}order/GetOrderDetails`,
        data: {Id: order.id},
        header: {
          'content-type':'application/json',
          Authorization: app.globalData.Authorization
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res)=>{
          wx.hideLoading();
          if(res.data.Code === 200) {
            list = res.data.Data.Clotheslist;
            let totalPrice = 0;
            list.forEach(item => {
              totalPrice += item.Number * item.ClothesPrice
            });
            that.setData({
              clothes: list,
              totalPrice: totalPrice,
              StudentRemark: res.data.Data.StudentRemark
            })
          } else {
            wx.showToast({
              title: res.data.Data,
              duration: 2000,
              mask:true,
            })
          }
        }
      });


    } else {
      list = JSON.parse(option.list);
      let totalPrice = 0;
      list.forEach(item => {
        totalPrice += item.Number * item.Price
      });
      this.setData({
        clothes: list,
        totalPrice: totalPrice
      })
    }
    
  },
  input: function(e) {
    this.setData({
      StudentRemark: e.detail.value
    });
  },
  pay: function () {
    const app = getApp();
    this.orderPay(
      app.globalData.OpenId, 
      app.globalData.IndentCode, 
      app.globalData.Authorization,
      this.data.StudentRemark,
      this.data.clothes);
  },

  orderPay(openid, IndentCode, Authorization, StudentRemark, list) {
    var that = this;
    wx.request({
      url: `${URL}order/GetPayParments`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: Authorization
      },
      data: {
        IndentCode: IndentCode,
        Openid: openid
      },
      success: function (result) {
        if (result.data.Code == "200") {
          var r = result.data.Data.Data;
          wx.requestPayment({
            'timeStamp': r.timeStamp,
            'nonceStr': r.nonceStr,
            'package': r.prepayId,
            'signType': 'MD5',
            'paySign': r.sign,
            'success': function () {
              wx.showToast({      
                title: '支付成功！',
                icon: "success",
                duration: 2000,
                mask:true,
                success: function (res) {
                  wx.request({
                    url: `${URL}order/SaveOrder`,
                    data: {
                      StudentRemark: StudentRemark,
                      UserId: '',
                      Id: '',
                      IndentCode: IndentCode,
                      clotheslist: list
                    },
                    header: {
                      'content-type': 'application/json',
                      Authorization: Authorization
                    },
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text'
                  });
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../order/order',
                    })
                  }, 2000)
                }
              })
            },
            'fail': function (result) {
              if(result.errMsg === 'requestPayment:fail cancel'){
                wx.showToast({
                  title: '支付已取消',
                  icon:'none',
                  duration:2000,
                  mask:true
                })
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
              
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "支付失败！",
            icon: "cancel",
            showCancel: false,
            success: function (res) {
              // if (res.confirm) {
              //   wx.switchTab({
              //     url: '../usehome/usehome?status=2',
              //     success: function (e) {
              //       var page = getCurrentPages().pop();
              //       if (page == undefined || page == null) return;
              //       page.onLoad();
              //     }
              //   })
              // }
            }
          })
        }
      }
    })
    // that.getOpenId(function (openid) {

    // })
  }
});