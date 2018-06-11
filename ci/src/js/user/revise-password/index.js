let $ = require('jquery');
let API = require("@components/api");

$(function (e) {

    formInit(e);    //焦点切换




    fnRegister(e);

    //修改密码
    function fnRegister(e) {
        var suburl = API.USER.REVISE; //修改密码接口
        var isPassw = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;   //密码验证


        formInit(e);    //焦点切换



        //提交
        $("#js_revise").on("click", function () {
            console.log(1);

            $(".input_item").removeClass("error");

            if ($.trim($("#js_original_passw").val()) == "") {
                setError($("#js_original_passw"), "请输入原密码");
                return false;
            };
            if (!isPassw.test($("#js_original_passw").val())) {
                setError($("#js_original_passw"), "密码格式错误（6-20位字母数字）");
                return false;
            };
            if ($.trim($("#js_passw").val()) == "") {
                setError($("#js_passw"), "请输入新密码");
                return false;
            };
            if (!isPassw.test($("#js_passw").val())) {
                setError($("#js_passw"), "密码格式错误（6-20位字母数字）");
                return false;
            };

            if ($.trim($("#js_passws").val()) == "") {
                setError($("#js_passws"), "请输入确认密码");
                return false;
            };
            if ($("#js_passw").val() != $("#js_passws").val()) {
                setError($("#js_passws"), "两次密码输入不一致");
                return false;
            };


            var prams = {
                "opassw": $.trim($("#js_original_passw").val()),
                "password": $.trim($("#js_passw").val())
            }

			var suburl = $('#url_pass').val();
            requestData(suburl, "post", call, prams);

            function call(data) {
                if (data.status == 1) {
                    window.location = data.msg;
                } else {
                    setError($("#js_register"), data.msg);
                };
            };
        });



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



// 表单报错
function setError(element, errorText) {
    var oError = element.parents(".form").find(".hint");
    element.focus();
    element.parents(".input_item").addClass("error");
    oError.css("visibility", "visible").html(errorText);
};

// 初始化表单
function formInit(e) {
    // var n = $('.input_text');
    $('input').each(function () {
        var n = $(this);
        isEmpty(n.val().trim()) || n.next('.input_placeholder').hide();
        n.on('focus', function () {
            $(this).parent().addClass('focus');
            $(this).next('.input_placeholder').hide();
        });
        n.on('blur', function () {
            $(this).parent().removeClass('focus');
            isEmpty($(this).val().trim()) && $(this).next('.input_placeholder').show();
        });
    });

};

// 是否为空
function isEmpty(val) {
    return val == "" ? true : false;
};

