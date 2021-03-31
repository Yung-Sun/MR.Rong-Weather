
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        evenHourlyData: Array,
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    },

    observers: {
        'evenHourlyData': function (val) {
            let timeList = []
            let srcList = []
            val.forEach(item => {
                let fullTime = item.fxTime
                let time = fullTime.slice(fullTime.indexOf('T') + 1, fullTime.indexOf('+'))
                timeList.push(time)
                srcList.push(`../../images/icon/${item.icon}.png`)
            })
            this.setData({
                timeList, srcList
            })
        }
    },
})