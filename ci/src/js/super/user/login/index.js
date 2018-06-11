/*
 * @Author: fuhao
 * @Date: 2018-05-01 19:15:30
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-21 17:06:33
 */
var $ = require("jquery");
var API = require("@components/api");
var areaData = require('@components/data');
// var area = require('@components/area');
var cascader = require("@components/cascader");
console.log(cascader);
$(function () {


    function drop(level){
        const Cascader = new cascader("#Cascader", {
            // 当前元素data对象key,
            trigger: "id",
            // trigger的值分隔符
            split: "/",
            // 下拉样式
            selectClass: "dropdown",
            // // 选项列表
            optionsClass: "drop_list scroll",
            keep: level,
            // // 选项
            // itemCalss: "",
            // // 选项高亮
            // activeClass: "active",
            // 数据源
            data: areaData,
            // 数据源 key
            keys: {
                // 值
                "value": "id",
                // 显示文字
                "label": "name",
                // 子级选项列表
                "children": "child"
            }
        });
        // 事件监听
        Cascader.on("change", function (data) {
            console.log(data)
            // 值修改后果,更新滚动条组件
            setTimeout(function () {
                scroll();
            }, 10)
        })
        scroll();
    }
    drop('0');


    scroll();
    //数据渲染
    //单选
    $('.chose_one').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var idx = $(v).attr('data-id');
            $(v).find('dd[data-id="' + idx + '"]').addClass('active');
            if (idx == '1') {
                drop('2');
            }
            if (idx == '2') {
                drop('0');
            }
        }
    })

    //多选
    $('.chose_more').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var arr = $(v).attr('data-id');
            var arr2 = arr.split(',');
            for (var j = 0; j < arr2.length; j++) {
                $(v).find('dd[data-id="' + arr2[j] + '"]').addClass('active');
            }
        }

    })

    //下拉列表
    $('.dropdown').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var idx = $(v).attr('data-id');
            var wz = $(v).siblings('ul').find('li[data-id="' + idx + '"]').text();
            $(v).find('span').text(wz);
        }

    })
    function Ci() {


        //事件委托者
        this.parentNode = $('body');

        //focus样式
        this.focus = function (oThis) {
            $('input').removeClass('focus_border err_border');
            $('textarea').removeClass('focus_border err_border');
            oThis.addClass('focus_border');
        }

        //下拉列表（一级）
        this.dropOne = function (oThis) {
            if (oThis.siblings('ul').css('display') == 'block') {
                $('.drop_list').slideUp('fast');
                oThis.find('i').removeClass('up');
            } else {
                $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
                oThis.siblings('ul').slideDown('fast');
                oThis.find('i').addClass('up');
            }
            $('.drop_area_list').hide();

        }


    }
    var _ci = new Ci();

    //事件委托者
    var $ct = _ci.parentNode;



    //获取部门职级数据
    var erJson;

    if (window.sectionJson){
        erJson = sectionJson;
        getErJson($('.bumen'));
    }


    //渲染部门
    function getErJson(node){
        var str='';
        $.each(erJson,function(i,v){
            console.log(v.id);
            str += '<li data-id="'+v.id+'">'+v.val+'</li>';
        })
        console.log(str);
        node.find('.drop_list').html(str);
    }

    //下拉列表（一级）
    $ct.on('click', '.dropdown', function (e) {
        scroll();
        e.stopPropagation();

        _ci.dropOne($(this));

    })
    $ct.on('click', '.drop_list li', function (e) {
        e.stopPropagation();
        var _showBox = $(this).parent();
        _showBox.siblings('p').find('span').text($(this).text());
        _showBox.slideUp('fast');
        _showBox.siblings('p').find('i').removeClass('up');
        $(this).parent().siblings('.dropdown').attr('data-id', $(this).data('id'));

        //部门职级联动
        if($(this).parents('.pc_box').hasClass('bumen')){
            var idx = $(this).index();
            var str = '';
            $.each(erJson[idx].child,function(i,v){
                str += '<dd data-id="' + v._id + '"><i></i><span>'+v._val+'</span></dd>'
            })
            $(this).parents('.pc_box').next().find('.chose_one').html(str);
        }

    })
    $(document).on('click', function () {
        $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
    });

    //滚动条样式修改
    function scroll() {
        $('.scroll').niceScroll({
            cursorcolor: "#ccc",//#CC0071 光标颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: "5px", //像素光标的宽度
            cursorborder: "0", // 游标边框css定义
            cursorborderradius: "5px",//以像素为光标边界半径
            autohidemode: false //是否隐藏滚动条
        });
    }

    //输入框focus样式
    $ct.on('focus', 'input,textarea', function () {
        _ci.focus($(this));
        $(this).siblings('i').addClass('active');
    })
    $ct.on('blur', 'input,textarea', function () {
        $(this).removeClass('focus_border');
        $(this).siblings('i').removeClass('active');
    })



    //单选题
    $ct.on('click', '.chose_one dd', function () {
        var idx = $(this).attr('data-id')

        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().attr('data-id', $(this).attr('data-id'));
        $(this).parent().attr('data-id', idx);

        if (idx == '1') {
            drop('2');
        }
        if (idx == '2') {
            drop('0');
        }
    })

    //多选题
    $ct.on('click', '.chose_more dd', function () {
        $(this).toggleClass('active');
    })
    function datePick(startTime) {
        //选择具体时间
        var date = 1;//时间初始化
        startTime.jeDate({
            format: "YYYY/MM/DD",
            zIndex: 3000,
            isClear: false,
            onClose: false,
            okfun: function (val) {
                if (startTime.siblings('.js_time_input2').length > 0) {
                    if (startTime.siblings(".js_time_input2").val() != '') {
                        startTime.siblings(".js_time_input2").val('');
                    }

                    date = startTime.val().replace(/\//g, '-');
                    if (date !== 1) {
                        startTime.siblings(".js_time_input2").jeDate({
                            format: "YYYY/MM/DD",
                            zIndex: 3000,
                            isClear: false,
                            onClose: false,
                            okfun: function (val2) {
                                if (startTime.siblings(".js_time_input2").val().replace(/-/g, '') < startTime.val().replace(/-/g, '')) {
                                    errMsg('结束时间必须大于开始时间！');
                                    date = 1;
                                    startTime.val('');
                                    startTime.siblings(".js_time_input2").val('');
                                }
                            }
                        });
                    }
                }

            }
        });
    }





    //保存
    $('.js_storage').on('click', function () {


        var param = {
            'login_name': $('#login_name').val(),
            'real_name': $('#real_name').val(),
            'pass': $('#password').val(),
            'phone': $('#phone').val(),
            'remark': $('#remark').val(),
            'addr': $('#Cascader').attr('data-id'),
            'type': $('#type').attr('data-id')

            // 'section': $('#section').attr('data-id'),
            // 'level': $('#level').attr('data-id')
        };
        console.log(param);
        //保存
        requestData(API.ADDUSER.SAVE, "post", call, param);

        function call(data) {
            console.log(data);
            if (data.status == 1) {
                errMsg(data.msg);
                setTimeout(function(){
                    window.location = data.url;
                },1000)

            } else {
                 errMsg(data.msg);
            };
        };

    })



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
            success: function (data, textStatus) {
                flag = data;
                if (typeof callback !== 'undefined') {
                    callback(data);
                }
            },
            error: function (data, textStatus) {
                flag = data;
                alert("网络繁忙,请稍候重试!");
            }
        });
        return flag;
    };
    /*空值判断*/
    function nullVal(str) {
        str = $.trim(str);
        if (str == "") {
            return 0;
        } else {
            return 1;
        }
    };
    //错误提示
    function errMsg(msg, oThis) {
        layer.msg(msg);
        if (oThis) {
            var t = oThis.parents('.pub_box').offset().top;
            $('body,html').animate({ 'scrollTop': t }, 100)
        }
    }
})