const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeArray: ["事假", "病假"],
    V_type: "请选择 >",
    V_start: "请选择日期 >",
    V_start_day: "请选择时间 >",
    V_end_day: "请选择时间 >",
    V_end: "请选择日期 >",
    files: [],
    photoFiles: [],
    day: "提示: 至少0.5",
    user: {},
    array: ['上午', '下午'],
    array1: ['上午', '下午'],
    index: '',
    indextime: '',
    indexend: '',
    type_: '',
    reason: ''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (optaions) {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindTypeChange(e) {
    this.setData({
      index: e.detail.value,
      V_type: ""
    })
  },
  bindPickerChange4(e) {
    this.setData({
      indexend: e.detail.value,
      V_end_day: ''
    });
    var startday = this.data.date1,
      endday = this.data.date2,
      startDate = new Date(startday).getTime(),
      endDate = new Date(endday).getTime(),
      startTime = this.data.indextime,
      endTime = this.data.indexend;
    if (startDate && endDate && startTime && endTime){
      this.datenumber(startDate, endDate, startTime, endTime);
      }
    

  },
  bindPickerChange3(e) {
    this.setData({
      indextime: e.detail.value,
      V_start_day: ''
    });
    var startday = this.data.date1,
      endday = this.data.date2,
      startDate = new Date(startday).getTime(),
      endDate = new Date(endday).getTime(),
      startTime = this.data.indextime,
      endTime = this.data.indexend;

    if (startDate && endDate && startTime && endTime) {
      this.datenumber(startDate, endDate, startTime, endTime);
    }
  },
  start_time(e) {
    this.setData({
      date1: e.detail.value,
      V_start: ""
    });
    var startday = this.data.date1,
      endday = this.data.date2,
      startDate = new Date(startday).getTime(),
      endDate = new Date(endday).getTime(),
      startTime = this.data.indextime,
      endTime = this.data.indexend;

    if (startDate && endDate && startTime && endTime) {
      this.datenumber(startDate, endDate, startTime, endTime);
    }
  },
  V_end(e) {
    this.setData({
      date2: e.detail.value,
      V_end: ''
    });
    var startday = this.data.date1,
      endday = this.data.date2,
      startDate = new Date(startday).getTime(),
      endDate = new Date(endday).getTime(),
      startTime = this.data.indextime,
      endTime = this.data.indexend;

    if (startDate && endDate && startTime && endTime) {
      this.datenumber(startDate, endDate, startTime, endTime);
    }
  },
  //添加图片
  chooseImage() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        wx.uploadFile({
          url: api.url + '/rest/comment/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (result) {
            console.log(result)
            var resultData = JSON.parse(result.data)
            let pfs = that.data.photoFiles;
            if (resultData.success) {
              pfs.push(resultData.url);
              that.setData({
                photoFiles: pfs
              })
            }
          },
          fail: function (e) {
            console.log(e);
          }
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  datenumber(startDate, endDate, startTime, endTime) {
    // console.log(startDate, endDate, startTime, endTime)
    var time = Math.ceil(endNumber / 1000 / 60 / 60 / 24),
      endNumber = endDate - startDate,
      day = '',
      that = this;
    if (endNumber < 0) {
      wx.showToast({
        title: '请选择正确的日期',
        icon: "none"
      })
      return;

    } else if (endNumber == 0) {
      var joindate = new Date(startDate).getDay();
      if (joindate == 0 || joindate == 6) {
        wx.showToast({
          title: '请选择正确的日期',
          icon: "none"
        })
        return
      } else {
        //开始日期与结束日期相等
        if (startTime == endTime) {
          that.setData({
            day: "0.5"
          })

        } else {
          that.setData({
            day: "1"
          })

        }
      }

    } else if (endNumber > 0) {
      //结束日期大于开始日期
      var time = Math.ceil(endNumber / 1000 / 60 / 60 / 24);

      var joindate = new Date(startDate).getDay(),
        outdate = new Date(endDate).getDay(),
        day = 0;

      if (joindate == 0 || joindate == 6) { } else {
        if (startTime == 0) {
          that.setData({
            day: day += 1
          })
        } else {
          that.setData({
            day: day += 0.5
          })
        }

      }
      if (outdate == 0 || outdate == 6) { } else {
        if (endTime == 0) {
          that.setData({
            day: day += 0.5
          })
        } else {
          that.setData({
            day: day += 1
          })
        }

      }
      for (var i = 1; i < time; i++) {
        var middle = new Date(startDate + (i * 24 * 60 * 60 * 1000)).getDay();
        if (middle == 0 || middle == 6) { } else {
          that.setData({
            day: day += 1
          })
        }

      }


    }
  },

  reasonChange: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  delImage: function (e) {
    let fis = this.data.files;
    let index = fis.indexOf(e.target.dataset.currentimg)
    fis.splice(index, 1);
    this.setData({
      files: fis,
      photoFiles: fis
    })
  },
  //发起
  finalSub: function () {
    var that = this;
    const {
      date1,
      date2,
      index,
      indextime,
      indexend,
      day,
      reason
    } = that.data;
    if (day == '提示: 至少0.5') {
      wx.showToast({
        title: '请输入正确日期',
      })
      return;
    }
    api.fetch({
      url: 'rest/work/doLeave',
      data: {
        userId: that.data.user.userId,
        photoFiles: that.data.photoFiles,
        type: parseInt(index) + 1,
        beginLeave: date1 + ' ' + (indextime == 0 ? '上午' : '下午'),
        endLeave: date2 + ' ' + (indexend == 0 ? '上午' : '下午'),
        leaveDays: day,
        leaveReason: reason
      },
      callback: (err, result) => {
        console.log(result)
        if (result.success) {
          wx.navigateBack({
            url: '/pages/launch/index'
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
})