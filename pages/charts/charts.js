var wxCharts = require('../../utils/wxcharts-min.js');
var summaryUtil = require('../../utils/summary.js');
var repository = require('../../utils/repository.js');

var colors=[
    '#EDAAA2',
    '#09bb07',
    '#576b95'
];
var colorIndex=0;
var getColor = function(){
    var color = colors[colorIndex%3];
    colorIndex++;

    return color;
};
var windowWidth = 320;
var chartHeight = 180;
var newChart1 = function (cavId,name,title,categories,xiguan) {
    new wxCharts({
        canvasId: cavId,
        type: 'line',
        categories: categories,
        series: [{
            name: name,
            color: getColor(),
            data: xiguan,

        }],
        yAxis: {
            title: title,
            min: 0
        },
        width: windowWidth,
        height: chartHeight
    });
}

Page({
    data:{
        customTypes:[]
    },
    onLoad: function () {
        console.log('onload');
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
            console.log('windowWidth', windowWidth);
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        // newChart();
        // newChart1();
        // newChart2();
    },
    onShow: function () {
        colorIndex =0;
        var sevenSummary = summaryUtil.sevenDaySummary();
        var customTypes = repository.getCustomTypes();
        this.setData({
            customTypes:customTypes
        });
        var categories = [];
        var ctSummary = {};
        customTypes.forEach((ct)=>{
            ctSummary[ct.name]={
                type:ct,
                result:[]
            };
        });
        for (var prop in sevenSummary) {
            var propArr = prop.split('-');
            var category = propArr[1]+'-'+propArr[2];
            categories.unshift(category);
            var summary = sevenSummary[prop];
            for(var ctIndex in customTypes){
                var ct = customTypes[ctIndex];
                ctSummary[ct.name].result.unshift(
                  summary[ct.name]? summary[ct.name].totalAmount : 0  
                );
            }
        }
        console.log(sevenSummary);
        console.log(ctSummary);
        for(var prop in ctSummary){
            var t = ctSummary[prop].type;
            var arr = ctSummary[prop].result;
            newChart1(prop,prop,'数量（'+t.unit+'）',categories,arr);
        }
    },
    onReady: function () {
        console.log('onReady');
    }
});