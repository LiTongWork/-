// pages/order/order.js
const { URL } = require('../../utils/http');
const DATA = {
  page: 1,
  rows: 10,
  Status: -1
};
var QRCode = require('../../utils/weapp-qrcode.js');
var qrcode;
let res = wx.getSystemInfoSync();
let scale = res.windowWidth / 750; //不同屏幕下QRcode的适配比例；设计稿是750宽
let width = 390 * scale; // 390为设计稿的宽度
Page({
  /*** 页面的初始数据*/
  data: {
    rows: [],
    Authorization: '',
    phoneNum: '',
    detail: false,
    logistics: false,
    formData: {
      page: 1,
      rows: 10,
      Status: -1
    },
    inputValue: '',
    inputSearch: '',
    statusValue: [
      {
        key:-1,
        status:'所有'
      },
      {
        key:0,
        status:'未支付'
      },
      {
        key:1,
        status:'已支付'
      },
      {
        key:2,
        status:'已寄'
      },
      {
        key:10,
        status:'已派'
      },
      {
        key:3,
        status:'已取'
      },
      {
        key:5,
        status:'派送成功'
      },
      {
        key:6,
        status: '已签收'
      },
      {
        key: 7,
        status: '工人拒收'
      }
      ,
      {
        key: 9,
        status: '已退款'
      }

    ],
    index: 0,
    searchStatus: '状态筛选',
    showModal: false
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    const app = getApp();
    const that = this;
    if (!app.globalData.Authorization) {
      redirectTo({
        url: '../index/index'
      });
      return;
    }
    qrcode = new QRCode('canvas', {
      text: "0000000000000",
      width: width,
      height: width,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    this.setData({
      phoneNum: app.globalData.phoneNum,
      Authorization: app.globalData.Authorization
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        if (res.data.Code == 200) {
          // console.log(res.data.Data.rows)
          that.setData({
            rows: res.data.Data.rows,
          })
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false;
        }
      },
      fail: () => {},
      complete: () => {wx.hideLoading()}
    });
  },

  // 支付
  pay: function(event) {
    // const app = getApp();
    // wx.showLoading({
    //   title: '正在支付...',
    //   mask: true
    // });
    const index = event.currentTarget.dataset.index
    const id = this.data.rows[index].Id;
    const indentCode = this.data.rows[index].IndentCode;
    const data = {
      indentCode: indentCode,
      id: id
    }
    wx.navigateTo({
      url: '../pay/pay?order=' + JSON.stringify(data),
    });
  },
  // 扫一扫
  scan: function(e) {
    this.setData({
      showModal: true
    });
    qrcode.makeCode(e.currentTarget.dataset.indentcode + '_' + this.data.phoneNum);

    // wx.showModal({
    //   title: '提示',
    //   content: '是否确认开箱？',
    //   success(result) {
    //     if(result.confirm) {
    //       wx.scanCode({
    //         success: (res) => {
    //           wx.request({
    //             url: `${URL}order/Flicking`,
    //             data: {
    //               IndentCode: event.currentTarget.dataset.indentcode,
    //               WechatPage: 'order',
    //               WechatFormId: app.globalData.formId,
    //               ...JSON.parse(res.result)
    //             },
    //             header: {
    //               'content-type': 'application/json',
    //               Authorization: app.globalData.Authorization
    //             },
    //             method: 'POST',
    //             dataType: 'json',
    //             responseType: 'text',
    //             success: (res) => {
    //               if (res.data.Code === 200) {
    //                 that.onLoad();
    //                 wx.showModal({
    //                   title: '开箱成功！',
    //                   showCancel: false
    //                 });
    //               } else {
    //                 wx.showModal({
    //                   title: res.data.Message,
    //                   showCancel: false
    //                 })
    //                 return false
    //               }
    //             }
    //           })
    //         },
    //         fail: (rej) => {},
    //         complete: ()=>{}
    //       })
    //     } else if(result.cancel) {
    //       return;
    //     }
    //   }
    // })

  },
  // 关闭弹框
  closeModal: function(e) {
    if (e.target.id === 'canvasBox') {
      return;
    }
    this.setData({
      showModal: false
    });
  },
  // 退款
  refund: function(e) {
    const app = getApp();
    const that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定退款？',
      success(result) {
        if (result.confirm) {
          wx.showLoading({
            title: '退款中...',
            mask: true,
          });
          wx.request({
            url: `${URL}order/WeChatRefund`,
            method: 'POST',
            header: {
              'content-type': 'application/json',
              Authorization: app.globalData.Authorization
            },
            data: {
              IndentCode: e.currentTarget.dataset.indentcode
            },
            success: function(res) {
              wx.hideLoading();
              // console.log(res)
              that.onLoad();
              if(res.data.Code == 200) {
                wx.showToast({
                  title: res.data.Message,
                  duration: 2000,
                  mask:true,
                  icon:'success',
                  success:function(){
                    
                  }
                });
              } else {
                wx.showModal({
                  title: res.data.Message,
                  showCancel: false
                });
              }
            }
          })
          
        } else if (result.cancel) {
          return;
        }
      }
    });
  },
  // 进入详情页
  openDetail: function(event) {
    const index = event.currentTarget.dataset.index
    const Id = this.data.rows[index].Id;
    wx.navigateTo({
      url: '../detail/detail?id=' + Id,
    });
  },
  openLogistics: function(event) {
    const index = event.currentTarget.dataset.index
    const Id = this.data.rows[index].Id;
    wx.navigateTo({
      url: '../logistics/logistics?id=' + Id
    })
  },
  toWash: function(event) {
    wx.navigateTo({
      url: '../wash/wash?id=' + event.currentTarget.dataset.id
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.data.formData.page = 1;
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: this.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          rows: res.data.Data.rows,
        });
        wx.showToast({
          title: '已经是最新的了',
          icon: 'success',
          duration: 1500,
          mask: true
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      complete: function() {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    // 页数+1
    this.data.formData.page += 1;
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: this.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // 回调函数
        var rows = that.data.rows;
        // 隐藏加载框
        wx.hideLoading();
        for (var i = 0; i < res.data.Data.rows.length; i++) {
          rows.push(res.data.Data.rows[i]);
        }
        if (res.data.Data.rows.length === 0) {
          wx.showToast({
            title: '已经到底了',
            duration: 1500,
            mask: true
          })
        }
        // 设置数据
        that.setData({
          rows: rows
        })

      }
    })

  },
  // 订单号搜索
  inputSearch: function(e) {
    console.log(e.detail.value)
    this.setData({
      inputSearch: e.detail.value
    })
    if(e.detail.value == ''){
      const app = getApp();
      const that = this;
      wx.request({
        url: `${URL}order/GetOrderList`,
        data: {
          page: 1,
          rows: 10,
          IndentCode: this.data.inputSearch,
          Status: -1
        },
        header: {
          'content-type': 'application/json',
          Authorization: app.globalData.Authorization
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          wx.hideLoading();
          if (res.data.Code == 200) {
            that.setData({
              searchStatus: '状态筛选',
              rows: res.data.Data.rows,
            })
          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            })
            return false;
          }
        },
        fail: () => { },
        complete: () => {
          wx.hideLoading()
        }
      });
    }
  },
  clickSearch: function() {
    const app = getApp();
    const that = this;
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: {
        page: 1,
        rows: 10,
        IndentCode: this.data.inputSearch,
        Status: -1
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        if (res.data.Code == 200) {
          that.setData({
            searchStatus: '状态筛选',
            rows: res.data.Data.rows,
          })
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false;
        }
      },
      fail: () => {},
      complete: () => {
        wx.hideLoading()
      }
    });
  },
  //状态筛选
  bindPickerChange: function(e) {
    const app = getApp();
    const that = this;
    const sssPage = 'formData.page'
    const sssStatus = 'formData.Status';
    // console.log(e.detail.value)
    that.setData({
      inputValue: '',
      index: e.detail.value,
      [sssPage]: 1,
      [sssStatus]: that.data.statusValue[e.detail.value].key,
      searchStatus: that.data.statusValue[e.detail.value].status
    })
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        if (res.data.Code == 200) {
          that.setData({
            rows: res.data.Data.rows,
          })
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false;
        }
      },
      fail: () => {},
      complete: () => {
        wx.hideLoading()
      }
    });
  },
  onUnload: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  calling:function(e){
    const workerPhone = e.currentTarget.dataset.phone;
    console.log(workerPhone);
    wx.makePhoneCall({
      phoneNumber: workerPhone,
      success: function (resp) {
        console.log(resp)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }

})