// pages/tixian/tixian.js
const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "reward/get-balance?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("获取余额:", res);
        that.setData({
          allMoney: res.data.data
        })
      }
    })
  },
  allMoney(e){
    this.setData({
      _money: this.data.allMoney
    })
  },
  bindKeyInput(e) {
    this.setData({
      _money: e.detail.value
    })
  },
  tixian() {
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '加载中',
    });
    //提现
    wx.request({
      url: apiurl + "public/apply-cash?sign=" + sign + '&operator_id=' + app.data.kid +'&app_type=reward',
      data: {
        money: that.data._money
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("提现:", res);
        var status = res.data.status;
        if (status == 1) {
          // 提现
          tips.success('提现成功！');
          // 返回
          that.setData({
            _money: ''
          })
          wx.navigateTo({
            url: '../keep/keep'
          })
          
        } else {
          console.log(res.data.msg);
          tips.error(res.data.msg);
        }
      }
    })
    wx.hideLoading()
  }


})