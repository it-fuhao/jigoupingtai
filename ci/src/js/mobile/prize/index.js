
var $ = require('jquery');
    var num = 0;
    var idxArr = [0,2,4,6]
    var prizeNum = $('#prize').val(); //后台获取中奖
    if (prizeNum == 0){
        var idx = Math.floor(Math.random() * 4);
        // console.log(idx);
        num = idxArr[idx];
    }else{
        if (prizeNum == 1){
            num = 5;
        }
        if (prizeNum == 2) {
            num = 7;
        }
        if (prizeNum == 3) {
            num = 3;
        }
        if (prizeNum == 4) {
            num = 1;
        }
        
    }
    console.log(num);
    var lottery = {
        index: -1, //当前转动到哪个位置，起点位置
        count: 0, //总共有多少个位置
        timer: 0, //setTimeout的ID，用clearTimeout清除
        speed: 20, //初始转动速度
        times: 0, //转动次数
        cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize: -1, //中奖位置
        init: function (id) {
            if ($('#' + id).find('.lottery-unit').length > 0) {
                var $lottery = $('#' + id);
                var $units = $lottery.find('.lottery-unit');
                this.obj = $lottery;
                this.count = $units.length;
                $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
            };
        },
        roll: function () {
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
            index += 1;
            if (index > count - 1) {
                index = 0;
            };
            $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
            this.index = index;
            return false;
        },
        stop: function (index) {
            this.prize = index;
            return false;
        }
    };

    function roll() {
        lottery.times += 1;
        lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化

        if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
            clearTimeout(lottery.timer);

            // layer.open({
            //     type: 1,
            //     shadeClose: true,
            //     shade: false,
            //     maxmin: true, //开启最大化最小化按钮
            //     area: ['893px', '600px'],
            //     content: $("#info").html()
            // });
            // $('.modal').show();
            setTimeout(function(){
                if (prizeNum == 0) {
                    $('.modal2').show();
                } else {
                    if (prizeNum == 1) {
                        $('.money').text('50')
                    }
                    if (prizeNum == 2) {
                        $('.money').text('20')
                    }
                    if (prizeNum == 3) {
                        $('.money').text('10')
                    }
                    if (prizeNum == 4) {
                        $('.money').text('5')
                    }
                    $('.modal1').show();
                }
            },500)
            lottery.prize = -1;
            lottery.times = 0;
            click = false;
        } else {
            if (lottery.times < lottery.cycle) {
                lottery.speed -= 10;
            } else if (lottery.times == lottery.cycle) {
                //var index = Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
                lottery.prize = num;
            } else {
                if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                    lottery.speed += 110;
                } else {
                    lottery.speed += 20;
                }
            }
            if (lottery.speed < 40) {
                lottery.speed = 40;
            };
            lottery.timer = setTimeout(roll, lottery.speed); //循环调用
        }
        return false;
    }

    var click = false;
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
                alert('网络繁忙,请稍候重试!');
            }
        });
        return flag;
    };
$(function(){
    lottery.init('lottery');
    $('.draw-btn').click(function () {
        if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;

        } else {
            lottery.speed = 100;
            roll(); //转圈过程不响应click事件，会将click置为false
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖		
            return false;
        }
    });

    $('input').focus(function(){
        $('.hint').removeClass('show');
    })

    var _flag = true;
    $('.js_submit').on('click',function(){

        var tel = $('.tel').val();
        var submitUrl = $(this).attr('data-url');

        if(_flag){
            if ($.trim(tel) == ''){
                $('.hint').addClass('show').text('请输入手机号！');
                return false;
            }
            if (!isTel(tel)){
                $('.hint').addClass('show').text('请输入正确的手机号！');
                return false;
            }
            var param = {
                'tel': tel
            }

            _flag = false;
            requestData(submitUrl, 'post', function (data) {
                if (data.status == 1) {
                    _flag = true;
                    location.href = data.data.url;

                } else {
                    _flag = true;
                    alert(data.msg);

                };

            }, param);
        }
    })

    //验证手机号和座机号
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
})

    
