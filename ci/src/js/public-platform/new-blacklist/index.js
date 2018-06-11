/*
 * @Author: fuhao
 * @Date: 2018-04-29 17:16:05
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-20 15:29:02
 */


var $ = require("jquery");
var API = require("@components/api");
var people = require('@components/people');

// console.log(people.data);

$(function () {

	//获取接口
	// var saveUrlVal = $('#url_save').val();//表单保存接口
	// var auditUrlVal = $('#url_audit').val();//表单审核接口
	// var submitUrlVal = $('#url_submit').val();//表单提交接口
	// var delUrlVal = $('.url_del').val();//表单删除接口
    //
	// var saveUrlVal = $('#url_save').val();//变更保存接口
    //
	// var saveUrl = API.SETUP.SETUPSAVE + saveUrlVal;
	// var auditUrl = API.SETUP.SETUPAUDIT + auditUrlVal;
	// var submitUrl = API.SETUP.SETUPSUBMIT + submitUrlVal;
	// var delUrl = API.SETUP.DEL + delUrlVal;



	function Ci() {

		//事件委托者
		this.parentNode = $('.main');


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



		//初始化
		this.init = function () {

			//民族初始化
			this.nation();

			//动态创建元素 dom丢失
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
			var wz = $(v).siblings('ul').find('li[data-id="' + idx + '"]').text();
			$(v).find('span').text(wz);
		}

	})



	//保存
	$('.js_storage').on('click', function () {

		//表单正常保存
		var param = {
			"data": "1"
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
	})
	//提交
	$('.js_submit').on('click', function () {

		var param = {
			"data": "1"
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



	//DOM
	//单选题
	$ct.on('click', '.chose_one dd', function () {
		$(this).addClass('active').siblings().removeClass('active');

		$(this).parent().attr('data-id', $(this).attr('data-id'));

	})

	//多选题
	$ct.on('click', '.chose_more dd', function () {

		$(this).toggleClass('active');
		var chose = [];
		$(this).parent().find('.active').each(function (i, v) {
			chose.push($(v).attr('data-id'));
		})
		$(this).parent().attr('data-id', chose.join(','));
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

	})
	$(document).on('click', function () {
		$('.drop_list').slideUp('fast').siblings('.dropdown').find('i').removeClass('up');
	});


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
