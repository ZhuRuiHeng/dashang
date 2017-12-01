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
  mingxi(){
    wx.navigateTo({
      url: '../keep/keep'
    })
  },
  tixian(){
    wx.navigateTo({
      url: '../tixian/tixian'
    })
  }
})