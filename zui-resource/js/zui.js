// 2017-07-24
;
$(function(){
// zui-start
"use strict";

var Zui=function(){
    return;
}
// 确认窗、询问窗
Zui.prototype.layer=data=>{
    // 先删除已存在窗口
    if($('.zui-layer').length) $('.zui-layer').remove();
    // 获取类别
    const type=data.type;
    let style=data.style||'blue';
    let dom='<div class="zui-layer-shade"></div>'+
                '<div class="zui-layer-main">'+
                    '<div class="zui-layer-main-title zui-bg-'+style+'">'+data.title+'<i class="zui-layer-main-close zui-icon-guanbi"></i></div>'+
                    '<div class="zui-layer-main-info">'+data.info+'</div>';
                    if(type=='alert'){
                        // 确认窗 按钮组
                        dom+='<div class="zui-layer-btn" zui-txt="right"><button zui-bg="'+style+'" zui-size="small" class="zui-btn zui-layer-okay">确定<button></div>';
                    }else if(type=='confirm'){
                        // 询问窗 按钮组
                        dom+='<div class="zui-layer-btn" zui-txt="right"><button zui-bg="'+style+'" zui-size="small" class="zui-btn zui-layer-okay">确定</button><button zui-size="small" class="zui-btn zui-bg-default zui-layer-cancel">取消</button></div>';
                    };
    dom+='</div>';
    // 插入dom
    let that=$(dom);
    $('body').append(that);

    // 按钮绑定-确定、取消事件
    let okay=that.find('.zui-layer-okay');
    let cancel=that.find('.zui-layer-cancel');
    if(data.okay){
        okay.on('click',()=>data.cancel(data.okayParam));
    };
    if(data.cancel){
        cancel.on('click',()=>data.cancel(data.cancelParam));
    };

    // 进入动画
    setTimeout(()=>{
        that.eq(0).addClass('on');
        that.eq(1).addClass('on');
    },100);
    // 按钮绑定-移除对话框
    $('.zui-layer-main button,.zui-layer-main-close').on('click',()=>{
        let type=null;
        that.eq(0).removeClass('on');
        that.eq(1).removeClass('on');
        setTimeout(()=>{
            that.remove();
        },200);
    });
    return false;
};

// 自动消失的提示窗
Zui.prototype.prompt=info=>{
    // 先删除已存在窗口
    if($('.zui-layer-prompt').length) $('.zui-layer-prompt').remove();
    // 生成dom
    let dom='<div class="zui-layer-prompt">'+info+'</div>';
    $('body').append(dom);
    // 动画效果及延时关闭
    setTimeout(()=>$('.zui-layer-prompt').addClass('on'),100);
    setTimeout(()=>$('.zui-layer-prompt').removeClass('on'),2500);
    setTimeout(()=>$('.zui-layer-prompt').remove(),2700);
    return false;
};

// message消息提示
Zui.prototype.message=data=>{
    // 生成dom
    let type=data.type||'消息';
    let style=data.style||'blue';
    let dom='<a class="zui-layer-message" href="'+data.url+'">'+
                '<span class="zui-layer-message-type" zui-bg="'+style+'"><em>'+type+'</em></span>'+
                '<span class="zui-layer-message-title">'+data.title+'</span>'+
                '<span class="zui-layer-message-info">'+data.info+'</span>'+
            '</a>';
    let that=$(dom);
    $('body').append(that);
    
    // 动态高度
    let leng=$('.zui-layer-message').length;
    that.css('top',(leng-1)*100+10);

    // 动画效果及延时关闭
    setTimeout(()=>that.addClass('on'),100);
    setTimeout(()=>that.removeClass('on'),5000);
    setTimeout(()=>that.remove(),5200);
    return false;
};

// radio美化
Zui.prototype.radio=el=>{
    
};

// 实例化Zui
var zui=new Zui();

// radio绑定
zui.radio($('.zui-radio'));

// select下拉事件绑定
$('.zui-select').on('click',function(event){
    event.stopPropagation();
    if($(this).hasClass('zui-select-open')){
        $(this).removeClass('zui-select-open');
    }else{
        $(this).addClass('zui-select-open');
    };
});

// select option选定
$('.zui-option-list li').on('click',function(){
    $(this).siblings().removeClass('zui-option');
    $(this).addClass('zui-option');
    $(this).parent().siblings('.zui-input').val($(this).text());
});

// body 点击 关闭一些窗口
$('body').on('click',()=>$('.zui-select').removeClass('zui-select-open'));

// 开关按钮
$('.zui-switch').each(function(){
    var inp=$(this).find('.zui-switch-input');
    var txt=inp.attr('zui-info').split('|');
    var on=txt[0];
    var off=txt[1];
    var info=$(this).find('.zui-switch-info');
    // 判断info填写内容
    function cge(){
        if(inp.is(':checked')){
            info.text(on);
        }else{
            info.text(off);
        }
    };
    // 初始化
    cge();
    // 绑定change
    inp.change(cge);
});

});// zui-end










