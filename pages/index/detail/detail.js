// pages/moreInfo/detail.js
let wxCharts = require('../../../utils/wxcharts.js');
let lineChart = null;

let renderLineChart = (dateList, maxTempList, minTempList) => {
  let windowWidth = 400;
  try {
    let res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
  } catch (e) {
    console.error('getSystemInfoSync failed!');
  }
  lineChart = new wxCharts({
    canvasId: 'tempByDay',
    type: 'line',
    categories: dateList,
    animation: true,
    // background: '#ff0000',
    series: [{
      name: '最高温',
      color: '#FD881B',
      data: maxTempList,
      format: function (val) {
        return val + '℃';
      }
    }, {
      name: '最低温',
      color: '#41A4FF',
      data: minTempList,
      format: function (val, name) {
        return val + '℃';
      }
    }],
    xAxis: {
      disableGrid: true
    },
    yAxis: {
      title: '温度 (℃)',
      titleFontColor: '#333333',
      format: function (val) {
        return val;
      },
      min: Math.min.apply(null, minTempList) - 3
    },
    width: windowWidth,
    height: 250,
    dataLabel: false,
    dataPointShape: true,
    extra: {
      lineStyle: 'curve'
    }
  });
}

Page({
  data: {

  },
  onLoad: function () {
    wx.getStorage({
      key: 'dailyData',
      success: (res) => {
        let dailyData = res.data
        let dateList = []
        let srcList = []
        let maxTempList = []
        let minTempList = []
        // 将后台传来的日期从 YYYY-MM-DD 改为 MM/DD
        dailyData.forEach((item, index) => {
          let date = item.fxDate
          let dateIndex = date.indexOf('-')
          let newDate = date.slice(dateIndex + 1).replace('-', '/')
          dateList.push(newDate)
          // image动态src
          srcList.push(`../../../images/icon/${item.iconDay}.png`)
          maxTempList.push(item.tempMax)
          minTempList.push(item.tempMin)
        })
        this.setData({ dailyData, dateList, maxTempList, minTempList, srcList })
      },
      complete: () => {
        let dateList = this.data.dateList
        let maxTempList = this.data.maxTempList
        let minTempList = this.data.minTempList
        renderLineChart(dateList, maxTempList, minTempList)
      }
    });


  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
});