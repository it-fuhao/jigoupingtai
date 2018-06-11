let $ = require('jquery');
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

// var data = {
//     "1": {
//         "is_show": 1,
//         "data": {
//             "title": "办学资格证审批统计",
//             "subtitle": "",
//             "xAxisData": ['获得办学资格证机构数','等待发证机构数','正式设立阶段机构数','筹备设立阶段机构数','注册用户总数'],
//             "seriesData": [
//                 {
//                     "name": "办学资格证审批统计",
//                     "data": [75, 20, 40, 55, 190]
//                 }
//             ]
//         }
//     },
//     "2": {
//         "is_show": 1,
//         "data": {
//             "title": "登记检查",
//             "xAxisData": ['已提交','已审核','合格数'],
//             "max":"80",
//             "seriesData": [
//                 {
//                     "name": "完成数量",
//                     "data": [25, 20, 16]
//                 },
//                 {
//                     "name": "完成百分比",
//                     "data": [33, 80, 80]
//                 }
//             ]
//         }
//     },
//     "3": {
//         "is_show": 1,
//         "data": {
//             "title": "办学变更",
//             "subtitle": "",
//             "xAxisData": ['处理数','未处理数'],
//             "seriesData": [
//                 {
//                     "name": "办学变更",
//                     "data": [18, 2]
//                 }
//             ]
//         }
//     }
// };

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

var charts1 = data[$("#charts1").attr('data-id')];
var charts2 = data[$("#charts2").attr('data-id')];
var charts3 = data[$("#charts3").attr('data-id')];
console.log(charts1);
//图1   
if(typeof(charts1) != "undefined" && charts1.is_show == 1){
    console.log(3);
    chartsFn($("#charts1"),zcharts(charts1.data));          
};
//图2   
if(typeof(charts2) != "undefined" && charts2.is_show == 1){
    chartsFn($("#charts2"),zcharts1(
        charts2.data,
        function(y,x){
            var max = Math.ceil(y+(y-x)*0.1+2);
            return max;
        },
        function(y,x){
            var min = Math.floor(x-(y-x)*0.2-2);
            return min;
        })
    );               
};
//图3   
if(typeof(charts3) != "undefined" && charts3.is_show == 1){
    chartsFn($("#charts3"),hcharts(charts3.data));
};



// 初始化图表
function chartsFn(obj,params){
    var myChart = echarts.init(obj[0]);
    myChart.setOption(params, true);
};

//柱状加折线图
function zcharts1(basedata,maxFn,minFn){
    var title = basedata.title;
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesData = basedata.seriesData;
    var len = seriesData.length;
    //var colorLen = colors.length;

    for(var i=0;i<len;i++){
        var name = seriesData[i].name;
        var series = {
            name:seriesData[i].name,
            type:'line',
            barWidth:'40%',
            //symbolSize: 10,
            label: {
                normal: {
                    show: false,
                    position: 'top',
                    color: '#424242',
                    formatter:'{c}'//百分比显示
                }
            },
            // lineStyle: {
            //     normal: {
            //         width: 2,
            //         type: lineTypes[i%lineTypes.length]
            //     }
            // },
            itemStyle: {
                //normal: colors[i%colorLen]
            },
            data:seriesData[i].data

        };
        var legends = {
            name: name
        }
        legendData.push(legends);
        seriesOption.push(series);
    };
    seriesOption[0].type = "bar";
    
    //console.log(seriesOption[0].type);
    
    var option1 = {
        title: {
            text: basedata.title,
            top: 16,
            x:'center'
        },
        tooltip: {},
        color: ["#008BCB","#F5A623","#979797"],
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
            itemWidth: 30,
            itemHeight: 5,
            bottom: 24,
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
                type : 'category',
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
        yAxis : [
            {
                type: 'value',
                name: '完成数量',
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
            {
                type: 'value',
                name: '完成百分比',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series : seriesOption
    };
    return option1;
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
                    formatter:'{c}'//百分比显示
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
            formatter: "{b} : {c}"
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
                formatter: '{value}',
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

//环形图
function hcharts(basedata){
    var colors2 = ["#468AFF","#7ED321","#FF9F00","#DF0021","#50E3C2","#7E2CFF","#50E3C2","#A8ADC0","#005EFF","#FFCE00"];
    var title = basedata.title; 
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesDataAll = [];
    var seriesData = basedata.seriesData[0].data;
    var subtext = basedata.subtitle;       
    var len = xAxisData.length;
    var colorLen = colors.length;
    
                    
    for(var j=0;j<len;j++){
        var name = xAxisData[j];
        var series = {
            value:seriesData[j], 
            name:name,
            label: {
                normal: {
                    fontSize: 12,
                    color: '#666',
                    formatter: "{c} ({d}%)"//百分比显示,
                    // position: 'inside'
                }
            },
            itemStyle:{
               normal:{
                    label:{
                        show: false,
                        textStyle: {
                            fontSize: 12,
                            color: '#666'
                        }
                        // formatter: function (params,option) {
                        //     if(params.data.value == 0){
                                
                        //         // params.data.itemStyle.normal.labelLine.show = false;
                        //         params.data.label.normal.show = false; 
                        //         params.data.labelLine.normal.show = false;
                                
                        //     }
                        //     console.log(params.data.value + '%');
                        //     return params.data.value + '%';
                        // },
                        // position: 'inside',
                        // formatter: "{a} <br/>{b}: {c} ({d}%)"//百分比显示
                    },
                    labelLine: {
                        show: false
                    },
                    color: colors[j%colorLen].color
               }
            }

        };
        legendData.push(name);    
        seriesDataAll.push(series);
    };      
    
    seriesOption[0] = {                     
        name: basedata.title,
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '55%'],
        sort : 'ascending',
        data: seriesDataAll
    };
    var option = {
        title: {
            text: basedata.title,
            // textStyle: {
            //     fontSize: '18px',
            //     color: '#394550'
            // },
            // subtext: subtext,
            // subtextStyle: {
            //     fontSize: '18px',
            //     color: '#F5A623',
            //     fontWeight: 'bold'
            // },
            x:'center'
        },
        legend: {
            data:legendData,
            //orient: 'vertical',
            right: '20%',
            top:"10%",
            itemWidth:10,
            itemHeight:10
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: seriesOption
    };
    return option;
};
