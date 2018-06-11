let $ = require('jquery');
var API = require("@components/api");
// var area = require("./data");
// console.log(require("./mobileSelect.js"));
if (typeof exports == "object") {
    module.exports = MobileSelect;
} else if (typeof define == "function" && define.amd) {
    define([], function () {
        return MobileSelect;
    })
} else {
    window.MobileSelect = MobileSelect;
};

$(function () {

    //添加姓名输入框
    var is_need_name = $('#is_need_name').val();
    if (is_need_name == 1){
        var needStr = '<dl class="list qs_input" id="_name" data-id="name">'
            + '<dt><b>姓名：</b>(填空题)'
            + '<s>*</s>'
            + '</dt>'
            + '<dd class="pub_bg pub_chose">'
            + '<input type="text" placeholder="请输入姓名">'
            + '</dd>'
            + '</dl>';
        $('.train_title').eq(0).after(needStr);
    }

    //添加证书题
    var is_need_cert = $('#has_else_qs').val();
    if(is_need_cert == 1){
        var needStr = '<dl class="list qs_chose_one" data-id="prove" data-d="">'
            + '<dt><b>在初中入学时是否用到了培训机构出具的相关推荐或证明（如竞赛获奖证书、学科能力水平证明等）：</b>(单选题)'
            + '<s>*</s>'
            + '</dt>'
            + '<dd class="pub_bg pub_chose input_chose">'
            + '<p>'
            + '<i></i><span>是</span>'
            + '</p>'
            + '<input type="text" class="inner_input" placeholder="请填写开具证明的培训机构名称">'
            + '<p><i></i><span>否</span></p>'
            + '</dd>'
            + '</dl>';
        $('.list').eq(0).after(needStr);
    }

    var areaData = [];
    var townData = {};
    var schoolData = {};

    var storageField;//缓存联动数据字段
    //获取联动一级数据
    function getAreaData() {
        var areaData = [];
        for (var i = 0; i < area.length; i++) {
            var areas = {
                id: area[i].id,
                value: area[i].value
            }
            areaData.push(areas);
        }
        return areaData;
    }
    // console.log(getAreaData());

    //获取联动二级数据
    function getTownData(id) {
        var townData = [];
        $.each(area, function (i, v) {
            if (v.id == id) {
                $.each(v.childs, function (c, d) {
                    townData.push({
                        id: d.id,
                        value: d.value
                    })
                })

            }
        })
        return townData;
    }
    // console.log(getTownData(1));

    //获取联动三级数据
    function getSchoolData(parentId, id) {
        var schoolData = [];
        $.each(area, function (i, v) {
            if (v.id == parentId) {
                $.each(v.childs, function (c, d) {
                    if (d.id == id) {
                        schoolData = d.childs;
                    }
                })

            }
        })
        return schoolData;
    }

    var idx = 1;
    if ($('#area_trigger').size()) {
        //区域选择及学校选择
        var areaSelect = new MobileSelect({
            trigger: '#area_trigger',
            title: '区县选择',
            wheels: [
                { data: getAreaData() }
            ],
            position: [2, 0],
            transitionEnd: function (indexArr, data) {
                //console.log(data);
            },
            callback: function (indexArr, data) {
                storageField = data[0].id;
                idx++;
                var town = getTownData(data[0].id);

                $('#school_trigger').val('')
                $('#area_trigger').val(data[0].value);
                $('#area_trigger').parents('dl').attr('data-d', data[0].id);
                $('#town_trigger').val('');
                var townSelect = new MobileSelect({
                    trigger: '#town_trigger',
                    title: '选择乡镇',
                    wheels: [
                        { data: town }
                    ],
                    position: [0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
                    transitionEnd: function (indexArr, data) {
                        //console.log(data);
                    },
                    callback: function (indexArr, data) {

                        //console.log(indexArr, data);
                        var school = getSchoolData(storageField, data[0].id);


                        //$('.mobileSelect').remove();
                        $('#town_trigger').val(data[0].value);
                        $('#town_trigger').parents('dl').attr('data-d', data[0].id);
                        $('#school_trigger').val('');
                        var schoolSelect = new MobileSelect({
                            trigger: '#school_trigger',
                            title: '选择学校',
                            wheels: [
                                { data: school }
                            ],
                            position: [0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
                            transitionEnd: function (indexArr, data) {
                                //console.log(data);
                            },
                            callback: function (indexArr, data) {
                                //$('.mobileSelect').eq(1).remove();
                                //console.log(indexArr, data);
                                $('#school_trigger').val(data[0].value);
                                $('#school_trigger').parents('dl').attr('data-d', data[0].id);
                            }
                        });
                        if ($('.mobileSelect').size() > 3) {
                            $('.mobileSelect').eq(2).remove();
                        }
                    }
                });
                if (idx > 2) {
                    if ($('.mobileSelect').size() == 3) {
                        $('.mobileSelect').eq(idx - 2).remove();
                    }
                    if ($('.mobileSelect').size() == 4) {
                        $('.mobileSelect').eq(1).remove();
                        $('.mobileSelect').eq(1).remove();
                    }
                    idx--;
                }
            }
        });
    };


    //单选题
    $('body').on('click', '.qs_chose_one p', function () {
        $(this).find('i').addClass('active').parent().siblings().find('i').removeClass('active');
        $(this).parents('dl').attr('data-d', $(this).index() - 0 + 1);

        if ($(this).siblings('input').size()) {
            $(this).parents('dl').attr('data-d', $(this).index());
            if($(this).next('input').size()){
                $(this).next('input').focus();
            }else{
                $(this).siblings('input').val('');
            }
            
        }
        //学段
        if ($(this).parents('.list').attr('data-id') == 'section'){
            $('#grade').find('.active').removeClass('active');
            $('#grade').parents('.list').attr('data-d','');

            if($(this).index() == 0){
                $('#grade span').each(function(i,v){
                    if(i>5){
                        $(v).addClass('hide');
                    }else{
                        $(v).removeClass('hide')
                    }
                })
            };
            if ($(this).index() == 1) {
                $('#grade span').each(function (i, v) {
                    if (i>5 && i<9) {
                        $(v).removeClass('hide');
                    } else {
                        $(v).addClass('hide')
                    }
                })
            };
            if ($(this).index() == 2) {
                $('#grade span').each(function (i, v) {
                    if (i > 8) {
                        $(v).removeClass('hide');
                    } else {
                        $(v).addClass('hide')
                    }
                })
            };

        }
    });

    //年级单选题
    $('#grade').on('click', 'span', function () {
        if(!$(this).parents('.list').prev().attr('data-d')){
            alert('请先选择学段');
            return false;
        }
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('dl').attr('data-d', $(this).index() - 0 + 1);
        
    });
    //学段单选题
    $('#section').on('click', 'span', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('dl').attr('data-d', $(this).index() - 0 + 1);
    });
    //多选题
    $('body').on('click', '.qs_chose_more p', function () {
        var arr = [];
        $(this).find('i').toggleClass('active');

        $(this).parents('.pub_bg').find('.active').parent().each(function (i, v) {
            //console.log($(v).index(),i);
            arr.push($(v).index() + 1);
            //arr.push($(v).index()-0+1);
            //$(this).parents('.qs_chose_more').attr('data-d',arr.join(','));
        });
        $(this).parents('.qs_chose_more').attr('data-d', arr.join(','));
    });

    //单选填空题
    $('body').on('focus','.input_chose input',function(){
        $(this).siblings('p').find('i').removeClass('active');
        $(this).prev('p').find('i').addClass('active');
    })

    //学科多选题
    $('#subject').on('click', 'span', function () {
        var arr = [];
        $(this).toggleClass('active');

        $(this).parents('.grid').find('.active').each(function (i, v) {
            arr.push($(v).index() + 1);
        });
        $(this).parents('.qs_chose_more').attr('data-d', arr.join(','));
    });

    $('.subject_wrap .select').each(function (i, v) {
        $(v).attr('id', 'tarining_area_trigger' + i);

        if ($('#tarining_area_trigger' + i).size()) {
            var tariningAreaSelect = new MobileSelect({
                trigger: '#tarining_area_trigger' + i,
                title: '区域选择',
                wheels: [
                    { data: getAreaData() }
                ],
                position: [2, 0],
                transitionEnd: function (indexArr, data) {
                    //console.log(data);
                },
                callback: function (indexArr, data) {

                    $('#tarining_area_trigger' + i).val(data[0].value);
                    $('#tarining_area_trigger' + i).parents('dl').attr('data-d', data[0].id);
                }
            });
        };

    });

    //添加培训班
    $('.add_btn').on('click', function () {

        // $('.mobileSelect').eq(1).remove();
        $(this).before($('#tpl').html());
        var curTrain = $(this).parents('.subject_wrap').find('.train_tpl');
        if (curTrain.size() >= 6) {
            $('.add_btn').hide();
        };

        curTrain.attr('data-id', curTrain.length);
        $(this).prev('.train_tpl').find('.train_title').text('培训班' + curTrain.length);

        $('.train_tpl').each(function (i, v) {
            $(v).find('.select').attr('id', 'tarining_area_trigger' + i);
            if ($('.select').size()) {
                var obj = $('#tarining_area_trigger' + i);
                var tariningAreaSelect = new MobileSelect({
                    trigger: '#tarining_area_trigger' + i,
                    title: '区域选择',
                    wheels: [
                        { data: getAreaData() }
                    ],
                    position: [2, 0],
                    transitionEnd: function (indexArr, data) {
                        //console.log(data);
                    },
                    callback: function (indexArr, data) {

                        $('#tarining_area_trigger' + i).val(data[0].value);
                        $('#tarining_area_trigger' + i).parents('dl').attr('data-d', data[0].id);
                    }
                });
            };
        })
        var domLen = $('.train_tpl').length;
        var modalLen = $('.mobileSelect').length;
        var len = modalLen - domLen;
        for (var i = 0; i < len; i++) {
            $('.mobileSelect').eq(0).remove();
        }



    });

    //删除培训班
    $('.subject_wrap').delegate('.del_train', 'click', function () {
        var idx = $(this).parents('.train_tpl').index() - 1;
        $(this).parents('.train_tpl').remove();
        $('.mobileSelect').eq(idx).remove();
        $('.add_btn').show();
    });

    //获取单维度
    var getVal = (selector) => {
        //表单正常提交
        var arr = {};

        $(selector).find('dl').each(function (i, v) {
            if($(v).find('.input_chose').size()){
                if ($.trim($(v).find('input').val()) !=''){
                    arr[$(v).attr('data-id')] = $(v).find('input').val();
                }else{
                    arr[$(v).attr('data-id')] = $(v).attr('data-d');                    
                }
            }else{
                if ($(v).hasClass('qs_input')) {
                    arr[$(v).attr('data-id')] = $(v).find('input').val();
                }
                if ($(v).hasClass('qs_chose_one')) {
                    arr[$(v).attr('data-id')] = $(v).attr('data-d');
                }
                if ($(v).hasClass('qs_chose_more')) {
                    arr[$(v).attr('data-id')] = $(v).attr('data-d');
                }
                if($(v).find('.select').size()){
                    arr[$(v).attr('data-id')] = $(v).attr('data-d');                    
                }
            }
        })

        return arr;
    }

    //获取多维度表单数据
    var getMoreVal = () => {
        var arr = [];
        $('.train_tpl').each(function (i, v) {
            arr.push(getVal(v));
        })
        return arr;
    }
    var submitUrl = $('#js_submit').attr('data-url');
    //提交
    var _flag = true;
    $('#js_submit').on('click', function () {

        if(_flag){
            
            if (!isEmpty()) {
                alert('请完成所有的题');
                return false;
            };
            var param = {};
            if ($('.train_tpl').size()) {
                //多维度提交
                param.data = getMoreVal();
                param.subject_id = $('#subject_id').val();
                param.name = $('#_name').find('input').val();
            } else {
                param = getVal('body');
            }

            param.wx_token = $('#wx_token').val();
            console.log(param);
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
        


    });

    //非空判断
    function isEmpty() {
        var flag = true;
        $('.list').each(function () {
            if($(this).hasClass('is_null')){
                return false;
            }
            var $input = $(this).find('input');
            var $textarea = $(this).find('textarea');
            if ($(this).find('.input_chose').size()){
                
                if($.trim($(this).find('input').val()) == ''){
                    if($(this).find('input').prev('p').find('i').hasClass('active')){
                        flag = false;
                    }
                }
            }else{
                if ($input.size()) {
                    if ($.trim($input.val()) == '') {
                        flag = false;
                    }
                } else if ($textarea.size()) {
                    if ($.trim($textarea.val()) == '') {
                        flag = false;
                    }
                }else if($(this).find('.select').size()){
                    if(!$(this).attr('data-d')){
                        flag = false;
                    }
                } else {
                    if (!$(this).find('.active').size()) {
                        flag = false;
                    }
                };
            }
            
        });
        return flag;
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
            alert('网络繁忙,请稍候重试!');
        }
    });
    return flag;
};
function getClass(dom, string) {
    return dom.getElementsByClassName(string);
}
//构造器
function MobileSelect(config) {
    this.mobileSelect;
    this.wheelsData = config.wheels;
    this.jsonType = false;
    this.cascadeJsonData = [];
    this.displayJson = [];
    this.curValue = null;
    this.curIndexArr = [];
    this.cascade = false;
    this.startY;
    this.moveEndY;
    this.moveY;
    this.oldMoveY;
    this.offset = 0;
    this.offsetSum = 0;
    this.oversizeBorder;
    this.curDistance = [];
    this.clickStatus = false;
    this.isPC = true;
    this.init(config);
}
MobileSelect.prototype = {
    constructor: MobileSelect,
    init: function (config) {
        var _this = this;
        _this.keyMap = config.keyMap ? config.keyMap : { id: 'id', value: 'value', childs: 'childs' };
        _this.checkDataType();
        _this.renderWheels(_this.wheelsData, config.cancelBtnText, config.ensureBtnText);
        _this.trigger = document.querySelector(config.trigger);
        if (!_this.trigger) {
            console.error('mobileSelect has been successfully installed, but no trigger found on your page.');
            return false;
        }
        _this.wheel = getClass(_this.mobileSelect, 'wheel');
        _this.slider = getClass(_this.mobileSelect, 'selectContainer');
        _this.wheels = _this.mobileSelect.querySelector('.wheels');
        _this.liHeight = _this.mobileSelect.querySelector('li').offsetHeight;
        _this.ensureBtn = _this.mobileSelect.querySelector('.ensure');
        _this.cancelBtn = _this.mobileSelect.querySelector('.cancel');
        _this.grayLayer = _this.mobileSelect.querySelector('.grayLayer');
        _this.popUp = _this.mobileSelect.querySelector('.content');
        _this.callback = config.callback || function () { };
        _this.transitionEnd = config.transitionEnd || function () { };
        _this.onShow = config.onShow || function () { };
        _this.onHide = config.onHide || function () { };
        _this.initPosition = config.position || [];
        _this.titleText = config.title || '';
        _this.connector = config.connector || ' ';
        _this.triggerDisplayData = !(typeof (config.triggerDisplayData) == 'undefined') ? config.triggerDisplayData : true;
        _this.trigger.style.cursor = 'pointer';
        _this.setStyle(config);
        _this.setTitle(_this.titleText);
        _this.checkIsPC();
        _this.checkCascade();
        _this.addListenerAll();

        if (_this.cascade) {
            _this.initCascade();
        }
        //定位 初始位置
        if (_this.initPosition.length < _this.slider.length) {
            var diff = _this.slider.length - _this.initPosition.length;
            for (var i = 0; i < diff; i++) {
                _this.initPosition.push(0);
            }
        }

        _this.setCurDistance(_this.initPosition);


        //按钮监听
        _this.cancelBtn.addEventListener('click', function () {
            _this.hide();
        });

        _this.ensureBtn.addEventListener('click', function () {
            _this.hide();
            if (!_this.liHeight) {
                _this.liHeight = _this.mobileSelect.querySelector('li').offsetHeight;
            }
            var tempValue = '';
            for (var i = 0; i < _this.wheel.length; i++) {
                i == _this.wheel.length - 1 ? tempValue += _this.getInnerHtml(i) : tempValue += _this.getInnerHtml(i) + _this.connector;
            }
            if (_this.triggerDisplayData) {
                _this.trigger.innerHTML = tempValue;
            }
            _this.curIndexArr = _this.getIndexArr();
            _this.curValue = _this.getCurValue();
            _this.callback(_this.curIndexArr, _this.curValue);
        });

        _this.trigger.addEventListener('click', function () {
            _this.show();
        });
        _this.grayLayer.addEventListener('click', function () {
            _this.hide();
        });
        _this.popUp.addEventListener('click', function () {
            event.stopPropagation();
        });

        _this.fixRowStyle(); //修正列数
    },

    setTitle: function (string) {
        var _this = this;
        _this.titleText = string;
        _this.mobileSelect.querySelector('.title').innerHTML = _this.titleText;
    },

    setStyle: function (config) {
        var _this = this;
        if (config.ensureBtnColor) {
            _this.ensureBtn.style.color = config.ensureBtnColor;
        }
        if (config.cancelBtnColor) {
            _this.cancelBtn.style.color = config.cancelBtnColor;
        }
        if (config.titleColor) {
            _this.title = _this.mobileSelect.querySelector('.title');
            _this.title.style.color = config.titleColor;
        }
        if (config.textColor) {
            _this.panel = _this.mobileSelect.querySelector('.panel');
            _this.panel.style.color = config.textColor;
        }
        if (config.titleBgColor) {
            _this.btnBar = _this.mobileSelect.querySelector('.btnBar');
            _this.btnBar.style.backgroundColor = config.titleBgColor;
        }
        if (config.bgColor) {
            _this.panel = _this.mobileSelect.querySelector('.panel');
            _this.shadowMask = _this.mobileSelect.querySelector('.shadowMask');
            _this.panel.style.backgroundColor = config.bgColor;
            _this.shadowMask.style.background = 'linear-gradient(to bottom, ' + config.bgColor + ', rgba(255, 255, 255, 0), ' + config.bgColor + ')';
        }
        if (!isNaN(config.maskOpacity)) {
            _this.grayMask = _this.mobileSelect.querySelector('.grayLayer');
            _this.grayMask.style.background = 'rgba(0, 0, 0, ' + config.maskOpacity + ')';
        }
    },

    checkIsPC: function () {
        var _this = this;
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            _this.isPC = false;
        }
    },

    show: function () {
        this.mobileSelect.classList.add('mobileSelect-show');
        if (typeof this.onShow === 'function') {
            this.onShow(this);
        }
    },

    hide: function () {
        this.mobileSelect.classList.remove('mobileSelect-show');
        if (typeof this.onHide === 'function') {
            this.onHide(this);
        }
    },

    renderWheels: function (wheelsData, cancelBtnText, ensureBtnText) {
        var _this = this;
        var cancelText = cancelBtnText ? cancelBtnText : '取消';
        var ensureText = ensureBtnText ? ensureBtnText : '确认';
        _this.mobileSelect = document.createElement("div");
        _this.mobileSelect.className = "mobileSelect";
        _this.mobileSelect.innerHTML =
            '<div class="grayLayer"></div>' +
            '<div class="content">' +
            '<div class="btnBar">' +
            '<div class="fixWidth">' +
            '<div class="cancel">' + cancelText + '</div>' +
            '<div class="title"></div>' +
            '<div class="ensure">' + ensureText + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="panel">' +
            '<div class="fixWidth">' +
            '<div class="wheels">' +
            '</div>' +
            '<div class="selectLine"></div>' +
            '<div class="shadowMask"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(_this.mobileSelect);

        //根据数据长度来渲染

        var tempHTML = '';
        for (var i = 0; i < wheelsData.length; i++) {
            //列
            tempHTML += '<div class="wheel"><ul class="selectContainer">';
            if (_this.jsonType) {
                for (var j = 0; j < wheelsData[i].data.length; j++) {
                    //行
                    tempHTML += '<li data-id="' + wheelsData[i].data[j][_this.keyMap.id] + '">' + wheelsData[i].data[j][_this.keyMap.value] + '</li>';
                }
            } else {
                for (var j = 0; j < wheelsData[i].data.length; j++) {
                    //行
                    tempHTML += '<li>' + wheelsData[i].data[j] + '</li>';
                }
            }
            tempHTML += '</ul></div>';
        }
        _this.mobileSelect.querySelector('.wheels').innerHTML = tempHTML;
    },

    addListenerAll: function () {
        var _this = this;
        for (var i = 0; i < _this.slider.length; i++) {
            //手势监听
            (function (i) {
                _this.addListenerWheel(_this.wheel[i], i);
            })(i);
        }
    },

    addListenerWheel: function (theWheel, index) {
        var _this = this;
        theWheel.addEventListener('touchstart', function () {
            _this.touch(event, this.firstChild, index);
        }, false);
        theWheel.addEventListener('touchend', function () {
            _this.touch(event, this.firstChild, index);
        }, false);
        theWheel.addEventListener('touchmove', function () {
            _this.touch(event, this.firstChild, index);
        }, false);

        if (_this.isPC) {
            //如果是PC端则再增加拖拽监听 方便调试
            theWheel.addEventListener('mousedown', function () {
                _this.dragClick(event, this.firstChild, index);
            }, false);
            theWheel.addEventListener('mousemove', function () {
                _this.dragClick(event, this.firstChild, index);
            }, false);
            theWheel.addEventListener('mouseup', function () {
                _this.dragClick(event, this.firstChild, index);
            }, true);
        }
    },

    checkDataType: function () {
        var _this = this;
        if (typeof (_this.wheelsData[0].data[0]) == 'object') {
            _this.jsonType = true;
        }
    },

    checkCascade: function () {
        var _this = this;
        if (_this.jsonType) {
            var node = _this.wheelsData[0].data;
            for (var i = 0; i < node.length; i++) {
                if (_this.keyMap.childs in node[i] && node[i][_this.keyMap.childs].length > 0) {
                    _this.cascade = true;
                    _this.cascadeJsonData = _this.wheelsData[0].data;
                    break;
                }
            }
        } else {
            _this.cascade = false;
        }
    },

    generateArrData: function (targetArr) {
        var tempArr = [];
        var keyMap_id = this.keyMap.id;
        var keyMap_value = this.keyMap.value;
        for (var i = 0; i < targetArr.length; i++) {
            var tempObj = {};
            tempObj[keyMap_id] = targetArr[i][this.keyMap.id];
            tempObj[keyMap_value] = targetArr[i][this.keyMap.value];
            tempArr.push(tempObj);
        }
        return tempArr;
    },

    initCascade: function () {
        var _this = this;
        _this.displayJson.push(_this.generateArrData(_this.cascadeJsonData));
        if (_this.initPosition.length > 0) {
            _this.initDeepCount = 0;
            _this.initCheckArrDeep(_this.cascadeJsonData[_this.initPosition[0]]);
        } else {
            _this.checkArrDeep(_this.cascadeJsonData[0]);
        }
        _this.reRenderWheels();
    },

    initCheckArrDeep: function (parent) {
        var _this = this;
        if (parent) {
            if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
                _this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs]));
                _this.initDeepCount++;
                var nextNode = parent[_this.keyMap.childs][_this.initPosition[_this.initDeepCount]];
                if (nextNode) {
                    _this.initCheckArrDeep(nextNode);
                } else {
                    _this.checkArrDeep(parent[_this.keyMap.childs][0]);
                }
            }
        }
    },

    checkArrDeep: function (parent) {
        //检测子节点深度  修改 displayJson
        var _this = this;
        if (parent) {
            if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
                _this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs])); //生成子节点数组
                _this.checkArrDeep(parent[_this.keyMap.childs][0]);//检测下一个子节点
            }
        }
    },

    checkRange: function (index, posIndexArr) {
        var _this = this;
        var deleteNum = _this.displayJson.length - 1 - index;
        for (var i = 0; i < deleteNum; i++) {
            _this.displayJson.pop(); //修改 displayJson
        }
        var resultNode;
        for (var i = 0; i <= index; i++) {
            if (i == 0)
                resultNode = _this.cascadeJsonData[posIndexArr[0]];
            else {
                resultNode = resultNode[_this.keyMap.childs][posIndexArr[i]];
            }
        }
        _this.checkArrDeep(resultNode);
        //console.log(_this.displayJson);
        _this.reRenderWheels();
        _this.fixRowStyle();
        _this.setCurDistance(_this.resetPosition(index, posIndexArr));
    },

    resetPosition: function (index, posIndexArr) {
        var _this = this;
        var tempPosArr = posIndexArr;
        var tempCount;
        if (_this.slider.length > posIndexArr.length) {
            tempCount = _this.slider.length - posIndexArr.length;
            for (var i = 0; i < tempCount; i++) {
                tempPosArr.push(0);
            }
        } else if (_this.slider.length < posIndexArr.length) {
            tempCount = posIndexArr.length - _this.slider.length;
            for (var i = 0; i < tempCount; i++) {
                tempPosArr.pop();
            }
        }
        for (var i = index + 1; i < tempPosArr.length; i++) {
            tempPosArr[i] = 0;
        }
        return tempPosArr;
    },

    reRenderWheels: function () {
        var _this = this;
        //删除多余的wheel
        if (_this.wheel.length > _this.displayJson.length) {
            var count = _this.wheel.length - _this.displayJson.length;
            for (var i = 0; i < count; i++) {
                _this.wheels.removeChild(_this.wheel[_this.wheel.length - 1]);
            }
        }
        for (var i = 0; i < _this.displayJson.length; i++) {
            //列
            (function (i) {
                var tempHTML = '';
                if (_this.wheel[i]) {
                    //console.log('插入Li');
                    for (var j = 0; j < _this.displayJson[i].length; j++) {
                        //行
                        tempHTML += '<li data-id="' + _this.displayJson[i][j][_this.keyMap.id] + '">' + _this.displayJson[i][j][_this.keyMap.value] + '</li>';
                    }
                    _this.slider[i].innerHTML = tempHTML;

                } else {
                    var tempWheel = document.createElement("div");
                    tempWheel.className = "wheel";
                    tempHTML = '<ul class="selectContainer">';
                    for (var j = 0; j < _this.displayJson[i].length; j++) {
                        //行
                        tempHTML += '<li data-id="' + _this.displayJson[i][j][_this.keyMap.id] + '">' + _this.displayJson[i][j][_this.keyMap.value] + '</li>';
                    }
                    tempHTML += '</ul>';
                    tempWheel.innerHTML = tempHTML;

                    _this.addListenerWheel(tempWheel, i);
                    _this.wheels.appendChild(tempWheel);
                }
                //_this.·(i);
            })(i);
        }
    },

    updateWheels: function (data) {
        var _this = this;
        if (_this.cascade) {
            _this.cascadeJsonData = data;
            _this.displayJson = [];
            _this.initCascade();
            if (_this.initPosition.length < _this.slider.length) {
                var diff = _this.slider.length - _this.initPosition.length;
                for (var i = 0; i < diff; i++) {
                    _this.initPosition.push(0);
                }
            }
            _this.setCurDistance(_this.initPosition);
            _this.fixRowStyle();
        }
    },

    updateWheel: function (sliderIndex, data) {
        var _this = this;
        var tempHTML = '';
        if (_this.cascade) {
            console.error('级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源');
            return false;
        }
        else if (_this.jsonType) {
            for (var j = 0; j < data.length; j++) {
                tempHTML += '<li data-id="' + data[j][_this.keyMap.id] + '">' + data[j][_this.keyMap.value] + '</li>';
            }
            _this.wheelsData[sliderIndex] = { data: data };
        } else {
            for (var j = 0; j < data.length; j++) {
                tempHTML += '<li>' + data[j] + '</li>';
            }
            _this.wheelsData[sliderIndex] = data;
        }
        _this.slider[sliderIndex].innerHTML = tempHTML;
    },

    fixRowStyle: function () {
        var _this = this;
        var width = (100 / _this.wheel.length).toFixed(2);
        for (var i = 0; i < _this.wheel.length; i++) {
            _this.wheel[i].style.width = width + '%';
        }
    },

    getIndex: function (distance) {
        return Math.round((2 * this.liHeight - distance) / this.liHeight);
    },

    getIndexArr: function () {
        var _this = this;
        var temp = [];
        for (var i = 0; i < _this.curDistance.length; i++) {
            temp.push(_this.getIndex(_this.curDistance[i]));
        }
        return temp;
    },

    getCurValue: function () {
        var _this = this;
        var temp = [];
        var positionArr = _this.getIndexArr();
        if (_this.cascade) {
            for (var i = 0; i < _this.wheel.length; i++) {
                temp.push(_this.displayJson[i][positionArr[i]]);
            }
        }
        else if (_this.jsonType) {
            for (var i = 0; i < _this.curDistance.length; i++) {
                temp.push(_this.wheelsData[i].data[_this.getIndex(_this.curDistance[i])]);
            }
        } else {
            for (var i = 0; i < _this.curDistance.length; i++) {
                temp.push(_this.getInnerHtml(i));
            }
        }
        return temp;
    },

    getValue: function () {
        return this.curValue;
    },

    calcDistance: function (index) {
        return 2 * this.liHeight - index * this.liHeight;
    },

    setCurDistance: function (indexArr) {
        var _this = this;
        var temp = [];
        for (var i = 0; i < _this.slider.length; i++) {
            temp.push(_this.calcDistance(indexArr[i]));
            _this.movePosition(_this.slider[i], temp[i]);
        }
        _this.curDistance = temp;
    },

    fixPosition: function (distance) {
        return -(this.getIndex(distance) - 2) * this.liHeight;
    },

    movePosition: function (theSlider, distance) {
        theSlider.style.webkitTransform = 'translate3d(0,' + distance + 'px, 0)';
        theSlider.style.transform = 'translate3d(0,' + distance + 'px, 0)';
    },

    locatePosition: function (index, posIndex) {
        var _this = this;
        this.curDistance[index] = this.calcDistance(posIndex);
        this.movePosition(this.slider[index], this.curDistance[index]);
        if (_this.cascade) {
            _this.checkRange(index, _this.getIndexArr());
        }
    },

    updateCurDistance: function (theSlider, index) {
        if (theSlider.style.transform) {
            this.curDistance[index] = parseInt(theSlider.style.transform.split(',')[1]);
        } else {
            this.curDistance[index] = parseInt(theSlider.style.webkitTransform.split(',')[1]);
        }
    },

    getDistance: function (theSlider) {
        if (theSlider.style.transform) {
            return parseInt(theSlider.style.transform.split(',')[1]);
        } else {
            return parseInt(theSlider.style.webkitTransform.split(',')[1]);
        }
    },

    getInnerHtml: function (sliderIndex) {
        var _this = this;
        var index = _this.getIndex(_this.curDistance[sliderIndex]);
        return _this.slider[sliderIndex].getElementsByTagName('li')[index].innerHTML;
    },

    touch: function (event, theSlider, index) {
        var _this = this;
        event = event || window.event;
        switch (event.type) {
            case "touchstart":
                _this.startY = event.touches[0].clientY;
                _this.startY = parseInt(_this.startY);
                _this.oldMoveY = _this.startY;
                break;

            case "touchend":

                _this.moveEndY = parseInt(event.changedTouches[0].clientY);
                _this.offsetSum = _this.moveEndY - _this.startY;
                _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length - 3) * _this.liHeight;

                if (_this.offsetSum == 0) {
                    //offsetSum为0,相当于点击事件
                    // 0 1 [2] 3 4
                    var clickOffetNum = parseInt((document.documentElement.clientHeight - _this.moveEndY) / 40);
                    if (clickOffetNum != 2) {
                        var offset = clickOffetNum - 2;
                        var newDistance = _this.curDistance[index] + (offset * _this.liHeight);
                        if ((newDistance <= 2 * _this.liHeight) && (newDistance >= _this.oversizeBorder)) {
                            _this.curDistance[index] = newDistance;
                            _this.movePosition(theSlider, _this.curDistance[index]);
                            _this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
                        }
                    }
                } else {
                    //修正位置
                    _this.updateCurDistance(theSlider, index);
                    _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
                    _this.movePosition(theSlider, _this.curDistance[index]);

                    //反弹
                    if (_this.curDistance[index] + _this.offsetSum > 2 * _this.liHeight) {
                        _this.curDistance[index] = 2 * _this.liHeight;
                        setTimeout(function () {
                            _this.movePosition(theSlider, _this.curDistance[index]);
                        }, 100);

                    } else if (_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder) {
                        _this.curDistance[index] = _this.oversizeBorder;
                        setTimeout(function () {
                            _this.movePosition(theSlider, _this.curDistance[index]);
                        }, 100);
                    }
                    _this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
                }

                if (_this.cascade) {
                    _this.checkRange(index, _this.getIndexArr());
                }

                break;

            case "touchmove":
                event.preventDefault();
                _this.moveY = event.touches[0].clientY;
                _this.offset = _this.moveY - _this.oldMoveY;

                _this.updateCurDistance(theSlider, index);
                _this.curDistance[index] = _this.curDistance[index] + _this.offset;
                _this.movePosition(theSlider, _this.curDistance[index]);
                _this.oldMoveY = _this.moveY;
                break;
        }
    },

    dragClick: function (event, theSlider, index) {
        var _this = this;
        event = event || window.event;
        switch (event.type) {
            case "mousedown":
                _this.startY = event.clientY;
                _this.oldMoveY = _this.startY;
                _this.clickStatus = true;
                break;

            case "mouseup":

                _this.moveEndY = event.clientY;
                _this.offsetSum = _this.moveEndY - _this.startY;
                _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length - 3) * _this.liHeight;

                if (_this.offsetSum == 0) {
                    var clickOffetNum = parseInt((document.documentElement.clientHeight - _this.moveEndY) / 40);
                    if (clickOffetNum != 2) {
                        var offset = clickOffetNum - 2;
                        var newDistance = _this.curDistance[index] + (offset * _this.liHeight);
                        if ((newDistance <= 2 * _this.liHeight) && (newDistance >= _this.oversizeBorder)) {
                            _this.curDistance[index] = newDistance;
                            _this.movePosition(theSlider, _this.curDistance[index]);
                            _this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
                        }
                    }
                } else {
                    //修正位置
                    _this.updateCurDistance(theSlider, index);
                    _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
                    _this.movePosition(theSlider, _this.curDistance[index]);

                    //反弹
                    if (_this.curDistance[index] + _this.offsetSum > 2 * _this.liHeight) {
                        _this.curDistance[index] = 2 * _this.liHeight;
                        setTimeout(function () {
                            _this.movePosition(theSlider, _this.curDistance[index]);
                        }, 100);

                    } else if (_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder) {
                        _this.curDistance[index] = _this.oversizeBorder;
                        setTimeout(function () {
                            _this.movePosition(theSlider, _this.curDistance[index]);
                        }, 100);
                    }
                    _this.transitionEnd(_this.getIndexArr(), _this.getCurValue());

                }

                _this.clickStatus = false;
                if (_this.cascade) {
                    _this.checkRange(index, _this.getIndexArr());
                }
                break;

            case "mousemove":
                event.preventDefault();
                if (_this.clickStatus) {
                    _this.moveY = event.clientY;
                    _this.offset = _this.moveY - _this.oldMoveY;
                    _this.updateCurDistance(theSlider, index);
                    _this.curDistance[index] = _this.curDistance[index] + _this.offset;
                    _this.movePosition(theSlider, _this.curDistance[index]);
                    _this.oldMoveY = _this.moveY;
                }
                break;
        }
    }
};

