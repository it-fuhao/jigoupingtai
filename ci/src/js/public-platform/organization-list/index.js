$(()=>{
	// 弹出遮罩层
	$(".main_con_table tbody td>a:nth-child(3)").click(function(){
		$(".black_overlay").show();
		$(".dialog_content").show();
	});
	//关闭遮罩层
	$(".close").click(function(){
		$(".black_overlay").hide();
		$(".dialog_content").hide();
	});
	$(".js_unsure").click(function(){
		$(".black_overlay").hide();
		$(".dialog_content").hide();
	});
	// 切换选项
	$(".chose_one").on("click","dd",function(){
		var $that=$(this);
		$that.addClass("active").siblings().removeClass("active");
		if(($that.find("span").text().indexOf('非')==0)){
			$(".not_manage").css("display","table");
			$(".manage").css("display","none");
		}else{
			$(".not_manage").css("display","none");
			$(".manage").css("display","table");
		}
	})

});
