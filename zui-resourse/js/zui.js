// 2017-07-24

"use strict";
// 严格模式

var Zui=function(){
    this.layer=(data)=>{
        // 先删除已存在窗口
        if($('.zui-layer').length) $('.zui-layer').remove();
        // 获取类别
        const type=data.type;
        let dom='';
        if(type=='confirm'){
            // 确认窗
            dom='<div class="zui-layer zui-layer-shade"></div>';
            dom+=
            '<div class="zui-layer-main">'+
                '<div class="zui-layer-main-title '+data.style+'">'+data.title+'<i class="zui-layer-main-close zui-icon-guanbi"></i></div>'+
                '<div class="zui-layer-main-info">'+data.info+'</div>'+
            '</div>';
            $('body').append(dom);
            setTimeout(()=>{
            $('.zui-layer-shade').addClass('on');
        },100);
        }else if(type=='ask'){
            // 询问窗
            dom='<div class="zui-layer zui-layer-shade"></div>';
        }else if(type=='message'){
            // 询问窗
            dom='';
        }
        return;
    };
    // 替代alert的 提示窗
    this.prompt=(info)=>{
        // 先删除已存在窗口
        if($('.zui-layer').length) $('.zui-layer').remove();
        // 生成dom
        let dom='<div class="zui-layer"><div class="zui-layer-prompt">'+info+'</div></div>';
        $('body').append(dom);
        // 动画效果及延时关闭
        setTimeout(()=>{
            $('.zui-layer-prompt').addClass('on');
        },100);
        setTimeout(()=>{
            $('.zui-layer-prompt').delay(2000).removeClass('on');
        },2800);
        setTimeout(()=>{
            $('.zui-layer').remove();
        },3000);
        return;
    };
    return;
}
// 实例化Zui
var zui=new Zui();


$(function(){
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
    $('body').on('click',function(){
        $('.zui-select').removeClass('zui-select-open');
    });

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
    })
})











