/*
 * @Author: fuhao 
 * @Date: 2018-05-01 19:15:30 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-21 13:03:47
 */
var $ = require("jquery");
var API = require("@components/api");

$(function () {


    function Ci() {


        //事件委托者
        this.parentNode = $('body');

        //focus样式   
        this.focus = function (oThis) {
            $('input').removeClass('focus_border err_border');
            $('textarea').removeClass('focus_border err_border');
            oThis.addClass('focus_border');
        }


    }
    var _ci = new Ci();




    //输入框focus样式
    $( 'input,textarea').on('focus', function () {
        _ci.focus($(this));
        $(this).siblings('i').addClass('active');
    })
    $('input,textarea').on('blur', function () {
        $(this).removeClass('focus_border');
        $(this).siblings('i').removeClass('active');
    })

    //保存
    $('.js_storage').on('click', function () {


        var param = {
            'name': $('#name').val(),
            'description': $('#description').val()
        };
        console.log(param);
        //保存
        requestData('/adminmanager/Department/create', "post", call, param);

        function call(data) {
            console.log(data);
            if (data.status == 1) {
                errMsg(data.msg);
                setTimeout(function () {
                    window.location = data.url;
                }, 1000)

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