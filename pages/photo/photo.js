const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: ['打开有惊喜', '猜猜这是谁', '你绝对想不到的照片', '私家珍藏！不看肯定后悔！', '大家好，给大家介绍一下，这是我女朋友', '大家好，给大家介绍一下，这是我男朋友'],
    dialog: false,
    min:1,
    max:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
      let that = this;
      let sign = wx.getStorageSync('sign');
      
  },
  upPhoto: function () {
     let that = this;
     let sign = wx.getStorageSync('sign');
     wx.showLoading({
       title: '加载中',
     });
    // 上传 
     wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            console.log("选择相册", res);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            tips.loading('上传中');
            tips.loaded(); //消失
            that.setData({
              dialog: true
            })
            console.log(apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);
            wx.uploadFile({
              url: apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid,
              filePath: tempFilePaths[0],
              name: 'image',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                console.log('上传图片成功',res);
                let data = JSON.parse(res.data);
                if (data.status == 1) {
                  that.setData({
                    url: data.data
                  })
                } else {
                  tips.alert(res.data.msg)
                }
              }
            })
          }
        })
        wx.hideLoading()
  },
  close(){
    this.setData({
      dialog: false      
    })
  },
  //描述
  bindContent(e){
    console.log('描述', e.detail.value);
    let desc = e.detail.value;
    this.setData({
      desc
    })
  },
  actionSheetTap: function () {
    let that = this;
    let itemList = that.data.itemList;
    wx.showActionSheet({
      itemList: ['打开有惊喜', '猜猜这是谁', '你绝对想不到的照片', '私家珍藏！不看肯定后悔！', '大家好，给大家介绍一下，这是我女朋友', '大家好，给大家介绍一下，这是我男朋友'],
      success: function (e) {
        console.log(e.tapIndex);
        that.setData({
          desc: itemList[e.tapIndex]
        })
      }
    })
  },
  min(e){
    console.log('min:',e.detail.value);
    this.setData({
      min: e.detail.value
    })
  },
  max(e) {
    console.log('max:', e.detail.value);
    this.setData({
      max: e.detail.value
    })
  },
  next(){
    let that = this;
    let sign = wx.getStorageSync('sign');
    if (!that.data.desc){
      that.setData({
        desc: '私家珍藏！不看肯定后悔！'
      })
    }
    console.log("min,max,desc", that.data.min, that.data.max, that.data.desc);
    // function isInteger(obj) {
    //   return obj % 1 === 0
    // }
    // console.log(isInteger(3));
    // console.log(isInteger(that.data.max), "isInteger");
    console.log(apiurl + "reward/create-image-packet?sign=" + sign + '&operator_id=' + app.data.kid)
    // 请求
    wx.request({
      url: apiurl + "reward/create-image-packet?sign="+sign +'&operator_id='+ app.data.kid,
      data:{
        min: that.data.min,
        max: that.data.max,
        desc: that.data.desc,
        url: that.data.url
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log("生成红包:", res);
        var status = res.data.status;
        if (status == 1) {
            let p_id = res.data.data;
            console.log(p_id);
            wx.navigateTo({
              url: '../poster/poster?types=1&p_id=' + p_id
            })
        } else {
            tips.alert(res.data.msg);
        }
      }
    })
    that.setData({
      dialog: false,
      min: 1,
      max: 10
    })
  }
  
})