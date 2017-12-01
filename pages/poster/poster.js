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
    console.log("options:", options);
    let types = options.types;
    this.setData({
      types,
      p_id: options.p_id
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let sign = wx.getStorageSync('sign');
    //红包详情
    wx.request({
      url: apiurl + "reward/share?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        p_id: that.data.p_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        let status = res.data.status;
        if (status==1){
          console.log("二维码:", res);
          that.setData({
            imgUrl: res.data.data
          })
        }else{
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
    
  },
  // 预览海报
  prewImg: function () {
    console.log("prewImg:",this.data.imgUrl);
    wx.previewImage({
      current: this.data.imgUrl, // 当前显示图片的http链接
      urls: [this.data.imgUrl] // 需要预览的图片http链接列表
    })
  },
  downLoad: function () {
    console.log("downLoad:",this.data.imgUrl);
    wx.downloadFile({
      url: this.data.imgUrl, //仅为示例，并非真实的资源
      success: function (res) {
        console.log("成功：",res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res);
            wx.showToast({
              title: '海报下载成功，请去相册查看',
              icon: 'success',
              duration: 800
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function (e) {
    console.log(e);
    var that = this;
    var title = e.target.dataset.title;
      return {
        title: title,
        path: '/pages/seen/seen?types=' + that.data.types + '&p_id=' + that.data.p_id,
        success: function (res) {
          console.log(res);
          // 转发成功
        },
        fail: function (res) {
          console.log(res);
          // 转发失败
        }
      }
  }
})