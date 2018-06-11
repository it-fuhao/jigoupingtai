let $ = require('jquery');
var API = require("@components/api");

$(function(e){
    formInit(e);    //焦点切换

    // 点击下拉
    $(".select_input").on("click",function(e){
        var selectList = $(this).siblings(".select_box");
        stopPropagation(e);
        $(".select_box").hide();
        if(selectList.css("display") == "none"){
            $(this).siblings(".select_box").slideDown();
            $(this).siblings("i").removeClass("down_arrow").addClass("up_arrow");
        } else {
            $(this).siblings(".select_box").slideUp();
            $(this).siblings("i").removeClass("up_arrow").addClass("down_arrow");
        };
        
        
        //滚动条样式修改
        $('.scroll').niceScroll({
            cursorcolor: "#ccc",//#CC0071 光标颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: "3px", //像素光标的宽度
            cursorborder: "0", // 游标边框css定义
            cursorborderradius: "3px",//以像素为光标边界半径
            autohidemode: false //是否隐藏滚动条
        });
    });

    $(document).on("click",function(e){
        $(".select_box").slideUp();
        $(".select_box").siblings("i").removeClass("up_arrow").addClass("down_arrow");
    });

    // 选择机构
    $('.scroll li').on('click',function(e){
        stopPropagation(e);
        var oThis = $(this);
        var liId = oThis.attr("data-id");
        var liText = oThis.text();
        var selectInput = oThis.parents(".select_box").siblings(".select_input");         
        var inputArea = oThis.parents(".select_box");

        inputArea.slideUp();
        inputArea.siblings("i").removeClass("up_arrow").addClass("down_arrow");
        selectInput.val(liText);
        selectInput.attr("data-id",liId);

        formInit(e);
    });
    
    fnRegister(e);

    //注册
    function fnRegister(e){
        var imgurl = API.VCODE; //图形验证码接口
        var msgurl = API.NOTEVCODE; //短信验证码接口
        var suburl = API.USER.REGISTER; //注册接口
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
                
                requestData('/user/sendCode/'+$.trim($("#js_mobile").val()), "get", call);

                function call(data) {
                    if (data.status == 1) {

                    } else {
                        if (data.status == 0) {
                            clock = 0;
                        };
                        setError($("#js_message"),data.msg);
                        
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
                setError($("#js_passw"),"请输入密码");
                return false;
            };
            
            if(!isPassw.test($("#js_passw").val())){
                setError($("#js_passw"),"密码格式错误（6-20位字母数字）");
                return false;
            };

            if ($.trim($("#js_passws").val()) == "") {
                setError($("#js_passws"),"请输入确认密码");
                return false;
            };
            if ($("#js_passw").val() != $("#js_passws").val()) {
                setError($("#js_passws"),"两次密码输入不一致");
                return false;
            };

            if ($.trim($("#js_email").val()) == "") {
                setError($("#js_email"),"请输入邮箱");
                return false;
            };
            if (!isEmail.test($.trim($("#js_email").val()))) {
                setError($("#js_email"),"请输入正确的邮箱");              
                return false;
            };

            if (!$("#js_classify").attr('data-id')) {
                setError($("#js_classify"),"请选择所在区");
                return false;
            };

            //if (!$("#js_is_directly").attr('data-id')) {
              //  setError($("#js_is_directly"),"请选择是否直属");
               // return false;
           // };

            var prams = {
                "phone": $.trim($("#js_mobile").val()),
                "code": $.trim($("#js_message").val()),
                "password": $.trim($("#js_passw").val()),
                "tpassword": $.trim($("#js_passws").val()),
                "email": $.trim($("#js_email").val()),
                "area": $("#js_classify").attr('data-id'),
              //  "is_city": $("#js_is_directly").attr('data-id'),
                "areaName": $("#js_classify").val()
            }
            console.log(prams);
            requestData(suburl, "post", call, prams);

            function call(data) {
                console.log(data);
                console.log(data.msg);
                if (data.status == 1) {
                    window.location = data.msg;
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