$(()=>{
	$(".chose_one").on("click","dd",function(){
		var $that=$(this);
		$that.addClass("active").siblings().removeClass("active");
		if(($that.find("span").text().indexOf('已')==0)){
			$(".processed").css("display","table");
			$(".untreated").css("display","none");
		}else{
			$(".processed").css("display","none");
			$(".untreated").css("display","table");
		}
	})
});
