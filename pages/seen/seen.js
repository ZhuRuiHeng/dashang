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
    let types = options.types;
    console.log("options:", options);
    this.setData({
      p_id: options.p_id
    })
  },
  onShow: function () {
      let that = this;
      app.getAuth(function () {
        let userInfo = wx.getStorageSync('userInfo');
        let sign = wx.getStorageSync('sign');
        that.setData({
          userInfo
        })
        //红包详情
        wx.request({
          url: apiurl + "reward/packet-detail?sign=" + sign + '&operator_id=' + app.data.kid,
          data:{
            p_id: that.data.p_id
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("红包详情:", res);
            let status = res.data.status;
            if (status==1){
                that.setData({
                  informAll: res.data.data,
                  can_see: res.data.data.can_see,
                  types: res.data.data.type,
                  blur: true  //是否模糊
                })
                if (that.data.types == 'images') {
                  that.setData({
                    keyWord: '图片'
                  })
                } else {
                  that.setData({
                    keyWord: '视频'
                  })
                }
                console.log("can_see", res.data.data.can_see);
                if (res.data.data.can_see == false) {
                  that.setData({
                    money: res.data.data.money,
                    blur: false //是否模糊
                  })
                }
            }else{
              tips.alert(res.data.msg)
            }
            
          }
        })
        //是否有支付功能
        wx.request({
          url: apiurl + "reward/can-pay?sign=" + sign + '&operator_id=' + app.data.kid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("是否有支付功能:", res);
            that.setData({
              canPay: res.data.data
            })
          }
        })
      })
  },
  blur(){
    let that = this;
    let sign = wx.getStorageSync('sign');
    if (that.data.blur == false) {  //是否模糊
        //红包详情
        wx.request({
          url: apiurl + "reward/packet-detail?sign=" + sign + '&operator_id=' + app.data.kid,
          data: {
            p_id: that.data.p_id
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("红包详情:", res);
            that.setData({
              informAll: res.data.data,
              can_see: res.data.data.can_see
            })
            if (res.data.data.can_see == false) {
              that.setData({
                money: res.data.data.money
              })
            }
          }
        })
    }else{

    }
  },
  // 发红包
  formSubmit(e){
    let that = this;
    let sign = wx.getStorageSync('sign');
    let form_id = e.detail.formId;//红包类型
    // 保存formId
    wx.request({
      url: apiurl + "public/save-form?sign=" + sign + '&operator_id=' + app.data.kid,
      data:{
        form_id: form_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("保存formId成功:", res);
      }
    })
    if (!that.data.canPay){
        tips.alert('您未开通支付功能！');
        return false;
    }
    if (!form_id) {
      tips.alert("formId错误");
      return false;
    }
    wx.request({
      url: apiurl + "reward/reward?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        p_id: that.data.p_id,
        money: that.data.money,
        form_id: form_id + Math.random() * 10
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("打赏红包:", res);
        if (res.data.status == '1') {
            let params = res.data.data;
            console.log(params);
            // 调用支付
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              'success': function (res) {  //成功
                  that.setData({
                    can_see:true
                  })
              }, 
              'fail': function (res) {  //失败
                  tips.alert('支付失败！')
              }
            })
        } else {
          tips.alert(res.data.msg)
        }
      }
    })
  },
  close() {
    this.setData({
      can_see: true
    })
  },
  // 预览海报
  prewImg: function () {
    console.log("prewImg:", this.data.informAll.url);
    wx.previewImage({
      current: this.data.informAll.url, // 当前显示图片的http链接
      urls: [this.data.informAll.url] // 需要预览的图片http链接列表
    })
  },
  backHome(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})