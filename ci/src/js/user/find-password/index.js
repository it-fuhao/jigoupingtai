let $ = require('jquery');

$(function(e){

    formInit(e);    //焦点切换   
    
    fnFindPassword(e);

    //注册
    function fnFindPassword(e){
        var imgurl = "/Home/captcha"; //图形验证码接口
        var msgurl = "/user/sendForgetCode/"; //短信验证码接口
        var suburl = "/user/findPassword"; //注册接口
        var isMob = /^1[3|4|5|7|8][0-9]\d{8}$/; //手机验证
        var isPassw = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;   //密码验证
        var isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        formInit(e);    //焦点切换

        var pflag = false;
        $("#js_mobile").keyup(function() {
            if (isMob.test($.trim($(this).val())) && sfalg) {
                $("#js_note_code").addClass("get_code");
                pflag = true;
            } else {
                $("#js_note_code").removeClass("get_code");
                pflag = false;
            }

        });

        var timer,
        clock = 60,
        sfalg = true;

        $("#js_note_code").on("click", function() {
            if (pflag) {
                sfalg = false;
                $("#js_note_code").removeClass("get_code");
                pflag = false;
                settime();
                var data = {};
                requestData(msgurl+$.trim($("#js_mobile").val()), "get", call, data);

                function call(data) {
                    if (data.status == 1) {
                        
                    } else if (data.status == 0){
                        clock = 0;
                        setError($("#js_mobile"),data.msg);
                    };
                };
            };

        });

        //提交
        $("#js_register").on("click", function() {

            // if($(this).hasClass("disabled")){
            //     return false;
            // };
            $(".input_item").removeClass("error");

            if ($.trim($("#js_mobile").val()) == "") {
                setError($("#js_mobile"),"请输入手机号");
                return false;
            };
            if (!isMob.test($.trim($("#js_mobile").val()))) {
                setError($("#js_mobile"),"请输入正确的手机号");              
                return false;
            };

            if ($.trim($("#js_message").val()) == "") {
                setError($("#js_message"),"请输入短信验证码");                  
                return false;
            };
            if ($.trim($("#js_passw").val()) == "") {
                setError($("#js_passw"),"请输入新密码");
                return false;
            };
            
            if(!isPassw.test($("#js_passw").val())){
                setError($("#js_passw"),"密码格式错误（6-20位字母数字）");
                return false;
            };

            if ($.trim($("#js_passws").val()) == "") {
                setError($("#js_passws"),"请再次输入新密码");
                return false;
            };
            if ($("#js_passw").val() != $("#js_passws").val()) {
                setError($("#js_passws"),"两次密码输入不一致");
                return false;
            };

            var prams = {
                "phone": $.trim($("#js_mobile").val()),
                "phonecode": $.trim($("#js_message").val()),
                "password": $.trim($("#js_passw").val()),
                "confirmpass": $.trim($("#js_passws").val())
            }
            requestData(suburl, "post", call, prams);

            function call(data) {
                if (data.status == 1) {
                    window.location.href = '/';
                } else {
                    setError($("#js_register"),data.msg);                   
                };
            };
        });

        function settime() {
            timer = setInterval(function() {
                if (clock >= 1) {
                    clock--;
                    $("#js_note_code").html(clock + "s后重新发送")
                }

                if (clock == 0) {
                    clearInterval(timer);
                    $("#js_note_code").addClass("get_code");
                    pflag = true;
                    sfalg = true;
                    $("#js_note_code").html("重新发送");
                    clock = 60;
                } else {
                    pflag = false;
                    sfalg = false;
                }
            }, 1000);
        };

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
        success: function(data, textStatus) {
            flag = data;
            if (typeof callback !== 'undefined') {
                callback(data);
            }
        },
        error: function(data, textStatus) {
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
function setError(element,errorText){
    var oError = element.parents(".form").find(".hint");
    element.focus();
    element.parents(".input_item").addClass("error");
    oError.css("visibility","visible").html(errorText);
};

// 初始化表单
function formInit(e){
    // var n = $('.input_text');
    $('input').each(function(){
        var n = $(this);
        isEmpty(n.val().trim()) || n.next('.input_placeholder').hide();
        n.on('focus', function() { 
            $(this).parent().addClass('focus');
            $(this).next('.input_placeholder').hide(); 
        });
        n.on('blur', function() { 
            $(this).parent().removeClass('focus');
            isEmpty($(this).val().trim()) && $(this).next('.input_placeholder').show(); 
        });
    });
    
};

// 是否为空
function isEmpty(val) {
    return val == "" ? true : false;
};

// 图片验证码
function setImgcode(obj,imgurl) {
    var num = Math.random()
    obj.attr("src", imgurl + "?" + num);
};