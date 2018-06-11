var $ = require("jquery");
var API = require("@components/api");

$(function(){
    // var trainData = [
    //     {
    //         "id": "1",
    //         "value": "语文",
    //         "childs": [
    //             {
    //                 "id": "1",
    //                 "value": "培训班1",
    //                 "lists": [
    //                     {"key":"培训时间","value":"周一至周五上课时间"},
    //                     {"key":"单次课培训时长","value":"120"},
    //                     {"key":"单次课课时费","value":"280"},
    //                     {"key":"该科目每年缴费总额","value":"5000"},
    //                     {"key":"培训类型","value":"面授班课"},
    //                     {"key":"培训机构名称","value":"成都市新东方学校"},
    //                     {"key":"培训机构所在区县","value":"金牛区"},
    //                     {"key":"培训机构详细地址","value":"金牛区市中心45号"},
    //                     {"key":"培训机构该课授课教师","value":"俞敏洪"},
    //                     {"key":"一次性缴费覆盖时长","value":"三个月"},
    //                     {"key":"进入此门课程培训是否需要入学考试","value":"是"},
    //                     {"key":"学习进度是否快于学校学习进度","value":"是"},
    //                     {"key":"培训班内容是否超出学校学习要求","value":"是"},
    //                     {"key":"参加此门课培训后，是否满意和有收获","value":"满意，有收获"},
    //                     {"key":"是否有在职教师兼职","value":"无"},
    //                     {"key":"补充","value":"收费不合理"}
    //                 ]
                    
    //             },
    //             {
    //                 "id": "2",
    //                 "value": "培训班2",
    //                 "lists": [
    //                     {"key":"培训时间","value":"假期"},
    //                     {"key":"单次课培训时长","value":"120"},
    //                     {"key":"单次课课时费","value":"360"},
    //                     {"key":"该科目每年缴费总额","value":"12000"},
    //                     {"key":"培训类型","value":"一对一"},
    //                     {"key":"培训机构名称","value":"成都市新东方优能中学"},
    //                     {"key":"培训机构所在区县","value":"金牛区"},
    //                     {"key":"培训机构详细地址","value":"金牛区桂花巷2号院内"},
    //                     {"key":"培训机构该课授课教师","value":"张翠花"},
    //                     {"key":"一次性缴费覆盖时长","value":"半年"},
    //                     {"key":"进入此门课程培训是否需要入学考试","value":"是"},
    //                     {"key":"学习进度是否快于学校学习进度","value":"是"},
    //                     {"key":"培训班内容是否超出学校学习要求","value":"是"},
    //                     {"key":"参加此门课培训后，是否满意和有收获","value":"满意，有收获"},
    //                     {"key":"是否有在职教师兼职","value":"无"},
    //                     {"key":"补充","value":"无"}
    //                 ]
                    
    //             }
    //         ]
    //     },
    //     {
    //         "id": "2",
    //         "value": "数学",
    //         "childs": [
    //             {
    //                 "id": "1",
    //                 "value": "培训班1",
    //                 "lists": [
    //                     {"key":"培训时间","value":"周末，假期"},
    //                     {"key":"单次课培训时长","value":"60"},
    //                     {"key":"单次课课时费","value":"1200"},
    //                     {"key":"该科目每年缴费总额","value":"6000"},
    //                     {"key":"培训类型","value":"其他"},
    //                     {"key":"培训机构名称","value":"成都市金牛区新思维数学体验馆"},
    //                     {"key":"培训机构所在区县","value":"金牛区"},
    //                     {"key":"培训机构详细地址","value":"金牛区宽窄巷子2号院内"},
    //                     {"key":"培训机构该课授课教师","value":"柳儿"},
    //                     {"key":"一次性缴费覆盖时长","value":"半年"},
    //                     {"key":"进入此门课程培训是否需要入学考试","value":"否"},
    //                     {"key":"学习进度是否快于学校学习进度","value":"是"},
    //                     {"key":"培训班内容是否超出学校学习要求","value":"是"},
    //                     {"key":"参加此门课培训后，是否满意和有收获","value":"满意，有收获"},
    //                     {"key":"是否有在职教师兼职","value":"有"},
    //                     {"key":"补充","value":"袁腾飞"}

    //                 ]
    //             }
    //         ]
    //     }        
    // ];
    
    var subjectArr = [];
    var allClass = {};
    var allList = {};
    
    var classData = {};
    var classArr = [];
    var trainItem = [];
    

    $.each(trainData, function (i, o){

        allClass[o['id']] = o['childs'];
             
    });  

    // 拆分数据
    function getData(data) {
        var dataArr = [];
        $.each(data, function (i, o){

            var datatItem = {
                "id": o['id'],
                "value": o['value']
            };
            
            if(typeof(o['lists']) != 'undefined'){                
                allList[o['id']] = o['lists'];
            };
            
            dataArr.push(datatItem);       
        });

        return dataArr;
    };

    //渲染学科与班级
    function setData(data) {
        var str = '';
        $.each(data, function(i, o){       
            if(i == 0){
                var className = 'active'
            } else {
                var className = '';
            };

            str += '<a class="'+ className +'" data-id="'+ o.id +'" href="javascript:;"><i></i><span>'+ o.value +'</span></a>';        
        });

        return str;
    }; 

    // 设置培训班
    function setTrain(data) {
        var str = '';
        $.each(data, function(i, o){       
            str += '<tr><th>'+ o.key +'</th><td>'+ o.value +'</td></tr>';        
        });

        return str;
    };

 
    subjectArr = getData(trainData);
    //学科赋值
    $('.subject_screen dd').html(setData(subjectArr));

    classArr = getData(allClass[subjectArr[0].id]);
    //培训班赋值
    $('.class_screen dd').html(setData(classArr));

    trainItem = allList[classArr[0].id];
    //培训班详情赋值
    $('.table_wrap tbody').html(setTrain(trainItem));

    
    //单选
    $('.table_wrap').delegate('.subject_screen a','click',function(){
        var id = $(this).attr('data-id');
        $(this).addClass('active').siblings('a').removeClass('active'); 

        classArr = getData(allClass[id]);
        //培训班赋值
        $('.class_screen dd').html(setData(classArr)); 

        trainItem = allList[classArr[0].id];

        //培训班赋值
        $('.table_wrap tbody').html(setTrain(trainItem));    
    });

    //单选
    $('.table_wrap').delegate('.class_screen a','click',function(){
        var id = $(this).attr('data-id');
        $(this).addClass('active').siblings('a').removeClass('active');

        trainItem = allList[id];

        //培训班赋值
        $('.table_wrap tbody').html(setTrain(trainItem));

    });

});