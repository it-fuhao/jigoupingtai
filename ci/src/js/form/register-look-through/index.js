/*
 * @Author: fuhao 
 * @Date: 2018-05-01 15:12:28 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-31 00:38:53
 */
var $ = require("jquery");
var API = require("@components/api");


$(function(){

    //标记
    $('.main_con').on('click','.check',function(){
        $(this).toggleClass('active');
    })
    

    //不同意按钮点击
    $('.btn12').click(function(){
        //审核页面加红色提示语
        $('.check').each(function(i,v){
            $(v).addClass('show');
        })
        $('.main_con').before('<p class="hint">请勾选出登记表中的不同意事项。</p>')
        $('.btn_box').removeClass('show');
        $('.btn_box2').addClass('show');
        // layerLink('./register-list.html');
    })

    //取消
    $('.js_unsure').on('click',function(){
        $('.check').each(function (i, v) {
            if($(v).hasClass('active')){
                $(v).removeClass('active');
            }
            $(v).removeClass('show');
        })
        $('.hint').remove();
        $('.btn_box').addClass('show');
        $('.btn_box2').removeClass('show');
    })

    //提交
    $('.js_submit').on('click',function(){
        layer.confirm('审核意见提交后不可更改，是否确认？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            var param = {}
            var arr = [];
            $('.check').each(function (i, v) {

                if ($(v).hasClass('active')) {
                    arr.push($(v).attr('data-id'));
                }
            })
            param.field_id = arr;
            param.submit_id = $('#submit_id').val();
            param.detail_id = $('#detail_id').val();
            
            //提交
            requestData(API.REGISTERlOOK.SUCCESS, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    window.location = data.data.url;
                } else {
                    errMsg('网络错误');
                };
            };
        }, function () {
        });
        
        
    })
    $('.btn3').click(function () {
        layer.confirm('审核后不可修改，是否确认？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            var param={
                'submit_id':$('#submit_id').val(),
                'detail_id':$('#detail_id').val()
            }
            requestData(API.REGISTERlOOK.ERR, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    window.location = data.data.url;
                } else {
                    errMsg('网络错误');
                };
            };
        }, function () {
        });
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