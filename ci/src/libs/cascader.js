/*
* 级联选择器
* @Author: chandre
* @Date:   2018-05-19 22:52:08
 * @Last Modified by: fuhao
 * @Last Modified time: 2018-05-22 13:56:32
*/
var $ = require("jquery");

const Cascader = function(selector , options) {

    
    this.$wrapper = $(selector);
    
    this.options = $.extend({
        // 当前元素data对象key,
        trigger: "value",
        // trigger的值分隔符
        'split': "/",
        // 下拉样式
        selectClass: "dropdown",
        // 选项列表
        optionsClass: "drop_list scroll",
        // 选项
        itemCalss: "drop_item",
        // 选项高亮
        activeClass: "active",
        // 级别
        keep: 0,
        // 数据源
        data: [],

        // 数据源 key
        keys: {
            // 值 
            "value": "value",
            // 显示文字
            "label": "label",
            // 子级选项列表
            "children": "children"
        },
    }, options);

    this.$children = [];
    this.$wrapper.empty();

    this.init();
}

Cascader.prototype = {

    // 初始化
    init() {
        const $wrapper = this.$wrapper,
            options = this.options,
            value = $wrapper.data(options["trigger"]);

        this.value = value.split(options["split"]);
        this.label = [];

        if (  this.options.keep > 0 && this.value.length > this.options.keep ) {
            this.value.splice( this.options.keep, this.value.length);
        }

        this._transformData();
        this._initDefaultValue();

    },

    // 转换数据为统一格式
    _transformData: function() {
        const data = this.options.data,
            keys = this.options.keys;

        function convert( arr ) {
            const tmpData = [];

            $.each(arr, function(i, item) {
                const obj = {
                    "value": item[keys["value"]] || "",
                    "label": item[keys["label"]] || "",
                    "children": item[keys["children"]] || [],
                }

                if (obj['children'].length > 0) {
                    obj['children'] = convert(obj['children'])
                }
                tmpData.push(obj);
            })
            return tmpData;
        }

        this.data = convert(data);
        return this;
    },

    // 初始化默认选项
    _initDefaultValue() {
        let self = this,
            options = this.options,
            value = this.value,
            data = this.data;

        this._createSelect( 0 , this.data);

        $.each(value, function(i, v) {
            $.each( data, function(j,k) {
                if ( k['value'] == v ) {
                    self.label.push(k['label']);
                    data = k["children"];

                    // 深度
                    if (options.keep > 0 && options.keep === i +1) {
                        return;
                    }

                    if (data.length > 0) {
                        self._createSelect( i+1 , data )
                    }
                }
            })
        })

        return this;

    },

    // 创建元素
    _createSelect: function( index, data ) {

        // 删除当前选择后面的所有子级
        this._removeChild(index);

        const self = this,
            options = this.options,
            $select = $("<div />"),
            $label = $("<span>请选择</span>"),
            $arrow = $("<i />");

        $select.addClass(options.selectClass);
        $select.append($label);
        $select.append($arrow);

        // 生成列表选项
        const $options = self._createOptions(index, $label, data);

        
        // 收起下接
        const slideUp = function(ev) {
            $options.stop()
                .slideUp('fast');
        }

        // 展开或收起列表
        $select.on('click', function(ev) {
            ev.stopPropagation();
            $options.stop()
                .slideToggle('fast');

            $arrow.toggleClass(options.activeClass);

            $(document).one("mouseup", slideUp);
        });

        //监听列表点击事件
        $($select, $options).on("click", "li", function(ev) {
            ev.stopPropagation();

            const $this = $(this),
                value = $this.data();
            
            $this.addClass(options.activeClass)
                .siblings()
                .removeClass(options.activeClass);

            // 更新显示文字
            $label.text(value["label"]);
            
            // 关闭弹出层
            slideUp();

           // 设置当前选项值 
            self._setValue( index, {
                value : value["value"],
                label : value["label"]
            })

            if (value['children'].length > 0) {
                if ( options.keep > 0 && options.keep <= self.value.length ) {
                    return ;
                }
                self._createSelect(index+1, value['children']);
            };

           

        });

        this.$children.push($select);

        $select.append($options);

        this.$wrapper.append($select)

       return $select;
    },

    // 创建选项
    _createOptions: function( index, $label, data ) {
        const self = this,
            options = this.options,
            value = this.value[index],
            $list = $("<ul />");

        $list.addClass( options.optionsClass ).hide();

        $.each(data, function(i,item) {
            const $item = $("<li />");
            $item.addClass(options.itemClass);

            // 显示默认选项
            if (item['value'] == value) {
                $label.text( item['label'] );
                $item.addClass(options.activeClass);
            }

            $item.data(item).text(item['label']);

            $list.append($item)
        });

       return $list;
    },


    // 删除子选项
    _removeChild(index) {

        const $after = this.$children.splice(index, this.$children.length);

        $.each($after, function(i, item) {
            // 删除事件
            item.off();
            // 删除元素
            item.remove();
        })
    },

    // 更新值 
    _setValue(index, agrs ) {

        // 删除或替换值
        this.value.splice(index, this.value.length, agrs.value );
        this.label.splice(index, this.label.length, agrs.label );

        const trigger = this.options["trigger"],
            cut = this.options["split"];
            
        // 正常修改元素上的值 
        this.$wrapper.data( trigger, this.value.join(cut));
        // 修改元素属性
        this.$wrapper.attr("data-"+ trigger, this.value.join(cut));

        this.trigger("change", {
            value: this.value,
            label: this.label
        });

        return this;
    },

    // 监听器
    _listeners: {},

    // 事件监听回调
    on: function(name , callback) {
        if (typeof name !== "string" ) {
            return;
        }
        var _listeners = this._listeners;

        if ( !_listeners[name] ) {
            _listeners[name] = $.Callbacks();
            _listeners[name].add(callback || $.noop );
        } else {
            _listeners[name].add(callback || $.noop );
        };
    },

    // 事件触发
    trigger: function(name, args) {
        var _listeners = this._listeners;
        if ( !_listeners[name] ) {
            return;
        }
        _listeners[name].fire(args);
    },
    
}


module.exports = Cascader;