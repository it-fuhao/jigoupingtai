
var $ = require("jquery");
var API = require("@components/api");

//接口
console.log(API);
// JavaScript Document	
$(function () {



    $('input').focus(function(){
        $('input').removeClass('focus_border');
        $(this).addClass('focus_border');
    })
    $('input').blur(function(){
        $(this).removeClass('focus_border');
    })
    yzmImg($(".input_ver_box img"));
    //点击切换验证码图片
    $(".input_ver_box img").click(function () {
        yzmImg($(".input_ver_box img"));
    });
   
    //点击登陆按钮验证提交登陆信息
    $("#js_login_submit").bind("click", function () {
        btnSubmit();
    });

});
//登陆
function keyenter(ele, call) {
    ele.on("keydown", function (e) {
        if (e.keyCode == 13) {
            btnSubmit();
        }
    });
}
function btnSubmit() {
    var bool = true;
    var userId = $("#js_user_id").val(); //获取用户id输入框的值
    var pswVal = $("#js_passw").val();
    var verfyCodeVal = $("#js_verifycode").val();
    // var captcha = $(".yzm_list").css('display');
    // var code = $("#js_verifycode").val();
    // var fromUrl = $("#fromUrl").val();
    if(nullVal(userId) == 0){
        errorVal('请输入手机号', $("#js_user_id"));
        return false;
    };
    if (isTel(userId) == 0){
        errorVal('请输入正确的手机号', $("#js_user_id"));
        return false;
    }
    if (nullVal(pswVal) == 0) {
        errorVal('请输入密码', $("#js_passw"));
        return false;
    }
    if (nullVal(verfyCodeVal) == 0) {
        errorVal('请输入验证码', $("#js_verifycode"));
        return false;
    }
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    var data = {
        'username': userId,
        'password': pswVal,
        'code': verfyCodeVal
    };
    $.post(API.USER.LOGIN, data, function (data) {
        
        if (data.status == 1) {
            console.log(data);
            location.href = data.msg;
        } else {
            // console.log(msg);
            errorVal(data.msg);
            yzmImg($(".input_ver_box img"));
        }
    });
}
//点击切换验证码图片
function yzmImg(yzmImg) {
    var randomNum = Math.floor(Math.random() * 999);
    yzmImg.attr("src", API.VCODE +"?"+ randomNum);
};
//验证手机号格式
function isTel(str) {
    //var isMob = /^((\+?86)|(\(\+86\)))?(13[0-9]{9}|15[0-9]{9}|17[03678][0-9]{8}|18[0-9]{9}|14[578][0-9]{8}|1349[0-9]{7})$/;
    var isMob = /^1[3|4|5|7|8][0-9]\d{8}$/;
    var value = $.trim(str);
    if (isMob.test(value)) {
        return 1;
    } else {
        return 0;
    }
};
/*空值判断*/
function nullVal(str) {
    var str = $.trim(str);
    if (str == "") {
        return 0;
    } else {
        return 1;
    }
};
//错误提示
function errorVal(str, oThis) {
    var str = $.trim(str);
    $('.hint').addClass('show').text(str);
    if(oThis){
        oThis.addClass('err_border');
        setTimeout(function () {
            oThis.removeClass('err_border');
        }, 1000)
    }
    
    // oThis.siblings(".succeed_icon").hide();
};

