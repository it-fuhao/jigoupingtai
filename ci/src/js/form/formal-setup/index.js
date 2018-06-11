/*
 * @Author: fuhao 
 * @Date: 2018-04-29 17:16:05 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-31 00:03:20
 */

var $ = require("jquery");
var API = require("@components/api");
var areaData = require('@components/data');
var area = require('@components/area');
var people = require('@components/people');

//var changeTpl = require('./else_tpl'); //变更流程引入模板

// console.log(people.data);

$(function () {

    //获取接口
    var saveUrlVal = $('#url_save').val();//表单保存接口
    var auditUrlVal = $('#url_audit').val();//表单审核接口
    var submitUrlVal = $('#url_submit').val();//表单提交接口
    var delUrlVal = $('.url_del').val();//表单删除接口

    //var saveUrlVal = $('#url_save').val();//变更保存接口

    var saveUrl = API.SETUP.SETUPSAVE + saveUrlVal;
    var auditUrl = API.SETUP.SETUPAUDIT + auditUrlVal;
    var submitUrl = API.SETUP.SETUPSUBMIT + submitUrlVal;
    var delUrl = API.SETUP.DEL + delUrlVal;



    function Ci() {


        //卡片类型
        this.tpl = '';

        //表单只有一个添加按钮 配置不可删除最后一项的数组
        this.kp_num = [
            'ct2',
            'ct5_1_1',
            'ct5_1_2',
            'ct5_2_1',
            'ct5_2_2',
            'ct5_3',
            'ct5_4',
            'ct6_1',
            'ct6_2',
            'ct6_3',
            'ct6_4',
            'ct8_1',
            'ct8_2',
            'ct10',
            'ct11',
            'ct12',
            'ct13'
        ];

        //事件委托者
        this.parentNode = $('.ct');

        //this.tabIndex = 0;


        //渲染民族
        this.nation = function () {

            $('.pc_box[data-field="nation"]').each(function (i, v) {

                for (var j = 0; j < people.data.length; j++) {
                    var str = '<li data-id="' + people.data[j].id + '">' + people.data[j].name + '</li>';
                    $(v).find('.drop_list').append(str);
                }

            })

        }

        //focus样式
        this.focus = function (oThis) {
            $('input').removeClass('focus_border err_border');
            $('textarea').removeClass('focus_border err_border');
            oThis.addClass('focus_border');
        }


        //下拉列表（一级）
        this.dropOne = function (oThis) {
            if (oThis.siblings('ul').css('display') == 'block') {
                $('.drop_list').slideUp('fast');
                oThis.find('i').removeClass('up');
            } else {
                $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
                oThis.siblings('ul').slideDown('fast');
                oThis.find('i').addClass('up');
            }
            $('.drop_area_list').hide();
        }

        //卡片只剩一个的时候不能删除
        this.removeDel = function (a) {
            //判断传入的变量是否是数组
            if (a instanceof Array) {
                $.each(a, function (i, v) {
                    if ($('.' + v).children('.pub_box').length < 2) {
                        $('.' + v).children('.pub_box').find('.kp_del').addClass('hide');
                    } else {
                        $('.' + v).children('.pub_box').find('.kp_del').removeClass('hide');
                    }

                })
            } else {
                if (this.kp_num.indexOf(a.attr('class')) > -1) {
                    //当前需要删除的卡片类型是单卡片类型
                    if (a.find('.kp_del').length < 2) {
                        a.find('.kp_del').addClass('hide');
                    } else {
                        a.find('.kp_del').removeClass('hide');
                    }
                } else {
                    //当前需要删除的卡片类型是多卡片类型
                    if (a.find('.kp_del').length < 1) {
                        a.find('.re_page').addClass('show');
                        a.find('.add_box_more').addClass('m0');
                    } else {
                        a.find('.kp_del').removeClass('hide');
                    }
                }

            }

        }

        //获取卡片名字并排序
        this.findFormTitle = function (o, l) {
            var font = o.parent().prev().find('.title').text();
            font = font.substr(0, font.length - 1);

            $('.' + l).each(function (i, v) {
                $(v).find('.title').text(font + (i + 1));
            })

            //当前表单排序
            var nowA = o.parent().parent();
            this.removeDel(nowA);
        }

        //添加表单
        this.addForm = function (oThis) {
            this.tpl = oThis.attr('data-add');//获取模板id
            var _btnBox = oThis.parent();//按钮盒子
            //如果有空页面
            if (_btnBox.prev('.re_page')) {
                _btnBox.prev('.re_page').removeClass('show');
            }
            // console.log(this.tpl);
            _btnBox.before($('#' + this.tpl).html());

            _btnBox.removeClass('m0');
            this.findFormTitle(oThis, this.tpl);
        }

        //删除表单
        this.delForm = function (oThis) {
            //删除发请求

            var param = {
                'id': oThis.attr('del-id'),
            }//页面渲染的时候，如果该表单在数据库 并且用户要删除该表单，字段代表删除是否需要发请求
            var thisTpl = this.tpl;

            if (param.id) {
                console.log(param);
                requestData(delUrl, "post", call, param);

                function call(data) {
                    if (data.status == 1) {
                        del(oThis);
                    } else {
                        errMsg(data.message);
                    };
                };

            } else {
                del(oThis);
            }

            //删除函数 前端页面操作
            function del(oThis) {
                var _o = oThis.parents('.pub_box').siblings('.add_box').find('.add');
                console.log(this);
                thisTpl = _o.attr('data-add');//获取模板id

                oThis.parents('.pub_box').remove();

                _ci.findFormTitle(_o, thisTpl);
            }

        }

        //表格增加一行
        this.addTable = function (oThis) {
            var _thisTable = oThis.parent().next();
            var str = "<tr>" + oThis.attr('data-tpl') + "</tr>";
            _thisTable.find('table').append(str);
        }

        //表格删除一行
        this.removeTable = function (oThis) {
            oThis.parents('tr').remove();
        }

        //表格清空一行
        this.emptyTable = function (oThis) {
            oThis.parents('tr').find('input').val('');
        }
        //初始化
        this.init = function () {
            //初始化表单第一张卡片是否可以删除
            this.removeDel(this.kp_num);

            //民族初始化
            this.nation();

            //动态创建元素 dom丢失
            if ($('.dropdown_area').length > 0) {
                $('.dropdown_area').each(function (i, v) {
                    $(v).attr('id', 'dropdown_area' + i);
                    area('#dropdown_area' + i, areaData);
                })

            };
            //日期选择赋ID
            if ($('.js_time_input1').length > 0) {

                $('.js_time_input1').each(function (i, v) {
                    $(v).attr('id', 'js_time_input' + i);
                    datePick($('#js_time_input' + i), "YYYY/MM/DD");
                })
            };

            if ($('.js_time_input3').length > 0) {
                $('.js_time_input3').each(function (i, v) {
                    $(v).attr('id', 'js_time_input3' + i);
                    datePick($('#js_time_input3' + i), "hh:mm:ss");
                })
            }

            //缓存表格行
            if ($('.add_table').length > 0 && $('table').length > 0) {

                $('.add_table').each(function (i, v) {
                    var len = $(v).parent().next().find('tr').eq(1).find('td').length;
                    var place = $(v).parent().next().find('tr').eq(1);
                    var str = '';
                    for(var j = 0;j<len-1;j++){
                        var placeholderText = place.find('td').eq(j).find('input').attr('placeholder');
                        str += '<td><input type="text" placeholder="' + placeholderText+'"></td>';
                        
                    }
                    str +='<td><a href="javascript:;" class="remove_table">删除</a></td>';
                    str = '<tr>'+str+'</tr>'
                    $(v).attr('data-tpl', str);
                })
            }

            //滚动条
            scroll();


        }
    }
    var _ci = new Ci();
    _ci.init();


    //事件委托者
    var $ct = _ci.parentNode;

    //数据渲染
    //单选
    $('.chose_one').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var idx = $(v).attr('data-id');
            $(v).find('dd[data-id="' + idx + '"]').addClass('active');
        }
    })

    //多选
    $('.chose_more').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var arr = $(v).attr('data-id');
            var arr2 = arr.split(',');
            for (var j = 0; j < arr2.length; j++) {
                $(v).find('dd[data-id="' + arr2[j] + '"]').addClass('active');
            }
        }

    })

    //下拉列表
    $('.dropdown').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var idx = $(v).attr('data-id');
            if (!idx || idx == 0) {
                $(v).find('span').text('请选择');
            } else {
                var wz = $(v).siblings('ul').find('li[data-id="' + idx + '"]').text();
                $(v).find('span').text(wz);
            }
        }

    })
    //是否是变更step
    //var rf = location.href;
    //var isChange = rf.split('?')[1];

	var isChange = $('.main').attr('data-change');
    if (isChange) {
        //办学变更
        if (isChange == '1') {
            $('.pub_box').eq(1).remove();
            $('.tab li').not('.active').remove();
            $('.tab .active').find('a').text('变更').attr('href', 'javascript:;');
            $('.pub_box').eq(0).find('h1').text('机构名称变更');
            $('.pub_box').eq(0).find('.pc_box').not($('.pc_box').eq(0)).remove();
        }
        //校长变更 或举办作者变更
        if (isChange == '2' || isChange == '3') {
            $('.tab li').not('.active').remove();
            $('.tab .active').find('a').text('变更').attr('href', 'javascript:;').siblings('s').remove();
            $('.tab2').remove();
        }
        //校本部变更或教学点变更
        if (isChange == '4' || isChange == '5') {
            $('.tab li').not('.active').remove();
            $('.tab .active').find('a').text('变更').attr('href', 'javascript:;').siblings('s').remove();
        }
        //校本部
        if (isChange == '4') {
            $('.add_box .add2').remove();
            $('.tpl_3_2').remove();

        }
        //教学点
        if (isChange == '5') {
            $('.add_box .add1').remove();
            $('.tpl_3_1').remove();
        }
        //有效期延续
        if (isChange == '6') {
            //8.3提交按钮和申请人信息移除
            $('.js_submit').parent().remove();
            $('.ct_all').remove();

            //有效期延续 更改页面导航链接 全部执行变更操作
            $('.tab a').each(function (i, v) {
                var beforeLink = $(v).attr('href');
                $(v).attr('href', beforeLink + '?6');
            })
            $('.tab2 a').each(function (i, v) {
                var beforeLink = $(v).attr('href');
                $(v).attr('href', beforeLink + '?6');
            })
        }
        //其他变更
        // if ($('.audit_status').size() && $('.cause').size()) {
        //     $('.btn_box').prev().prev().before(changeTpl);
        // } else {

        //     $('.btn_box').before(changeTpl);
        // }

        $('.js_storage').text('提交变更');
    }
    //审核页面3
    var isCheck = $('#addCheck').val();
    if (isCheck == 3) {

        $('.pub_box').each(function (i, v) {
            $(v).addClass('check_border');
        })

        $('.pc_info').each(function (i, v) {
            if ($(v).parent().hasClass('grey_box')) {
                //默认显示的字段
            } else {
                $(v).before('<i class="pc_check"></i>');
            }

        })

        //8_3申请人信息移除
        if ($('.ct_all').size()) {
            $('.ct_all').remove();
        }

        //改保存按钮为提交
        $('.js_storage').text('提 交');

        //表单中的表格元素给复选框
        $('.pc_box table input').each(function (i, v) {
            $(v).before('<i class="pc_check">');
        })

        //表单查看页表单左侧信息加类名
        $('.pc_info p').each(function (i, v) {
            if ($(v).hasClass('input_p')) {
                $(v).removeClass('input_p').addClass('dan_p');
            } else if (!$(v).hasClass('er_p')) {
                $(v).addClass('dan_p');
            }
        })

        //审核的时候 申请人信息不审核
        if($('.else_box').size()){
            $('.else_box').children('.pub_box').eq(1).remove();
        }

        //控制查看1审核3 底部显示内容
        $('.cause').addClass('show');

        //审核页面加红色提示语
        $('.ct').before('<p class="hint">若不同意，请勾选出表单中的不同意事项，并在提交前写明不同意原因。若同意，则直接点击提交。</p>')
    }

    //查看页面 1
    if (isCheck == 1) {
        $('.btn_box').addClass('hide');

        //控制查看1审核3 底部显示内容
        $('.audit_status').addClass('show');
    }

    //查看1 审核3
    if (isCheck == 1 || isCheck == 3) {
        $('.pc_info p').each(function (i, v) {
            if ($(v).hasClass('input_p')) {
                $(v).removeClass('input_p').addClass('dan_p');
            } else if (!$(v).hasClass('er_p')) {
                $(v).addClass('dan_p');
            }
        })

        //移除空页面提示
        if ($('.re_page').size()>0){
            $('.re_page').removeClass('show');
        }


        //5_1移除表头的复选框
        if ($('.main') && $('.main').attr('data-nowPage') == 'form5_1') {
            $('.tab3').addClass('hide');
            $('.tpl_5_1_3').find('.chose_more').addClass('hide');
        }

        //添加卡片按钮移除
        $('.add_box').each(function (i, v) {
            $(v).remove();
        })
        //删除卡片按钮移除
        $('.kp_del').each(function (i, v) {
            $(v).remove();
        })
        //添加表格按钮移除
        $('.add_table').each(function (i, v) {
            $(v).remove();
        })

        //右侧内容做渲染
        $('.pc_box').each(function (i, v) {

            //单选
            if ($(v).find('.chose_one').size()) {
                $(v).find('.pc_content').html('<p class="grey_p">' + $(v).find('.active').find('span').text() + '</p>');
                //完善法人信息头部切换样式调整
                if ($('.perfect_info1').size()) {
                    $('.tab3').find('.grey_p').css({ 'margin-top': '11px' })
                }
            }

            //多选
            if ($(v).find('.chose_more').size()) {
                var str = '';
                $(v).find('.active').each(function (a, b) {
                    str = str + $(b).find('span').text() + ' ';
                })
                $(v).find('.pc_content').html('<p class="grey_p">' + str + '</p>');

            }

            //input
            if ($(v).find('.pc_content').children('input').size()) {
                //单独的input
                if ($(v).find('input').size() == 1) {
                    $(v).find('.pc_content').html('<p class="grey_p">' + $(v).find('input').val() + '</p>');
                }
                if ($(v).find('input').size() == 2) {
                    var str = [];
                    $(v).find('input').each(function (a, b) {
                        str.push($(b).val())
                    })
                    str = str.join('-');
                    $(v).find('.pc_content').html('<p class="grey_p">' + str + '</p>');
                }
            }

            //文本域
            if ($(v).find('textarea').size()) {
                $(v).find('.pc_content').html('<p class="grey_p">' + $(v).find('textarea').val() + '</p>');
            }

            //下拉列表
            if ($(v).find('.dropdown').size()) {
                var str = '';
                str = $(v).find('.dropdown span').text() == '请选择' ? '' : $(v).find('.dropdown span').text()
                $(v).find('.pc_content').html('<p class="grey_p">' + str + '</p>');
            }

            //文件上传
            if ($(v).find('form').size()) {
                var str = '';
                if ($(v).find('.form_input a').attr('href') == 'javascript:;') {
                    //为空
                    str = '';
                } else {
                    str = '<a href="' + $(v).find('.form_input a').attr('href') + '" target="_blank">' + $(v).find('.form_input a').text() + '</a>'
                }
                $(v).find('.pc_content').html('<p class="grey_p">' + str + '</p>');
            }

            //表格
            if ($(v).find('table').size()) {

                //表单中表格input只读
                $(v).find('table input').each(function (a, b) {
                    $(b).attr('readonly', true);
                });

                //表单中表格添加按钮置灰
                $(v).find('.remove_table').each(function (i, v) {
                    $(v).removeClass('remove_table');
                })
                $(v).find('.empty_table').each(function (i, v) {
                    $(v).removeClass('empty_table');
                })
            }

        })
    }
    $ct.on('click', '.pc_check', function () {
        $(this).toggleClass('active');

    })

    //获取审核标记的字段数据
    function checkField() {
        var arr = [];
        $('.pub_box').each(function (i, v) {
            var data = {};
            var isType;
            if ($(v).attr('data-id')) {
                data.id = $(v).attr('data-id');
            }
            if ($(v).attr('data-field')) {
                data.type = $(v).attr('data-field');
            }
            if ($(v).attr('data-type')) {
                data.type = $(v).attr('data-type');
            }
            //5.1 5.2 11
            var page = $('.main').attr('data-nowPage');

            if (page == 'form5_1' || page == 'form5_2' || page == 'form11') {
                var len = $(v).attr('class');
                //审核页面添加类名判断
                var lenArr = len.split(' ');
                len = lenArr[1];
                data.type = len.substr(len.length - 1, 1) - 0 + 1;
            }

            var data_field = [];//用来存放标记字段

            $(v).find('.pc_box').each(function (a, b) {
                if ($(b).find('.pc_check').hasClass('active')) {
                    //正常标记
                    if ($(b).find('.pc_info').size()) {

                        data_field.push($(b).attr('data-field'));
                    }
                    //表格标记
                    if ($(b).find('table').size()) {
                        var table_id = '';
                        if ($(b).parents('.pub_box').hasClass('tpl_8_3_1') || $(b).parents('.pub_box').hasClass('tpl_8_3_2')) {
                            //表单所有标记（xxx:2）
                            table_id = $(b).parent().attr('data-field');

                            $(b).find('input').each(function (c, d) {
                                console.log(1);
                                if ($(d).siblings('.pc_check').hasClass('active')) {
                                    data_field.push(table_id + ':' + c);
                                }

                            })
                        } else {

                            //行列表单标记（xxx:2:3）
                            table_id = $(b).attr('data-field');
                            $(b).find('i.active').each(function (c, d) {

                                var row = $(d).parent().index();
                                var col = $(d).parents('tr').index() - 1;
                                data_field.push(table_id + ':' + col + ':' + row);
                            })
                        }

                    }

                }
                data.data_field = data_field;
            })

            arr.push(data);
        })
        return arr;
    }
    // console.log(checkField());
    // $ct.on('change','input',function(){
    //     alert('input值改变了');
    // })
    // $ct.on('change', 'textarea', function () {
    //     alert('textarea值改变了');
    // })

    // 获取表单项值
    function getFormItemValue($el) {
        var $pc_content = $el;
        // 找出上传的文件值
        if ($pc_content.find(".form_input a").size()) {
            var val = $pc_content.find(".form_input a").attr("href");
            if (/^javascript/.test(val)) {
                val = ""
            }
            return val;
        }
        // 下拉选项
        if ($pc_content.find(".dropdown").size()) {
            return $pc_content.find(".dropdown").attr("data-id");
        }
        // 联动
        if ($pc_content.find(".dropdown_area").size()) {
            return $pc_content.find(".dropdown_area").attr("data-id");
        }
        // 单选
        if ($pc_content.find(".chose_one").size()) {
            var _chsoeone = $pc_content.find(".chose_one").attr("data-id");
            if (_chsoeone) {
                return _chsoeone;
            } else {
                return '';
            }

        }

        // 多选
        if ($pc_content.find(".chose_more").size()) {
            var _chosemore = $pc_content.find('.chose_more').attr('data-id');
            if (_chosemore) {
                if (_chosemore.indexOf(',') != -1) {
                    return _chosemore.split(",");
                } else {
                    return _chosemore;
                }

            } else {
                return '';
            }

        }

        // 表格
        if ($pc_content.find("table").size()) {
            var tableArr = [];
            var parentNode = $pc_content.parent(); //找到表格的父节点，根据类名来判断数据格式
            if (parentNode.hasClass('tpl_8_3_1') || parentNode.hasClass('tpl_8_3_2')) {
                //表格数据整体提交
                $pc_content.find('input').each(function (i, v) {
                    tableArr.push($.trim($(v).val()));
                })
            } else {
                //表格数据一行提交
                $pc_content.find('tr').each(function (i, v) {
                    if ($(v).find('input').size()) {
                        var arr2 = [];
                        for (var j = 0; j < $(v).find('input').length; j++) {
                            arr2.push($(v).find('input').eq(j).val());
                        }
                        tableArr.push(arr2);
                    }

                })
            }

            return tableArr;
        }
        //如果是两个ipnput（时间选择）
        if ($pc_content.find('input').length == 2) {
            return $pc_content.find('.js_time_input1').val() + '-' + $pc_content.find('.js_time_input2').val();
        }
        // 查找input, textarea
        return $pc_content.find("input, textarea").val();
    }

    // 遍历所有表单项
    function getFormItem(selector) {
        var data = {};
        $(selector).find("[data-field]").each(function (i, item) {
            var $item = $(item),
                name = $item.attr("data-field"),
                val = getFormItemValue($item);

            if (typeof val != "undefined") {
                data[name] = val;
            }
        })

        var isType;
        if ($(selector).attr('data-id')) {
            data.id = $(selector).attr('data-id');
        }
        if ($(selector).attr('data-field')) {
            data.type = $(selector).attr('data-field');
        }
        if ($(selector).attr('data-type')) {
            data.type = $(selector).attr('data-type');
        }
        // if ($(selector).find('.dropdown_area').length > 0) {
        //     data.address = $(selector).find('.dropdown_area').siblings('.addr_input').val();
        // }
        //删除按钮添加的del-id  传给后台判断更新或者插入
        if ($(selector).find('.kp_del')) {
            if ($(selector).find('.kp_del').attr('del-id')) {
                data.del_id = $(selector).find('.kp_del').attr('del-id');
            } else {
                data.del_id = '';
            }

        } else {

        }

        //5.1
        var page = $('.main').attr('data-nowPage');
        if (page == 'form5_1' || page == 'form5_2' || page == 'form11') {
            var len = $(selector).attr('class');
            data.type = len.substr(len.length - 1, 1) - 0 + 1;
        }

        return data;
    };


	$('.up_btn').on('click',function(){
	    var upUrl = $('#url_upstep').val();
		var param = {
		   'data' : '',
		}
		requestData(upUrl, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    window.location.reload();
                } else {
                    errMsg(data.msg);
                };
            };

	})


	$('.up_btn_change').on('click',function(){
	    var upUrl = $('#url_upstep').val();
		var param = {
		   'type' : $('.main').attr('data-change'),
		}
		requestData(upUrl, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    window.location.href = data.msg;
                } else {
                    errMsg(data.msg);
                };
            };

	})


     //错误信息标红
	if(window.changeErrorData && window.errorShow){
		var pageID = $('#pageId').val();
		if(pageID == '8-3'){
			$('.pub_form_box').each(function (a, b) {
				$(b).find('th').each(function (c, d){
					var cls = $(b).attr('data-field')+':'+c;
					var flag = false;
					for(var k in window.changeErrorData[a]){
						if(k == 'data_field'){
							flag = true;
						}
					}
					if(flag && $.inArray(cls, changeErrorData[a].data_field) != -1){
						
						$(d).find('p').addClass('err_border');
					};
				});
			});	
		}

        $('.pub_form_box').each(function (a, b) {
			$(b).children('.pc_box').each(function (c, d){
				var cls = $(d).attr('data-field');
				var flag = false;
				for(var k in window.changeErrorData[a]){
					if(k == 'data_field'){
						flag = true;
					}
				}
				if(flag && $.inArray(cls, changeErrorData[a].data_field) != -1){
					console.log(1);
					$(d).find('.pc_info p').addClass('err_border');
				}
				
				
			});
		});
		
	 }


	 $('.js_storage_ba').on('click',function(){

			var param = {
                "data": findParam()
            };
			var changeUrl = $('#url_pre').val();
            //保存
            requestData(changeUrl, "post", call, param);
            function call(data) {

                if (data.status == 1) {
                    errMsg(data.msg);
                } else {
                    errMsg(data.msg);
                };
            };
			return;
	 });





    //保存
    $('.js_storage').on('click', function () {
        var change = $('.main').attr('data-change');
		if(change && isCheck != 3){
				//表单正常保存
            var param = {
                "data": findParam()
            };
			var changeUrl = $('#url_change').val();
            //保存
            requestData(changeUrl, "post", call, param);
            function call(data) {

                if (data.status == 1) {
                    location.href = data.msg;
                } else {
                    errMsg(data.msg);
                };
            };
			return;

		}

		if(change && isCheck == 3){

			  var param = {
                'data': checkField(),
                'type': $('#pageId').val(),
                'err_msg': $('.cause_text').val(),
				'id': $('.else_box').attr('data-id'),	
            }
            //判断页面是否审核通过
            var _status = 1; // 1通过（一个都没选） 2不通过
            $('.pc_check').each(function (i, v) {
                if ($(v).hasClass('active')) {
                    _status = 2;
                }
            })

            param.status = _status;
           
			var changeauditUrl = $('#url_changeaudit').val();
            //保存
            requestData(changeauditUrl, "post", call, param);
            function call(data) {

                if (data.status == 1) {
                    location.href = data.msg;
                } else {
                    errMsg(data.msg);
                };
            };
			return;	



		}

        //审核的提交
        if (isCheck == 3) {


            var param = {
                'data': checkField(),
                'type': $('#pageId').val(),
                'err_msg': $('.cause_text').val(),
				'id': $('#pageId').attr('data-id'),	
            }
            //判断页面是否审核通过
            var _status = 1; // 1通过（一个都没选） 2不通过
            $('.pc_check').each(function (i, v) {
                if ($(v).hasClass('active')) {
                    _status = 2;
                }
            })

            param.status = _status;
            console.log(param);

            requestData(auditUrl, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    window.location.reload();
                } else if(data.status == 100){
                     window.location.href = data.msg;
                } else {
                    errMsg(data.msg);
                };
            };
        } else {
            //表单正常保存
            var param = {
                "data": findParam()
            };

            console.log(param);
            //保存
            requestData(saveUrl, "post", call, param);

            function call(data) {

                console.log(data);
                console.log(data.msg);
                if (data.status == 1) {

                    //完善信息页面提示信息后台传入
                    if (data.msg) {
                        layer.msg(data.msg);
						setTimeout(function () {
                            location.reload();
                        }, 2000)
                    } else {
                        layer.msg('保存成功');
                        //window.location = data.msg;
                        setTimeout(function () {
                            location.reload();
                        }, 2000)
                    }


                } else {
                    errMsg(data.msg);
                };
            };
        }
    })
    //提交
    $('.js_submit').on('click', function () {

        var param = {
            "data": getFormItem('.tpl_8_3_4')
        };
        console.log(param);
        //保存
        requestData(submitUrl, "post", call, param);

        function call(data) {
            if (data.status == 1) {
                window.location = data.msg;
            } else {
                errMsg(data.msg);
            };
        };
    })


    //获取数据函数
    function findParam() {
        var arr = [];
        //5.1
        if ($('.tab3').size()) {
            var dangArr = {};
            dangArr.type_all = $('.tab3').find('.chose_more').attr('data-id');
            arr.push(dangArr);
        }

        //8.3循环拆分
        if ($('.main8').size() && $('.main8').attr('data-nowPage') == 'form8_3' && !isChange) {

            var pubLen = $('.pub_box').length;
            $('.pub_box').each(function (i, v) {
                if (i < 3) {
                    arr.push(getFormItem(v));
                }
            })

        } else {
            $('.pub_box').each(function (i, v) {
                if ($(v).hasClass('tpl_5_1_3')) {
                    //5.1.3
                    var list = {};
                    list.type = 4;
                    $(v).find('.pub_form_box').children('div').each(function (a, b) {

                        var cls = $(b).attr('class');
                        var len = cls.substr(cls.length - 1, 1);
                        list[len] = getFormItem($(b));
                        //list[len].type = 4;
                    })
                    arr.push(list);
                } else {
                    arr.push(getFormItem(v));
                }

            })
        }

        return arr;
    }



    //DOM
    //单选题
    $ct.on('click', '.chose_one dd', function () {
        $(this).addClass('active').siblings().removeClass('active');

        $(this).parent().attr('data-id', $(this).attr('data-id'));
        //完善法人信息表单方法
        if ($(this).parents('.perfect_info1').length > 0) {

            var infoTpl = $(this).attr('data-info');
            if ($(this).hasClass('active')) {
                $('.info').html($('#' + infoTpl).html());
            }
            //动态样式事件未创建
            _ci.init();
        }
    })

    //多选题
    $ct.on('click', '.chose_more dd', function () {

        $(this).toggleClass('active');
        var chose = [];
        $(this).parent().find('.active').each(function (i, v) {
            chose.push($(v).attr('data-id'));
        })
        $(this).parent().attr('data-id', chose.join(','));
        //5.1复选框
        if ($(this).parents('.tab3').length > 0) {
            var tplArr1 = ['ct5_1_1', 'ct5_1_2', 'ct5_1_3'];
            choseTab($(this), tplArr1, $('.ct5'));

        } else if ($(this).parents('.ct5_1_3').length > 0) {
            var tplArr2 = [
                'tpl_5_1_3_1',
                'tpl_5_1_3_2',
                'tpl_5_1_3_3',
                'tpl_5_1_3_4',
                'tpl_5_1_3_5',
                'tpl_5_1_3_6',
                'tpl_5_1_3_7',
            ];
            choseTab($(this), tplArr2, $('.ct5_1_3'));

        }
    })

    //多选切换显示隐藏表单函数
    function choseTab(oThis, tplArr, parentNode) {
        var tplArr = tplArr;
        var _thisIdx = oThis.index();
        if (oThis.hasClass('active')) {
            if (parentNode.parent('.ct').length > 0) {
                parentNode.append($('#' + tplArr[_thisIdx]).html());

            } else {
                parentNode.find('.pub_form_box').append($('#' + tplArr[_thisIdx]).html());
            }

        } else {
            parentNode.find($('.' + tplArr[_thisIdx])).remove();
        }
    }

    //下拉列表（一级）
    $ct.on('click', '.dropdown', function (e) {
        scroll();
        e.stopPropagation();

        _ci.dropOne($(this));

    })
    
    $ct.on('click', '.drop_list li', function (e) {
        e.stopPropagation();
        var _showBox = $(this).parent();
        _showBox.siblings('p').find('span').text($(this).text());
        _showBox.slideUp('fast');
        _showBox.siblings('p').find('i').removeClass('up');
        $(this).parent().siblings('.dropdown').attr('data-id', $(this).data('id'));

    })
    $(document).on('click', function () {
        $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
    });

    //表格增加
    $ct.on('click', '.add_table', function () {
        _ci.addTable($(this));
    });

    //表格删除
    $ct.on('click', '.remove_table', function () {
        _ci.removeTable($(this));
    });

    //表格清空
    $ct.on('click', '.empty_table', function () {
        _ci.emptyTable($(this));
    })

    //添加表单
    $ct.on('click', '.add', function () {
        _ci.addForm($(this));
        //动态样式事件未创建
        _ci.init();

    })
    //删除表单
    $ct.on('click', '.kp_del', function () {
        _ci.delForm($(this));
    })

    //输入框focus样式
    $ct.on('focus', 'input,textarea', function () {
        _ci.focus($(this));
    })
    $ct.on('blur', 'input,textarea', function () {
        $(this).removeClass('focus_border');
    })
    //滚动条样式修改
    function scroll() {
        $('.scroll').niceScroll({
            cursorcolor: "#ccc",//#CC0071 光标颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: "5px", //像素光标的宽度
            cursorborder: "0", // 游标边框css定义
            cursorborderradius: "5px",//以像素为光标边界半径
            autohidemode: false //是否隐藏滚动条
        });
    }


    function datePick(startTime, type) {

        //选择具体时间
        var date = 1;//时间初始化
        startTime.jeDate({
            format: type,
            zIndex: 3000,
            isClear: false,
            onClose: false,
            okfun: function (val) {
                if (startTime.siblings('.js_time_input2').length > 0) {
                    if (startTime.siblings(".js_time_input2").val() != '') {
                        startTime.siblings(".js_time_input2").val('');
                    }

                    date = startTime.val().replace(/\//g, ':');
                    if (date !== 1) {
                        startTime.siblings(".js_time_input2").jeDate({
                            format: type,
                            zIndex: 3000,
                            isClear: false,
                            onClose: false,
                            okfun: function (val2) {
                                if (startTime.siblings(".js_time_input2").val().replace(/-/g, '') < startTime.val().replace(/:/g, '')) {
                                    errMsg('结束时间必须大于开始时间！');
                                    date = 1;
                                    startTime.val('');
                                    startTime.siblings(".js_time_input2").val('');
                                }
                            }
                        });
                    }
                }

            }
        });
    }


    //文件上传
    $ct.on('change', '.js_upload', function () {
		
        fileChange(this);
    })

    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;

    function fileChange(target, id) {
		
        var bool = true;
        var fileSize = 0;
        var filetypes = [".zip", ".rar", ".doc", ".docx", ".xls", ".xlsx", ".pdf", ".jpg", ".png", ".bmp"];
        // var filetypes = [".txt", ".doc", ".ppt", ".pdf", ".docx", ".jpg"];
        var filepath = target.value;
        var extStart = filepath.lastIndexOf(".");
        var fileNameStart = filepath.lastIndexOf("\\");
        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
        var fileName = filepath.substring(fileNameStart + 1, filepath.length);
        var filemaxsize = 20 * 1024 * 1024; //20m 
        if (filepath) {
            //获取文件大小
            if (isIE && !target.files) {
                var filePath = target.value;
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                if (!fileSystem.FileExists(filePath)) {
                    // $(target).parent().siblings(".err_span").addClass('show').text("附件不存在，请重新选择！");
                    errMsg('附件不存在，请重新选择！')
                    return false;
                }

                var file = fileSystem.GetFile(filePath);
                fileSize = file.Size;
            } else {
                fileSize = target.files[0].size;
            };
            var size = fileSize;
            //判断文件类型和大小 
            if (ext != ".ZIP" && ext != ".RAR" && ext != ".DOC" && ext != ".DOCX" && ext != ".XLS" && ext != ".XLSX" && ext != ".PDF" && ext != ".JPG" && ext != ".PNG" && ext != ".BMP") {
                console.log(1);
                // $(target).parent().siblings(".err_span").addClass('show').text("请上传正确格式的文件！");
                errMsg('请上传正确格式的文件！');
                target.value = "";
                bool = false;
            } else if (size > filemaxsize) {
                // $(target).parent().siblings(".err_span").addClass('show').text("附件大小不能大于20M！");
                errMsg('附件大小不能大于20M！');
                target.value = "";
                bool = false;
            } else if (size <= 0) {
                // $(target).parent().siblings(".err_span").addClass('show').text("附件大小不能为0！");
                errMsg('附件大小不能为0！');
                target.value = "";
                bool = false;
            } else {
                var previewBox = $(target).parents('form').siblings('.preview_box');
                // $(target).parent().siblings(".err_span").addClass('show').text("");
                // $(".file_box").hide();
                previewBox.find("span").text("上传中……");
                previewBox.find("a").removeClass('show');

                $(target).parents('form').ajaxSubmit({
                    dataType: 'json',
                    success: function (data) {
                        var msg;
                        if (data.msg) {
                            msg = data.msg;
                        };
                        if (data.message) {
                            msg = data.message;
                        };
                        if (data.status == "error_no_1") {
                            location.reload();
                            return false;
                        }
                        if (data.status == "error_no_2") {
                            location.href = data.data.url;
                            return false;
                        }
                        if (data.status == 0) {
                            previewBox.find('span').addClass('hide');
                            previewBox.find('a').addClass('show').text(fileName);
                            previewBox.find('a').attr("href", data.data.fileUrl);
                        } else {
                            previewBox.find('span').removeClass('hide').text(msg);
                        }
                    },
                    error: function (xhr) {
                        previewBox.find('span').removeClass('hide').text("网络可能有点问题，请重新上传试试！");
                    }
                });
            };

        } else {
            bool = false;
        };

    };
    //提交
    // requestData(API.PREPARE.SUBMIT, "post", call, param);

    // function call(data) {
    //     if (data.status == 1) {
    //         window.location = data.message;
    //     } else {
    //         var msg;
    //         if (data.msg) {
    //             msg = data.msg;
    //         };
    //         if (data.message) {
    //             msg = data.message;
    //         };
    //         errMsg(msg);
    //     };
    // };
    
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