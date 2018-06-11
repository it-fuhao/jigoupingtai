$(function () {
    var cascader = require("@components/cascader");
    const  Cascader = new cascader("#Cascader", {
        // 当前元素data对象key,
        trigger: "value",
        // trigger的值分隔符
        split: "/",
        // 下拉样式
        // selectClass: "dropdown1",
        // // 选项列表
        // optionsClass: "111drop_list scroll",
        // // 选项
        // itemCalss: "",
        // // 选项高亮
        // activeClass: "active",
        // 数据源
        data: areaData,
        // 数据源 key
        keys: {
            // 值 
            "value": "id",
            // 显示文字
            "label": "name",
            // 子级选项列表
            "children": "child"
        }
    });

    // 事件监听
    Cascader.on("change", function(data) {
        console.log(data)
        // 值修改后果,更新滚动条组件
        setTimeout(function() {
            scroll();
        }, 10)
    })
});