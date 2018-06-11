/*
 * @Author: fuhao 
 * @Date: 2018-05-20 17:41:48 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-21 10:36:13
 */
var $ = require("jquery");
var API = require("@components/api");

$(function () {
    //多选题
    $('.chose_more dd').on('click', function () {

        $(this).toggleClass('active');
        var chose = [];
        $(this).parent().find('.active').each(function (i, v) {
            chose.push($(v).attr('data-id'));
        })
        $(this).parent().attr('data-id', chose.join(','));

    })

    $('.js_storage').on('click', function () {
        var arr = [];
        $('dd.active').each(function (i, v) {
            var _arr = [];
            _arr.push($(v).attr('c'));
            _arr.push($(v).attr('a'));
            arr.push(_arr);
        })
        var param = {
            'data': arr
        }
        param.userid = $('#user_id').val();
        console.log(param);
        requestData('/adminmanager/User/power/', "post", call, param);

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