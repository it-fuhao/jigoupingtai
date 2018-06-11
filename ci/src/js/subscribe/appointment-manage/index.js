/*
 * @Author: fuhao 
 * @Date: 2018-05-01 19:15:30 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-21 19:05:18
 */
var $ = require("jquery");
var API = require("@components/api");

$(function () {


    scroll();

    function Ci() {


        //事件委托者
        this.parentNode = $('body');


        //下拉列表（一级）
        this.dropOne = function (oThis) {
            if (oThis.siblings('ul').css('display') == 'block') {
                $('.t_list').slideUp('fast');
                oThis.find('i').removeClass('up');
            } else {
                $('.t_list').slideUp('fast').siblings('.t_drop').find('i').removeClass('up');
                oThis.siblings('ul').slideDown('fast');
                oThis.find('i').addClass('up');
            }

        }


    }
    var _ci = new Ci();

    //事件委托者
    var $ct = _ci.parentNode;



    //获取部门职级数据
    // var erJson;

    // if (window.sectionJson) {
    //     erJson = sectionJson;
    //     getErJson($('.bumen'));
    // }


    //渲染部门
    // function getErJson(node) {
    //     var str = '';
    //     $.each(erJson, function (i, v) {
    //         console.log(v.id);
    //         str += '<li data-id="' + v.id + '">' + v.val + '</li>';
    //     })
    //     console.log(str);
    //     node.find('.t_list').html(str);
    // }

    //下拉列表（一级）
    $('.t_drop').on('click', function (e) {
        scroll();
        e.stopPropagation();

        _ci.dropOne($(this));

    })
    $('.t_list li').on('click', function (e) {
        e.stopPropagation();
        var _showBox = $(this).parent();
        _showBox.siblings('p').attr('data-id', $(this).attr('data-id')).find('span').text($(this).text());
        _showBox.slideUp('fast');
        _showBox.siblings('p').find('i').removeClass('up');

        //部门职级联动
        // if ($(this).parents('.pc_box').hasClass('bumen')) {
        //     var idx = $(this).index();
        //     var str = '';
        //     $.each(erJson[idx].child, function (i, v) {
        //         str += '<dd data-id="' + v._id + '"><i></i><span>' + v._val + '</span></dd>'
        //     })
        //     $(this).parents('.pc_box').next().find('.chose_one').html(str);
        // }

    })
    $(document).on('click', function () {
        $('.t_list').slideUp('fast').siblings('.t_drop').find('i').removeClass('up');
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


    //保存
    $('.js_storage').on('click', function () {
        var param = {};
        $('tbody tr').each(function(i,v){
            var key = $(v).find('td').eq(0).text();
            var val = $(v).find('td').eq(1).find('.t_drop span').text();
            if(val == '请选择'){
                val = "0";
            };
            param[key] = val;
        })
        
        console.log(param);
        //保存
        requestData(API.SUBSCRIBE.ADMINAPPO, "post", call, param);

        function call(data) {
            console.log(data);
            if (data.status == 1) {
                errMsg(data.msg);

            } else {
                errMsg('网络错误');
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