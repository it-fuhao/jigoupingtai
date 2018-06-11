/**
 * 表单查看
 * @authors Abby (abbyyigoog@gmail.com)
 * @date    2018-04-25 20:59:08
 * @version $Id$
 */

let $ = require('jquery');

$(function(){
    //$('.tab_con').html($('#table1').html());

    $('.tab_item li').on('click',function(){
        var index = $(this).index()+1;
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.tab_con').html($('#table'+index).html());
    });
});

