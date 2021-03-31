
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        dailyData: Array,
        today: String
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
        'dailyData': function (dailyData) {
            let newDateList = []
            dailyData.forEach((item, index) => {
                // 将后台传来的日期从 YYYY-MM-DD 改为 MM/DD
                let date = item.fxDate
                let dateIndex = date.indexOf('-')
                let newDate = date.slice(dateIndex + 1).replace('-', '/')
                newDateList.push(newDate)
            })
            this.setData({
                newDateList
            })
        }
    }
})
