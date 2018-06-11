$(()=>{
	var map = new BMap.Map("chart-container");
	//初始化map对象
	map.centerAndZoom(new BMap.Point(120.2, 30.3), 17);
	//增加地图控件（当前增加的控件对应为"地图-卫星图-三维图"切换控件）
	map.addControl(new BMap.MapTypeControl());
	//启用滚轮缩放map大小
	map.enableScrollWheelZoom(true);
	//清除map上的所有覆盖物
	map.clearOverlays();
	var point,marker,bpoints=[];
	// 创建标注对象并添加到地图
	var points = [];
	// points.push({"L":104.090539,"B":30.645733,"Name":"西南民族大学"});
	points.push({"L":103.993214,"B":30.770399,"Name":"西南交通大学"});
	points.push({"L":104.153661,"B":30.681403,"Name":"成都理工大"});
	points.push({"L":104.090539,"B":30.636951,"Name":"四川大学"});
	// points.push({"L":114.07,"B":22.62,"Name":"深圳"});//114.07,22.62
	for(var i = 0,pointsLen = points.length;i <pointsLen;i++){
		point = new BMap.Point(points[i].L,points[i].B);
		bpoints.push(point);
		marker = new BMap.Marker(point);
		map.addOverlay(marker);
		//给标注点添加点击事件。使用立即执行函数和闭包
		(function() {
			var thePoint = points[i];
			marker.addEventListener("click",function(){
				showInfo(this,thePoint);
			});
		})();
	}
	//按照添加的坐标计算合适的zoom及中心坐标并更新map
	map.setViewport(bpoints);
	var localSearch = new BMap.LocalSearch(map);
	localSearch.enableAutoViewport(); //允许自动调节窗体大小

	//绑定事件
	$("div.map_search ul").on("click","li",function(){
		// console.log(1);
		var areaName=$(this).html();
		console.log(areaName);
		// searchByStationName(areaName.substring(areaName.indexOf("：")+1,areaName.length))；
		searchByStationName(areaName);
	});
	function showInfo(thisMaker,point){
		var sContent =point.Name;
		var infoWindow = new BMap.InfoWindow(sContent);// 创建信息窗口对象
		thisMaker.openInfoWindow(infoWindow);//图片加载完毕重绘infowindow
	}

	function searchByStationName(areaName) {
		map.clearOverlays();//清空原来的标注
		localSearch.setSearchCompleteCallback(function (searchResult) {
			var poi = searchResult.getPoi(0);
			map.centerAndZoom(poi.point, 13);
			var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
			map.addOverlay(marker);
			var content = areaName + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
			var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
			marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
			// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		});
		localSearch.search(areaName);
	}

	//    show函数中的points数组就是显示所需的坐标信息和提示信息，L表示经度，B表示纬
});

