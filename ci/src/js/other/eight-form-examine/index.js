/**
 * 表单查看
 * @authors Abby (abbyyigoog@gmail.com)
 * @date    2018-04-25 20:59:08
 * @version $Id$
 */

let $ = require('jquery');
let API = require("@components/api");

$(function(){
    //$('.tab_con').html($('#table1').html());
    
    //初始化当前表单id
    $('.disagree').attr('href',$('.tab_item li').eq(0).attr('data-url'));
    $('.consent').attr('data-id',$('.tab_item li').eq(0).attr('data-id'));

    //点击替换表单id
    $('.tab_item li').on('click',function(){
        var index = $(this).index()+1;
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.tab_con').html($('#table'+index).html());
        $('.disagree').attr('href',$(this).attr('data-url'));
        $('.consent').attr('data-id',$(this).attr('data-id'));
    });

    // 同意提交
    $('.consent').on('click',function(){

        var id = $(this).attr('data-id');
        var params = {
            'id': id
        };

        requestData(API.APPROVE.CONSENT, 'post', function(data){
            if (data.status == 1) {
                window.location = data.message;
            } else {
                var msg;
                if (data.msg) {
                    msg = data.msg;
                };
                if (data.message) {
                    msg = data.message;
                };
                layer.msg(msg);                   
            };
        }, params);

    });

    // 不同意审批标记
    $('.check').on('click',function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        };
    });

    // 不同意提交
    $('#js_submit').on('click',function(){
        var len = $('.check.active').length;
        var text = $('.cause_text').text();
        var arr = [];
       
        if(len > 0 || $.trim(text) !== ''){

            $('.active').each(function(){
                arr.push($(this).attr('data-id'));
            });    
            var params = {
                'list': arr,
                'text': $.trim(text)
            };

            requestData(API.APPROVE.CONSENT, 'post', function(data){
                
                if (data.status == 1) {
                    window.location = data.message;
                } else {
                    var msg;
                    if (data.msg) {
                        msg = data.msg;
                    };
                    if (data.message) {
                        msg = data.message;
                    };
                    layer.msg(msg);                    
                };

            }, params);
        } else {
            layer.msg('请勾选出不同意事项或输入原因'); 
        };
    });

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
        success: function(data, textStatus) {
            flag = data;
            if (typeof callback !== 'undefined') {
                callback(data);
            }
        },
        error: function(data, textStatus) {
            flag = data;
            layer.msg('网络繁忙,请稍候重试!');
        }
    });
    return flag;
};