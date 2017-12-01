const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
Page({
  data: {
    type: 'img',
    navto: 1,  //是否跳转启动页 1跳转 0 不跳转
    broadcasting: '肌肤有困难？就找禾葡兰！千名专业美肤导师为你提供一对一服务，随时免费咨询，微信搜索小程序：禾葡兰护肤中心',
  },
  //事件处理函数
  photo: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../photo/photo'
    })
  },
  video: function (e) {
    wx.navigateTo({
      url: '../video/video'
    })
  },
  onLoad: function (options) {
    let that = this;
     wx.setStorageSync("navto", 1);
     console.log("options:", options);
    //  是否有scene参数跳转seen
     if (options.scene) {
       let scene = decodeURIComponent(options.scene);
       console.log("scene:", scene);
       var strs = new Array(); //定义一数组 
       strs = scene.split("_"); //字符分割 
       console.log(strs);
       console.log("p_id:", strs[1]);
       var p_id = strs[1];
       that.setData({
         p_id: p_id
       })
      
     }
  },
  onShow: function () {
      let that = this;
      let sign = wx.getStorageSync('sign');
      if (that.data.p_id) {
        wx.navigateTo({
          url: '../seen/seen?p_id=' + that.data.p_id
        })
      }
      if (wx.getStorageSync("navto")) {
        setTimeout(function () {
          wx.navigateTo({
            url: '../adver/adver'
          })
        }, 20)
      }
      //滚动文字
      wx.request({
        url: "https://unify.playonweixin.com/site/get-advertisements",
        success: function (res) {
          console.log(res);
          if (res.data.status) {
            var advers = res.data.adver.advers;
            var head_adver = res.data.adver.head_adver;
            var broadcasting = res.data.adver.broadcasting;
            wx.setStorageSync("advers", advers);
            wx.setStorageSync("broadcasting", broadcasting);
            that.setData({
              broadcasting
            })
          }
        }
      })
      app.getAuth(function () {
        let userInfo = wx.getStorageSync('userInfo');
        let sign = wx.getStorageSync('sign');
      })
  }
})
