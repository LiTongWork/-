// 物流
const {URL} = require('../../utils/http');
Page({
    data: {
        msg: {},
        logistics: [],
        id: '',
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
          url: `${URL}order/GetLogistics`,
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
                res.data.Data.Logistics.forEach(value=>{
                  value.StrTime = ("'"+value.StrTime+"'").toString().substr(6,11);
                });
                that.setData({
                    msg: res.data.Data,
                    logistics: res.data.Data.Logistics
                })
            } else {
              wx.showToast({
                title: res.data.Message,
                icon: 'none',
                duration: 2000,
                mask:true,
              })
            }
          }
        });
      }
});