/*
 * @Author: fuhao 
 * @Date: 2018-05-01 19:15:30 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-30 20:49:46
 */
var $ = require("jquery");
var API = require("@components/api");

$(function () {

    function Ci() {


        //卡片类型
        this.tpl = '';

        //职级num
        this.tplNum = $('.pub_box').length;

        //渲染汉字
        this.num = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

        //事件委托者
        this.parentNode = $('body');

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

        //新建登记表单
        this.addDjForm = function (oThis) {
            var newForm = oThis.siblings('input').val();
            var listBox = oThis.parent().siblings('.form_list_box').find('ul');
			if($('.hidden_input').val() == ''){
				errMsg('请先保存登记信息');
				return false;
			}
            if ($.trim(newForm) == '') {
                errMsg('请输入新建的表单名称');
                return false;
            }
            //添加
            var param = {
                'task_id': $('.hidden_input').val(),
                'name': newForm
            }
            console.log(param);
            requestData(API.REGISTER.ADD, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    var str = '<li data-id="' + data.data.id + '">'
                        + '<p>' + newForm + '</p>'
                        + '<a href="javascript:;" class="edit_dj_form">编辑</a>'
                        + '<a href="javascript:;" class="del_dj_form">删除</a>'
                        + '<a href="javascript:;" class="power_dj_form">分配权限</a>'
                        + '</li>';

                    listBox.prepend(str);

                    oThis.siblings('input').val('');
                } else {
                    errMsg(data.message);
                };
            };




        }

        //删除登记表单
        this.removeDjForm = function (oThis) {

            //删除
            var param = {
                // 'id': $('.hidden_input').val(),
                'form_id': oThis.parent().attr('data-id')
            }
            console.log(param);
            requestData(API.REGISTER.DEL, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    oThis.parent().remove();
                } else {
                    errMsg(data.message);
                };
            };

        }
        //编辑登记表单
        this.editDjForm = function (oThis) {
            //编辑
            var task_id = $('.hidden_input').val();
            location.href = '/register/TaskForm/formUpdate/'+task_id+'/' + oThis.parent().attr('data-id');

        }

        //分配权限登记表单
        this.powerDjForm = function (oThis) {
            //分配权限
            var task_id = $('.hidden_input').val();
            location.href = '/register/TaskFormFlow/formPower/'+ task_id + '/' + oThis.parent().attr('data-id');

        }

        //卡片只剩一个的时候不能删除
        this.removeDel = function (a) {
            //当前需要删除的卡片类型是单卡片类型
            if (a.find('.pub_box').length < 2) {
                a.find('.kp_del').addClass('hide');
            } else {
                a.find('.kp_del').removeClass('hide');
            }

        }

        //获取卡片名字并排序
        this.findFormTitle = function (o) {
            //当前表单排序
            $('.add').find('span').text(this.num[o]);
            this.removeDel($('.ct'));
        }

        //添加表单
        this.addForm = function (oThis) {
            this.tpl = oThis.attr('data-add');//获取模板id
            var _btnBox = oThis.parent();//按钮盒子

            // console.log(this.tpl);
            _btnBox.before($('#' + this.tpl).html());
            this.tplNum++;
            this.findFormTitle(this.tplNum);
        }

        //删除表单
        this.delForm = function (oThis) {
            var _o = oThis.parents('.pub_box').siblings('.add_box').find('.add');

            this.tpl = _o.attr('data-add');//获取模板id
            oThis.parents('.pub_box').remove();

            this.tplNum--;
            this.findFormTitle(this.tplNum);
        }

        //删除表单
        this.delTask = function (oThis) {
            var _id = oThis.attr('data-id');
            if(_id == '' || _id == '0'){
                errMsg('请刷新重试');
            }
            var param = {
                'task_id': oThis.attr('data-id')
            }
            console.log(param);

            requestData(API.REGISTER.TASKDEL, "post", call, param);

            function call(data) {
                console.log(data);
                if (data.status == 1) {
                    oThis.parent('').parent().remove();
                } else {
                    errMsg(data.message);
                };
            };


        }

        //新建审核权限
        this.addFlowForm = function (oThis) {

            var _thisBox = oThis.parent().parent();
            var dep = $.trim(_thisBox.find('.dropdown:last').attr('data-id')),
                job = $.trim(_thisBox.find('.chose_one:last').attr('data-id')),
                del = $.trim(_thisBox.find('.kp_del:last').attr('data-id')); //如果是已有记录添加时

            if ((dep == 'undefined' || dep == '') || (job == 'undefined' || job == '') ) {
                errMsg('请选择审查部门和职级');
                return false;
            }

            //如果上一条已有删除，说明已经入库了，所以不再发送请求
            if ( del == 'undefined' || del == '' ) {
                //添加
                var param = {
                    'task_id':$('.task_id').val(),
                    'task_custom_form_id': $('.form_id').val(),
                    'task_check_department_id': dep,
                    'task_check_duty_id': job,
                    'task_check_step': 0,
                }
                console.log(param);
              


				var tips = $('.ct').attr('data-tips');
			
				if(tips){
					var tparam = {
						'm_id': $('.hidden_input').val(),
						'check_department_id': dep,
						'check_duty_id': job,
						'check_step': 0,
					}

					requestData('/Manageflow/flowCreat', "post", call, tparam);
				}else{
					requestData(API.REGISTER.ADDFLOW, "post", call, param);
				}


                function call(data) {
                    console.log(data);
                    if (data.status == 1) {
                        _thisBox.find('.kp_del:last').attr('data-id', data.data.id);

                        _ci.addForm(oThis);

                        //动态样式事件未创建
                        _ci.init();
                    } else {
                        errMsg(data.message);
                    };
                };
            } else {
                _ci.addForm(oThis);
                //动态样式事件未创建
                _ci.init();
            }


        }

        //删除审核权限
        this.delFlowForm = function (oThis) {
            var _thisBox = oThis.parent().parent();
            var del = $.trim(_thisBox.find('.kp_del').attr('data-id'));


            //添加
            var param = {
                'flow_id': del,
            }
            console.log(param);
            

			var tips = $('.ct').attr('data-tips');
			if(tips){
				requestData('/Manageflow/flowDel', "post", call, param);
			}else{
				requestData(API.REGISTER.DELFLOW, "post", call, param);
			}


            function call(data) {
                console.log(data);
                if (data.status == 1) {
                    _ci.delForm(oThis);
                    //动态样式事件未创建
                    _ci.init();
                } else {
                    errMsg(data.message);
                };
            };
        }

        //发布登记
        this.publishDjForm = function (oThis) {

            var task    = $.trim($('.hidden_input').val()),
                form    = '';

            $('.form_list_box li').each(function (i, v) {
                form += $.trim($(this).attr('data-id')) + ',';
            });

            if ( task == '' || task == 'undefined' ) {
                errMsg('请先保存登记信息');
                return false;
            }

            if ( form.length < 2 ){
                errMsg('请先新建表单并分配权限');
                return false;
            }
            //添加
            var param = {
                'task_id': task,
                'form_id': form,
            }
            console.log(param);
            requestData(API.REGISTER.PUBLISH, "post", call, param);

            function call(data) {
                console.log(data);
                if (data.status == 1) {
                    location.href = '/register/TaskReg/index';
                } else {
                    errMsg(data.msg);
                };
            };
        }

        //初始化
        this.init = function () {

            //初始化表单第一张卡片是否可以删除
            // this.removeDel(this.kp_num);

            //动态创建元素 dom丢失


            if ($('.js_time_input1').length > 0) {

                $('.js_time_input1').each(function (i, v) {

                    $(v).attr('id', 'js_time_input' + i);
                    datePick($('#js_time_input' + i));
                })

            };
            //滚动条
            scroll();

            getErJson($('.bumen'));

        }
    }
    var _ci = new Ci();
    _ci.init();

    //获取部门职级数据

    var erJson;

    if (window.sectionJson) {
        erJson = sectionJson;
        getErJson($('.bumen'));
    }

    //渲染部门
    function getErJson(node) {
        var str = '';
        $.each(erJson, function (i, v) {
            str += '<li data-id="' + v.id + '">' + v.val + '</li>';
        })
        node.find('.drop_list').html(str);
    }
    //事件委托者
    var $ct = _ci.parentNode;

    //添加表单
    $ct.on('click', '.add', function () {
        _ci.addFlowForm($(this));

        //动态样式事件未创建
        _ci.init();

    })

    //删除表单
    $ct.on('click', '.kp_del', function () {
        _ci.delFlowForm($(this));
    })


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

        //部门职级联动
        if ($(this).parents('.pc_box').hasClass('bumen')) {
            var idx = $(this).index();
            var str = '';
            $.each(erJson[idx].child, function (i, v) {
                str += '<dd data-id="' + v._id + '"><i></i><span>' + v._val + '</span></dd>'
            })
            $(this).parents('.pc_box').next().find('.chose_one').html(str);
        }

    })
    $(document).on('click', function () {
        $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
    });

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

    //输入框focus样式
    $ct.on('focus', 'input,textarea', function () {
        _ci.focus($(this));
        $(this).siblings('i').addClass('active');
    })
    $ct.on('blur', 'input,textarea', function () {
        $(this).removeClass('focus_border');
        $(this).siblings('i').removeClass('active');
    })
    //删除登记表单
    $ct.on('click', '.task_del', function () {
        _ci.delTask($(this));
    })

    //新建登记表单
    $('.js_add_dj').on('click', function () {
        _ci.addDjForm($(this));
    })

    //删除登记表单
    $ct.on('click', '.del_dj_form', function () {
        _ci.removeDjForm($(this));
    })

    //编辑登记表单
    $ct.on('click', '.edit_dj_form', function () {
        _ci.editDjForm($(this));
    })

    //分配权限登记表单
    $ct.on('click', '.power_dj_form', function () {
        _ci.powerDjForm($(this));
    })

    //保存登记表单
    $ct.on('click', '.js_publish', function () {
        _ci.publishDjForm($(this));
    })

    //单选题
    $ct.on('click', '.chose_one dd', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().attr('data-id', $(this).attr('data-id'));
    })

    //多选题
    $ct.on('click', '.chose_more dd', function () {
        $(this).toggleClass('active');
    })
    function datePick(startTime) {
        //选择具体时间
        var date = 1;//时间初始化
        startTime.jeDate({
            format: "YYYY/MM/DD",
            zIndex: 3000,
            isClear: false,
            onClose: false,
            okfun: function (val) {
                if (startTime.siblings('.js_time_input2').length > 0) {
                    if (startTime.siblings(".js_time_input2").val() != '') {
                        startTime.siblings(".js_time_input2").val('');
                    }

                    date = startTime.val().replace(/\//g, '-');
                    if (date !== 1) {
                        startTime.siblings(".js_time_input2").jeDate({
                            format: "YYYY/MM/DD",
                            zIndex: 3000,
                            isClear: false,
                            onClose: false,
                            okfun: function (val2) {
                                if (startTime.siblings(".js_time_input2").val().replace(/-/g, '') < startTime.val().replace(/-/g, '')) {
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





    //新建登记保存
    $('.js_storage').on('click', function () {
		
        var startTIme; //日期
        var endTIme; //日期
        var area = []; //多选数组

        $('#date').find('input').each(function (i, v) {

            if (i == 0) {
                startTIme = $(v).val();
            }
            if (i == 1) {
                endTIme = $(v).val();
            }
        });

        $('#area').find('.active').each(function (i, v) {
            area.push($(v).attr('data-id'));
        });
        if ($('#area').size() > 0 && area.length == 0){
            errMsg('表单信息不完整！');
            return false;
        }
		if(startTIme == '' || endTIme == '' || $('#name').find('input').val() == ''){
			errMsg('表单信息不完整！');
			return false;
		}
        var param = {
            'task_name': $('#name').find('input').val(),
            'start_time': startTIme,
            'end_time': endTIme,
            'allocation_area_ids': area,
            'id': $('.hidden_input').val()
        };
        console.log(param);
        //保存
        requestData(API.REGISTER.SAVE, "post", call, param);

        function call(data) {
            if (data.status == 1) {
                $('.hidden_input').val(data.msg);
                location.href = '/register/TaskReg/showUpdate/' + data.msg;
            } else {
                alert(data.msg);
            };
        };

    })

    //添加职级保存
    $('.js_storage_level').on('click', function () {
        var arr = [];
        

        $('.pub_box').each(function (i, v) {
            var arrJson = {};
            $(v).find('.pc_box').each(function (a, b) {
                var key = $(b).attr('data-field');
                var val = '';
                if (key == 'section') {
                    val = $(b).find('.dropdown').attr('data-id')
                }
                if (key == 'level') {
                    val = $(b).find('.chose_one').attr('data-id')
                }
                arrJson[key] = val;
            })

            arr.push(arrJson);
        })
        var param = {
            'data': arr
        }
        console.log(param);
        requestData(API.REGISTER.SAVE, "post", call, param);

        function call(data) {
            if (data.status == 1) {
                window.location = data.msg;
            } else {
                alert(data.message);
            };
        };
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