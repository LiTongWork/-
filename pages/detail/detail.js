//Page Object
const {URL} = require('../../utils/http');
Page({
    data: {
        msg: {},
        clothes: [],
        Id: '',
        Authorization: ''
    },
    //options(Object)
    onLoad: function(option){
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const id = option.id;
      const app = getApp();
      const that = this;
      this.setData({
        Id: option.id,
        Authorization: app.globalData.Authorization
      });
      wx.request({
        url: `${URL}order/GetOrderDetails`,
        data: {Id: id},
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
            that.setData({
              msg: res.data.Data,
              clothes: res.data.Data.Clotheslist
            })
            console.log(res.data.Data)
          } else {
            wx.showToast({
              title: res.data.Data,
              duration: 2000,
              mask:true,
            })
          }
        }
      });
    }
});