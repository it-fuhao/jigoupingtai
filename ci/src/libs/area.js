var $ = require("jquery");

module.exports = function (selector, data) {
    // 处罚元素
    var $target = $(selector);

    // 默认值
    var value = $target.data("id");
    // 显示文字
    var display = [];

    if (value == "") {
        value = [];
        $target.find("span").text("请选择");
    } else {
        value = value.split("/")
    }

    // 弹出层列表
    var $listWrapper = $('<ul class="drop_area_list"></ul>');
    var $provList = $("<ol></ol>")
    var $cityList = $("<ol></ol>");
    var $areaList = $("<ol></ol>");

    $listWrapper.append($provList);
    $listWrapper.append($cityList);
    $listWrapper.append($areaList);

    // 插入到页面
    $target.after($listWrapper);

    // 省, 市, 区 数据
    var prov = {},
        city = {};

    // 省列表, 默认添加

    $.each(data, function (i, item) {
        prov[item.id] = item;
        $provList.append('<li data-id="' + item.id + '" data-name="' + item.name + '">' + item.name + '</li>');
    });

    /**
     * 获取市
     * @param  id 省级ID
     */
    var getCity = function (pid) {
        var cityData = prov[pid].child;
        // 清空城市列表
        $cityList.empty();
        city = {};
        $.each(cityData, function (i, item) {
            city[item.id] = item;
            $cityList.append('<li data-pid="' + pid + '" data-id="' + item.id + '" data-name="' + item.name + '">' + item.name + '</li>');
            if (i === 0) {
                getArea(pid, item.id);
            }
        })
    }

    /**
     * 获取区
     * @param  p 市级ID
     */
    var getArea = function (pid, cid) {
        var areaData = city[cid].child;
        // 清空城市列表
        $areaList.empty();
        $.each(areaData, function (i, item) {
            $areaList.append('<li data-pid="' + pid + '" data-cid="' + cid + '" data-id="' + item.id + '" data-name="' + item.name + '">' + item.name + '</li>');
        })
    }

    // 无默认值,直接使用第一条数据作为默认列表
    if (value.length === 0) {
        if (data[0].child && data[0].child.length > 0) {
            getCity(data[0].id);
            if (data[0].child[0].child && data[0].child[0].child.length > 0) {
                getArea(data[0].id, data[0].child[0].id)
            }
        }
    } else {
        $.each(value, function (i, val) {
            switch (i) {
                case 0:
                    $provList.find('[data-id="' + val + '"]').addClass("active");
                    getCity(val);
                    break;
                case 1:
                    $cityList.find('[data-id="' + val + '"]').addClass("active");
                    break;
                case 2:
                    $areaList.find('[data-id="' + val + '"]').addClass("active");
                    break;
            }
        })
    }

    // 弹出下拉菜单
    $target.on("click", function (e) {
        e.stopPropagation();
        $listWrapper.slideDown();

        $(document).one("click", function (ev) {
            $listWrapper.slideUp("fast")
        })
    });

    // 选项省
    $provList.on("click", "li", function (e) {
        e.stopPropagation();
        var $this = $(this),
            data = $this.data();
        $this.addClass("active").siblings().removeClass("active");
        getCity(data.id);
    });

    // 选项城市
    $cityList.on("click", "li", function (e) {
        e.stopPropagation();
        var $this = $(this),
            data = $this.data();
        $this.addClass("active").siblings().removeClass("active");

        if (city[data.id].child && city[data.id].child.length > 0) {
            getArea(data.pid, data.id);
        } else {
            value = [data.pid, data.id];
            display = [prov[data.pid]['name'], city[data.id]['name']];
            $target.find("span").text(display.join(" / "));
            $listWrapper.slideUp("fast")
            $target.data("id", value.join("/"))
        }

    });

    $areaList.on("click", "li", function (e) {
        e.stopPropagation();
        var $this = $(this),
            data = $this.data();
        $this.addClass("active").siblings().removeClass("active");

        $provList.find('[data-id="' + data.pid + '"]').addClass("active").siblings().removeClass("active");
        $cityList.find('[data-id="' + data.cid + '"]').addClass("active").siblings().removeClass("active");

        value = [data.pid, data.cid, data.id];
        display = [prov[data.pid]['name'], city[data.cid]['name'], data.name];
        $target.find("span").text(display.join(" / "));
        $listWrapper.slideUp("fast")
        $target.attr("data-id", value.join("/"))
    });

};
