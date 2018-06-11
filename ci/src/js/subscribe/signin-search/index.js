/**
 * 表单查看
 * @authors Abby (abbyyigoog@gmail.com)
 * @date    2018-05-11 17:34:08
 * @version $Id$
 */

let $ = require('jquery');
let API = require("@components/api");

$(function(){
    var create_time = '';
    var user_name = '';
    $('#search_submit').on('click',function(){
        var searchUrl = $(this).attr('data-url');

        if ($.trim($("#search_val").val()) == '') {
            layer.msg("请输入申请人姓名");

            return false;
        };

        var prams = {
            "name" : $('#search_val').val()
        };
        
        requestData(searchUrl, "post", call, prams);

        function call(data) {

            if (data.status == 1) {
                var datas = data.data;

                var list = '<tr><th>申请事项</th><td>'+ datas.appoint_things +'</td></tr>';
                    list += '<tr><th>申请机构</th><td>'+ datas.appoint_company +'</td></tr>';
                    list += '<tr><th>申请提交时间</th><td>'+ datas.create_time +'</td></tr>';
                    list += '<tr><th>预约时间</th><td>'+ datas.app_date +'</td></tr>';
                    list += '<tr><th>预约人</th><td>'+ datas.user_name +'</td></tr>';
                
                var str = '<table><tbody>'+ list +'</tbody></table>';
                $('.tab_con').html(str);
                $('.main_con_btn').addClass('show');

                create_time = datas.create_time;
                user_name = datas.user_name;
                
            } else {
                layer.msg(data.msg);
            };
        };
    });

    //点击签到
    $('.main_con_btn').click(function () {
        var signinUrl = $(this).attr('data-url');
        var prams = {
            'create_time': create_time,
            'user_name': user_name
        }
        layer.confirm('签到后不可修改，是否确认签到？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            requestData(signinUrl, "post", call, prams);

            function call(data) {
                
                if (data.status == 1) {
                    layer.msg('签到成功');
                    $('.main_con_btn').removeClass('show');
                } else {
                    layer.msg(data.msg);
                };
            };
        }, function () {
        });
    })


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
            layer.msg("网络繁忙,请稍候重试!");
        }
    });
    return flag;
};