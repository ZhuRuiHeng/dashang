const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: ['打开有惊喜', '猜猜这是谁', '你绝对想不到的视频', '私家珍藏！不看肯定后悔！', '大家好，给大家介绍一下，这是我女朋友', '大家好，给大家介绍一下，这是我男朋友'],
    dialog: false,
    min: 1,
    max: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  upVideo(){
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log("视频:", res);
        var tempFilePath = res.tempFilePath; //视频
        var thumbTempFilePath = res.thumbTempFilePath;//图
        var size = (res.size/1024)/1024; //大小
        var duration = res.duration;
        if (duration<3){
          tips.alert('视频时长不能小于3s!');
          return false;
        }
        if (size>25){
            tips.alert('视频压缩不能大于25M!');
            return false;
        }
        that.setData({
          src: res.tempFilePath
        })
        tips.loading('上传中');
       console.log('tempFilePath:', tempFilePath);
        console.log(apiurl + "public/upload-video?sign=" + sign + '&operator_id=' + app.data.kid + '&app_type=reward');
        wx.uploadFile({
          url: apiurl + "public/upload-video?sign=" + sign + '&operator_id=' + app.data.kid +'&app_type=reward',
          filePath: tempFilePath,
          name: 'video',
          header: { 'content-type': 'multipart/form-data' },
          formData: null,
          success: function (res) {
            console.log("视频：",res)
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              that.setData({
                url: data.data,
                dialog: true
              })
              tips.success('上传成功！')
            } else {
              tips.alert(res.data.msg)
            }
            tips.loaded(); //消失
          }
        })
      }
    })
  },
  close() {
    this.setData({
      dialog: false
    })
  },
  //描述
  bindContent(e) {
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
      itemList: ['打开有惊喜', '猜猜这是谁', '你绝对想不到的视频', '私家珍藏！不看肯定后悔！', '大家好，给大家介绍一下，这是我女朋友', '大家好，给大家介绍一下，这是我男朋友'],
      success: function (e) {
        console.log(e.tapIndex);
        that.setData({
          desc: itemList[e.tapIndex]
        })
      }
    })
  },
  min(e) {
    console.log('min:', e.detail.value);
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
  next() {
    let that = this;
    let sign = wx.getStorageSync('sign');
    if (!that.data.desc) {
      that.setData({
        desc: '私家珍藏！不看肯定后悔！'
      })
    }
    console.log("min,max,desc", that.data.min, that.data.max, that.data.desc);
    // 请求
    wx.request({
      url: apiurl + "reward/create-video-packet?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        min: parseInt(that.data.min),
        max: parseInt(that.data.max),
        desc: that.data.desc,
        url: that.data.url,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log("生成视频红包:", res);
        var status = res.data.status;
        if (status == 1) {
          let p_id = res.data.data;
          wx.navigateTo({
            url: '../poster/poster?types=2&p_id='+p_id
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