//index.js
//获取应用实例
const app = getApp();
const { URL } = require('../../utils/http');
var ctx;
Page({
  data: {
    mobile:'',
    psd:'',
    verifyCode:'',
    text:'',
    code: ''
    //这里text是本地制作的验证码，后期换上接口的
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    var app = getApp();
    wx.login({
      success(res) {
        app.globalData.OpenId = res.code;
        that.setData({
          code: res.code
        });
      }
    })
    drawPic(that);
     
  },
  change: function () {
    var that = this;
    drawPic(that);
  },
  inputMobile:function(e){
    //手机号码
    this.setData({
      mobile:e.detail.value
    })
  },
  inputPsd: function (e) {
    //密码
    this.setData({
      psd: e.detail.value
    })
  },
  importVerify:function (e) {
    //验证码
    this.setData({
      verifyCode: e.detail.value 
    })
  },
  loginClick:function(e){
    //登录
    const app = getApp();
    app.formId = e.detail.formId;
    var mobile = this.data.mobile;
    var psd = this.data.psd;
    var verifyCode = this.data.verifyCode.toUpperCase();
    var mobileReg = /^1[34578]\d{9}$/;
    if (mobile == '') {
      wx.showModal({
        title: '手机号不能为空！',
        showCancel:false
      })
      return false
    }else if (!mobileReg.test(mobile)) {
      wx.showModal({
        title: '手机号有误！',
        showCancel: false
      })
      return false
    } else if (psd.length < 6 || psd.length > 32){
      //先判断密码长度
      wx.showModal({
        title: '密码有误！',
        showCancel: false
      })
      return false
    }else if (verifyCode == ''){
      //接判断验证码
      wx.showModal({
        title: '验证码不能为空！',
        showCancel: false
      })
      return false
    } else if (verifyCode != this.data.text ) {
      wx.showModal({
        title: '验证码有误！',
        showCancel: false
      })
      drawPic(this);
      return false
    }else {
      const that = this;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: `${URL}AccountManage/UserLogin`,
        data: {
          UserName: mobile,
          Password: psd,
          OpenId: that.data.code
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          wx.hideLoading();
          that.onLoad();
          if (res.data.Code == 200) {
            var app = getApp();
            app.globalData.Authorization = res.data.Data;
            app.globalData.phoneNum = that.data.mobile;
            wx.request({
              url: `${URL}AccountInfo/GetUserInfo`,
              header: {
                'content-type': 'application/json',
                Authorization: app.globalData.Authorization
              },
              method: 'post',
              dataType: 'json',
              responseType: 'text',
              success: function (result) {
                if (result.data.Code === 200 && result.data.Data.LoginType === 2) {
                  wx.redirectTo({
                    url: '../worker/worker',
                  })
                } else {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              }
            })

          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            })
            return false
          }
        },
        complete: function () { wx.hideLoading() }

      })
    }
  },
  registerClick:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  toForget: function() {
    wx.navigateTo({
      url: '../forget/forget'
    })
  }

  
})

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**生成一个随机色**/
function randomColor(min, max) {
  var r = randomNum(min, max);
  var g = randomNum(min, max);
  var b = randomNum(min, max);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/**绘制验证码图片**/
function drawPic(that) {
  ctx = wx.createCanvasContext('canvas');
  /**绘制背景色**/
  ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
  ctx.fillRect(0, 0, 100, 50)
  /**绘制文字**/
  var arr;
  var text = '';
  var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
  for (var i = 0; i < 4; i++) {
    var txt = str[randomNum(0, str.length)];
    ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
    ctx.font = randomNum(20, 26) + 'px SimHei'; //随机生成字体大小
    var x = 5 + i * 20;
    var y = randomNum(20, 25);
    var deg = randomNum(-20, 20);
    //修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 5, 0);
    text = text + txt;
    //恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  /**绘制干扰线**/
  for (var i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, 90), randomNum(0, 28));
    ctx.lineTo(randomNum(0, 90), randomNum(0, 28));
    ctx.stroke();
  }
  /**绘制干扰点**/
  for (var i = 0; i < 20; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, 90), randomNum(0, 28), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.draw(false, function () {
  
    that.setData({
      text: text
    });
  
  });
}
