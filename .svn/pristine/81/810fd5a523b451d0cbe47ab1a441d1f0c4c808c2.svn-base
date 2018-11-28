// pages/wash/wash.js
const {
  URL
} = require('../../utils/http');
Page({
  data: {
    showView: false,
    menus: [],
    clothesList: [],
    clothesAll: [],
    clothesAllIndex: 0,
    checkedList: [],
    changeList: [],
    noMenu: '',
    menuItme: 0,
    Authorization: '',
    ids: [],
    totalNum: 0,
    totalPrice: 0,
    oldId: null
  },


  onLoad: function (option) {
    // 页面初始化 options为页面跳转所带来的参数
    const oldId = option.id;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    const that = this;
    const app = getApp();
    this.setData({
      Authorization: app.globalData.Authorization,
      oldId: oldId
    })
    app.globalData.Id = oldId;
    // 是否为修改页面
    if(oldId) {
      wx.request({
        url: `${URL}order/GetOrderDetails`,
        data: {Id: oldId},
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
            const checkedList = res.data.Data.Clotheslist;
            checkedList.forEach(value=> {
                value.Id = value.ClothesId;
                value.Name = value.ClotherName;
                value.Price = value.ClothesPrice
            })
            that.setData({
              changeList: res.data.Data.Clotheslist,
              checkedList: checkedList,
              totalNum: checkedList.length,
              totalPrice: res.data.Data.TotalPrice
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
    }
    
    // 获取衣服类型
    wx.request({
      url: `${URL}order/GetClothesType`,
      header: {
        'content-type': 'application/json',
        Authorization: that.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.data.Code == 200) {
          if (res.data.Data) {
            const ids = that.data.ids;
            const clothesAll = that.data.clothesAll;
            ids.push(res.data.Data.ParentList[0].Id);
            that.setData({
              menus: res.data.Data.ParentList,
              ids: ids
            });
            // 获取衣服种类
            wx.request({
              url: `${URL}order/GetChildeType`,
              data: { id: res.data.Data.ParentList[0].Id },
              header: {
                'content-type': 'application/json',
                Authorization: that.data.Authorization
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (result) {
                if (result.data.Code == 200) {
                  if (result.data.Data.ClothesList.length) {
                    const clothes = result.data.Data.ClothesList;
                    clothes.forEach(value => {
                      value.Number = 0;
                      value.ParentName = res.data.Data.ParentList[0].Name
                    });
                    // 如果是修改
                    if(oldId) {
                      const changeList = that.data.changeList;
                      clothes.forEach(value1 => {
                        changeList.forEach(value2 => {
                          if(value1.Id === value2.ClothesId) {
                            value1.Number = value2.Number;
                          }
                        })
                      });
                    }
                    clothesAll.push(clothes);
                    that.setData({
                      clothesList: clothes,
                      clothesAll: clothesAll,
                    });
                  }

                }
              }
            })
          } else {
            this.setData({
              noMenu: '暂无数据'
            })
          }
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false
        }
      },
      fail: () => { },
      complete: () => {wx.hideLoading();}
    });
  },
  toggleList: function () {
    var that = this;
    if(!this.data.totalNum) {return;}
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 菜单切换
  menuTap: function (event) {
    const index = event.currentTarget.dataset.index;
    const that = this;
    this.setData({
      menuItme: index
    });
    const id = this.data.menus[index].Id;
    const ids = this.data.ids;
    const clothesAll = this.data.clothesAll;
    const clothesList = this.data.clothesList;
    if (ids.indexOf(id) > -1) {
      this.setData({
        clothesList: clothesAll[ids.indexOf(id)],
        clothesAllIndex: ids.indexOf(id)
      });
      wx.hideLoading();
      return;
    } else {
      ids.push(id);
      this.setData({
        ids: ids
      });
      wx.showLoading({
        title: '玩命加载中...',
        mask: true
      });
      wx.request({
        url: `${URL}order/GetChildeType`,
        data: { id: id },
        header: {
          'content-type': 'application/json',
          Authorization: this.data.Authorization
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (result) {
          if (result.data.Code == 200) {
            if (result.data.Data.ClothesList.length) {
              const clothes = result.data.Data.ClothesList;
              const ParentName = that.data.menus.find(value=>value.Id === id).Name;
              clothes.forEach(value => {
                value.Number = 0;
                value.ParentName = ParentName
              });
              // 如果是修改
              if(that.data.oldId) {
                const changeList = that.data.changeList;
                clothes.forEach(value1 => {
                  changeList.forEach(value2 => {
                    if(value1.Id === value2.ClothesId) {
                      value1.Number = value2.Number;
                    }
                  })
                });
              }
              clothesAll.push(clothes);
              that.setData({
                clothesList: clothes,
                clothesAll: clothesAll,
                clothesAllIndex: clothesAll.length - 1
              });
            } else {
              const clothes = result.data.Data.ClothesList;
              clothesAll.push(clothes);
              that.setData({
                clothesList: clothes,
                clothesAll: clothesAll,
                clothesAllIndex: clothesAll.length - 1
              });
            }

          }
        },
        complete: function() {wx.hideLoading();}
      })
    }
  },
  // 单件减 
  minusCartCount: function (event) {
    const index = event.currentTarget.dataset.index;
    const clothes = this.data.clothesList;
    const clothesAll = this.data.clothesAll;
    const clothesAllIndex = this.data.clothesAllIndex;
    let checkedList = this.data.checkedList;
    let totalNum = this.data.totalNum;
    let totalPrice = this.data.totalPrice;
    if (clothes[index].Number > 0) {
      clothes[index].Number -= 1;
      const minusId = clothes[index].Id;
      const thisCount = clothes[index].Number;
      for (let i = 0; i < checkedList.length; i++) {
        if (checkedList[i].Id === minusId && thisCount === 0) {
          checkedList.splice(i, 1);
        } else if(checkedList[i].Id === minusId && thisCount !== 0) {
          checkedList[i] = clothes[index];
        }
      }
      totalPrice = 0;
      checkedList.forEach(value => {
        totalPrice += value.Number*value.Price;
      });
      clothesAll[clothesAllIndex] = clothes;
      if (totalNum > 0) {
        totalNum -= 1;
      }
      this.setData({
        clothesList: clothes,
        clothesAll: clothesAll,
        totalNum: totalNum,
        checkedList: checkedList,
        totalPrice: totalPrice
      });
    }
    return;
  },
  // 单件加
  addCartCount: function (event) {
    const index = event.currentTarget.dataset.index;
    const clothes = this.data.clothesList;
    const clothesAll = this.data.clothesAll;
    const clothesAllIndex = this.data.clothesAllIndex;
    let checkedList = this.data.checkedList;
    let totalNum = this.data.totalNum;
    let totalPrice = this.data.totalPrice;
    const minusId = clothes[index].Id;
    let a = false;
    let listIndex = -1;

    clothes[index].Number += 1;
   
    if(checkedList.length) {
      for (let i = 0; i < checkedList.length; i++) {
        if ( checkedList[i].Id === minusId) {
          listIndex = i;
          a = true;
          break;
        }
      }
    }
    if(a) {
      checkedList[listIndex] = clothes[index];
    } else {
      checkedList.push(clothes[index]);
    }
    totalPrice = 0;
    checkedList.forEach(value => {
      totalPrice += value.Number*value.Price;
    });
    totalNum += 1;
    clothesAll[clothesAllIndex] = clothes;
    this.setData({
      clothesList: clothes,
      clothesAll: clothesAll,
      totalNum: totalNum,
      checkedList: checkedList,
      totalPrice: totalPrice
    });
    return;
  },

  // 订单减
  cartMinus: function(event) {
    const index = event.currentTarget.dataset.index;
    const checkedList = this.data.checkedList;
    let totalPrice = this.data.totalPrice;
    const minusId = checkedList[index].Id;
    const clothesList = this.data.clothesList;
    const clothesAll = this.data.clothesAll;
    let totalNum = this.data.totalNum;
    if (checkedList[index].Number > 1) {
      checkedList[index].Number -= 1;
    } else {
      checkedList.splice(index, 1);
    }
    for (let i = 0; i < clothesList.length; i++) {
      if (clothesList[i].Id === minusId) {
        clothesList[i].Number -= 1;
      }
    }
    for (let a = 0; a < clothesAll.length; a++) {
      for(let b =0; b < clothesAll[a].length; b++) {
        if(clothesAll[a][b].Id === minusId) {
          clothesAll[a][b].Number -= 1;
        }
      }
    }
    totalPrice = 0;
    checkedList.forEach(value => {
      totalPrice += value.Number*value.Price;
    });
    totalNum -= 1;
    if(totalNum === 0) {
      this.setData({
        showView: false
      })
    }
    this.setData({
      totalPrice: totalPrice,
      checkedList: checkedList,
      clothesAll: clothesAll,
      clothesList: clothesList,
      totalNum: totalNum
    })
  },
  // 订单加
  cartAdd: function(event) {
    const index = event.currentTarget.dataset.index;
    const checkedList = this.data.checkedList;
    let totalPrice = this.data.totalPrice;
    const minusId = checkedList[index].Id;
    const clothesList = this.data.clothesList;
    const clothesAll = this.data.clothesAll;
    let totalNum = this.data.totalNum;
    checkedList[index].Number += 1;
    for (let i = 0; i < clothesList.length; i++) {
      if (clothesList[i].Id === minusId) {
        clothesList[i].Number += 1;
      }
    }
    for (let a = 0; a < clothesAll.length; a++) {
      for(let b =0; b < clothesAll[a].length; b++) {
        if(clothesAll[a][b].Id === minusId) {
          clothesAll[a][b].Number += 1;
        }
      }
    }
    totalPrice = 0;
    checkedList.forEach(value => {
      totalPrice += value.Number*value.Price;
    });
    totalNum += 1;
    this.setData({
      totalPrice: totalPrice,
      checkedList: checkedList,
      clothesAll: clothesAll,
      clothesList: clothesList,
      totalNum: totalNum
    })
  },
  // 清空
  empty: function() {
    const clothesList = this.data.clothesList;
    const clothesAll = this.data.clothesAll;
    for (let i = 0; i < clothesList.length; i++) {
      clothesList[i].Number = 0;
    }
    for (let a = 0; a < clothesAll.length; a++) {
      for(let b =0; b < clothesAll[a].length; b++) {
        clothesAll[a][b].Number = 0;
      }
    }
    this.setData({
      checkedList: [],
      totalNum: 0,
      totalPrice: 0,
      clothesList: clothesList,
      clothesAll: clothesAll,
      showView: false
    });
  },
  // 支付
  pay: function() {
    const list = this.data.checkedList;
    const app = getApp();
    const clothesList = this.data.checkedList.map(value => {
      value.ParentId
    })
    wx.request({
      url: `${URL}order/SaveOrder`,
      data: {
        StudentRemark: '',
        UserId: '',
        Id: app.globalData.Id,
        clotheslist: list
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        app.globalData.Id = '';
        if (res.data.Code == 200) {
          app.globalData.IndentCode = res.data.Data;
          wx.showToast({
            title: '下单成功',
            icon: 'succes',
            duration: 20000,
            mask:true,
            success: function() {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../pay/pay?list='+ JSON.stringify(list)
                });
                wx.hideToast();
              }, 2000);  
              
            }
          });
         
        } else {
          if(res.data.Message === '身份认证失败。') {
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 2500,
              mask:true,
              success: function() {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../login/login'
                  });
                  wx.hideToast();
                }, 2500);
              }
            });
            
          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            });
            return false;
          }
        }
      },
      complete: function() {
        app.globalData.Id = '';
      }
    });
    


    
  },
})