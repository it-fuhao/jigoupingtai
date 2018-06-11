var $ = require('jquery');
var API = require("@components/api");

//获取客户端返回的表字段
function getFormFields(type = 0) {
    var customFormFields = {
        '1': {
            'id': '1',
            'offset': 1,
            'type': 'label',
            'field_name': '姓名',
        },
        '2': {
            'id': '2',
            'offset': 2,
            'type': 'text',
            'value_attr': 'str',
            'rule1': '3',
            'rule2': '100'
        },
        '3': {
            'id': '3',
            'offset': 3,
            'type': 'label',
            'field_name': '只能为中文',
        },
        '4': {
            'id': '4',
            'offset': 4,
            'type': 'label',
            'field_name': '爱好',
        },
        '5': {
            'id': '5',
            'offset': 5,
            'type': 'list',
            'bind_data': "游泳&&看电影&&旅游"
        },
        '6': {
            'id': '6',
            'offset': 6,
            'type': 'label',
            'field_name': '最多只能选择3个',
        },
    };
    if (type == 1) {
        return window.customFormFields;
    } else {
        return window.customFormFields;
    }


}

//数据源， 可以增/删/改
function DataObject() {
    this.data = '';
}

/**
 * 添加一个字段
 *
 * 如果offset存在则修改
 * 
 * param int    offset 字段offset
 * param object field  一个字段对象 @see line 22
 */
DataObject.prototype.add = function (offset, field) {
    this.data[offset] = field;
}

DataObject.prototype.bindData = function (data) {
    this.data = data;
}

DataObject.prototype.get = function (offset) {
    if (offset == 0) {
        return this.data;
    }
    return this.data[offset];
}

/**
 * @param int type
 * type = 0 新加行
 * type = 1 删除行
 */
DataObject.prototype.update = function (rowIndex, type) {
    if (type == 0) {
        var offset = Number(rowIndex) * 3;
        var index = 0;

        // console.log('row: ' + rowIndex + ' offset: ' + offset + ' data-length: ' + Object.keys(this.data).length);
        //判断如果是最后一行添加, 直接添加三个数据对象
        if (offset == Object.keys(this.data).length) {
            // console.log('末尾添加');
            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'label',
                offset: offset,
                field_name: '标签'
            };

            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'text',
                offset: offset,
                field_name: ''
            };

            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'label',
                offset: offset,
                field_name: '备注'
            };
            //不是最后一行, 修改当前行后面所有数据offset值
        } else {
            // console.log('添加了一行');

            var _tmp = this.data;
            offset = Number(rowIndex) * 3;
            len = Object.keys(this.data).length;
            for (var i = len; i > offset; i--) {
                index = Number(i) + 3;
                // console.log('当前index值: ' + index);
                this.data[index.toString()] = _tmp[i.toString()];
                this.data[index.toString()].offset = index;
            }
            var offset = rowIndex * 3;
            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'label',
                offset: offset,
                field_name: '标签'
            };

            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'text',
                offset: offset,
                field_name: ''
            };

            offset++;
            this.data[offset.toString()] = {
                id: 0,
                type: 'label',
                offset: offset,
                field_name: '备注'
            };
            return;
        }
    } else {
        var offset = Number(rowIndex) * 3;
        var index = 0;
        //删除一行
        if (offset == Object.keys(this.data).length) {
            // console.log('del row');
            delete this.data[offset];
            offset--;
            delete this.data[offset];
            offset--;
            delete this.data[offset];
        } else {
            var offset = Number(rowIndex) * 3 - 2;
            var index = 0;
            var len = Object.keys(this.data).length;
            len = len - 3;
            for (var i = 0; i <= len; i++) {
                index = Number(i) + 3;
                if (Number(i) <= offset) {
                    continue;
                }
                this.data[i.toString()] = this.data[index.toString()];
                this.data[i.toString()].offset = i;
                // delete this.data[i];
            }
            delete this.data[i.toString()];
            i++;
            delete this.data[i.toString()];
            i++;
            delete this.data[i.toString()];
            return;
            for (var i in this.data) {
                index = Number(i) - 3;
                if (Number(i) <= offset) {
                    continue;
                }

                this.data[index.toString()] = this.data[i];
                delete this.data[i];
            }
        }
    }
}

/**
 * 删除一个字段
 *
 * 如果offset存在则修改为空
 * 
 * param int    offset 字段offset
 * param object field  一个字段对象 @see line 22
 */
DataObject.prototype.del = function (offset) {
    this.data.offset = {
        'type': '',
        'value_attr': '',
        'rule1': '',
        'rule2': ''
    };
}

//label Ui
function LabelUI() {
    this.beginHtml = '<div class="pc_info"><input type="text" value="';
    //标签显示文本
    this.text = '';
    //结束html 
    this.endHtml = '"></div>';
    //<span>__DATA__</span>
}

//生成一个label html代码
LabelUI.prototype.buildHtml = function (field) {

    if (field.field_name == undefined) {
        return this.beginHtml + this.text + this.endHtml;
    }
    var text = field.field_name;
    return this.beginHtml + text + this.endHtml;
}

//-------------------------------end

function TextUI() {
    this.beginHtml = '<div class="pc_content" data-type="text">';
    this.text = '<input type="text" placeholder="请填写">';
    this.endHtml = '</div>';
}

TextUI.prototype.buildHtml = function (field) {
    //获取offset
    if (field.bindData == undefined) {
        return this.beginHtml + this.text + this.endHtml;
    }
    var text = '<input type="text" value="' + field.bindData + '" />';
    return this.beginHtml + text + this.endHtml;
}
//-------------------------------end

var ListUI = function () {
    this.beginHtml = '<div class="pc_content" data-type="list">';
    this.beginHtml += '<p class="dropdown2" data-id="">';
    this.beginHtml += '<span>请选择</span><i></i></p>';
    this.beginHtml += '<ul class="drop_list2 scroll">';
    this.text = '<li data-id="1">租赁</li>';
    this.endHtml = '</ul>';
    this.endHtml += '</div>';
}

ListUI.prototype.buildHtml = function (field) {
    //获取offset
    if (field.bind_data == undefined) {
        return this.beginHtml + this.text + this.endHtml;
    }

    //拆分bindData为数组, 按\n
    var _bindData = field.bind_data.split("&&");
    // console.log(_bindData);

    var text = '';
    for (var i in _bindData) {
        text += '<li data-id="' + _bindData[i] + '">' + _bindData[i] + '</li>';
    }
    return this.beginHtml + text + this.endHtml;
}
//-------------------------------end

function RadioUI() {
    this.beginHtml = '<div class="pc_content" data-type="radio">';
    this.beginHtml += '<dl class="chose_one" data-id="1">';
    this.text = '<dd data-id="1"><i></i><span>单选1</span></dd>';
    this.text += '<dd data-id="2"><i></i><span>单选2</span></dd>';
    this.endHtml = '</dl>';
    this.endHtml += '</div>';
}

RadioUI.prototype.buildHtml = function (field) {
    //获取offset
    if (field.bind_data == undefined) {
        return this.beginHtml + this.text + this.endHtml;
    }

    //拆分bindData为数组, 按\n
    var _bindData = field.bind_data.split("&&");

    var text = '';
    for (var i in _bindData) {
        text += '<dd data-id="' + _bindData[i] + '"><i></i><span>' + _bindData[i] + '</span></dd>';
    }
    return this.beginHtml + text + this.endHtml;
}
//-------------------------------end

function CheckUI() {
    this.beginHtml = '<div class="pc_content" data-type="check">';
    this.beginHtml += '<dl class="chose_more" data-id="">';
    this.text = '<dd data-id="1"><i></i><span>复选1</span></dd>';
    this.text += '<dd data-id="2"><i></i><span>复选2</span></dd>';
    this.endHtml = '</dl>';
    this.endHtml += '</div>';
}

CheckUI.prototype.buildHtml = function (field) {
    // console.log(field);
    //获取offset
    if (field.bind_data == undefined) {
        return this.beginHtml + this.text + this.endHtml;
    }

    //拆分bindData为数组, 按\\n
    var _bindData = field.bind_data.split("&&");

    var text = '';
    for (var i in _bindData) {
        text += '<dd data-id="' + _bindData[i] + '"><i></i><span>' + _bindData[i] + '</span></dd>';
    }
    return this.beginHtml + text + this.endHtml;
}

//-------------------------------end
function ImageUI() {
    this.beginHtml = '';
    this.text = '';
    this.endHtml = '';
}

ImageUI.prototype.buildHtml = function (field) {
    //获取offset
    var offset = 1;
    return 'imagUpload';
    return this.beginHtml + offset + " value=" + field.field_name + this.endHtml;
}
//-------------------------------end

//一个字段ui对象, 对不同的类型输出不同的html代码
function FieldUIObject() {
    this.label = new LabelUI();
    this.text = new TextUI();
    this.list = new ListUI();
    this.radio = new RadioUI();
    this.check = new CheckUI();
    this.image = new ImageUI();
    //checkbox...list....radio....input
}

FieldUIObject.prototype.buildHtml = function (field) {
    var _html = '';

    switch (field.type) {
        case "label":
            _html = this.label.buildHtml(field);
            break;
        case "text":
            _html = this.text.buildHtml(field);
            break;
        case "list":
            _html = this.list.buildHtml(field);
            break;
        case "radio":
            _html = this.radio.buildHtml(field);
            break;
        case "check":
            _html = this.check.buildHtml(field);
            break;
        case "image":
            _html = this.image.buildHtml(field);
            break;
    }

    return _html;
}

function Workspace() {
    //字段ui 对象
    this.fieldUi = '';
    //当前表格选中的单元格索引, 从1开始
    this.offset = 1;
    //当前表格选中的单元格所在的行
    this.row = 0;
    //当前表格绑定的数据源对象
    this.data = '';
    //指定的talbe id
    this._table = '#custom_form';
    //ui层id
    this._uiMenuId = '#form-ui';
    //弹出层按钮id/css
    this._uiMenuBtn = '.control-style—select';
    //删除行id/css
    this._delRowBtn = '.del_input';
    //添加行id/css
    this._addRowBtn = '.add_input';

    //表格一行html代码
    this._trheadBegin = '<tr rowindex="';
    this._trheadEnd = '">';
    this._td1Begin = '';
    this._td1 = '';
    this._td1End = '';
    this._td2Begin = '';
    this._td2 = '';
    this._td2End = '';
    this._td3 = '';
    this._td4Begin = '';
    this._td4 = '';
    this._td4End = '';
    this._td5 = '';
    this._trfoot = '</tr>';
    //表格行结束

    this._td1Begin += '<td class="title editing" offset="';
    this._td1End += '"></td>';

    this._td2Begin += '<td style="width: 383px;" offset="';
    this._td2End += '"><div class="pc_content"><input type="text" placeholder="请填写"></div></td>';

    this._td3 = '<td class="control-style—select editing">';
    this._td3 += '<i></i>';
    this._td3 += '</td>';

    this._td4Begin += '<td class="note editing" offset="';
    this._td4End += '"><input type="text"></td>';

    this._td5 += '<td class="note editing action-span" style="border:none;">';
    this._td5 += '<span class="add_input">';
    this._td5 += '</span>';
    this._td5 += '<span class="del_input">';
    this._td5 += '</span>';
    this._td5 += '</td>';
}

/**
 * 绑定workspace绑定对象id
 * 
 * @param object o
 *  {
 *      'tableId': '', //绑定的tableid
 *      'uiMenuId': '', //弹出ui层选择菜单id
 *      'uiMenuBtn': '', //弹出ui层菜单按钮id/css
 *      'delRowBtn': '', //删除行id/css按钮
 *      'addRowBtn': '', //添加行id/css按钮
 *  }
 *
 */
Workspace.prototype.bindId = function (o) {
    if (o.tableId == undefined) {
        alert('请绑定显示表单的id');
        return;
    }
    if (o.uiMenuId == undefined) {
        alert('请绑定显示ui菜单选择器id');
        return;
    }
    if (o.uiMenuBtn == undefined) {
        alert('请绑定ui菜单的驱动按钮id/css');
        return;
    }
    if (o.delRowBtn == undefined) {
        alert('请绑定删除行按钮id/css');
        return;
    }
    if (o.addRowBtn == undefined) {
        alert('请绑定添加行按钮id/css');
        return;
    }

    this._table = '#' + o.tableId;
    this._uiMenuId = '#' + o.uiMenuId;
    this._uiMenuBtn = o.uiMenuBtn;
    this._delRowBtn = o.delRowBtn;
    this._addRowBtn = o.addRowBtn;
}

//设置表格绑定数据源对象
Workspace.prototype.bindData = function (data) {
    this.data = data;
};

//获取当前所在行
Workspace.prototype.getRow = function () {
    return Number(this.row);
}

//设置当前所在行
Workspace.prototype.setRow = function (row) {
    return this.row = row;
}

//设置当前所在offset
Workspace.prototype.setOffset = function (offset) {
    return this.offset = offset;
}

//获取当前所在offset
Workspace.prototype.getOffset = function () {
    return this.offset;
}

Workspace.prototype.setHtmlByOffset = function (offset, html) {
    var row = this.getRow();
    row = Number(row);
    var index = Number(offset) % 3;
    switch (index) {
        case 1:
            $(this._table + ' tr:eq(' + row + ') td:eq(0)').html(html);
            break;
        case 2:
            $(this._table + ' tr:eq(' + row + ') td:eq(1)').html(html);
            break;
        case 0:
            $(this._table + ' tr:eq(' + row + ') td:eq(3)').html(html);
            break;
    }
}

//初始化操作
Workspace.prototype.init = function (type = 0) {

    var _dataObj = new DataObject();
    _dataObj.bindData(getFormFields(type));
    this.bindFieldUi(new FieldUIObject());
    this.bindData(_dataObj);

    var _data = this.data.get(0);
    var _this = this;

    //默认弹出层为隐藏
    $('#form-ui').hide();

    //给所有td添加公共单击事件, 单击后获取当前工作区offset值
    $('body').on('click', '#custom_form tr', function () {
        _this.setRow($(this).attr('rowindex'));
        
    });


    $('body').on('click', '#custom_form tr td', function () {
        var offset = $(this).attr('offset');
        var str = 'row: ' + _this.getRow() + "\n";
        str += 'offset: ' + offset + "\n";
        $('#data-offset').text(str);
        if (_data[offset] == undefined) {
            return;
        }
        var _str = '';
        _str += 'id: ' + _data[offset].id + "\n";
        _str += 'offset: ' + _data[offset].offset + "\n";
        _str += 'type: ' + _data[offset].type + "\n";
        _str += 'field_name: ' + _data[offset].field_name + "\n";
        _str += 'value_attr: ' + _data[offset].value_attr + "\n";
        _str += 'rule1: ' + _data[offset].rule1 + "\n";
        _str += 'rule2: ' + _data[offset].rule2 + "\n";
        _str += 'bind_data: ' + _data[offset].bind_data + "\n";
        _str += '-----------' + "\n";
        $('#data-data').text(_str);

        //右侧控制台视图刷新
        var rule = _this.data.data[offset];

        
        var hasType = $(this).find('.pc_content').attr('data-type');
        //如果是文本操作
        if (hasType && hasType == 'text'){
            //规则一健壮性处理
            rule.rule1 ? $('#rule1').val(rule.rule1) : $('#rule1').val('');
            // if (rule.rule1){
            //     $('#rule1').val(rule.rule1);
            // }else{
            //     $('#rule1').val('');
            // }

            //规则二健壮性处理
            rule.rule2 ? $('#rule2').val(rule.rule2) : $('#rule2').val('');

            var checkType = rule.value_attr;
            if(checkType){
                $('.item[data-id=' + checkType+']').addClass('selected').siblings('.item').removeClass('selected');
            }
 
        } else if (hasType && hasType != 'text'){
            //如果是其他的类型
            if(rule.bind_data){
                var todoStr = rule.bind_data.split('&&').join('\n');
                $('#bind-data').val(todoStr);
            }else{
                $('#bind-data').val('');
            }
        }

        console.log(_this.data.data[offset]);
    });

    //添加行
    $('body').on('click', '.add_input', function () {
        _this.setRow($(this).parent().parent().attr('rowIndex'));
        var _row = _this.getRow();
        _this.data.update(_row, 0);
        _this.deleteAllRows();
        _this.refresh(0);
        $('#rule1').val('');
        $('#rule2').val('');
        $('#bind-data').val('');
    });

    //删除行
    $('body').on('click', '.del_input', function () {
        // $(this).parent().click();
        _this.setRow($(this).parent().parent().attr('rowIndex'));
        var _row = _this.getRow();
        _this.data.update(_row, 1);
        _this.deleteAllRows();
        _this.refresh(0);
    });

    //弹出ui层
    $('body').on('click', _this._table + ' ' + _this._uiMenuBtn, function (e) {
        $(_this._uiMenuId).slideToggle('fast');
        var x = $(this).offset().top;
        var y = $(this).offset().left;
        x = x + 40;
        y = y - 380;
        $(_this._uiMenuId).offset({
            'top': x,
            'left': y
        });
        //console.log(_this.data.get(0));
    });

    // $(document).on('click', function () {
    //     $('#form-ui').slideUp('fast');
    // });

    //选择ui
    $(_this._uiMenuId + ' ' + 'li').click(function (e) {
        var type = $(this).attr('data-id');
        //todo 判断
        if (type == 'text') {
            $('#ui-attr').show();
            $('#ui-select').hide();
        } else {
            $('#ui-attr').hide();
            $('#ui-select').show();
        }
        var row = _this.getRow();

        var offset = row * 3 - 1;

        // console.log('row: ' + row + '  offset:  ' + offset);
        _this.data.data[offset].type = type;
        _this.refresh(0);
        $(_this._uiMenuId).slideUp('fast');
        // console.log(_this.data.data[offset]);
    });

    $('body').on('click','.pc_content',function(){
        if($(this).attr('data-type') == 'text'){
            $('#ui-attr').show();
            $('#ui-select').hide();
        }else{
            $('#ui-attr').hide();
            $('#ui-select').show();
        }
    })
    //$("#ui-attr").hide();
    //$("#ui-select").hide();
    // $("#ui-select").show();
    //如果是radio/checkbox/list选择绑定数据
    $(".item").click(function () {
        $(".item").removeClass('selected');
        $(this).addClass('selected');

        var valueAttr = $(this).attr('data-id');
        var row = _this.getRow();
        var offset = row * 3 - 1;
        _this.data.data[offset].value_attr = valueAttr;
        _this.data.data[offset].rule1 = $("#rule1").val();
        _this.data.data[offset].rule2 = $("#rule2").val();
        // console.log(_this.data.data[offset]);
    })


    
    //标签改变
    $('body').on('change', _this._table + '   .pc_info input ', function () {
        var offset = $(this).parent().parent().attr('offset');
        _this.data.data[offset].field_name = $(this).val();
        _this.refresh(0);
    });



    //规则发生改变,修改数据对象
    $("#rule1,#rule2").change(function () {
        var row = _this.getRow();
        var offset = row * 3 - 1;
        _this.data.data[offset].rule1 = $("#rule1").val();
        _this.data.data[offset].rule2 = $("#rule2").val();
        // console.log(_this.data.data[offset]);
        
        // $('#ui-attr').hide();
    })

    //绑定数据
    $("#ui-select").change(function () {
        var row = _this.getRow();
        var offset = row * 3 - 1;
        var newVal = $('#bind-data').val().split('\n').join('&&');
        console.log(newVal);
        _this.data.data[offset].bind_data = newVal;
        // console.log(_this.data.data[offset]);
        _this.refresh(0);
        // $('#ui-select').hide();
    });
    this.refresh(0);

    //设置前/后台显示
    if (type == 1) {
        _this.setFrontView();
    }
}

//清楚当前绑定对象所有数据
Workspace.prototype.deleteAllRows = function () {
    var rows = $(this._table).find("tr").length
    for (var i = rows; i > 0; i--) {
        $(this._table + ' tr:eq(' + i + ')').remove();
    }
    this.setRow(0);
}

/**
 * 设置表格显示样式
 * 
 * @param int type 1:前台展示 2:后台展示
 */
Workspace.prototype.setFrontView = function () {
    $('.control-choose').remove();
    $('.pc_info input').each(function (i, v) {
        var text = $(v).val();
        var str = '<p class="input_p">' + text + '</p>';
        $(v).parent().html(str);
    })
    $('tbody tr').eq(0).remove();
    $('tr').each(function (i, v) {
        $(v).find('td').eq(0).css({ "width": "260px", "border": "none" }).find('.pc_info').css({ "width": "260px" });
        $(v).find('td').eq(2).remove();
        $(v).find('td').eq(3).remove();
        $(v).find('td').eq(2).css({ "width": "328px", "border": "none" }).find('.pc_info').css({ "width": "328px" });
    })
    $('.dropdown2').each(function (i, v) {
        $(v).addClass('dropdown').removeClass('dropdown2')
    })
    $('.drop_list2').each(function (i, v) {
        $(v).addClass('drop_list').removeClass('drop_list2')
    })
}

//刷新表格
Workspace.prototype.refresh = function (offset) {
    var _str = '';
    var _data = this.data.get(0);
    var _html = '';

    if (offset == 0) {
        _data = this.data.get(0);
        this.deleteAllRows();
        this.addRow();
        for (var i in _data) {
            _html = this.fieldUi.buildHtml(_data[i]);
            this.setHtmlByOffset(i, _html);
            if (((Number(i) % 3) == 0) && (Number(i) !== Object.keys(_data).length)) {
                this.addRow();
            }
        }
        $(this._table + ' tr:eq(1) span:eq(1)').remove();
        $('#data-debug').text(_str);
    } else {
        var _data = this.data.get(offset);
        _html = this.fieldUi.buildHtml(_data);
        this.setHtmlByOffset(offset, _html);
    }
}

//添加行
Workspace.prototype.addRow = function () {
    var row = this.getRow();
    var _index = Number(row) * 3;
    var _row = this._trheadBegin +
        (Number(row) + 1) +
        this._trheadEnd +
        this._td1Begin +
        (_index + 1) +
        this._td1End +
        this._td2Begin +
        (_index + 2) +
        this._td2End +
        this._td3 +
        this._td4Begin +
        (_index + 3) +
        this._td4End +
        this._td5 +
        this._trfoot;
    $(_row).insertAfter($(this._table + ' tr:eq(' + row + ')'));
    this.setRow(row + 1);
}

//删除行
Workspace.prototype.delRow = function (row) {
    $(this._table + ' tr:eq(' + _row + ')').remove();
    this.data.update(row, 1);
}

//绑定字段ui对象
Workspace.prototype.bindFieldUi = function (fieldUi) {
    this.fieldUi = fieldUi;
}

var _work = new Workspace();


$(function () {
    var pageType = $('.pageType').val();
    if(pageType == '1'){
        //前台
        _work.init(1);
        
    }else{
        _work.init();
    }

    //dropdown2 鼠标移入事件
    $('body').on('mouseover', '.dropdown2', function () {
        scroll();
        $(this).siblings('ul').slideDown('fast');
    })
    $('body').on('mouseleave', '.dropdown2', function () {
        $(this).siblings('ul').slideUp('fast');
    })
    //console.log(_work.data.get(0));
    //_dataObj.update(1, 0);
    //console.log(_dataObj.get(0));
    //_dataObj.update(2, 1);
    //console.log(_dataObj.get(0));

    //return;
    //var _label = new LabelUI();
    //_label.buildHtml({field_name:'abcd'});

    //var _label = new ListUI();
    //_label.buildHtml({
    //field_name:'abcd',
    //bindData: "ab\ncd\nef"
    //});

    //var _label = new TextUI();
    //_label.buildHtml({
    //field_name:'abcd',
    //bindData: "ab\ncd\nef"
    //});


    //_work.bindId({
    //'tableId'   : 'custom_form',
    //'uiMenuId'  : 'form-ui',
    //'uiMenuBtn' : '.editing',
    //'delRowBtn' : '.del_input',
    //'addRowBtn' : '.add_input',
    //});

    // console.log();

    //$("#ui-attr").hide();
    // $("#ui-select").hide();
    // $("#ui-select").show();

    function Ci() {


        //卡片类型
        this.tpl = '';

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
            $('#ui-attr').hide();
            $('#ui-select').show();
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
            // scroll();


        }
    }
    var _ci = new Ci();
    _ci.init();


    //事件委托者
    var $ct = _ci.parentNode;

    //数据渲染
    if(window.customFormFields){
        for (var k in window.customFormFields){
            if (window.customFormFields[k].value){
                var val = window.customFormFields[k].value;
                var $this = $('td[offset=' + window.customFormFields[k].offset + ']');
                if ($this.find('input').size()){
                    $this.find('input').val(val)
                };
                if ($this.find('.chose_one').size()) {
                    $this.find('.chose_one').attr('data-id',val);
                    $this.find('dd[data-id='+val+']').addClass('active')
                };
                if ($this.find('.chose_more').size()) {
                    var arr = val.split('&&');
                    $this.find('.chose_more').attr('data-id', arr.join(','));
                    $this.find('dd').each(function(i,v){
                        if (arr.indexOf($(v).attr('data-id')) != -1){
                            $(v).addClass('active')
                        }
                    })
                };
                if ($this.find('.dropdown').size()) {
                    $this.find('.dropdown').attr('data-id', val).find('span').text(val);
                };
                
            }
            
        }
    }

    // 获取表单项值
    function getFormItemValue($el) {
        var $pc_content = $el;
        // 找出上传的文件值
        if ($pc_content.find(".form_input a").size()) {
            var val = $pc_content.find(".form_input a").attr("href");
            if (/^javascript/.test(val)) {
                val = ""
            }
            return val;
        }
        // 下拉选项
        if ($pc_content.find(".dropdown").size()) {
            return $pc_content.find(".dropdown").attr("data-id");
        }
        // 联动
        if ($pc_content.find(".dropdown_area").size()) {
            return $pc_content.find(".dropdown_area").attr("data-id");
        }
        // 单选
        if ($pc_content.find(".chose_one").size()) {
            var _chsoeone = $pc_content.find(".chose_one").attr("data-id");
            if (_chsoeone) {
                return _chsoeone;
            } else {
                return '';
            }

        }

        // 多选
        if ($pc_content.find(".chose_more").size()) {
            var _chosemore = $pc_content.find('.chose_more').attr('data-id');
            if (_chosemore) {
                if (_chosemore.indexOf(',') != -1) {
                    return _chosemore.split(",");
                } else {
                    return _chosemore;
                }

            } else {
                return '';
            }

        }

        // 表格
        if ($pc_content.find("table").size()) {
            var tableArr = [];
            var parentNode = $pc_content.parent(); //找到表格的父节点，根据类名来判断数据格式
            if (parentNode.hasClass('tpl_8_3_1') || parentNode.hasClass('tpl_8_3_2')) {
                //表格数据整体提交
                $pc_content.find('input').each(function (i, v) {
                    tableArr.push($.trim($(v).val()));
                })
            } else {
                //表格数据一行提交
                $pc_content.find('tr').each(function (i, v) {
                    if ($(v).find('input').size()) {
                        var arr2 = [];
                        for (var j = 0; j < $(v).find('input').length; j++) {
                            arr2.push($(v).find('input').eq(j).val());
                        }
                        tableArr.push(arr2);
                    }

                })
            }

            return tableArr;
        }
        //如果是两个ipnput（时间选择）
        if ($pc_content.find('input').length == 2) {
            return $pc_content.find('.js_time_input1').val() + '-' + $pc_content.find('.js_time_input2').val();
        }
        // 查找input, textarea
        return $pc_content.find("input, textarea").val();
    }

    


    //前台表单提交
    $('.task_submit').on('click', function () {

        var arr = [];
        $('td').each(function(i,v){
            
            var obj = {};
            var idx = $(v).attr('offset');
            obj.sid = window.customFormFields[idx].sid;
            obj.form_detail_id = window.customFormFields[idx].id;
            obj.type = window.customFormFields[idx].type;
            if (getFormItemValue($(v)) == undefined){
                obj.value = '';
            }else{
                obj.value = getFormItemValue($(v))
            }
            arr.push(obj);
        })
        var param = {
            'form_id':$('#form_id').val(),
            'task_id':$('#task_id').val(),
            'submit_id':$('#submit_id').val(),
            'data':arr
        }
        console.log(param);
        //保存
        requestData('/UserTask/addSubmitDetail', "post", call, param);

        function call(data) {
            if (data.status == 1) {
                layer.msg('保存成功');
                setTimeout(function () {
                    javascript:history.go(-1);
                }, 1800)
            } else {
                errMsg(data.msg);
            };
        };
    })


    //保存
    $('.js_storage').on('click', function () {
        //表单正常保存
        // var param = {
        //     "data": findParam()
        // };
        var param = {
            'task_id': $('.task_id').val(),
            'form_id': $('.form_id').val(),
            'detail': _work.data.get(0),
        };

        console.log(param);
        //保存
        requestData(API.REGISTER.CUSTOMFORM, "post", call, param);

        function call(data) {

            console.log(data);
            console.log(data.msg);
            if (data.status == 1) {
                layer.msg('保存成功');
                //window.location = data.msg;
                setTimeout(function () {
                    location.href = '/register/TaskReg/showUpdate/' + data.msg;
                }, 2000)
            } else {
                errMsg(data.msg);
            };
        };
    })

    //提交
    $('.task_submit_all').on('click', function () {

        var task = [];
        $('tbody tr').each(function (i, v) {
            task[i] = $(v).attr('data-id');
        });
        if (task.length < 1) {
            return false;
        }
        var param = {
            'task': $('.task_id').val(),
            "data": task,
        };
        console.log(param);

        requestData(API.REGISTER.TASKSUBMIT, "post", call, param);

        function call(data) {
            if (data.status == 1) {
                layer.msg('发布成功');
                setTimeout(function () {
                    $('.dj_title_box').children('a').remove();
                }, 2000)
            } else {
                errMsg(data.msg);
            };
        };
    })


    //获取数据函数
    



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
        // scroll();
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


    function datePick(startTime, type) {

        //选择具体时间
        var date = 1;//时间初始化
        startTime.jeDate({
            format: type,
            zIndex: 3000,
            isClear: false,
            onClose: false,
            okfun: function (val) {
                if (startTime.siblings('.js_time_input2').length > 0) {
                    if (startTime.siblings(".js_time_input2").val() != '') {
                        startTime.siblings(".js_time_input2").val('');
                    }

                    date = startTime.val().replace(/\//g, ':');
                    if (date !== 1) {
                        startTime.siblings(".js_time_input2").jeDate({
                            format: type,
                            zIndex: 3000,
                            isClear: false,
                            onClose: false,
                            okfun: function (val2) {
                                if (startTime.siblings(".js_time_input2").val().replace(/-/g, '') < startTime.val().replace(/:/g, '')) {
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

