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
// 雷达图
// require('echarts/lib/chart/radar');
// // 仪表图
// require('echarts/lib/chart/gauge');
// 网格
require("echarts/lib/component/grid");
// 图例
require("echarts/lib/component/legend");
// // 图例
// require("echarts/lib/custom");
// // 图例
// require("echarts/lib/markPoint");


$(function(){
    // var data = {
    //     "allData": {
    //         "1": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例",
    //                 "subtitle": "79003人,77.45%",
    //                 "xAxisData": ["未参加校外培训人数", "参加校外培训人数"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例",
    //                         "data": [79003, 22997]
    //                     }
    //                 ]
    //             }
    //         },
    //         "2": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [25,18,20,32,52,50,60,30,40,35,33,42,60,10]
    //                     }
    //                 ]
    //             }
    //         },
    //         "3": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训平均科目数",
    //                 "subtitle": "1.92科",
    //                 "xAxisData": ["1科","2科","3科","4科","5科","5科以上"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训平均科目数",
    //                         "data": [30030, 33890, 9089, 4200, 1039, 799]
    //                     }
    //                 ]
    //             }
    //         },
    //         "4": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均花费",
    //                 "subtitle": "20451.39元",
    //                 "xAxisData": ["50000元以上","30000-50000元","20000-29999元","10000-19999元","5000-9999元","5000元以下"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均花费",
    //                         "data": [3167, 5093, 38745, 20987, 6499, 4512]
    //                     }
    //                 ]
    //             }
    //         },
    //         "5": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均花费对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加各学科校外培训的年度平均花费对比",
    //                         "data": [3000, 15000, 12000, 8000, 2000, 2000, 1500, 3000, 2000, 7000, 5500, 5600, 6500, 2200]
    //                     }
    //                 ]
    //             }
    //         },
    //         "6": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均时长(分钟)",
    //                 "subtitle": "7800分钟",
    //                 "xAxisData": ["3120分钟以下(周均1h以下)","3120-6239分钟(周均1-2h)","6240-1249分钟(周均2-4h)","12480-18719分钟(周均4-8h)","18720分钟以上(周均6h)"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均时长(分钟)",
    //                         "data": [8876, 18759, 34932, 11690, 4746]
    //                     }
    //                 ] 
    //             }
    //         },
    //         "7": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均时长(分钟)",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [3200, 12000, 7000, 7600, 2100, 1800, 1200, 3000, 2600, 9600, 4500, 4000, 6700, 2200]
    //                     }
    //                 ]
    //             }
    //         },
    //         "8": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的时间分布",
    //                 "subtitle": "",
    //                 "xAxisData": ["假期","周末","周一至周五不上课时间","周一至周五上课时间"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的时间分布",
    //                         "data": [95, 90, 30, 5]
    //                     }
    //                 ]
    //             }
    //         },
    //         "9": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训人次最多的10个街道",
    //                 "subtitle": "",
    //                 "xAxisData": ["天府街道","抚琴街道","柳城街道","芳草街道","高新区西园街道","城厢街道","东光街道","阳光街道","董忠街道","荷花池街道"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [53009, 42002, 24532, 20122, 19872, 17888, 16789, 15897, 15213, 14222]
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     "primary": {
    //         "1": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例",
    //                 "subtitle": "30315人,65.33%",
    //                 "xAxisData": ["未参加校外培训人数", "参加校外培训人数"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例",
    //                         "data": [30315, 16087]
    //                     }
    //                 ]
    //             }
    //         },
    //         "2": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [12,30,60,0,0,0,0,0,0,50,30,28,45,20]
    //                     }
    //                 ]
    //             }
    //         },
    //         "3": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训平均科目数",
    //                 "subtitle": "1.3科",
    //                 "xAxisData": ["1科","2科","3科","4科","5科","5科以上"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训平均科目数",
    //                         "data": [15000, 8765, 4200, 900, 778, 672]
    //                     }
    //                 ]
    //             }
    //         },
    //         "4": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均花费",
    //                 "subtitle": "19642元",
    //                 "xAxisData": ["50000元以上","30000-50000元","20000-29999元","10000-19999元","5000-9999元","5000元以下"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均花费",
    //                         "data": [1300, 4512, 8734, 9812, 4712, 1245]
    //                     }
    //                 ]
    //             }
    //         },
    //         "5": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均花费对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加各学科校外培训的年度平均花费对比",
    //                         "data": [3000, 6000, 8020, 0, 0, 0, 0, 0, 0, 7500, 5500, 4200, 5400, 1500]
    //                     }
    //                 ]
    //             }
    //         },
    //         "6": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均时长(分钟)",
    //                 "subtitle": "7600分钟",
    //                 "xAxisData": ["3120分钟以下(周均1h以下)","3120-6239分钟(周均1-2h)","6240-1249分钟(周均2-4h)","12480-18719分钟(周均4-8h)","18720分钟以上(周均6h)"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均时长(分钟)",
    //                         "data": [3112, 3040, 18451, 4512, 1200]
    //                     }
    //                 ] 
    //             }
    //         },
    //         "7": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均时长(分钟)",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [4000, 10200, 12000,0, 0, 0, 0, 0, 0, 8700, 4500, 3900, 3800, 2100]
    //                     }
    //                 ]
    //             }
    //         },
    //         "8": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的时间分布",
    //                 "subtitle": "",
    //                 "xAxisData": ["假期","周末","周一至周五不上课时间","周一至周五上课时间"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的时间分布",
    //                         "data": [93, 83, 20, 2]
    //                     }
    //                 ]
    //             }
    //         },
    //         "9": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训人次最多的10个街道",
    //                 "subtitle": "",
    //                 "xAxisData": ["天府街道","芳草街道","柳城街道","抚琴街道","高新区西园街道","城厢街道","荷花池街道","阳光街道","董忠街道","东光街道"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [23001, 20102, 19932, 19123, 16231, 15888, 14489, 14007, 12214, 10222]
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     "middle": {
    //         "1": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例",
    //                 "subtitle": "34168人,79.2%",
    //                 "xAxisData": ["未参加校外培训人数", "参加校外培训人数"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例",
    //                         "data": [34168, 8973]
    //                     }
    //                 ]
    //             }
    //         },
    //         "2": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [43,87,60,67,12,0,12,20,10,0,38,42,30,10]
    //                     }
    //                 ]
    //             }
    //         },
    //         "3": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训平均科目数",
    //                 "subtitle": "1.71科",
    //                 "xAxisData": ["1科","2科","3科","4科","5科","5科以上"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训平均科目数",
    //                         "data": [4500, 9812, 11003, 5411, 2300, 1142]
    //                     }
    //                 ]
    //             }
    //         },
    //         "4": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均花费",
    //                 "subtitle": "22312.4元",
    //                 "xAxisData": ["50000元以上","30000-50000元","20000-29999元","10000-19999元","5000-9999元","5000元以下"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均花费",
    //                         "data": [4500, 8812, 12003, 5412, 2900, 541]
    //                     }
    //                 ]
    //             }
    //         },
    //         "5": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均花费对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加各学科校外培训的年度平均花费对比",
    //                         "data": [5000, 10000, 9800, 8700, 2000, 0, 1900, 3000, 2000, 0, 6500, 7200, 6800, 3400]
    //                     }
    //                 ]
    //             }
    //         },
    //         "6": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均时长(分钟)",
    //                 "subtitle": "8100分钟",
    //                 "xAxisData": ["3120分钟以下(周均1h以下)","3120-6239分钟(周均1-2h)","6240-1249分钟(周均2-4h)","12480-18719分钟(周均4-8h)","18720分钟以上(周均6h)"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均时长(分钟)",
    //                         "data": [2100, 8123, 11042, 7210, 5693]
    //                     }
    //                 ] 
    //             }
    //         },
    //         "7": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均时长(分钟)",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [4300, 13000, 9300, 7900, 2100, 0, 2000, 4000, 2000, 0, 5100, 4000, 4800, 2400]
    //                     }
    //                 ]
    //             }
    //         },
    //         "8": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的时间分布",
    //                 "subtitle": "",
    //                 "xAxisData": ["假期","周末","周一至周五不上课时间","周一至周五上课时间"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的时间分布",
    //                         "data": [97, 91, 30, 2]
    //                     }
    //                 ]
    //             }
    //         },
    //         "9": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训人次最多的10个街道",
    //                 "subtitle": "",
    //                 "xAxisData": ["天府街道","抚琴街道","荷花池街道","阳光街道","高新区西园街道","城厢街道","东光街道","芳草街道","董忠街道","柳城街道"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [26100, 24666, 24031, 22111, 19872, 17288, 16729, 14897, 12213, 11222]
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     "high": {
    //         "1": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例",
    //                 "subtitle": "14520人,82.01%",
    //                 "xAxisData": ["未参加校外培训人数", "参加校外培训人数"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例",
    //                         "data": [14520, 3630]
    //                     }
    //                 ]
    //             }
    //         },
    //         "2": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训比例对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [20,67,60,52,22,20,20,30,20,0,21,32,20,10]
    //                     }
    //                 ]
    //             }
    //         },
    //         "3": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训平均科目数",
    //                 "subtitle": "2.1科",
    //                 "xAxisData": ["1科","2科","3科","4科","5科","5科以上"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训平均科目数",
    //                         "data": [1002, 3201, 6510, 3111, 2000, 696]
    //                     }
    //                 ]
    //             }
    //         },
    //         "4": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均花费",
    //                 "subtitle": "25134.5元",
    //                 "xAxisData": ["50000元以上","30000-50000元","20000-29999元","10000-19999元","5000-9999元","5000元以下"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均花费",
    //                         "data": [2310, 3789, 4810, 2111, 1000, 500]
    //                     }
    //                 ]
    //             }
    //         },
    //         "5": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均花费对比",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加各学科校外培训的年度平均花费对比",
    //                         "data": [5000, 14000, 10000, 9050, 3000, 2000, 4000, 5000, 4000, 0, 3500, 4100, 3800, 1400]
    //                     }
    //                 ]
    //             }
    //         },
    //         "6": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的年度平均时长(分钟)",
    //                 "subtitle": "7500分钟",
    //                 "xAxisData": ["3120分钟以下(周均1h以下)","3120-6239分钟(周均1-2h)","6240-1249分钟(周均2-4h)","12480-18719分钟(周均4-8h)","18720分钟以上(周均6h)"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的年度平均时长(分钟)",
    //                         "data": [2310, 3628, 5810, 1872, 900]
    //                     }
    //                 ] 
    //             }
    //         },
    //         "7": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加各学科校外培训的年度平均时长(分钟)",
    //                 "subtitle": "",
    //                 "xAxisData": ["语文","数学","外语","物理","化学","生物","历史","地理","政治","奥数","体育","美术","音乐","其他"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [4000, 12000, 9000, 8000, 2000, 1000, 2000, 4000, 2000, 0, 2500, 3900, 3300, 1400]
    //                     }
    //                 ]
    //             }
    //         },
    //         "8": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训的时间分布",
    //                 "subtitle": "",
    //                 "xAxisData": ["假期","周末","周一至周五不上课时间","周一至周五上课时间"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训的时间分布",
    //                         "data": [95, 84, 20, 8]
    //                     }
    //                 ]
    //             }
    //         },
    //         "9": {
    //             "is_show": 1,
    //             "data": {
    //                 "title": "区域学生参加校外培训人次最多的10个街道",
    //                 "subtitle": "",
    //                 "xAxisData": ["天府街道","城厢街道","高新区西园街道","芳草街道","柳城街道","抚琴街道","东光街道","东光街道","董忠街道","荷花池街道"],
    //                 "seriesData": [
    //                     {
    //                         "name": "区域学生参加校外培训比例对比",
    //                         "data": [12333, 10212, 9321, 8867, 8431, 7888, 7123, 6534, 6012, 5689]
    //                     }
    //                 ]
    //             }
    //         }
    //     }
    // };

    //初始化图表
    tabData(data["allData"]);

    //单选
    $('.radio_list a').on('click',function(){
        var tistData = $(this).attr('data-id');


        $(this).addClass('active').siblings('a').removeClass('active');
        tabData(data[tistData]);
        
    });

    //多选
    $('.check_list a').on('click',function(){
        $(this).toggleClass('active');
    });

    // 切换图表
    function tabData(data) {
        var charts1 = data[$("#charts1").attr('data-id')];
        var charts2 = data[$("#charts2").attr('data-id')];
        var charts3 = data[$("#charts3").attr('data-id')];
        var charts4 = data[$("#charts4").attr('data-id')];
        var charts5 = data[$("#charts5").attr('data-id')];
        var charts6 = data[$("#charts6").attr('data-id')];
        var charts7 = data[$("#charts7").attr('data-id')];
        var charts8 = data[$("#charts8").attr('data-id')];
        var charts9 = data[$("#charts9").attr('data-id')];

        //图1   
        if(typeof(charts1) != "undefined" && charts1.is_show == 1){
            chartsFn($("#charts1"),hcharts(charts1.data));          
        };
        //图2   
        if(typeof(charts2) != "undefined" && charts2.is_show == 1){
            chartsFn($("#charts2"),zcharts1(charts2.data));          
        };
        //图3   
        if(typeof(charts3) != "undefined" && charts3.is_show == 1){
            chartsFn($("#charts3"),zcharts(charts3.data));
        };
        //图4   
        if(typeof(charts4) != "undefined" && charts4.is_show == 1){
            chartsFn($("#charts4"),hcharts(charts4.data));
        };
         //图5   
        if(typeof(charts5) != "undefined" && charts5.is_show == 1){
            chartsFn($("#charts5"),zcharts1(charts5.data));
        };
         //图6   
        if(typeof(charts6) != "undefined" && charts6.is_show == 1){
            chartsFn($("#charts6"),zcharts(charts6.data));
        };
         //图7   
        if(typeof(charts7) != "undefined" && charts7.is_show == 1){
            chartsFn($("#charts7"),zcharts1(charts7.data));
        };
         //图8   
        if(typeof(charts8) != "undefined" && charts8.is_show == 1){
            chartsFn($("#charts8"),zcharts(charts8.data));
        };
         //图9   
        if(typeof(charts9) != "undefined" && charts9.is_show == 1){
            chartsFn($("#charts9"),zcharts(charts9.data)); 
        };

    };

});

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
    //myChart.dispose();
    myChart.setOption(params, true);
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
            textStyle: {
                fontSize: '18px',
                color: '#394550'
            },
            subtext: subtext,
            subtextStyle: {
                fontSize: '18px',
                color: '#F5A623',
                fontWeight: 'bold'
            },
            x:'center'
        },
        legend: {
            data:legendData,
            orient: 'vertical',
            left: 'left',
            bottom:"1%",
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

//柱状图配置
function zcharts(basedata){
    var title = basedata.title;
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesData = basedata.seriesData;

    var subtext = basedata.subtitle;
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
            subtext: subtext,
            textStyle: {
                fontSize: '18px'
            },
            x:'center',
            'subtextStyle': {
                fontSize: '15px',
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
//          legend: {
//              data:legendData,
//              top:"3%",
//              itemWidth:10,
//              itemHeight:10
//          },
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
                    //rotate: 45, 
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

//柱状图配置
function zcharts1(basedata){
    var title = basedata.title;
    var legendData = [];
    var seriesOption = [];
    var xAxisData = basedata.xAxisData;
    var seriesData = basedata.seriesData;

    var subtext = basedata.subtitle;
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
                    position: 'top',
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
            subtext: subtext,
            textStyle: {
                fontSize: '18px'
            },
            x:'center',
            'subtextStyle': {
                fontSize: '15px',
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
        yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
                "interval": 0,
                formatter: '{value}',
            }
        },
        xAxis : [               
            {
                type : 'category',
                axisLabel: {
                    interval: 0, 
                    //rotate: 45, 
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