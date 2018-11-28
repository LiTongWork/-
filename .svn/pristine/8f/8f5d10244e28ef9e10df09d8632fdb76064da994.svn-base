//Page Object
const {
  URL
} = require('../../utils/http');
var QRCode = require('../../utils/weapp-qrcode.js');
var qrcode;
const app = getApp();
Page({
  data: {
    msg: {},
    clothes: [],
    Id: '',
    Authorization: '',
    showModal: false,
    wroksRemark:'',
    StudentPhone:''
  },
  //options(Object)
  onLoad: function(option) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    qrcode = new QRCode('canvas', {
      text: "0000000000000",
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    const id = option.id;
    const that = this;
    this.setData({
      Id: option.id,
      Authorization: app.globalData.Authorization
    });
    wx.request({
      url: `${URL}order/GetOrderDetails`,
      data: {
        Id: id
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
        if (res.data.Code === 200) {
          that.setData({
            msg: res.data.Data,
            clothes: res.data.Data.Clotheslist,
            StudentPhone: res.data.Data.StudentPhone
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
  },
  onRejection: function(e) {
    var ww = null ;
    var that = this;
    console.log(that.data.wroksRemark)
    if (that.data.wroksRemark == ''){
      wx.showToast({
        title: '拒收原因不能为空。',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否确定拒收？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中...',
              mask: true,
            });
            wx.request({
              url: `${URL}order/WorkerRejection`,
              data: {
                IndentCode: e.currentTarget.dataset.indentcode,
                WroksRemark: that.data.wroksRemark
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
                console.log(res.data)
                if (res.data.Code === 200) {
                  that.setData({
                    showModal: true
                  });
                  qrcode.makeCode('W' + e.currentTarget.dataset.indentcode + '_' + that.data.StudentPhone);
                  
                } else {
                  console.log(res.data.Data)
                  if (res.data.Data == null) {
                    ww = res.data.Message
                  } else {
                    ww = res.data.Data
                  }
                  wx.showToast({
                    title: ww,
                    icon: 'none',
                    duration: 2000,
                    mask: true,
                  })
                }
              }
            });
          } else if (res.cancel) {

          }
        }
      })
    }
    

  },
  // 关闭弹框
  closeModal: function (e) {
    if (e.target.id === 'canvasBox') {
      return;
    }
    this.setData({
      showModal: false
    });
  },
  input: function (e) {
    this.setData({
      wroksRemark: e.detail.value
    });
  },
  btnCancel:function(){
    wx.redirectTo({
      url: '../workerOrder/workerOrder',
    })
  }
});