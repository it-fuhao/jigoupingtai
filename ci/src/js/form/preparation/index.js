
var $ = require("jquery");
var API = require("@components/api");

// var areaData = require('@components/data');
// var area = require('@components/area');


$(function () {

    // area('.dropdown_area', areaData);


    //数据渲染
    //单选
    $('.chose_one').each(function (i, v) {
        if ($(v).attr('data-id')) {
            var idx = $(v).attr('data-id');
            $(v).find('dd[data-id="' + idx + '"]').addClass('active');
        }
    })
    var idxx = $('.legal_person').attr('data-id');
    $('.legal_person').find('li[data-id="' + idxx + '"]').addClass('active');
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
            if(!idx || idx == 0){
                $(v).find('span').text('请选择');
            }else{
                var wz = $(v).siblings('ul').find('li[data-id="' + idx + '"]').text();
                $(v).find('span').text(wz);
            }
            
        }

    })
    $('input').focus(function () {
        var chose_title = $(this).parents('.pc_box').prev().find('.chose_host_man');
        if (chose_title.length > 0 && !chose_title.hasClass('active')) {

        } else {
            border($(this));
        }


    })
    $('input').blur(function () {
        $(this).removeClass('focus_border');
    })
    $('textarea').focus(function () {
        var chose_title = $(this).parent().siblings('.pc_info').find('.chose_host_man');
        if (chose_title.length > 0 && !chose_title.hasClass('active')) {
            console.log(1);
        } else {
            border($(this));
        }

    })
    $('textarea').blur(function () {
        $(this).removeClass('focus_border');
    })
    //选择法人属性
    var nowText = $('#name').find('textarea').val();
    var _nowIdx = $('.legal_person').attr('data-id');
    $('.legal_person li').on('click', function () {
        var nowIdx = $(this).parent().find('.active').attr('data-id');
        // errMsg('111');
        var yl = '请填写';
        var fyl = '非营利性民办培训机构的名称，依次由行政区划名称、字号（两个以上汉字组成）、业务领域、组织形式四部分组成。';
        var nameEle = $('#name').find('textarea');

        $(this).addClass('active').siblings().removeClass('active');
        $('#legal').attr('data-id',$(this).attr('data-id'));
        // nameEle.val('');

        if ($(this).attr('data-id') == 1) {
            if (_nowIdx == 2) {
                nameEle.val('');
            } else {
                if ($(this).attr('data-id') != nowIdx) {
                    nameEle.val(nowText);
                }
            }
            nameEle.attr('placeholder', yl);
            
        }
        if ($(this).attr('data-id') == 2) {
            if (_nowIdx == 1){
                nameEle.val('');
            }else{
                if ($(this).attr('data-id') != nowIdx) {
                    nameEle.val(nowText);
                }
            }
            nameEle.attr('placeholder', fyl);
            
        }
        

        
    })

    //选择具体时间
    var date = 1;//时间初始化
    $(".js_time_input1").jeDate({
        format: "YYYY/MM/DD",
        zIndex: 3000,
        isClear: false,
        onClose: false,
        okfun: function (val) {
            if ($(".js_time_input2").val() != '') {
                $(".js_time_input2").val('');

            }
            date = $('.js_time_input1').val().replace(/\//g, '-');
            if (date !== 1) {
                $(".js_time_input2").jeDate({
                    format: "YYYY/MM/DD",
                    zIndex: 3000,
                    isClear: false,
                    onClose: false,
                    okfun: function (val2) {
                        if ($(".js_time_input2").val().replace(/-/g, '') < $(".js_time_input1").val().replace(/-/g, '')) {
                            errMsg('结束时间必须大于开始时间！');
                            date = 1;
                            $(".js_time_input1").val('');
                            $(".js_time_input2").val('');
                        }
                    }
                });
            }
        }
    });

    //单选题
    $('.chose_one dd').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');

        //是否招收寄宿学员
        var clickEle = $(this).parents('.pc_box');
        if (clickEle.attr('id') == 'is_boarding' || clickEle.attr('id') == 'lunch_service') {
            if ($(this).data('id') == 1) {
                clickEle.next('.hide_box').slideDown();
            } else {
                clickEle.next('.hide_box').slideUp();
            }
        }
    })

    //多选题
    $('.chose_more dd').on('click', function () {
        $(this).toggleClass('active');
    })



    //下拉列表
    $('.dropdown').on('click', function (e) {
        e.stopPropagation();
        if ($(this).siblings('ul').css('display') == 'block') {
            $('.drop_list').slideUp('fast');
            $(this).find('i').removeClass('up');
        } else {
            $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
            $(this).siblings('ul').slideDown('fast');
            $(this).find('i').addClass('up');
        }

        

    });
    $('.drop_list li').on('click', function (e) {
        e.stopPropagation();
        var _showBox = $(this).parent();
        _showBox.siblings('p').find('span').text($(this).text());
        _showBox.slideUp('fast');
        _showBox.siblings('p').find('i').removeClass('up');
        $(this).parent().siblings('.dropdown').attr('data-id', $(this).data('id'));

        //是否租赁
        var clickEle = $(this).parents('.pc_box');
        if (clickEle.attr('id') == 'teach_area_property') {
            if (_showBox.siblings('p').attr('data-id') == 1) {
                clickEle.next().next('.hide_box').slideDown();
            } else {
                clickEle.next().next('.hide_box').slideUp();
            }
        }
    })
    $(document).on('click', function () {
        $('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
    });

    //提交
    $('.btn_box a').on('click', function () {

        //选择法人属性
        var legal = $('#legal').attr('data-id');//法人属性
        //基本信息
        var name = $('#name').find('textarea').val();//名称
        var school = $('#school').find('.dropdown').attr('data-id');//学院或学校
        var student_object = getChooseMore($('#student_object'));//招生对象
        var is_higher_education = $('#is_higher_education').find('.active').attr('data-id');//是否实施高等教育
        var is_has_teacher = $('#is_has_teacher').find('.active').attr('data-id');//是否有高校系列教师
        var run_school_ct = $('#run_school_ct').find('textarea').val();//办学内容

        //举办人
        var legal_name = $('#legal_name').find('textarea').val();//法人名称
        var legal_money = $('#legal_money').find('input').val();//法人出资金额
        var natural_name = $('#natural_name').find('textarea').val();//自然人名称
        var natural_money = $('#natural_money').find('input').val();//自然人出资金额
        var is_union = $('#is_union').find('.active').attr('data-id');//是否联合办学

        //组织机构
        var is_organization = $('#is_organization').find('.active').attr('data-id');//党组织        
        var decison_maker = $('#decison_maker').find('input').val();//决策机构负责人
        var else_decisions = $('#else_decisions').find('.dropdown').attr('data-id');//其他决策机构       
        var else_organization = $('#else_organization').find('input').val();//其他组织机构

        //管理制度
        var rule = getChooseMore($('#rule'));//规章制度

        //主要管理人员
        var legal_man = $('#legal_man').find('.dropdown').attr('data-id');//法定代表人
        var principal = $('#principal').find('input').val();//校长
        var principal_id = $('#principal_id').find('input').val();//校长身份证
        var principal_degree = $('#principal_degree').find('.dropdown').attr('data-id');//校长学历
        var principal_exp = $('#principal_exp').find('.dropdown').attr('data-id');//校长经验

        //师资队伍
        var teaxher_num = $('#teaxher_num').find('input').val();//教师总数
        var subject_num = $('#subject_num').find('input').val();//学科类和学科延伸类培训授课人员总数
        var subject_hasCard_num = $('#subject_hasCard_num').find('input').val();//学科类和学科延伸类培训授课人员中有教师资格证人数
        var fulltime_teacher = $('#fulltime_teacher').find('input').val();//专职教师数

        //七、办学场所和设施设备
        var school_addres = $('#school_addres').find('input').val();//地址
        var teach_place_area = $('#teach_place_area').find('input').val();//教学用房建筑面积
        var place_all_area = $('#place_all_area').find('input').val();//总建筑面积（平方米）
        var house_property = $('#house_property').find('.dropdown').attr('data-id');//房屋性质
        var teach_area_property = $('#teach_area_property').find('.dropdown').attr('data-id');//办学场所性质
        var property_owner = $('#property_owner').find('input').val();//产权人
        //如果是自有 则没有租赁时间选择
        var term_of_lease='';
        if (teach_area_property == 1){
            term_of_lease = $('#term_of_lease').find('input').eq(0).val()
                + '|'
                + $('#term_of_lease').find('input').eq(1).val();
        }
        
        var is_fire_protection = $('#is_fire_protection').find('.active').attr('data-id');//办学场所符合国家规定的消防要求        
        var is_boarding = $('#is_boarding').find('.active').attr('data-id');//是否招收寄宿学员 

        var read_place = '';
        var live_place = '';
        var sports_place = '';
        var is_fire_dormitory = '';
        if (is_boarding == 1) {
            read_place = $('#read_place').find('.active').attr('data-id');//是否有相应阅览场所        
            live_place = $('#live_place').find('.active').attr('data-id');//是否有生活场所        
            sports_place = $('#sports_place').find('.active').attr('data-id');//是否有运动场所        
            is_fire_dormitory = $('#is_fire_dormitory').find('.active').attr('data-id');//所提供的宿舍符合相关消防要求        
        } 
        var lunch_service = $('#lunch_service').find('.active').attr('data-id');//向学员提供餐饮服务 
        var food_safety ='';
        if (lunch_service == 1){
            food_safety = $('#food_safety').find('.active').attr('data-id');//符合国家食品安全的标准
        }       
        

        var param = {
            'corporate_attr': legal,
            'company_title': name,
            'school_type': school,
            'takein_type': student_object,
            'selfexam_type': is_higher_education,
            'ishave_hightteacher': is_has_teacher,
            'take_edu_content': run_school_ct,
            'fa_hoster': legal_name,
            'fa_total': legal_money,
            'zi_hoster': natural_name,
            'zi_total': natural_money,
            'is_uniontake': is_union,
            'is_establish_party': is_organization,
            'party_hoster': decison_maker,
            'party_type': else_decisions,
            'other_agency': else_organization,
            'law_rules': rule,
            'legal_person': legal_man,
            'principal': principal,
            'principal_idcards': principal_id,
            'principal_edulevel': principal_degree,
            'principal_teachingage': principal_exp,
            'teacher_total': teaxher_num,
            'teacher_train_total': subject_num,
            'teacher_cer_total': subject_hasCard_num,
            'teacher_fulltime_total': fulltime_teacher,
            'company_address': school_addres,
            'company_build_teaching_area': teach_place_area,
            'company_build_area': place_all_area,
            'company_house_type': house_property,
            'company_institute_type': teach_area_property,
            'company_house_hoster': property_owner,
            'company_lease_startdate': term_of_lease,//
            'is_as_xiaofang': is_fire_protection,
            'is_as_jisustudent': is_boarding,
            'is_as_read_place': read_place,
            'is_as_live_place': live_place,
            'is_as_sports': sports_place,
            'is_as_xiaofang_dormitory': is_fire_dormitory,
            'is_as_food': lunch_service,
            'is_as_food_safe': food_safety,
        }
        if ($(this).hasClass('js_storage')) {
            param.id = $('.js_storage').attr('data-id');
            console.log(param);
            //保存
            requestData(API.PREPARE.SAVE, "post", call, param);

            function call(data) {
                if (data.status == 1) {
					errMsg(data.msg);
					setTimeout(function () {
                            location.reload();
                        }, 2000)
                } else {
                    errMsg(data.msg);
                };
            };
        } else {
            if (!legal) {
                errMsg('请选择法人属性', $('#legal'));
                return false;
            }
            if (!nullVal(name)) {
                errMsg('请输入名称', $('#name'));
                return false;
            }
            if (!school) {
                errMsg('请选择学院或学校', $('#school'));
                return false;
            }
            if (student_object.length == 0) {
                errMsg('请选择招生对象', $('#student_object'));
                return false;
            }
            if (!is_higher_education) {
                errMsg('请选择是否实施高等教育', $('#is_higher_education'));
                return false;
            }
            if (!is_has_teacher) {
                errMsg('请选择是否有高校系列教师', $('#is_has_teacher'));
                return false;
            }
            if (!nullVal(run_school_ct)) {
                errMsg('请填写办学内容', $('#run_school_ct'));
                return false;
            }
            //请填写举办人名称和出资总额

            var testArr = [legal_name, legal_money, natural_name, natural_money];
            console.log(testArr);
            var nullLen = 0;

            for(var i = 0;i<testArr.length;i++){
                if (!nullVal(testArr[i])) {
                    nullLen++;
                }
            }
            if (nullLen == 1 || nullLen == 3) {
                errMsg('请填写正确的举办人名称和出资总额', $('#legal_name'));
                return false;
            } else if (!nullVal(legal_name) || !nullVal(legal_money)) {
                if (!nullVal(natural_name)){
                    errMsg('请填写正确的举办人名称和出资总额', $('#legal_name'));
                    return false;
                }
            } else if (!nullVal(natural_name) || !nullVal(natural_money)) {
                if (!nullVal(legal_name)) {
                    errMsg('请填写正确的举办人名称和出资总额', $('#legal_name'));
                    return false;
                }
            }
            if (!is_union) {
                errMsg('请选择是否联合办学', $('#is_union'));
                return false;
            }
            if (!is_organization) {
                errMsg('请选择是否建立了中国共产党基层组织', $('#is_organization'));
                return false;
            }
            if (!nullVal(decison_maker)) {
                errMsg('请填写决策机构负责人', $('#decison_maker'));
                return false;
            }
            if (!else_decisions) {
                errMsg('请选择设立理事会、董事会或者其他形式的决策机构', $('#else_decisions'));
                return false;
            }
            if (!nullVal(else_organization)) {
                errMsg('请填写其他组织机构', $('#else_organization'));
                return false;
            }
            if (rule.length == 0) {
                errMsg('请选择制定的各项规章制度', $('#rule'));
                return false;
            }
            if (!legal_man) {
                errMsg('请选择法定代表人', $('#legal_man'));
                return false;
            }
            if (!nullVal(principal)) {
                errMsg('请填写校长', $('#principal'));
                return false;
            }
            if (!nullVal(principal_id)) {
                errMsg('请填写校长身份证号码', $('#principal_id'));
                return false;
            }
            if (!principal_degree) {
                errMsg('请选择校长学历', $('#principal_degree'));
                return false;
            }
            if (!principal_exp) {
                errMsg('请选择校长相关教育管理经验年限', $('#principal_exp'));
                return false;
            }
            if (!nullVal(teaxher_num)) {
                errMsg('请填写教师总数', $('#teaxher_num'));
                return false;
            }
            if (!nullVal(subject_num)) {
                errMsg('请填写学科类和学科延伸类培训授课人员总数', $('#subject_num'));
                return false;
            }
            if (!nullVal(subject_hasCard_num)) {
                errMsg('请填写学科类和学科延伸类培训授课人员中有教师资格证人数', $('#subject_hasCard_num'));
                return false;
            }
            if (!nullVal(fulltime_teacher)) {
                errMsg('请填写专职教师数', $('#fulltime_teacher'));
                return false;
            }
            if (!nullVal(school_addres)) {
                errMsg('请填写办学详细地址', $('#school_addres'));
                return false;
            }
            if (!nullVal(teach_place_area)) {
                errMsg('请填写教学用房建筑面积', $('#teach_place_area'));
                return false;
            }
            if (!nullVal(place_all_area)) {
                errMsg('请填写总建筑面积（平方米）', $('#place_all_area'));
                return false;
            }
            if (!house_property) {
                errMsg('请选择房屋性质', $('#house_property'));
                return false;
            }
            if (!teach_area_property) {
                errMsg('请选择办学场所性质', $('#teach_area_property'));
                return false;
            }
            if (!nullVal(property_owner)) {
                errMsg('请填写产权人', $('#property_owner'));
                return false;
            }
            if (teach_area_property == 1){
                console.log(123123123);
                var term_true = true;
                $('#term_of_lease').find('input').each(function (i, v) {
                    if (!nullVal($(v).val())) {
                        term_true = false;
                    }
                })
                if (!term_true) {
                    errMsg('请填写租赁期限', $('#term_of_lease'));
                    return false;
                }
            }
            if (!is_fire_protection) {
                errMsg('请选择办学场所是否符合国家规定的消防要求', $('#is_fire_protection'));
                return false;
            }
            if (!is_boarding) {
                errMsg('请选择是否招收寄宿学员', $('#is_boarding'));
                return false;
            }
            if (is_boarding == 1) {
                if (!read_place) {
                    errMsg('请选择是否有相应阅览场所', $('#read_place'));
                    return false;
                }
                if (!live_place) {
                    errMsg('请选择是否有生活场所', $('#live_place'));
                    return false;
                }
                if (!sports_place) {
                    errMsg('请选择是否有运动场所', $('#sports_place'));
                    return false;
                }
                if (!is_fire_dormitory) {
                    errMsg('请选择所提供的宿舍是否符合相关消防要求', $('#is_fire_dormitory'));
                    return false;
                }
            } else {

            }
            if (!lunch_service) {
                errMsg('请选择是否向学员提供餐饮服务', $('#lunch_service'));
                return false;
            }
            if (lunch_service == 1){
                if (!food_safety) {
                    errMsg('请选择是否符合国家食品安全的标准', $('#food_safety'));
                    return false;
                }
            }
            

            //提交
            param.id = $('.js_submit').attr('data-id');
            console.log(param);
            requestData(API.PREPARE.SUBMIT, "post", call, param);

            function call(data) {
                if (data.status == 1) {
                    errMsg('提交成功')
                    setTimeout(function(){
                        window.location = data.msg;
                    },1500)
                    
                } else {
                    var msg;
                    if (data.msg) {
                        msg = data.msg;
                    };
                    if (data.message) {
                        msg = data.message;
                    };
                    errMsg(msg);
                };
            };

        }

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
    //获取多选题数组
    function getChooseMore(oThis) {
        var arr = [];
        oThis.find('dd.active').each(function (i, v) {
            arr.push($(v).data('id'));
        })
        return arr;
    }
    //focus样式   
    function border(oThis) {
        $('input').removeClass('focus_border');
        $('input').removeClass('err_border');
        $('textarea').removeClass('focus_border');
        $('textarea').removeClass('err_border');
        oThis.addClass('focus_border');
    }
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


	
     //错误信息标红
	if(window.Errorfields){

		$('.pc_box').each(function (a, b) {
			
				var cls = $(b).attr('id');
                if ($.inArray(cls, window.Errorfields) != -1){
                    console.log(1);
					$(b).find('.pc_info p').addClass('err_border');
				};
		
		});
	 }

})

