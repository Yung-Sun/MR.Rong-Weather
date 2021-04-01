// pages/moreInfo/detail.js
let wxCharts = require('../../../utils/wxcharts.js');
let lineChart = null;
let renderLineChart = () => {
  let windowWidth = 400;
  let maxTemp = [30, 28, 29, 31, 29, 28, 28, 29, 27, 29]
  let minTemp = [27, 25, 26, 25, 24, 24, 25, 24, 25, 26]
  try {
    let res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
  } catch (e) {
    console.error('getSystemInfoSync failed!');
  }
  lineChart = new wxCharts({
    canvasId: 'tempByDay',
    type: 'line',
    categories: ['04/01', '04/02', '04/03', '04/04', '04/05', '04/06', '04/07', '04/08', '04/09', '04/10'],
    animation: true,
    // background: '#ff0000',
    series: [{
      name: '最低温',
      color: '#41A4FF',
      data: minTemp,
      format: function (val, name) {
        return val + '℃';
      }
    }, {
      name: '最高温',
      color: '#FD881B',
      data: maxTemp,
      format: function (val) {
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
      min: Math.min.apply(null, minTemp) - 3
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
    iconSrc: '../../../images/icon/100.png'
  },
  onLoad: function () {
    renderLineChart()
    wx.getStorage({
      key: 'dailyData',
      success: (res) => {
        let dailyData = res.data
        let dateList = []
        let srcList = []
        // 将后台传来的日期从 YYYY-MM-DD 改为 MM/DD
        dailyData.forEach((item, index) => {
          let date = item.fxDate
          let dateIndex = date.indexOf('-')
          let newDate = date.slice(dateIndex + 1).replace('-', '/')
          dateList.push(newDate)
          // image动态src
          srcList.push(`../../../images/icon/${item.iconDay}.png`)
        })
        this.setData({ dailyData, dateList, srcList })
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