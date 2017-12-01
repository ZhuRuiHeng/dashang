const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:", options);
  },
  onShow: function () {
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "reward/account-details?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        let status = res.data.status;
        if (status==1){
          //时间戳转化
          function toDate(number) {
            var n = number * 1000;
            var date = new Date(n);
            console.log("date", date)
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
          }
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].add_time = toDate(res.data.data[i].add_time)
          }
          that.setData({
            listAll: res.data.data,
          })
          console.log("列表数据：",that.data.listAll);
        }else{
          tips.alert(res.data.msg);
          that.setData({
            listAll: false,
          })
        }
      }
    })
  },
  /**
 *   下拉分页
 */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let sign = wx.getStorageSync('sign');
    let oldGoodsList = that.data.listAll;
    console.log("oldGoodsList:" + oldGoodsList);
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log(that.data.page);
    wx.request({
      url: apiurl + "reward/account-details?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        page: reqPage,
        count: 10
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("新可能认识的人:", res);
        let status = res.data.status;
        if (status==1){
          var listAll = res.data.data;
          if (listAll.length == 0) {
            tips.alert('没有更多数据了');
            return;
          }
          var page = oldPage + 1;
          var newContent = oldGoodsList.concat(listAll);
          that.setData({
            listAll: newContent,
            page: reqPage
          })
          wx.hideLoading();
          if (newContent == undefined) {
            tips.alert('没有更多数据')
          }
        }else{
          tips.alert('没有更多数据了');
        }
        
      }
    })
    wx.hideLoading()
  }
})