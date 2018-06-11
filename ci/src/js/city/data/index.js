var $ = require("jquery");
var API = require("@components/api");
// ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 提示框
require('echarts/lib/component/tooltip');
// 标题组件
require('echarts/lib/component/title');
// 柱状图
require('echarts/lib/chart/bar');
// 线型图
require('echarts/lib/chart/line');
// 饼状图
require('echarts/lib/chart/pie');
// // 雷达图
// require('echarts/lib/chart/radar');
// // 仪表图
// require('echarts/lib/chart/gauge');
// 网格
require("echarts/lib/component/grid");
// 图例
require("echarts/lib/component/legend");


$(function(){
    // var data = {
    //     "1": {
    //         "data": {
    //             "title": "各区县学校填报比例对比",
    //             "xAxisData": ["金牛区","武侯区","锦江区","青羊区","成华区","温江区","新都区","青白江区","龙泉驿区","天府新区"],
    //             "max":"100",
    //             "seriesData": [
    //                 {
    //                     "name": "填报比例%",
    //                     "data": [31,51,73,77,16,95,50,98,3,35]                    
    //                 }
                    
    //             ]
    //         },
    //         "is_show": 1
    //     },
    //     "2": {
    //         "data": {
    //             "title": "各区县有效问卷比例对比",
    //             "xAxisData": ["金牛区","武侯区","锦江区","青羊区","成华区","温江区","新都区","青白江区","龙泉驿区","天府新区"],
    //             "max":"100",
    //             "seriesData": [
    //                 {
    //                     "name": "有效问卷比例%",
    //                     "data": [87,3,54,83,98,37,96,61,25,24]                    
    //                 }                   
    //             ]
    //         },
    //         "is_show": 1
    //     },
    //     "3": {
    //         "data": {
    //             "title": "各区县填报完成率比例对比",
    //             "xAxisData": ["金牛区","武侯区","锦江区","青羊区","成华区","温江区","新都区","青白江区","龙泉驿区","天府新区"],
    //             "max":"100",
    //             "seriesData": [
    //                 {
    //                     "name": "填报完成率%",
    //                     "data": [54,10,72,91,68,68,74,98,49,87]                    
    //                 }
                   
    //             ]
    //         },
    //         "is_show": 1
    //     }
    // };
    
    // var charts_part2_TITLE = {
    //     "data": {
    //         "title": "问卷填报统计",
    //         "xAxisData": ["5.25","5.26","5.27","5.28","5.29","5.30","5.31"],
    //         "max":"80",
    //         "seriesData": [
    //             {
    //                 "name": "填报人次",
    //                 "data": [20,32,50,43,70,78,65]                   
    //             },
    //             {
    //                 "name": "有效问卷数",
    //                 "data": [18,30,45,34,40,66,50]                  
    //             }
    //         ]
    //     },
    //     "is_show": 1
    // };

    //初始化图表
    if(typeof(charts_part2_TITLE) != "undefined" && charts_part2_TITLE.is_show == 1){
        chartsFn($("#charts1"),kcharts(
        charts_part2_TITLE.data,
        function(y,x){
            var max = Math.ceil(y+(y-x)*0.1+1);
            return max;
        },
        function(y,x){
            var min = Math.floor(x-(y-x)*0.2-2);
            return min;
        }));          
    };

    if(typeof(data) != "undefined"){
        tabData(data["1"]);
    };
    
    //单选
    $('.radio_list a').on('click',function(){
        var tistData = $(this).attr('data-id');


        $(this).addClass('active').siblings('a').removeClass('active');
        tabData(data[tistData]);
        
    });

    // 切换图表
    function tabData(data) {
        
        var charts2 = data;
        
        if(typeof(charts2) != "undefined" && charts2.is_show == 1){
            chartsFn($("#charts2"),zcharts(charts2.data));          
        };
    };


    // 选择时间
    $('#js_time_btn').on('click',function(){
        var startTime = $('#start').val();
        var endTime = $('#end').val();

        if(startTime !== '' && endTime !== ''){
            getData (startTime, endTime);
        } else {
            layer.msg('请选择时间');
        };

    });

    startTime();

    endTime($('#start').val())
    
});

// 时间选择
function startTime() {

    //选择具体时间
    var date = 1;//时间初始化
    $('#start').jeDate({
        format: "YYYY-MM-DD",
        zIndex: 3000,
        isinitVal:true,
        initDate:[{DD:"-6"},true],   //初始化日期减7天加1小时
        minDate: '2018-05-10 23:59:59', //设定最小日期为当前日期
        maxDate: $.nowDate({DD:0}),
        isClear: false,
        onClose: false,
        okfun: function (val) {
            endTime(val.val);
        }
    });
};

//初始化时间
function endTime(startTime){
    $("#end").jeDate({
        format: "YYYY-MM-DD",
        zIndex: 3000,
        isinitVal:true,
        initDate:[{DD:"+0"},true],   //初始化日期减7天加1小时
        minDate: startTime, //设定最小日期为当前日期
        maxDate: $.nowDate({DD:0}),
        isClear: false,
        onClose: false,
        okfun: function (val) {
            
        }
    });
};

function getData (startTime, endTime) {
    var myChart = echarts.init($("#charts1")[0]);
    
    var params = {  
        "startTime": startTime,
        "endTime": endTime,
		"area_id": $('.content').attr('data-id'),
		"type": $('.content').attr('data-type')
    };

    var charts_part2_TITLE = {
        "data": {
            "title": "问卷填报统计",
            "xAxisData": ["5.25","5.26","5.27","5.28","5.29","5.30","5.31"],
            "max":"80",
            "seriesData": [
                {
                    "name": "填报人次",
                    "data": [20,32,50,43,70,78,65]                   
                },
                {
                    "name": "有效问卷数",
                    "data": [18,30,45,34,40,66,50]                  
                }
            ]
        },
        "is_show": 1
    };

    requestData("/admin/question/FillData/data", "post", function(data){
        if(data.status == 1){
            if(data.data.is_show==1){
                
                var typeData = data.data.data;
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(kcharts(
                    typeData,
                    function(y,x){
                        var max = Math.ceil(y+(y-x)*0.1+1);
                        return max;
                    },
                    function(y,x){
                        var min = Math.floor(x-(y-x)*0.2-2);
                        return min;
                    }),true
                ); 
            }else{
                myChart.dispose();
            };
                                
        }else{
            layer.msg(data.msg);
        };
    },params);

};
var colors = [{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#7CBFFF'
        }, {
            offset: 1,
            color: '#468AFF'
        }])
    },{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#B5EC45'
        }, {
            offset: 1,
            color: '#7ED321'
        }])
    },{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#FBD249'
        }, {
            offset: 1,
            color: '#FF9F00'
        }])
    },{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#F5515F'
        }, {
            offset: 1,
            color: '#DF0021'
        }])
    },{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#88F3E3'
        }, {
            offset: 1,
            color: '#50E3C2'
        }])
},{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#AB2DDC'
        }, {
            offset: 1,
            color: '#7E2CFF'
        }])
},{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#88F3E3'
        }, {
            offset: 1,
            color: '#50E3C2'
        }])
},{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#DEE0EB'
        }, {
            offset: 1,
            color: '#A8ADC0'
        }])
},{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#6C5EFF'
        }, {
            offset: 1,
            color: '#005EFF'
        }])
},{
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#FCE953'
        }, {
            offset: 1,
            color: '#FFCE00'
        }])
}];
// 初始化图表
function chartsFn(obj,params){
    var myChart = echarts.init(obj[0]);
    myChart.setOption(params, true);
};

//柱状图配置
function zcharts(basedata){
    var title = basedata.title;
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesData = basedata.seriesData;

    var subtext = seriesData[0].name;
    var len = seriesData.length;
    var colorLen = colors.length;
    
    for(var i=0;i<len;i++){
        var name = seriesData[i].name;
        var series = {
            name:seriesData[i].name,
            type:'bar',
            barWidth:'40%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#424242',
                    formatter:'{c}%'//百分比显示
                }
            },
            itemStyle: {
                normal: colors[1]
            },
            data:seriesData[i].data
        };
        legendData.push(name);
        seriesOption.push(series);
    };
    
    var option1 = {
        title: {
            text: basedata.title,
            // subtext: subtext,
            x:'center',
            'subtextStyle': {
                fontSize: '18px',
                color: '#F5A623'
            }
        },
        color: colors[1],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: "{b} : {c}%"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        calculable : true,
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
                "interval": 0,
                formatter: '{value}%',
            }
        },
        yAxis : [               
            {
                type : 'category',
                axisLabel: {
                    interval: 0, 
                    rotate: 0, 
                    show: true, 
                    splitNumber: 15, 
                    textStyle: {
                        "fontFamily": "微软雅黑", 
                        "fontSize": 12
                    }
                }, 
                data : xAxisData
            }
        ],
        series : seriesOption
    };
    return option1;
};
//折线图
function kcharts(basedata,maxFn,minFn){
    var title = basedata.title;
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesData = basedata.seriesData;
    var len = seriesData.length;
    var lineWidths = [4, 2, 2, 4, 4]    //线的类型
    var lineTypes = ['solid', 'dashed', 'dotted', 'dashed', 'dotted']   //线的类型
    //var colorLen = colors.length;
    var legendTypes = ['circle', 'rect', 'arrow', 'triangle', 'diamond', 'pin', 'roundRect'];
    var symbolOffset = [[0, 0],[0, 0],[0, '-50%'],[0, 0],[0, 0]];
    for(var i=0;i<len;i++){
        var name = seriesData[i].name;
        var series = {
            name:seriesData[i].name,
            type:'line',
            barWidth:'40%',
            symbol: legendTypes[i%legendTypes.length],
            symbolSize: 10,
            symbolOffset: symbolOffset[i%symbolOffset.length],
            label: {
                normal: {
                    show: false,
                    position: 'top',
                    color: '#424242',
                    formatter:'{c}'//百分比显示
                }
            },
            lineStyle: {
                normal: {
                    width: 2,
                    type: 'solid'
                }
            },
            itemStyle: {
                //normal: colors[i%colorLen]
            },
            data:seriesData[i].data
        };
        legendData.push(name);
        seriesOption.push(series);
    };
    //seriesOption[0].type = "bar";
    
    //console.log(seriesOption[0].type);
    
    var option1 = {
        title: {
            text: basedata.title,
            top: 16,
            x:'center'
        },
        //backgroundColor: '#F4F9FD',
        tooltip: {},
        color: ["#F5A623","#008BCB","#3CD29B","#D849C8","#8B71E7"],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
            // ,
            // formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            data: legendData,
            itemWidth: 20,
            itemHeight: 10,
            bottom: 20,
            borderColor: 5,
            textStyle: {
                color: '#4C4D51',
                fontSize: 16
            }
        },
        grid: {
            top: '20%',
            bottom: '15%',
            containLabel: true
        },
        calculable : true,
        xAxis : [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    interval: 0, 
                    rotate: 0, 
                    show: true, 
                    splitNumber: 15, 
                    textStyle: {
                        "fontFamily": "微软雅黑", 
                        "fontSize": 12,
                        "color": '#424242'
                    }
                }, 
                data : xAxisData
            }
        ],
        yAxis : {
            type: 'value',
            max: function(value) {
                return maxFn && maxFn(value.max,value.min);
            },
            min: function(value) {
                return minFn && minFn(value.max,value.min);
            },
            boundaryGap: [0, 0.01],
            "axisLabel": {
                "interval": 0,
                formatter: '{value}'
            }
        },
        series : seriesOption
    };
    return option1;
};

// ajax封装
function requestData(url, type, callback, arrayList) {
    var flag = false;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

    $.ajax({
        url: url,
        data: arrayList,
        type: type,
        async: callback ? true : false,
        success: function(data, textStatus) {
            flag = data;
            if (typeof callback !== 'undefined') {
                callback(data);
            }
        },
        error: function(data, textStatus) {
            flag = data;
            alert("网络繁忙,请稍候重试!");
        }
    });
    return flag;
};