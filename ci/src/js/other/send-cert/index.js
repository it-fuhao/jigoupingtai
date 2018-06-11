/*
 * @Author: fuhao 
 * @Date: 2018-05-02 16:00:46 
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-05 14:47:38
 */
var $ = require('jquery');
var API = require('@components/api')
$(function(){
    
    $('.show_modal').on('click',function(){
        $('.modal').show();
		$('.modal').attr('data-id',$(this).attr('data-id'));
    })
    $('.close').on('click',function(){
		$('.modal').attr('data-id','');
        $('.modal').find('input').val('');
        $('.modal').find('.hint').removeClass('show');
        $('.modal').hide();

    })
    $('.js_sure').on('click',function(){
        var cert = $(this).parent().siblings('input').val();
        if($.trim(cert) == '') {
            $(this).parent().siblings('.hint').addClass('show').text('输入不能为空');
            return false;
        }
		var param = {
		    'code':cert,
			'id': $('.modal').attr('data-id')
		}
        requestData('/sendcer/send', "post", call, param);

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
        
    })
    //提交

$('.del_modal').on('click',function(){
        
		var delid = $(this).attr('data-id');
		if(confirm('确认驳回吗？')){
				var param = {
						'id': delid
					}
					requestData('/sendcer/del', "post", call, param);

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

		}
    })
    


	 //错误提示
    function errMsg(msg, oThis) {
        layer.msg(msg);
        if (oThis) {
            var t = oThis.parents('.pub_box').offset().top;
            $('body,html').animate({ 'scrollTop': t }, 100)
        }
    }



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
})