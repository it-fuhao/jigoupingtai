/**
 * 表单查看
 * @authors Abby (abbyyigoog@gmail.com)
 * @date    2018-05-11 17:34:08
 * @version $Id$
 */

let $ = require('jquery');
let API = require("@components/api");

$(function (e) {
    var n = 0,
        len = $('.tab_con').length;

    var suburl = API.SUBSCRIBE.SUBMIT; //预约提交接口
    var cancelurl = API.SUBSCRIBE.CANCEL; //取消预约接口
    var isMob = /^1[3|4|5|7|8][0-9]\d{8}$/; //手机验证

    $('.last-week').on('click', function () {
        if (n <= 0) {
            n = 0;

        } else {
            n--;

        };
        tab(n);
    });

    $('.next-week').on('click', function () {
        if (n >= len - 1) {
            n = len - 1;

        } else {
            n++;

        };
        tab(n);
    });

    $('.tab_con').delegate('.appointment', 'click', function () {
        $('.selected').removeClass('selected').addClass('appointment').html('<span>点击预约</span>');
        $(this).removeClass('appointment').addClass('selected').html('<span>已选择</span>');
    });

    // 提交
    $('#js_submit').on('click', function () {
        $(".long_input").removeClass("err_border");

        if ($('.selected').length <= 0) {
            layer.msg('请选择预约时间');
            return false;
        };

        if ($.trim($("#js_name").val()) == "") {
            setError($("#js_name"), "请输入联系人姓名");
            return false;
        };

        if ($.trim($("#js_tel").val()) == "") {
            setError($("#js_tel"), "联系人电话");
            return false;
        };
        if (!isMob.test($.trim($("#js_tel").val()))) {
            setError($("#js_tel"), "请输入正确的手机号");
            return false;
        };

        if ($.trim($("#js_job").val()) == "") {
            setError($("#js_job"), "请输入职务");
            return false;
        };

        var prams = {
            "date": $('.selected').attr('date-id'),
            "time_start_id": $('.selected').attr('time_start_id'),
            "time_end_id": $('.selected').attr('time_end_id'),
            "name": $.trim($("#js_name").val()),
            "tel": $("#js_tel").val(),
            "job": $("#js_job").val()
        };
        console.log(prams);
        requestData(suburl, "post", call, prams);

        function call(data) {
            console.log(data);
            console.log(data.msg);

            if (data.status == 1) {
                location.href = data.msg;
            } else {
                setError($("#js_submit"), data.msg);
            };
        };

    });

    // 取消预约
    $('#js_cancel').on('click', function () {
        var prams = {
            "id": $(this).attr('data-id')
        }
        requestData(cancelurl, "post", call, prams);
        
        function call(data) {

            if (data.status == 1) {
                window.location = data.msg;
            } else {
                setError($("#js_cancel"), data.msg);
            };
        };
    });

    //初始化表单
    formInit(e);

    function tab(n) {

        $('.nav-week a').removeClass('disabled');
        $('.tab_con').removeClass('active');

        if (n == 0) {
            $('.last-week').addClass('disabled');
        };

        if (n == len - 1) {
            $('.next-week').addClass('disabled');
        };

        $('.tab_con').eq(n).addClass('active');
    };

});
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

//阻止冒泡
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};

// 表单报错
function setError(element, errorText) {
    element.focus();
    element.addClass("err_border");
    layer.msg(errorText);
};

// 初始化表单
function formInit(e) {
    // var n = $('.input_text');
    $('input').each(function () {
        var n = $(this);
        isEmpty(n.val().trim()) || n.next('.input_placeholder').hide();
        n.on('focus', function () {
            $(this).addClass('focus_border');
            $(this).next('.input_placeholder').hide();
        });
        n.on('blur', function () {
            $(this).removeClass('focus_border');
            isEmpty($(this).val().trim()) && $(this).next('.input_placeholder').show();
        });
    });

};

// 是否为空
function isEmpty(val) {
    return val == "" ? true : false;
};